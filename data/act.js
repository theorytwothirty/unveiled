// What data/api.html can be asked to do. c = {ask, res, ring:{key, room}, node}.
;(function(){
var act = API.act, root = c => c.ask.root;
var fail = (c, code, why) => { c.res.status = code; c.res.end(why) };
var mine = (c, user) => user.get(root(c)).get(c.ring.room).get('card');

act.ping = 1; // answered in data/api.html before any key is needed

// any password works, nothing to set up: it becomes the key that encrypts what you save,
// and you'll see exactly the cards that were saved with the same password
act.join = async function(c, ring){
  if(!c.ask.pass){ return fail(c, 400, 'password needed') }
  ring = await API.derive(c.ask.pass, root(c));
  API.keep(root(c), ring);
  'unveiled-test' === root(c) && SEED.plant({ask: c.ask, ring: ring, node: NET.gun.get(root(c)).get(ring.room)});
  c.res.end({ok: 1});
};

act.all = async function(c, got, jobs, seen, list){
  got = {}; jobs = [];
  seen = await NET.each(c.node.get('people'), pub => jobs.push(API.card(c, pub).then(card => { card && (got[pub] = card) })), 900, 3000);
  await Promise.race([Promise.all(jobs), new Promise(ok => setTimeout(ok, 1200))]);
  list = Object.keys(got).filter(pub => seen[pub]).sort((a, b) => got[a].at - got[b].at)
    .map(pub => ({id: pub, name: got[pub].name, told: API.told(got[pub])}));
  c.res.end({list: list, all: API.keys.length, told: list.reduce((n, one) => n + one.told, 0)});
};

act.one = async function(c, card, ans){
  card = c.ask.who && await API.card(c, c.ask.who);
  if(!card){ return fail(c, 404, 'gone') }
  ans = {};
  API.keys.forEach(k => { var a = (card.ans || {})[k]; ans[k] = a && a.text ? {text: String(a.text)} : {hid: 1} });
  c.res.end({id: c.ask.who, name: card.name, told: API.told(card), ans: ans});
};

// only shared, non-empty answers are ever encrypted and sent; private ones stay in this browser
act.put = async function(c, pair, card){
  if(!c.ask.name){ return fail(c, 400, 'name needed') }
  pair = await NET.pair();
  card = {name: c.ask.name, at: Date.now(), ans: {}};
  API.keys.forEach(k => { var a = c.ask.ans[k]; if(a.share && a.text.trim()){ card.ans[k] = {text: a.text} } });
  card = await SEA.encrypt(card, c.ring.key);
  await Promise.all([
    NET.sign(pair, user => NET.save(mine(c, user), card, 2000)),
    NET.save(c.node.get('people').get(pair.pub), Date.now(), 2000)
  ]);
  c.res.end({id: pair.pub});
};

act.cut = async function(c, pair){
  pair = await NET.pair();
  await Promise.all([
    NET.sign(pair, user => NET.save(mine(c, user), null, 2000)),
    NET.save(c.node.get('people').get(pair.pub), null, 2000)
  ]);
  c.res.end({cut: 1});
};
}());
