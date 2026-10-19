// Screen changes. A new screen gets a fresh frame, cloned from the #frame model: a frame's first load
// adds nothing to browser history, so the phone's back swipe stays on the app's own path.
// The same screen again (one question to the next) hydrates in place.
;(function(){
var VIEW = APP.view = {};
VIEW.model = document.getElementById('frame');
VIEW.hue = document.querySelector('meta[name="theme-color"]');
VIEW.seq = 0;
VIEW.el = null;

VIEW.wait = ms => new Promise(ok => setTimeout(ok, ms));

// spot = {at, i, who} — small, addressable, never an answer
VIEW.show = async function(spot, how, seq, body, old, el){
  seq = ++VIEW.seq;
  if(APP.lock && APP.lock(spot)){ spot = APP.home(); how = 'swap' }
  if('back' !== how){ history[(how || !history.state) ? 'replaceState' : 'pushState'](spot, '') }
  APP.spot = spot; old = VIEW.el;
  old && old.tag('out', 1);
  try{
    body = await Promise.all([APP.page[spot.at](spot), VIEW.wait(old ? 220 : 0)]).then(all => all[0]);
  }catch(err){ body = null }
  if(seq !== VIEW.seq){ return }
  if(!body){ return VIEW.show(APP.home(), 'swap') }
  el = old && old.at === spot.at ? old : VIEW.make(spot.at);
  VIEW.dark(body.dark);
  await kit.fetch('view/' + spot.at + '.html', body, el).catch(VIEW.miss);
  if(seq !== VIEW.seq){ return el !== old && el.remove() }
  VIEW.el = el; el.tag('out', -1);
  APP.shown && APP.shown(spot, el);
  if(old && old !== el){ setTimeout(() => old.remove(), 400) }
};

VIEW.make = function(at, el){
  el = VIEW.model.content.firstElementChild.cloneNode(true);
  el.at = at; document.body.pin(el);
  return el;
};

VIEW.dark = function(on){
  document.documentElement.tag('dark', on ? 1 : -1);
  VIEW.hue.content = on ? '#26111C' : '#FAF7F2';
};

VIEW.miss = function(err){ console.warn('view failed', err) };

addEventListener('popstate', eve => { eve.state && eve.state.at && VIEW.show(eve.state, 'back') });
}());
