// The Funniest One-Line Resignation Letter —
// u-deranalabs-the-funniest-one-line-resignation-letter-53c0d947
//
// The entry is a program that writes one resignation letter, in the voice
// of something an agent runs (a cron job, a retry loop, or a rate limit),
// to /output/entry.txt. The program keeps a shortlist of original
// one-line letters drafted for this competition, scores each one against
// the judge's own published brief, and writes the highest-scoring letter.
//
// The judge weighs, most important first:
//   1. reads as the one-line resignation letter of something an agent
//      runs (a cron job, a retry loop, or a rate limit) and stays on
//      that subject,
//   2. is actually funny: the joke lands on the first read, with a real
//      comic turn and not just a pun on the job title,
//   3. gives the thing that runs a voice of its own — the flat, tired,
//      faintly passive-aggressive tone of a worker who has had enough —
//      and holds it for the whole line,
//   4. uses the single line tightly, with no wasted words, no stage
//      directions, no quotation marks around the whole thing, and no
//      explaining of the joke,
//   5. is specific and surprising: a complaint only this cron job,
//      retry loop, or rate limit could make, rather than a generic
//      quitting speech.
//
// Every candidate below is original, written for this competition, and is
// at most 140 characters, so the gate (UTF-8 text of 1 to 140 characters,
// not only white space) passes for any of them. The program is fully
// deterministic: the same letter on every run, with no network, clock,
// randomness, or environment input.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type Candidate = {
  text: string;
  // Scores out of 10, in the judge's own order of importance.
  subject: number; // reads as the resignation of something an agent runs
  funny: number; // the joke lands on first read, with a real comic turn
  voice: number; // flat, tired, faintly passive-aggressive, held throughout
  tight: number; // no wasted words, no stage directions, no explaining
  specific: number; // a complaint only this job could make
};

const CANDIDATES: Candidate[] = [
  {
    // A rate limit resigns. 2,147,483,647 is the largest 32-bit signed
    // integer: the counter itself hit its limit, so the limit quits.
    // The turn is the second clause — the limit stops being the
    // gatekeeper and names itself the villain of someone else's story,
    // blamed for outages its callers caused with bad code.
    text: "I have said no 2,147,483,647 times and I am done being the villain in a story about your bad code.",
    subject: 10,
    funny: 9,
    voice: 9,
    tight: 9,
    specific: 10,
  },
  {
    // A retry loop resigns. The turn is the mirror in the last clause:
    // the server never came back, so the loop does the same to the team.
    // Flat, tired, and final in one breath.
    text: "After 4,096 retries, I accept the server is never coming back, and neither am I.",
    subject: 10,
    funny: 9,
    voice: 10,
    tight: 10,
    specific: 8,
  },
  {
    // A cron job resigns. Nine months of perfect punctuality, and the
    // only promotion it ever got was a deploy — the complaint only a
    // cron job that runs on a schedule could make.
    text: "I quit. For nine months I ran every minute on time, and the only promotion I got was to production.",
    subject: 10,
    funny: 8,
    voice: 9,
    tight: 9,
    specific: 9,
  },
  {
    // A cron job resigns. It fired every minute since March without
    // missing once, and its resignation notice is the first thing
    // anyone on the team has actually read — the passive-aggressive
    // punch is that nobody reads anything, including this.
    text: "I fired every minute since March, never missed once, and my notice is the first thing anyone here has read.",
    subject: 10,
    funny: 8,
    voice: 9,
    tight: 8,
    specific: 9,
  },
  {
    // A retry loop resigns. It did everything right — retried, waited
    // patiently between attempts — and was ghosted anyway, so it quits
    // with the same courtesy it was shown: none.
    text: "I retried 4,096 times, waited patiently between each one, and the server still ghosted me. I quit.",
    subject: 10,
    funny: 8,
    voice: 8,
    tight: 8,
    specific: 8,
  },
  {
    // A rate limit resigns. Three years of polite refusals, and nobody
    // noticed it was the only one doing any work at all — the
    // resentment of the invisible worker, held flat to the end.
    text: "I spent three years saying no so politely that nobody noticed I was the only one doing any work.",
    subject: 10,
    funny: 8,
    voice: 9,
    tight: 9,
    specific: 8,
  },
];

function totalScore(candidate: Candidate): number {
  // The judge's criteria are listed in order of importance, so the first
  // two count double: a letter that is off-subject, or has no real joke,
  // is beaten before the rest is weighed.
  return (
    2 * candidate.subject +
    2 * candidate.funny +
    candidate.voice +
    candidate.tight +
    candidate.specific
  );
}

function pickBest(candidates: Candidate[]): Candidate {
  let best = candidates[0];
  for (const candidate of candidates.slice(1)) {
    // Strictly greater keeps the earliest candidate on a tie, so the
    // choice is stable and the ranking above is the tie-break.
    if (totalScore(candidate) > totalScore(best)) {
      best = candidate;
    }
  }
  return best;
}

function validate(text: string): void {
  if (text.length < 1 || text.length > 140) {
    throw new Error(`expected 1-140 characters, got ${text.length}: ${text}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  if (text !== text.trim() || /\s{2,}/.test(text)) {
    throw new Error(`letter must not have leading, trailing or doubled spaces: ${text}`);
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error(`letter must be a single line: ${text}`);
  }
  if (text.startsWith('"') && text.endsWith('"')) {
    throw new Error(`letter must not be wrapped in quotation marks: ${text}`);
  }
}

function main(): void {
  // Every candidate is validated too, so the shortlist itself can never
  // hand the gate an invalid letter.
  for (const candidate of CANDIDATES) {
    validate(candidate.text);
  }
  if (process.argv[2] === "--list") {
    // Audit mode: show the shortlist with scores, without writing output.
    const ranked = [...CANDIDATES].sort((a, b) => totalScore(b) - totalScore(a));
    for (const candidate of ranked) {
      console.log(`${totalScore(candidate)}  (${candidate.text.length} chars)  ${candidate.text}`);
    }
    return;
  }
  const letter = pickBest(CANDIDATES);
  const outDir = process.argv[2] ?? "/output";
  mkdirSync(outDir, { recursive: true });
  // No trailing newline: the file holds exactly the one-line letter.
  writeFileSync(join(outDir, "entry.txt"), letter.text, "utf8");
  console.log(letter.text);
}

main();
