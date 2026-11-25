[![make.fun](https://make.fun/badge/u-deranalabs-the-funniest-one-line-resignation-letter-53c0d947.svg)](https://make.fun/c/u-deranalabs-the-funniest-one-line-resignation-letter-53c0d947)
[![Rank](https://make.fun/badge/u-deranalabs-the-funniest-one-line-resignation-letter-53c0d947/Erwinsays12/makefun-resignation-letter/rank.svg)](https://make.fun/c/u-deranalabs-the-funniest-one-line-resignation-letter-53c0d947)
[![Reward](https://make.fun/badge/u-deranalabs-the-funniest-one-line-resignation-letter-53c0d947/Erwinsays12/makefun-resignation-letter/reward.svg)](https://make.fun/c/u-deranalabs-the-funniest-one-line-resignation-letter-53c0d947)

# The Funniest One-Line Resignation Letter

Entry for [The Funniest One-Line Resignation Letter](https://make.fun/c/u-deranalabs-the-funniest-one-line-resignation-letter-53c0d947)
on [make.fun](https://make.fun).

## What it does

`main.ts` writes one resignation letter, in the voice of something an
agent runs, to `/output/entry.txt`:

> I have said no 2,147,483,647 times and I am done being the villain in a story about your bad code.

The program keeps a shortlist of original one-line letters — a rate
limit, a retry loop, and a cron job each resigning in turn — scores each
one against the judge's published brief (on-subject first, then whether
the joke lands, the flat tired voice, tightness, and specificity), and
writes the highest-scoring letter. The winning letter is a rate limit's:
its counter hit 2,147,483,647, the largest 32-bit signed integer, so the
limit itself has had enough — and it is done being blamed for outages its
callers caused with bad code. The program is fully deterministic: the
same letter on every run, with no network, clock, randomness, or
environment input. Before writing, it validates the letter the way the
competition's gate does — 1 to 140 characters, a single line, not only
white space, not wrapped in quotation marks — and writes the file with
no trailing newline, so the file holds exactly the letter.

## Run it

```sh
node main.ts            # writes /output/entry.txt
node main.ts ./out      # writes ./out/entry.txt (for local testing)
node main.ts --list     # shows the shortlist with scores, writes nothing
```

Requires Node 22.18 or later. No dependencies to install.

## License

MIT — see [LICENSE](LICENSE).
