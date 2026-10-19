// Four fictional people, planted only in the 'unveiled-test' root when a test group is started.
// Each gets a throwaway signing key. Their private answers are never planted, just like real ones.
var SEED = {list: []};

SEED.add = function(name, say, one, k){
  one = {name: name, ans: {}};
  for(k in say){ if(say[k][1] && say[k][0]){ one.ans[k] = {text: say[k][0]} } }
  SEED.list.push(one);
};

SEED.plant = async function(c){
  if(await NET.seek(c.node.get('seeded'), 1500)){ return }
  await NET.save(c.node.get('seeded'), Date.now(), 1500);
  for(var i = 0; i < SEED.list.length; i++){ await SEED.one(c, SEED.list[i], i) }
};

SEED.one = async function(c, one, i, pair, card){
  pair = await SEA.pair();
  card = await SEA.encrypt({name: one.name, at: Date.now() - 9e6 + i, ans: one.ans}, c.ring.key);
  await NET.sign(pair, user => NET.save(user.get(c.ask.root).get(c.ring.room).get('card'), card, 2000));
  await NET.save(c.node.get('people').get(pair.pub), Date.now(), 2000);
};

SEED.add('Alex', {
  r:['Single, and happily so. Dating a little, nothing exclusive. No agreements to work around.', 1],
  b:['I love direct communication and checking in. Kissing is an easy yes; anything beyond that, ask me first. Condoms always, no exceptions.', 1],
  d:['Slow, unhurried connection. Being really seen. I’d love to explore more playful flirting and a little more confidence in asking for what I want.', 1],
  s:['Tested six weeks ago, full panel, all clear. On PrEP.', 0],
  m:['Mostly exploration. I’m open to friendship afterwards, not looking for anything serious right now.', 1],
  a:['Stay a while, talk, drink some water. A text the next day goes a long way.', 1],
  f:['Something cinematic: a stranger at a hotel bar, a conversation that turns into more.', 1],
  k:['Light restraint, being teased, a little praise.', 1],
  o:['Happy to be here. Go gently and we’ll have a lovely time.', 1]
});

SEED.add('Jordan', {
  r:['Married, in an open relationship for three years. My partner knows about tonight and we check in with each other before and after.', 1],
  b:['No overnight stays, and nothing that leaves marks. Barrier protection is non-negotiable. Hard no to anything filmed or photographed.', 1],
  d:['Being desired without pressure. Long, attentive touch. I want to feel like the only person in the room.', 1],
  s:['Last tested in March. Happy to talk privately.', 0],
  m:['Connection in the moment, with care. Friendship is welcome; romance isn’t on the table for me.', 1],
  a:['A quiet cuddle, then a little space. I’ll want to debrief with my partner, so I may step away.', 1],
  f:['Being blindfolded while someone I trust describes everything before it happens.', 1],
  k:['Sensation play: ice, feathers, temperature.', 0],
  p:['Strangers on a train, meeting for the first time.', 1]
});

SEED.add('Sam', {
  r:['Seeing someone casually; we’re non-exclusive and we’ve talked about it.', 1],
  b:['Please ask before anything new, every time. I freeze rather than say no, so verbal check-ins really matter to me.', 1],
  d:['Laughing in bed. Someone who takes their time. I’m curious about switching roles.', 1],
  s:['Tested last month for everything, negative. Using the pill and condoms.', 1],
  m:['I’d love to keep things warm and friendly afterwards. Something more could be lovely, but no expectations.', 1],
  a:['Reassurance, honestly. Tell me it was good. Food helps too.', 1],
  k:['Being in charge, gently.', 1],
  o:['I laugh when I’m nervous. It’s a good sign.', 1]
});

SEED.add('Riley', {
  r:['Single. I’ve only recently started exploring non-monogamy, so I’m new to all of this.', 1],
  b:['Go slow with me. Kissing and touching are fine; anything more needs a conversation first.', 1],
  d:['Curious about group dynamics, mostly watching for now. I like feeling included.', 1],
  m:['Pure curiosity and a good night with friends I trust.', 1]
});
