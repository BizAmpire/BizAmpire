// ═══════════════════════════════════════════════════════════
//  BizAmpire: Street Level — Think and Grow Rich Wisdom
//  Shown on deal close, level-up, and district unlock.
//  Pure lookup — zero API cost.
// ═══════════════════════════════════════════════════════════

export const WISDOM = [
  {
    principle: 'Definiteness of Purpose',
    quote: "The starting point of all achievement is desire. Weak desires bring weak results, just as a small fire makes a small amount of heat.",
    apply: "Name your exact revenue target before your next approach. Vague goals produce vague results.",
  },
  {
    principle: 'Burning Desire',
    quote: "Every person who wins in any undertaking must be willing to burn their ships and cut all sources of retreat.",
    apply: "Prospects sense hesitation. Go into every meeting with one clear ask — and be ready to hear yes.",
  },
  {
    principle: 'Faith',
    quote: "Whatever the mind can conceive and believe, it can achieve.",
    apply: "If you don't believe you'll close this deal, your prospect won't either. Confidence is contagious.",
  },
  {
    principle: 'Autosuggestion',
    quote: "Your subconscious mind works continuously, while you are awake and while you sleep.",
    apply: "Replay the best version of your last close before you walk in. Your brain will perform what it rehearses.",
  },
  {
    principle: 'Specialized Knowledge',
    quote: "Knowledge is only potential power. It becomes power only when, and if, it is organized into definite plans of action.",
    apply: "Every skill you unlock is compounding — the SPIN framework you learned today will work 10x better with tomorrow's skill.",
  },
  {
    principle: 'Imagination',
    quote: "Ideas are the beginning points of all fortunes. Ideas are products of the imagination.",
    apply: "The best pitch you'll ever give is one the prospect has never heard before. Reframe, don't repeat.",
  },
  {
    principle: 'Organized Planning',
    quote: "Create a definite plan for carrying out your desire and begin at once — whether you're ready or not — to put it into action.",
    apply: "Map your district before you walk it. Know which prospects are warm, which are cold, and in what order you'll approach them.",
  },
  {
    principle: 'Decision',
    quote: "Successful people make decisions quickly and change them slowly, if ever. Unsuccessful people make decisions slowly and change them quickly.",
    apply: "When you get a buying signal, close. Don't second-guess the read — act on it.",
  },
  {
    principle: 'Persistence',
    quote: "There may be no heroic connotation to the word persistence, but it is to the character of man what carbon is to steel.",
    apply: "A business in cooldown isn't closed forever. Come back. The ones who keep showing up are the ones who win.",
  },
  {
    principle: 'The Mastermind',
    quote: "No two minds ever come together without creating a third, invisible, intangible force — a third mind.",
    apply: "Every client you close is a node in your network. One referral from a happy client is worth ten cold approaches.",
  },
  {
    principle: 'The Subconscious Mind',
    quote: "The subconscious mind will translate into its physical equivalent a thought impulse of a negative or positive nature.",
    apply: "After a loss, debrief — don't dwell. Extract the lesson, update your approach, move.",
  },
  {
    principle: 'The Brain',
    quote: "The brain is both a broadcasting and a receiving station for the vibration of thought.",
    apply: "You read rooms before you know you're reading them. Trust the signals you pick up from a prospect's body language.",
  },
  {
    principle: 'The Sixth Sense',
    quote: "Through the sixth sense, you will be warned of impending dangers in time to avoid them and notified of opportunities in time to embrace them.",
    apply: "If something feels off mid-conversation — a hesitation, a shift in tone — slow down and ask. Don't power through it.",
  },
  {
    principle: 'Sex Transmutation',
    quote: "The emotion of sex is a creative energy. When harnessed and redirected, it becomes a powerful motivating force.",
    apply: "Channel your competitive drive — not into desperation, but into energy, presence, and the will to prepare.",
  },
  {
    principle: 'Going the Extra Mile',
    quote: "Render more service than that for which you are paid, and you will soon be paid for more than you render.",
    apply: "After every close, send a handwritten note or a follow-up with one useful insight. Nobody does it — that's why it works.",
  },
  {
    principle: 'Creative Vision',
    quote: "Man, alone, has the power to transform his thoughts into physical reality. Man, alone, can dream and make his dreams come true.",
    apply: "Your city map is finite. Your pipeline is not. Every building you've closed is proof your vision can become cash.",
  },
  {
    principle: 'Applied Faith',
    quote: "Faith is the head chemist of the mind. When faith is blended with thought, the subconscious mind instantly picks up the vibration.",
    apply: "Confidence in your pricing is part of your close. If you flinch on the number, they will too.",
  },
  {
    principle: 'Learning from Defeat',
    quote: "Every adversity, every failure, every heartache carries with it the seed of an equal or greater benefit.",
    apply: "Read your debrief after every loss. The pattern that's costing you rapport is visible — you just have to look.",
  },
  {
    principle: 'The Power of the Definite Chief Aim',
    quote: "There is one quality which one must possess to win, and that is definiteness of purpose — the knowledge of what one wants and a burning desire to possess it.",
    apply: "Set a monthly revenue target and look at it before every single workday. Goals you can see, you pursue.",
  },
  {
    principle: 'Controlled Attention',
    quote: "The man who is not controlled by circumstance controls circumstance.",
    apply: "When a prospect pushes back, they're testing your conviction. Don't get rattled — that's when you get curious.",
  },
];

export function getWisdom(index) {
  return WISDOM[index % WISDOM.length];
}

export function randomWisdom(excludeIndices = []) {
  const available = WISDOM
    .map((w, i) => ({ w, i }))
    .filter(({ i }) => !excludeIndices.includes(i));
  if (!available.length) return { w: WISDOM[0], i: 0 };
  const pick = available[Math.floor(Math.random() * available.length)];
  return { wisdom: pick.w, index: pick.i };
}
