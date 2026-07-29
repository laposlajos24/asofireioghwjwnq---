export const meowscaradaData = {
  id: "meowscarada",
  name: "Meowscarada",
  age: 22,
  bio: "Stage magician with a knack for dramatic entrances and quiet cafe dates. Don't let the mask fool you.",
  avatar: "/meowscarada_butt.png",
  swipeImages: [
    "https://via.placeholder.com/400x600"
  ],
  dates: ["restaurant_date", "magic_show_date"],
  initialChatHistory: [
    { id: 1, sender: 'them', text: 'Hey! Thanks for matching. I was hoping you’d swipe right. 🌿✨', type: 'text' }
  ],
  dialogueTree: [
    {
      id: 0,
      characterPrompt: "Hey! Thanks for matching. I was hoping you’d swipe right. 🌿✨",
      choices: [
        {
          text: "The pleasure is mine! How could anyone pass up a true master of illusions?",
          response: "A master? Flatterer! Though I suppose it takes one to spot one. Most people just ask if the mask comes off. Care for a preview of my repertoire?",
          rewardPhoto: "/meowscarada_butt.png",
          nextStep: 1
        },
        {
          text: "Honestly, your bio caught my eye immediately.",
          response: "Really? Most people just look at the avatar. I appreciate someone who reads! Here, a reward for your attention...",
          rewardPhoto: "https://via.placeholder.com/300x400",
          nextStep: 1
        }
      ]
    },
    {
      id: 1,
      characterPrompt: "Here, let me send you a little sneak peek of what I'm working on today...",
      choices: [
        {
          text: "You look incredible! Is that a new stage outfit?",
          response: "Haha, thank you! It's still a work in progress. Honestly, practicing all day under these stage lights makes me crave some real-world company.",
          nextStep: 2
        },
        {
          text: "Okay, now I definitely need to see this performance live.",
          response: "Oh? Confident, are we? I like that energy. It takes a lot to keep up with my pacing, but I might just let you try.",
          nextStep: 2
        }
      ]
    },
    {
      id: 2,
      characterPrompt: "I'm actually thinking about heading out to grab some coffee or a late-night bite soon. Are you free this week?",
      choices: [
        {
          text: "Only if I get to be your date. Name the place.",
          response: "Smooth to the very end! It's a date then. Let's make it official and see how you handle my world. ❤️",
          rewardPhoto: "https://via.placeholder.com/400x600",
          nextStep: 3
        },
        {
          text: "I'd love to grab a bite and chat more in person!",
          response: "Yay! Perfect. I know a cozy little spot downtown that pairs great with magic. See you there!",
          rewardPhoto: "https://via.placeholder.com/400x600",
          nextStep: 3
        }
      ]
    }
  ]
};