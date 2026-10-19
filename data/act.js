// What data/api.html can be asked to do. c = {ask, res, ring:{key, room}, node}.
;(function(){
var act = API.act, root = c => c.ask.root;
var fail = (c, code, why) => { c.res.status = code; c.res.end(why) };
var mine = (c, user) => user.get(root(c)).get(c.ring.room).get('card');

act.ping = 1; // answered in data/api.html before any key is needed

// any password works, nothing to set up: it becomes the key that encrypts what you save,
// and you'll see exactly the cards that were saved with the same password
// replies with which group this is, and whether this browser already shared a card in it
act.join = async function(c, ring, card){
  if(!c.ask.pass){ return fail(c, 400, 'password needed') }
  ring = await API.derive(c.ask.pass, root(c));
  API.keep(root(c), ring);
  'unveiled-test' === root(c) && SEED.plant({ask: c.ask, ring: ring, node: NET.gun.get(root(c)).get(ring.room)});
  card = await API.card({ask: c.ask, ring: ring}, (await NET.pair()).pub, 1000);
  c.res.end({room: ring.room.slice(0, 16), mine: !!card});
};

// answers fast with whoever is already known; everyone else streams in through API.live
act.all = async function(c, got, jobs, seen, list){
  got = {}; jobs = [];
  API.live(c);
  seen = await NET.each(c.node.get('people'), pub => jobs.push(API.card(c, pub).then(card => { card && (got[pub] = card) })), 300, 1200);
  await Promise.race([Promise.all(jobs), new Promise(ok => setTimeout(ok, 600))]);
  list = Object.keys(got).filter(pub => seen[pub]).sort((a, b) => got[a].at - got[b].at)
    .map(pub => ({id: pub, name: got[pub].name, told: API.told(got[pub])}));
  c.res.end({list: list, all: API.keys.length, told: list.reduce((n, one) => n + one.told, 0)});
};

// one watcher per group: each person who appears, changes, or leaves is said as a 'person' event
API.live = function(c, room){
  room = c.ring.room; if(API.live[c.ask.root + room]){ return } API.live[c.ask.root + room] = 1;
  c.node.get('people').map().on((v, pub) => {
    if(!v){ return kit.say({room: room.slice(0, 16), id: pub, gone: 1}, 'person') }
    API.card(c, pub).then(card => card && kit.say({room: room.slice(0, 16), id: pub, name: card.name, told: API.told(card)}, 'person'));
  });
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
