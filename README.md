# Centaur

**A curriculum for the human half of the human–AI engineering pair.**

In 1998, Garry Kasparov popularized "centaur chess": a human plus a machine, playing as one team. For years, average players with good machines and *great collaboration process* beat both grandmasters and supercomputers playing alone. The lesson wasn't that the machine mattered less — it was that the human half had a distinct skill set, and it could be trained.

Software engineering just became centaur chess. Your coding agent writes most of the code now. What it can't do is know your systems' invariants, define what "done" means before the run, catch the plausible-but-wrong reading, or decide what's worth building. Centaur is a 12-month, agent-run curriculum that trains exactly those skills: **brief, verify, orchestrate, decide.**

## How it works

Centaur has no app and no login. Your coding agent *is* the mentor — the whole protocol lives in [`AGENTS.md`](AGENTS.md) (the [agents.md](https://agents.md) standard). `CLAUDE.md` and `GEMINI.md` are thin shims pointing there, so it works out of the box with **Claude Code, OpenAI Codex, Cursor, Gemini CLI, Jules, Zed, Amp, opencode** — and any other agent, by telling it "read AGENTS.md and follow it".

1. **Clone this repo** (fork it — your progress and profile stay in your copy).
2. **Open it in your coding agent.**
3. Say **"set me up"**. The agent interviews you — your role, stack, the systems you own, your highest-stakes path — and rewrites every `{{placeholder}}` in the curriculum against *your* real systems. From then on, nothing here is generic.
4. Every day, say **"what should I learn today?"** You get exactly one item, sized to about an hour, with its reference link and a concrete first step.

### The rituals

| You say | What happens |
|---|---|
| `set me up` | One-time interview; personalizes every item to your systems |
| `what should I learn today?` | One item, one first step, one reference — never a module dump |
| `done <item>` | Records progress, journals it, refreshes the dashboard, commits — reading items pass a teach-back gate first |
| `quiz me` (or any Friday) | Closed-book recall quiz, graded crisp / fuzzy / blank — you call your confidence before each answer, and past areas come back on a spaced schedule |
| `weekly review` | Pace check against quarter milestones — grades your drill *quality*, not just the streak |
| `audit me` (monthly) | You defect-hunt a real agent artifact solo, time-boxed — sometimes with planted errors |
| `podcast pack <item>` | NotebookLM-ready bundle — a briefing the AI hosts can *debate*, source links, an audio prompt, and post-listen recall questions the mentor quizzes you on later |

## The learning science inside

AI is a spectacular teacher and a terrible study partner: it explains so fluently that you *feel* like you've learned — the **fluency illusion**, the best-documented failure mode of studying with an AI. In one study, students who practiced with an answer-first assistant scored ~17% *worse* on later solo tests. Centaur's rituals are built from the techniques with the strongest evidence in cognitive science, wired specifically to counter that:

- **Retrieval practice** — the testing effect, g ≈ 0.70, the strongest-evidenced learning technique on record. Quizzes are closed-book and recall-only; the mentor asks before it explains, and never answers a concept question until you've given your 30-second best guess.
- **Spaced repetition & successive relearning** — a mastered area isn't finished; it comes back at expanding intervals (1 week → 3 → 9), and a single fuzzy answer resets the clock. "Done" means *scheduled*, because memory decays.
- **Confidence calibration** — you call *sure / likely / guess* before every answer. A "sure" that grades fuzzy is flagged on the spot and jumps the review queue: miscalibration is more dangerous than ignorance.
- **Teach-back (the protégé effect)** — a reading item isn't done until you explain it back causally: a mechanism, a tradeoff, a failure mode. Restatement is rejected. A 2026 study found a forced explanation gate roughly halved later no-AI failure rates (77% → 39%).
- **Interleaving** — every quiz ends with one unannounced question from an old area, training you to recognize *which* tool applies, not just how it works.
- **Desirable difficulty** — the mentor gives hints before answers and makes you struggle productively first. Effortful practice feels worse and works better.

## What's inside

| Module | Focus |
|---|---|
| m0 | Fundamentals audit — 22 self-test areas, interleaved all year |
| m1 | Precision writing & specification *(the master skill)* |
| m2 | Verification engineering: tests → evals |
| m3 | Distributed systems, owned not borrowed |
| m4 | Agentic systems mastery + security |
| m5 | Product & business judgment |
| m6 | Influence: leverage beyond your keyboard *(ongoing from day one)* |
| m7 | Regulated-domain engineering *(optional specialization)* |
| m8 | Systems mechanics: the decision layer |

9 modules, ~119 items, a 12-month roadmap in [`curriculum/guide.md`](curriculum/guide.md), an annotated reference library in [`site/references.html`](site/references.html), and a zero-dependency dashboard — open [`site/index.html`](site/index.html) in a browser.

## Philosophy

- **One item a day.** Depth compounds; module dumps don't.
- **Recall, not recognition.** Quizzes are closed-book and oral. Multiple choice is banned.
- **The agent's self-assessment is never verification.** Not your agent's at work, and not your mentor's here.
- **Grades are contestable — both ways.** Rebut with evidence and the mentor re-grades; it never defends a verdict to save face, and never softens one to please you.
- **War stories become audit questions.** Every production surprise you mention gets distilled into the fundamentals audit.
- **Every miss becomes a rule or a redesign.** Fuzzy answers and failed defect-hunts don't just get journaled — they change what you drill next.

## What you'll be able to do

By the end, measurably:

- **Veto an agent's design with a mechanism argument** — "that index won't help this query, here's why" — not a vibe.
- **Catch the wrong reading before the run.** Spot the plausible misinterpretation in a brief while it's still cheap.
- **Size specs to blast radius.** A one-line brief for a rename; invariants, edge cases, and "not doing" for your highest-stakes path.
- **Run fan-out/judge pipelines** — parallel agents, deterministic checks first, LLM judges you've calibrated, and know when *not* to trust the judge.

## The running example

Concrete beats generic, so the worked examples use fintech — money movement, ledgers, idempotent transfers — as the running high-stakes domain. Setup substitutes your own: whatever path in *your* systems costs the most when it breaks plays the same role. Module 7 goes deep on regulated domains and is entirely optional.

## Contributing

Issues and PRs welcome — especially new fundamentals-audit questions distilled from real production surprises, and reference-library additions with a one-line "why this one". Keep items placeholder-based (`{{your highest-stakes path}}`), never grounded in a specific employer.

## License

[MIT](LICENSE) © Centaur contributors.
