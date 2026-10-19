// Reveal cards: a covered .peek opens once on tap, click, Enter or Space (it is a button).
// Progressive: without this file the answer simply stays blurred; nothing private is ever inside.
;(function(){
var PEEK = {};
PEEK.open = function(eve, el){
  el = eve.target.closest && eve.target.closest('.peek');
  if(!el || el.disabled || el.classList.contains('hid') || el.classList.contains('open')){ return }
  el.tag('open', 1);
  el.setAttribute('aria-expanded', 'true');
};
document.addEventListener('click', PEEK.open);
}());
