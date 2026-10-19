// What each screen is given (APP.page) and what each user action does (APP.go).
// Screens speak with kit.say({to:'next', ...}, 'go'); nothing else crosses the boundary.
;(function(){
var me = () => APP.me, show = (spot, how) => APP.view.show(spot, how);
var pad = n => (n < 10 ? '0' : '') + n;

var page = APP.page = {};
page.hello = () => ({sent: !!me().sent});
page.pass = spot => ({test: APP.test, edit: !!(spot.edit || spot.swap)});
page.name = spot => ({name: me().name, edit: !!spot.edit});
page.dark = () => ({dark: true});
page.done = () => ({name: me().name});
page.card = function(spot, q, a){
  q = ASK.list[spot.i]; a = me().ans[q.key];
  return {i: spot.i, n: pad(spot.i + 1) + ' / ' + pad(ASK.list.length), key: q.key, tips: q.tips,
    q: {mark: q.mark, word: q.word, head: q.head, text: q.text, note: q.note || null},
    hold: q.hold, text: a.text, dark: !!q.dark, edit: !!spot.edit};
};
page.look = () => ({name: me().name, sent: !!me().sent, list: ASK.list.map((q, i) => ({
  i: i, key: q.key, mark: q.mark, word: q.word, text: me().ans[q.key].text, share: me().ans[q.key].share, deep: !!q.dark }))});
page.all = async (spot, got) => {
  if(!me().in || !me().sent){ return null }
  got = await APP.grp.all().catch(err => 401 === err.status ? null : {list: [], told: 0, all: ASK.list.length, slow: 1});
  if(!got){ return null }
  got.me = me().id; return got;
};
page.one = async spot => me().in && me().sent ? APP.grp.one(spot.who) : null;

var go = APP.go = {};
go.home = () => show({at:'hello'});
go.begin = () => show({at:'name'});
// the password is the door: it is what everything you share gets encrypted with
go.pass = async d => {
  try{ await APP.grp.join(d.pass) }catch(err){ return kit.say({err: 1}, 'oops', APP.view.el) }
  APP.spot.edit ? history.back() : show(APP.home(), 'swap');
};
go.repass = () => show({at:'pass', edit:1});
// back to the door to enter another password: lands in that group's gallery, or at Welcome if I'm new there
go.swap = () => show({at:'pass', swap:1});
go.name = d => { me().name = (d.name || '').trim().slice(0, 40); APP.keep.save();
  APP.spot.edit ? history.back() : show({at:'card', i:0}) };
go.next = (d, i) => { APP.keep.put(d.key, d.ans); i = APP.spot.i + 1;
  if(APP.spot.edit){ return history.back() }
  if(i === ASK.core.length){ return show({at:'dark'}) }
  show(i < ASK.list.length ? {at:'card', i:i} : {at:'look'}) };
go.back = d => { d.key && APP.keep.put(d.key, d.ans); history.back() };
go.deep = () => show({at:'card', i:ASK.core.length});
go.look = () => show({at:'look'});
go.edit = d => show({at:'card', i:d.i, edit:1});
go.rename = () => show({at:'name', edit:1});
go.share = d => APP.keep.put(d.key, {share: !!d.share});
go.send = async () => {
  if(!me().in){ return show({at:'pass', edit:1}) }
  try{ await APP.grp.send(me()) }catch(err){ return kit.say({err:'We couldn’t share your answers. Please try again.'}, 'oops', APP.view.el) }
  show({at:'done'});
};
go.all = () => show({at:'all'});
go.one = d => show({at:'one', who:d.who});
go.mine = () => show({at:'look'});
go.cut = async () => { await APP.grp.cut(); show({at:'hello'}, 'swap') };

kit.ear('go', function(eve, d){
  eve.preventDefault(); d = eve.detail || {};
  go[d.to] && go[d.to](d);
});

APP.grp.warm();
// nothing opens until the password is in, and the door only reopens on purpose (to switch password)
APP.lock = spot => me().in ? 'pass' === spot.at && !spot.edit && !spot.swap : 'pass' !== spot.at;
APP.home = () => !me().in ? {at:'pass'} : me().sent ? {at:'all'} : {at:'hello'};
show(me().in && history.state && history.state.at ? history.state : APP.home(), 'swap');
}());
