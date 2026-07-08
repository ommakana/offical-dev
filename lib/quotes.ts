export interface Quote {
  text: string;
  author?: string;
}

// A curated mix — nerdy jokes, witty one-liners, famous devs, motivational bits.
// One quote per day (rotates by day-of-year) so it's fresh without being noisy.
const QUOTES: Quote[] = [
  // Nerdy / jokes
  { text: "There are only 10 types of people in the world: those who understand binary, and those who don't." },
  { text: "99 little bugs in the code. Take one down, patch it around — 127 little bugs in the code." },
  { text: "Why do programmers prefer dark mode? Because light attracts bugs." },
  { text: "To understand recursion, you must first understand recursion." },
  { text: "A QA engineer walks into a bar. Orders 0 beers. Orders 999999999 beers. Orders -1 beers. Orders a lizard. Orders null. Orders asdfjkl;." },
  { text: "It's not a bug — it's an undocumented feature." },
  { text: "There are two hard problems in CS: cache invalidation, naming things, and off-by-one errors." },
  { text: "sudo make me a sandwich." },
  { text: "Git commit. Git push. Git out of here." },
  { text: "LGTM. (I didn't actually read it.)" },

  // Famous dev quotes
  { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { text: "Premature optimization is the root of all evil.", author: "Donald Knuth" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "The best code is no code at all.", author: "Jeff Atwood" },
  { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "The only way to go fast is to go well.", author: "Robert C. Martin" },
  { text: "Measuring programming progress by lines of code is like measuring aircraft building progress by weight.", author: "Bill Gates" },
  { text: "Software is like entropy: it is difficult to grasp, weighs nothing, and obeys the second law of thermodynamics — it always increases.", author: "Norman Augustine" },

  // Witty one-liners
  { text: "A day without coding is a day I wouldn't know what to do with myself." },
  { text: "Eat. Sleep. Code. Repeat. (And hydrate — seriously.)" },
  { text: "Ship it. Perfect is the enemy of done." },
  { text: "Coffee.exe has stopped working. Developer.exe is now unresponsive." },
  { text: "The cloud is just someone else's computer. And it's on fire. It's fine." },
  { text: "Weeks of coding can save you hours of planning." },
  { text: "Documentation: the love letter you write to your future self." },
  { text: "In theory, there's no difference between theory and practice. In practice, there is." },
];

/**
 * Returns a deterministic quote for the current calendar day.
 * Same quote all day; different quote tomorrow. No React state needed.
 */
export function getDailyQuote(): Quote {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  return QUOTES[dayOfYear % QUOTES.length];
}
