// src/data/characters/meowscarada/dates/restaurantDate.js
//
// Ported from the original Ren'Py script (meowscarada_date1 onward).
// Uses characterStates[id].relationship as the affection counter — bump it
// via `affectionChange` on a choice, gate options/branches with
// `minAffection`. See FullscreenDateView.jsx for the full scene schema.
//
// Image paths are placeholders matching the original CG names so art can
// be dropped in later without touching this file.

const BG = '/assets/images/backgrounds';
const CG = '/assets/images/characters/meowscarada';

export const restaurantDate = {
  id: 'restaurant_date',
  title: 'Dinner Downtown',
  initialSceneId: 'arrival',

  scenes: {
    // ------------------------------------------------------------------
    // ARRIVAL
    // ------------------------------------------------------------------
    arrival: {
      background: `${CG}/restaurant_arrive.png`,
      speaker: 'Narrator',
      dialogue:
        "He's already there when you arrive. Of course he is. Sitting perfectly upright in a private booth, menu in hand. He doesn't look up when you walk in. He doesn't need to.\n\n\"You're on time. Good. Sit.\"",
      choices: [
        { text: 'Take a seat confidently.', nextScene: 'seat_confident', affectionChange: 1 },
        { text: 'Apologize for making him wait.', nextScene: 'seat_apology' },
      ],
    },

    seat_confident: {
      background: `${CG}/restaurant_eyecheck.png`,
      dialogue:
        '"Hmm."\n\nHe looks you over slowly. Top to bottom. Something flickers behind those pink eyes.',
      autoNext: 'honesty_intro',
    },

    seat_apology: {
      background: `${CG}/restaurant_eyecheck.png`,
      dialogue:
        '"I said you were on time. Don\'t apologize for things that don\'t need apologizing for."\n\nHis facial expression doesn\'t falter, and yet... you feel like this wasn\'t what he was looking for.',
      autoNext: 'honesty_intro',
    },

    // ------------------------------------------------------------------
    // HONESTY / WHY DID YOU SWIPE
    // ------------------------------------------------------------------
    honesty_intro: {
      background: `${BG}/restaurant.png`,
      dialogue:
        "\"I'll be honest. I don't usually do this. Dating apps are beneath me.\"",
      choices: [
        { text: 'So why did you?', nextScene: 'curiosity_response', affectionChange: 1 },
        { text: 'Yet here you are.', nextScene: 'hereyouare_response', affectionChange: 2 },
      ],
    },

    curiosity_response: {
      dialogue:
        '"...Curiosity. You looked like you might be worth my time. Jury\'s still out."',
      autoNext: 'waiter_scene',
    },

    hereyouare_response: {
      image: `${CG}/restaurant_smile.png`,
      dialogue:
        '"...Yes. Here I am."\n\nHe smiles. Just slightly. It\'s the most unnerving thing you\'ve ever seen.',
      autoNext: 'waiter_scene',
    },

    // ------------------------------------------------------------------
    // ORDERING / TELL ME SOMETHING
    // ------------------------------------------------------------------
    waiter_scene: {
      image: `${CG}/restaurant_waiter.png`,
      speaker: 'Narrator',
      dialogue:
        "The waiter arrives. Meowscarada orders without looking at the menu. Something expensive. In French. The waiter doesn't bat an eye. You order whatever sounds least likely to embarrass you.",
      autoNext: 'tell_something_prompt',
    },

    tell_something_prompt: {
      background: `${BG}/restaurant.png`,
      dialogue: '"So. Tell me something about yourself. And please. Make it interesting."',
      choices: [
        {
          text: 'Tell him something genuinely interesting.',
          nextScene: 'interesting_response',
          affectionChange: 2,
        },
        { text: 'Give a safe, boring answer.', nextScene: 'boring_response' },
      ],
    },

    interesting_response: {
      image: `${CG}/restaurant_smile.png`,
      dialogue:
        'He\'s quiet for a moment. Actually quiet. Not dismissive quiet.\n\n"Hm. That\'s actually not terrible."\n\nHe leans back in his seat. Something in his posture shifts.',
      autoNext: 'restroom_offer',
    },

    boring_response: {
      image: `${CG}/restaurant_smile.png`,
      dialogue:
        '"...That\'s it? Really."\n\nHe sets his wine glass down very slowly.\n\n"I\'m going to need you to do significantly better than that."',
      autoNext: 'boring_route',
    },

    // ------------------------------------------------------------------
    // BORING ROUTE — FOOTJOB + ANAL VORE (bad ending)
    // ------------------------------------------------------------------
    boring_route: {
      image: `${CG}/restaurant_footjob.png`,
      dialogue:
        'Something shifts under the table. You feel it before you understand what it is — his foot, sliding deliberately up your leg. Slow. Purposeful.\n\n"Since conversation seems to be off the table... we\'ll find another way to pass the time."',
      autoNext: 'boring_route_2',
    },

    boring_route_2: {
      image: `${CG}/restaurant_footjob2.png`,
      speaker: 'Narrator',
      dialogue:
        'He picks his wine glass back up. Takes a sip. Looks out the window like nothing is happening — like he isn\'t doing exactly what he\'s doing, under the table, in a restaurant, with a completely straight face.\n\nThe waiter comes to check on you. Meowscarada smiles politely and asks how the kitchen is doing tonight. You say nothing. You are physically incapable of saying nothing.\n\nBy the time the main course arrives you\'ve completely lost the thread of any conversation. He maintains it effortlessly — wine vintages, the architecture of the restaurant, current events. His foot does not stop.\n\nBy dessert you\'re a complete mess. He looks perfectly fine. He always looks perfectly fine.',
      autoNext: 'boring_route_comment',
    },

    boring_route_comment: {
      dialogue: '"Well. That was marginally more entertaining than your conversation."',
      choices: [
        { text: 'That was incredible.', nextScene: 'boring_route_end_setup' },
        { text: "You're completely unbelievable.", nextScene: 'boring_route_end_setup', affectionChange: 1 },
      ],
    },

    boring_route_end_setup: {
      image: `${CG}/restaurant_hungry.png`,
      speaker: 'Narrator',
      dialogue:
        'He dabs his mouth with the napkin. Sets it down with the kind of finality that makes your stomach drop.\n\n"Dinner itself was rather dull. I hate wasting a good meal."\n\nHe stands. Smooths his shirt. Looks down at you.\n\n"Don\'t take it personally."',
      autoNext: 'boring_route_vore',
    },

    boring_route_vore: {
      image: `${CG}/restaurant_analvore.png`,
      speaker: 'Narrator',
      dialogue:
        'It happens very quickly. One moment you\'re sitting at the table. The next you\'re not.\n\nThe restaurant continues around him. Nobody notices. Nobody ever notices with him. He sits back down, folds his hands on the table. His stomach gives one long, slow shift as it gets to work. He orders another glass of wine. Checks his phone. The digestion is thorough and unhurried.\n\nHis stomach gurgles quietly, deeply satisfied. He pats it once without thinking about it. By the time the bill arrives everything is considerably more settled.\n\nHe reaches into his pocket. Pauses. Reaches somewhere else instead — and sets something small and white on the silver tray. Neatly. Precisely. Right where a tip would go.\n\n"Service was adequate. But you were pretty dull."',
      isEnding: true,
      endingId: 'not_worth_walk',
      endingTitle: 'Not Even Worth the Walk',
      endingType: 'bad',
    },

    // ------------------------------------------------------------------
    // RESTROOM OFFER
    // ------------------------------------------------------------------
    restroom_offer: {
      dialogue:
        '"You know. The restrooms here are very private. I\'ve always found that interesting."\n\nHe tilts his head slightly, watching you with those half-lidded pink eyes. Waiting.',
      choices: [
        { text: 'Follow him.', nextScene: 'restroom_start' },
        { text: 'Decline politely.', nextScene: 'footjob_route' },
      ],
    },

    // ------------------------------------------------------------------
    // FOOTJOB ROUTE → ALLEY
    // ------------------------------------------------------------------
    footjob_route: {
      image: `${CG}/restaurant_footjob.png`,
      dialogue:
        '"No?"\n\nHe looks at you for a long moment. "Interesting." He smiles. It doesn\'t reach his eyes. Something slides under the table.\n\n"Suit yourself."',
      autoNext: 'footjob_route_2',
    },

    footjob_route_2: {
      image: `${CG}/restaurant_footjob2.png`,
      speaker: 'Narrator',
      dialogue:
        'He keeps you thoroughly occupied for the rest of dinner. Not a word about it. Not a flicker on his face. Completely composed. Completely in control. You are neither of those things.\n\nThe waiter refills his water. He thanks them pleasantly. You stare at the tablecloth and try to remember how to breathe.\n\nAfter dinner he stands and straightens his jacket.\n\n"There\'s an alley nearby I\'m rather fond of. Come."\n\nHe walks out without checking if you\'re following. He knows you are.',
      autoNext: 'alley_gate',
    },

    // ------------------------------------------------------------------
    // RESTROOM ROUTE
    // ------------------------------------------------------------------
    restroom_start: {
      background: `${CG}/restroom_door.png`,
      speaker: 'Narrator',
      dialogue:
        'The restroom is indeed very private. Single occupancy. He locks the door behind you. Doesn\'t rush.\n\n"So." He turns to face you, leans against the wall, arms loose at his sides — looking at you like you\'re something he hasn\'t quite decided what to do with yet.\n\nYou close the distance. He lets you. Barely.\n\n"What are you going to do with me?"',
      choices: [
        { text: 'Take charge.', nextScene: 'restroom_top' },
        { text: 'Let him lead.', nextScene: 'restroom_sub' },
      ],
    },

    restroom_top: {
      image: `${CG}/restroom_surprised.png`,
      speaker: 'Narrator',
      dialogue:
        'He raises an eyebrow. For a moment he actually looks surprised — genuinely surprised. It lasts about two seconds.\n\n"Oh. Oh that\'s adorable."\n\nHe lets you have your moment. Lets you think you\'re in control. The makeout is intense, breathless. He tastes like expensive wine and something warmer. His hands come up to your shoulders — gentle at first. Then not.\n\nHe pulls back just far enough to look at you. Those pink eyes. That expression.\n\n"Thank you for dinner."',
      autoNext: 'restroom_top_2',
    },

    restroom_top_2: {
      image: `${CG}/restroom_mawshot.png`,
      speaker: 'Narrator',
      dialogue:
        'He slowly opens his maw until you\'re left staring down into that abyss of a gullet. You blush a bit — freak.\n\nYou\'re sent head first down his throat. A slight moan escapes him as he swallows.\n\nYou know, between you and me — you should have picked up that he is a top.',
      autoNext: 'restroom_top_3',
    },

    restroom_top_3: {
      speaker: 'Narrator',
      dialogue:
        'The restroom is very quiet afterward. His reflection looks back at him from the mirror. He fixes his hair. Takes his time.\n\nHis stomach gives a long, slow rumble. He watches it in the mirror. Pats it once, absently — the way you\'d pat a pocket to check your keys. The digestion is warm and thorough. He adjusts his collar. Straightens his sleeves. His stomach gurgles again. Lower this time. Deeper.\n\nSatisfied, he tilts his head back. A sound escapes him — he doesn\'t particularly try to suppress it. Something small and white clatters into the sink. He looks at it. Picks it up. Holds it up to the light for a moment.\n\n"Waste not."\n\nHe drops it in the bin, unlocks the door, and walks back to his table to finish dinner. Orders dessert. It\'s a very good crème brûlée.',
      isEnding: true,
      endingId: 'dessert',
      endingTitle: 'Dessert',
      endingType: 'bad',
    },

    restroom_sub: {
      dialogue:
        'You step back. Give him the space. He looks at you for a long moment, reading something in your expression.\n\n"Smart."\n\nWhat follows is not something you\'ll forget easily. He\'s completely in control — unhurried, thorough, like he has all the time in the world and intends to use it. You don\'t remember at what point your legs stop working. He catches you. Of course he does. He doesn\'t comment on it.',
      autoNext: 'restroom_sub_2',
    },

    restroom_sub_2: {
      speaker: 'Narrator',
      dialogue:
        'When you finally leave the restroom he straightens his collar. Glances at you.\n\n"You\'ll do. Come. Let\'s finish dinner."\n\nHe holds the door. The restaurant is exactly as you left it. Nobody suspects a thing. He orders dessert. Recommends the crème brûlée. It\'s a very good date.',
      isEnding: true,
      endingId: 'youll_do',
      endingTitle: "You'll Do — Happy End",
      endingType: 'good',
    },

    // ------------------------------------------------------------------
    // ALLEY — affection-gated branch
    // ------------------------------------------------------------------
    alley_gate: {
      background: `${BG}/alley.png`,
      image: `${CG}/predatory.png`,
      dialogue:
        'The alley is quiet. Dark. The kind of private that cities only manage by accident. He stops walking. Turns.\n\n"I had a lovely evening. Mostly."\n\nHe tilts his head. That smile. "I\'m still a little hungry though."\n\nHe takes a step closer. The alley feels smaller than it did a moment ago.',
      branch: [
        { minAffection: 3, nextScene: 'alley_convince_gate' },
        { nextScene: 'alley_vore' },
      ],
    },

    alley_convince_gate: {
      dialogue: '...',
      choices: [
        { text: "Wait — let's talk about this.", nextScene: 'alley_convince' },
        { text: 'Say nothing.', nextScene: 'alley_vore' },
      ],
    },

    alley_convince: {
      speaker: 'Narrator',
      dialogue:
        '"...Talk about it." He stops. Actually stops. "You want to talk about it." He stares at you. Something shifts in his expression.\n\n"You\'re either very brave or very stupid. I haven\'t decided which."\n\nA long pause. A cat passes at the far end of the alley. Doesn\'t look twice.\n\n"...Fine. Convince me you\'re more interesting alive."',
      choices: [
        { text: 'Offer an alternative.', nextScene: 'alley_happy', affectionChange: 1 },
        { text: 'Beg.', nextScene: 'alley_vore' },
      ],
    },

    // ------------------------------------------------------------------
    // ALLEY HAPPY ENDING
    // ------------------------------------------------------------------
    alley_happy: {
      speaker: 'Narrator',
      dialogue:
        'He\'s quiet for a moment. "...That\'s not the worst counteroffer I\'ve heard."\n\nWhat follows is enthusiastic, thorough, and very much on his terms — which somehow makes it better. When it\'s over he looks down at you, that unreadable expression. He crouches to your level, slowly. Opens his mouth. Wide. His tongue runs along his teeth, deliberate, eyes never leaving yours.\n\n"...Next time."\n\nHe stands, smooths his shirt, like nothing happened — like that wasn\'t a promise and a threat in the same breath.',
      autoNext: 'alley_happy_2',
    },

    alley_happy_2: {
      speaker: 'Narrator',
      dialogue:
        '"Same app. Don\'t keep me waiting."\n\nHe walks back toward the street. Doesn\'t look back. You stay in the alley for a while, thinking about what next time means.\n\nThen — sirens. Blue and red light floods the alley entrance.\n\n"Hey! You there! Don\'t move!"',
      isEnding: true,
      endingId: 'next_time',
      endingTitle: 'Next Time — Happy End',
      endingType: 'good',
    },

    // ------------------------------------------------------------------
    // ALLEY VORE ENDING (bad)
    // ------------------------------------------------------------------
    alley_vore: {
      image: `${CG}/predatory.png`,
      speaker: 'Narrator',
      dialogue:
        '"It was a good date. Mostly."\n\nHe steps closer, close enough that you have to look up at him.\n\n"Don\'t worry."\n\nHe reaches out, adjusts your collar. Gently.\n\n"You\'ll make an excellent dessert."',
      autoNext: 'alley_vore_2',
    },

    alley_vore_2: {
      speaker: 'Narrator',
      dialogue:
        'He opens his mouth. Wider than seems possible. Wider than seems right. And then — the world tilts. Warm. Dark. The sounds of the city go muffled and distant. Something contracts around you, slow, rhythmic, inevitable. It\'s not uncomfortable. That\'s somehow the strangest part.',
      autoNext: 'alley_vore_3',
    },

    alley_vore_3: {
      speaker: 'Narrator',
      dialogue:
        'Outside the alley is quiet. He leans against the wall, one hand resting on his stomach, the other scrolling through his phone. AnthroDate is still open. He\'s already browsing.\n\nHis stomach shifts. He shifts with it. Settles. The digestion is thorough and warm and entirely unhurried — he has nowhere to be. His stomach gurgles, low, deep, satisfied. He pats it once, doesn\'t think about it.\n\nTime passes. His stomach settles further, quieter now. The job nearly done. He tilts his head back. The alley echoes. Something rolls along the cobblestones, comes to rest against the opposite wall. He glances at it. Looks back at his phone.\n\n"Three stars. Conversation could have been better."\n\nHe pushes off the wall, walks back toward the street. Doesn\'t look back.',
      isEnding: true,
      endingId: 'dessert_alley',
      endingTitle: 'Dessert in the Alley',
      endingType: 'bad',
    },
  },
};
