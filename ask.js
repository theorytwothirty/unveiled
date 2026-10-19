// The whole questionnaire lives here. Edit words freely; keep the keys stable.
// key: storage key · mark: big letter · word: section name · head: the question
// text: short explanation · tips: inspiration · note: closing line · hold: placeholder
// share: shared by default · ask: show the share toggle on the question itself · dark: After Dark styling
var ASK = {};

ASK.list = [
  { key:'r', mark:'R', word:'Relationships', share:true,
    head:'Is there anyone else we should know about?',
    text:'Are you single, partnered, dating, monogamous, or open? Any agreements or commitments that might affect what happens here?',
    tips:['Current relationship status.', 'Open or monogamous agreements.', 'Anything important others should know.'],
    note:'', hold:'Tell us a little about your relationship landscape…' },

  { key:'b', mark:'B', word:'Boundaries', share:true,
    head:'What’s a yes, and what’s a hard no?',
    text:'Let’s talk about what feels good, what doesn’t, and what needs a conversation first.',
    tips:['Physical or emotional boundaries.', 'Hard limits or triggers.', 'Safer-sex and contraception requirements.', 'Things you’d like people to ask before doing.'],
    note:'Sexy people ask. They don’t assume.', hold:'My boundaries are…' },

  { key:'d', mark:'D', word:'Desires', share:true,
    head:'Okay… what DO you want?',
    text:'What excites you? What would you love to experience or explore?',
    tips:['Things that turn you on.', 'Experiences you’re curious about.', 'What makes you feel desired or connected.'],
    note:'Sharing a desire isn’t the same as giving consent.', hold:'I’d love to explore…' },

  { key:'s', mark:'S', word:'Sexual Health', share:false,
    head:'Let’s talk sexual health.',
    text:'Being open about sexual health helps everyone make informed decisions.',
    tips:['When were you last tested, and for what?', 'Any known STIs or relevant changes since testing?', 'Protection, contraception, or PrEP preferences.', 'Anything else relevant to sexual health or pregnancy risk?'],
    note:'Responsible is sexy, too.', hold:'What I’d like others to know…' },

  { key:'m', mark:'M', word:'Meaning', share:true,
    head:'What would this mean to you?',
    text:'Let’s make sure we’re on the same page about expectations.',
    tips:['Just tonight, casual exploration, or something more?', 'Are you looking for emotional connection?', 'Any hopes or expectations afterward?'],
    note:'Same experience. Different expectations. Let’s talk about it.', hold:'For me, intimacy means…' },

  { key:'a', mark:'A', word:'Aftercare', share:true,
    head:'What would help you feel good afterward?',
    text:'Everyone has different needs after intimacy. What makes you feel cared for?',
    tips:['Cuddles, reassurance, or conversation?', 'Space, privacy, or sleeping together?', 'A check-in the next day?', 'Food, water, or a little debrief?'],
    note:'Sometimes the moments after matter just as much.', hold:'I feel most cared for when…' },

  { key:'f', mark:'F', word:'Fantasies', share:false, ask:true, dark:true, peek:'Their deepest fantasy',
    head:'What’s your deepest sexual fantasy, if you have one?',
    text:'Something you’ve imagined, something you’re curious about, or something that turns you on.',
    tips:[], note:'', hold:'My fantasy is…' },

  { key:'k', mark:'K', word:'Kinks', share:false, ask:true, dark:true, peek:'Their kinks',
    head:'Do you have any kinks?',
    text:'Anything playful, unconventional, or particularly exciting to you?',
    tips:[], note:'', hold:'Something I’m into…' },

  { key:'p', mark:'RP', word:'Role Play', share:false, ask:true, dark:true, peek:'Their favorite role play',
    head:'What’s your favorite role-play scenario, if you have one?',
    text:'A character, dynamic, or scenario you’d enjoy exploring.',
    tips:[], note:'', hold:'I’d love to play…' },

  { key:'o', mark:'+', word:'Anything Else', share:false, ask:true, dark:true, peek:'Anything else',
    head:'Anything else you’d like to share?',
    text:'A wish, a curiosity, a little confession — whatever feels right.',
    tips:[], note:'', hold:'One more thing…' }
];

ASK.core = ASK.list.filter(q => !q.dark);
ASK.deep = ASK.list.filter(q => q.dark);
