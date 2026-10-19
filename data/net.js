// GUN helpers for data/api.html: one relay, timed reads and writes, and one signing queue.
// Gun never says "nothing more is coming", so every read has a deadline.
var NET = {};

NET.peers = ['https://try.axe.eco/gun'];
NET.gun = Gun({peers: NET.peers});

// first real value, or undefined when the deadline passes
NET.seek = (ref, ms) => new Promise(ok => {
  var ev, t, done = v => { if(done.x){ return } done.x = 1; clearTimeout(t); ev && ev.off(); ok(v) };
  t = setTimeout(done, ms || 3000);
  ref.on((v, k, m, e) => { ev = e; if(undefined !== v && null !== v){ done(v) } });
});

// resolve on the relay's ack, or carry on after the deadline: the write is already saved locally and syncs later
NET.save = (ref, val, ms) => new Promise(ok => {
  var t = setTimeout(() => ok({late: 1}), ms || 3000);
  ref.put(val, ack => { clearTimeout(t); ok(ack || {}) });
});

// every key under a node, handed to each() as it arrives; settles once quiet, or at the cap
NET.each = (ref, each, quiet, cap) => new Promise(ok => {
  var ev, seen = {}, t, end = setTimeout(stop, cap || 3500);
  function stop(){ clearTimeout(t); clearTimeout(end); ev && ev.off(); ok(seen) }
  t = setTimeout(stop, quiet || 900);
  ref.map().on((v, k, m, e) => {
    ev = e; if(seen[k] === v){ return } seen[k] = v; v && each(k, v);
    clearTimeout(t); t = setTimeout(stop, quiet || 900);
  });
});

// gun.user() is a single signer, so signed work runs one job at a time
NET.line = Promise.resolve();
NET.sign = (pair, job) => (NET.line = NET.line.catch(() => 0).then(() => new Promise((ok, no) => {
  var user = NET.gun.user();
  if(user.is && user.is.pub !== pair.pub){ user.leave() }
  if(user.is){ return Promise.resolve(job(user)).then(ok, no) }
  user.auth(pair, ack => ack.err ? no(new Error(ack.err)) : Promise.resolve(job(user)).then(ok, no));
})));

// this browser's own signing key, made once and kept here; it is never shown and never leaves
NET.pair = async function(pair){
  try{ pair = JSON.parse(localStorage.veilpair || 'null') }catch(e){ pair = null }
  if(pair && pair.pub && pair.priv){ return pair }
  pair = await SEA.pair(); localStorage.veilpair = JSON.stringify(pair);
  return pair;
};
