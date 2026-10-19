// Ownership check from a second, unrelated client: a stranger's signed write to someone else's card must be refused.
// usage: npm i gun@0.2020.1241 && node test/forge.js <room> <pub>
// <room> and <pub> come from a test group: localStorage.veilring['unveiled-test'].room and APP.me.id
var Gun = require('gun'); require('gun/sea');
var FORGE = {room: process.argv[2], pub: process.argv[3]};

FORGE.card = gun => gun.get('~' + FORGE.pub).get('unveiled-test').get(FORGE.room).get('card');

FORGE.run = async function(gun, pair){
  gun = Gun({peers: ['https://try.axe.eco/gun'], radisk: false, localStorage: false, file: false});
  pair = await Gun.SEA.pair();
  gun.user().auth(pair, () => FORGE.card(gun).put('FORGED', FORGE.ack));
  setTimeout(() => FORGE.read(gun), 4000);
};
FORGE.ack = ack => console.log(ack.err ? 'refused: ' + ack.err : 'ACCEPTED?');
FORGE.read = gun => FORGE.card(gun).once(v => {
  console.log('FORGED' === v ? 'FAIL: card overwritten' : 'PASS: card untouched');
  process.exit('FORGED' === v ? 1 : 0);
});

FORGE.run();
