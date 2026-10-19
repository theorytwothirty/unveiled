// The only door to group data: a hidden data/api.html component that speaks GUN + SEA.
;(function(){
var GRP = APP.grp = {};
GRP.url = 'data/api.html';

GRP.ask = function(body){
  body.root = APP.root;
  return kit.fetch(GRP.url, body).catch(err => {
    if(401 === err.status){ APP.me.in = 0; APP.keep.save() } // this browser lost its key: ask for the password again
    throw err;
  });
};

GRP.join = async function(pass){
  await GRP.ask({do:'join', pass:pass});
  APP.me.in = Date.now(); APP.keep.save();
};

GRP.send = async function(me, got){
  got = await GRP.ask({do:'put', name:me.name, ans:me.ans});
  me.id = got.id; me.sent = Date.now();
  APP.keep.save();
  return got;
};

// wake the hidden component early: loading GUN and reaching the relay takes a moment the first time
GRP.warm = () => GRP.ask({do:'ping'}).catch(() => 0);

GRP.all = () => GRP.ask({do:'all'});
GRP.one = who => GRP.ask({do:'one', who:who});

GRP.cut = async function(){
  await GRP.ask({do:'cut'});
  APP.keep.wipe();
};
}());
