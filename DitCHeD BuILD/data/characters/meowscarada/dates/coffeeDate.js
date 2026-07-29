// src/data/characters/meowscarada/dates/coffeeDate.js
export const coffeeDate = {
  id: 'coffee_date',
  title: 'Late Night Pastry Run',
  initialSceneId: 'start',
  scenes: {
    start: {
      background: '/assets/images/coffee_shop.png',
      speaker: 'Meowscarada',
      dialogue: "You brought me here? You really know the way to my heart.",
      choices: [
        { text: "Only the best for you.", nextScene: 'success', affectionChange: 20, rewardPhoto: '/assets/images/meowscarada_butt.png' }
      ]
    },
    success: {
      background: '/assets/images/coffee_shop.png',
      speaker: 'Meowscarada',
      dialogue: "I'm stuffed, but I'd totally go another round with you.",
      isEnding: true,
      endingTitle: "Sugar Rush Romance ✨"
    }
  }
};