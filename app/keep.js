// This browser's own draft: every answer, private ones included. Only shared answers ever leave (see data/act.js).
var APP = window.APP || (window.APP = {});

;(function(){
var KEEP = APP.keep = {};

// test and real groups live under different GUN roots, so test people never mix with real ones.
// Local hosts and ?test use the test root; anything else is the real one.
APP.test = /[?&]test\b/.test(location.search) || /^(localhost|127\.0\.0\.1|\[::1\]|)$/.test(location.hostname);
APP.root = APP.test ? 'unveiled-test' : 'unveiled';
KEEP.slot = APP.test ? 'veiltest' : 'veil';

KEEP.blank = function(me){
  me = {id:'', in:0, name:'', sent:0, ans:{}};
  ASK.list.forEach(q => { me.ans[q.key] = {text:'', share:!!q.share} });
  return me;
};

KEEP.load = function(raw, me){
  try{ raw = JSON.parse(localStorage[KEEP.slot] || 'null') }catch(e){ raw = null }
  me = KEEP.blank();
  if(!raw || 'object' !== typeof raw){ return me }
  me.id = raw.id || ''; me.in = raw.in || 0; me.name = raw.name || ''; me.sent = raw.sent || 0;
  ASK.list.forEach(q => { Object.assign(me.ans[q.key], (raw.ans || {})[q.key]) });
  return me;
};

KEEP.save = function(){
  try{ localStorage[KEEP.slot] = JSON.stringify(APP.me) }catch(e){}
};

// forget the answers, but stay in the group
KEEP.wipe = function(was){
  was = APP.me.in; APP.me = KEEP.blank(); APP.me.in = was; KEEP.save();
};

// the one place answers change
KEEP.put = function(key, ans){
  if(!ans || !APP.me.ans[key]){ return }
  if('string' === typeof ans.text){ APP.me.ans[key].text = ans.text.slice(0, 4000) }
  if('boolean' === typeof ans.share){ APP.me.ans[key].share = ans.share }
  KEEP.save();
};

APP.me = KEEP.load();
}());
