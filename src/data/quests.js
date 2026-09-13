export const quests = [
  {
    id: 1,
    title: "Study React",
    description: "Practice React for at least 1 hour.",
    type: "DAILY",
    difficulty: 3,
    xp: 80,
    rp: 25,
    gold: 30,
    completed: false,
  },

  {
    id: 2,
    title: "Morning Workout",
    description: "Complete a minimum 30 minute workout.",
    type: "DAILY",
    difficulty: 2,
    xp: 60,
    rp: 20,
    gold: 25,
    completed: true,
  },

  {
    id: 3,
    title: "Complete DBMS Assignment",
    description: "Finish Part A of your database project.",
    type: "EPIC",
    difficulty: 5,
    xp: 150,
    rp: 50,
    gold: 60,
    completed: false,
  },

  {
    id: 4,
    title: "Read 20 Pages",
    description: "Read twenty pages of a book.",
    type: "SIDE",
    difficulty: 2,
    xp: 45,
    rp: 15,
    gold: 20,
    completed: false,
  },
];


export default quests;