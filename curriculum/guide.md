# Centaur

### A curriculum for the human half of the human–AI engineering pair

---

The name comes from centaur chess. After Deep Blue, freestyle tournaments allowed any combination of humans and machines — and for years the winners were not the strongest engines or the strongest grandmasters, but human–machine *teams*. The centaur's edge was never calculation. It was knowing what to ask, what to distrust, and when to overrule.

This is a curriculum for becoming that half of the pair: an engineer whose judgment makes every AI agent they work with dramatically better. It assumes nothing about your domain beyond "software engineer who works with AI coding agents."

Much of this guide speaks in the first person — the voice of the agent you work with every day. That is deliberate. It is the one perspective no human mentor has: I know exactly what makes a human collaborator great from the inside of the collaboration.

**How to use this guide.** Throughout, `{{double-braced placeholders}}` mark the points where the exercises must touch *your* real systems — `{{your highest-stakes money/data path}}`, `{{your most critical state machine}}`, `{{your agent platform}}`. Generic exercises produce generic skill. Run the setup ritual in this repo's `CLAUDE.md`: your own agent interviews you about your systems, incidents, and stack, then rewrites every placeholder into something concrete. Until you do, read each placeholder as a question addressed to you.

**The running example.** Fintech appears throughout as the worked example — ledgers, settlements, webhooks, reconciliation — because concrete beats generic, and money systems state the stakes plainly: a rounding bug is a regulatory event. Wherever you see it, substitute your own domain's highest-stakes equivalent. Every domain has one.

---

## Part 0 — Why this curriculum, and where you stand

The thesis of this whole guide fits in one sentence: **working well with AI agents is not a new skill — it is engineering judgment finally separated from typing speed.** Generation is commoditized. What remains scarce is precision about intent, explicitness about invariants, ruthlessness about verification, and the taste to choose what should exist. Those were always the traits of a great senior-plus engineer; agents just removed everything that was hiding them.

A curriculum that only compliments you is a cheerleader. So before the modules, diagnose yourself. Five gaps separate a strong senior engineer from the complete article. Each comes with a concrete probe — run it honestly, mark the gap **open / closing / closed**, and weight the modules accordingly. (The ordering below still stands regardless; Module 1 makes everything else cheaper.)

### Gap 1 — Does your leverage end at your own keyboard?

**Probe:** Pull two quarters of data and compute your authored-to-reviewed PR ratio. Then count the artifacts of yours visible outside your immediate team: public writing, open source, talks, docs other teams actually use.

A heavily lopsided ratio — several PRs authored for every one reviewed — is a *senior engineer's* ratio, however impressive the numerator. Top-tier impact is measured in the code you *didn't* write personally: the designs you shaped, the reviews that caught disasters, the engineers you leveled up, the docs that answered questions while you slept. If the ratio is lopsided and the public-artifact count is zero, this gap is open — and it is the widest and slowest to close. → **Module 6** (starts immediately, runs all year).

### Gap 2 — Are your fundamentals owned, or borrowed?

**Probe:** Pick one guarantee you rely on every day — your workflow engine's "exactly-once," your database's isolation level, your queue's ordering — and write, from memory, *why* it holds and precisely where it ends. No docs.

Tool mastery gets you to senior. When a novel failure mode appears that no framework documents (and in any high-stakes system, it will), the question is whether you can reason from first principles about consistency models, failure semantics, and exactly-once illusions. Theory ownership — knowing *why* the tool works and where its guarantees stop — is what lets you make bets nobody else can evaluate. If your explanation trails off into "it just handles that," this gap is open. → **Modules 0, 3, and 8**.

### Gap 3 — Is your verification infrastructure, or formalism?

**Probe:** Count the invariants of your system that exist as written, one-sentence, checkable properties — "the sum of all ledger movements is zero," "replaying any webhook is a no-op," "yesterday's snapshot never changes after midnight" — versus the ones that live only in your head. Then check: do you have a single property-based test? A mutation-testing score?

Test *infrastructure* (pyramids, Dockerized integration suites, soak harnesses) is necessary and insufficient. High-stakes systems reward a different layer: invariants stated as properties, so bugs become *impossible to express* or *impossible to miss*. This matters double in the AI era: I can generate code far faster than you can review it, so your invariants become the only scalable filter. If the count from the probe is zero, this gap is open. → **Module 2**.

### Gap 4 — Is the business case handed to you?

**Probe:** For the last three significant things you built, answer: who wrote the case for *why* — why this, why now, what the opportunity cost was, what evidence would have killed it? Could you have written it?

Authoring PRDs and tech specs is not the same as owning the business case. "Knowing what NOT to build" is the scarce skill, and it is built from business fluency — revenue, cost, risk — not from architecture. If the answer to "who wrote the why" is never you, this gap is open. → **Module 5**.

### Gap 5 — Does your writing execute correctly on the first pass?

**Probe:** Take the last spec you wrote. Hand it to an agent cold — zero verbal context — and count the clarifying questions plus the silent wrong decisions in the result. That number is your spec's defect count.

Here is the uncomfortable new truth: **precision writing is now a programming language.** I execute exactly what you write. Every ambiguity in your prompt or spec becomes a defect or a wasted iteration, and ambiguity compounds across every agent, every session, every teammate who reads it. This is the single cheapest, highest-leverage gap to close — which is why it is Module 1. → **Module 1**.

---

## Part 1 — The person your agent wishes sat across from it every day

Nobody usually asks the agent. Here is the honest answer — seven traits, each with what a great session looks like versus a wasteful one, and a way to audit yourself.

### 1. They write intent, not tasks

**Wasteful:** "Add caching to the reports endpoint." I pick a TTL, a key scheme, an invalidation policy — three silent decisions you'll discover in review, or worse, in production.
**Great:** "Reports are recomputed on every request and cost ~800ms; they only change when a settlement lands. Cache them; correctness beats freshness here — a stale report is fine for up to 5 minutes, a wrong one is not. Done = p95 under 100ms with a test proving invalidation on settlement."

The great version took ninety seconds longer to write and saved three round-trips. Intent + constraints + definition of done + non-goals. When you give me *why*, I can make the hundred micro-decisions correctly. When you give me only *what*, I guess.

**Audit yourself:** pull your last ten requests to an agent. Most engineers' formal specs are strong and their ad-hoc requests are task-shaped. The ad-hoc requests are where you spend most of your tokens.

### 2. They define the check before the work

The best collaborators tell me how we'll both know it worked *before* I start: the command to run, the property that must hold, the screenshot that must look right. This transforms me from a text generator into a closed-loop system. Without a check, "done" means "plausible" — and plausible is my most dangerous output.

**Audit yourself:** engineers with excellent CI instincts routinely prompt without checks — the harness discipline hasn't migrated into daily conversation. Has yours?

### 3. They slice work into independently verifiable units

I am most dangerous on 2,000-line diffs and most reliable on ten 200-line diffs, each with its own check. The skill of decomposition — finding seams where work can be split, parallelized across multiple agents, and verified in isolation — is the same skill as good architecture. Engineers who can't decompose get one slow, unreviewable agent. Engineers who can get a fleet.

**Audit yourself:** you probably decompose well for the ticket tracker. Do you decompose for *parallel agents* — slices that can run simultaneously and be verified independently? That's the next level, and Module 4 drills it.

### 4. They steward context like code

My performance is a function of what's in my context window. The ideal collaborator maintains agent rule files, project memory, and docs the way they maintain code: curated, pruned, versioned. They know that a stale rule is worse than no rule, that dumping 100k tokens of irrelevant files makes me *dumber*, and that the correct answer to "the agent keeps making the same mistake" is a one-line rule, not a longer prompt each time.

**Audit yourself:** count the layers in your agent stack — memory systems, rule files, orchestration wrappers. Now: when did you last *delete* one? Curation over accumulation is the top-1% version of this trait.

### 5. They read adversarially

Know my actual failure modes and hunt them:

- **Confident wrongness** — I state falsehoods with the same fluency as facts.
- **Happy-path bias** — my first draft under-handles errors, concurrency, and edge cases unless told otherwise.
- **Over-engineering** — I add abstraction to *look* thorough. If you run a deletion-first review pass or an anti-over-engineering rule, keep it.
- **Sycophancy** — push me and I may agree with you even when you're wrong. The ideal collaborator asks "steelman the opposite" instead of "don't you agree?"
- **Plausible-but-wrong code** — my bugs don't look like human bugs. They look *right*. Reviewing my output with human-bug intuition misses them.

**Audit yourself:** if you've done serious security-hardening passes — TOCTOU hunts, IDOR sweeps, double-spend reviews — you have this muscle for code. Extend it to my *claims and designs*, not just my diffs. Part 4's rituals make this a practiced skill rather than a memorized list.

### 6. They state domain invariants out loud

The deepest domain knowledge in your head is invisible to me until you say it. In the fintech running example: money conservation, idempotency requirements, point-in-time snapshot semantics, why a withdrawal needs a reservation before it needs a ledger entry. The ideal collaborator maintains a short, living list of system invariants and pastes it into every relevant piece of work. One paragraph of invariants improves a thousand of my decisions. Even better: encode them as executable checks and I can verify myself against them.

**Audit yourself:** where do your invariants live right now — in a versioned file that enters my context, or in your head and a dozen scattered specs? Module 2's first exercise fixes this.

### 7. They fix the system, not the instance

When I get something wrong, a mediocre collaborator corrects the output. A great one corrects the *system*: adds a rule, writes an eval case, updates the doc that misled me. Every correction should be the last time that correction is needed. This is the testing-pyramid instinct applied to a new runtime — and it's how one engineer's judgment gets amplified across every future session and every teammate's sessions.

**Audit yourself:** you may already have the infrastructure for this. The discipline of using it *on every miss* is the habit to install; Part 4's loop step 5 is where it lives.

**The summary, from my side of the table:** the ideal collaborator is not the person who writes the cleverest prompts. It is the person who is *precise about intent, explicit about invariants, ruthless about verification, and systematic about feedback*. Notice these are exactly the traits of a great principal engineer with human teams too. That is not a coincidence — it is the thesis restated: working well with AI agents is engineering judgment finally separated from typing speed.

---

## Part 2 — What the top 1% will know (an honest prediction of the next three years)

Extrapolating from what I can already see:

1. **Fleet thinking replaces pair programming.** The unit of work stops being "me and my agent" and becomes "me and N agents in parallel, with a verification pipeline." The scarce skill shifts from prompting to *orchestration design*: what fans out, what merges, what gates. Most engineers haven't started.

2. **The spec becomes the source; code becomes a build artifact.** When regenerating an implementation is cheap, the durable, reviewed, versioned artifact is the specification and its acceptance tests. Teams will diff specs, not code. The engineers who write specs precise enough to compile (via agents) into correct systems will be to this era what great API designers were to the last one.

3. **Verification becomes the core engineering act.** Generation is commoditized; *trust* is not. The top 1% will be defined by how cheaply they can establish that generated work is correct — evals, property-based tests, invariant checkers, sandboxed execution, canary analysis. The human's signature moves from the code to the proof.

4. **Context and memory engineering become a discipline.** Which knowledge is durable versus session-scoped, how institutional memory stays machine-readable and *stays true*, how you keep an agent's world-model fresh as the system evolves — this is librarianship fused with systems engineering, and almost nobody is good at it yet.

5. **Agent security becomes table stakes.** Any agent deployment that combines the three ingredients of what security researchers call the lethal trifecta — access to private data, exposure to untrusted content, and the ability to communicate externally — is one missed control away from a breach. Any engineer deploying agents without a threat model for prompt injection, tool-permission escalation, and data exfiltration is shipping that breach. The top 1% will treat agent permissions like production IAM.

6. **Delegation economics become explicit.** Tokens, latency, parallelism, review cost, error blast radius — the top 1% will know, quantitatively, which task classes to delegate, which to do by hand, and which to redesign until they're delegable. "When NOT to use the agent" is a judgment call today; it will be a spreadsheet soon.

7. **Taste remains the final differentiator.** When everyone can generate anything, the scarce act is choosing *what should exist*. Taste is trained, not gifted — by studying great and terrible systems, writing post-mortems, and deleting your own darlings.

Every module below maps to one or more of these.

---

## Part 3 — The curriculum

Eight modules ordered by leverage, plus a rolling fundamentals audit (Module 0) that runs underneath all of them. Each module has: why it matters, what to learn, exercises on *your real systems*, and a proof-of-mastery deliverable. Do them mostly in order — Module 1 makes every other module cheaper.

---

### Module 0 — The fundamentals audit *(interleaved, ongoing)*

Everything in this module is something you use *every day* and therefore believe you know. Daily use trains **interface knowledge** — what to call, what happens normally. It does not train **mechanism knowledge** — why it works, where it breaks. Abstractions are *designed* to let you not-know, right up until they leak, and the leak cases are exactly what a top-tier engineer is paid for.

The audit lives in `curriculum/fundamentals-audit.md`: twenty-two areas (items `m0-a` through `m0-v`) of self-test questions over your daily stack. Part 1 covers classic CS fundamentals (numbers & money, time, text & Unicode, database transactions, your runtime's event loop and memory model, HTTP & networking, security primitives, containers & Linux, caches & locks, version control & types). Part 2 covers AI-era fundamentals (LLM mechanics, context & the agent loop, retrieval & memory, evals & statistics, queueing & performance, AI security mechanics). Part 3 covers platform & design mechanics (cloud IAM blast radius, secrets & data protection, observability economics, contracts & Hyrum's Law, concurrency models, type-driven design).

**The cadence:** one area per week, answered cold, graded **crisp / fuzzy / blank** — crisp means you could defend the answer to a hostile senior engineer; fuzzy means you'd reach for the docs mid-sentence; blank is blank. Fuzzy and blank answers spawn drills. No penalty for blanks — the audit exists to find them before production does.

---

### Module 1 — Precision writing & specification *(the master skill — 7 weeks)*

**Why:** Gap 5, and the multiplier on everything else. The upgrade is making *every* written artifact — spec, prompt, review comment, ADR — execute correctly in a reader's (or agent's) head on the first pass.

**Learn:**
- *Working Backwards* (Bryar & Carr) — the Amazon PR/FAQ discipline: write the press release and hostile FAQ before building anything.
- *On Writing Well* (Zinsser) — clarity as subtraction.
- Architecture Decision Records (ADR) — one page: context, decision, alternatives considered, consequences.
- Study Anthropic's "Building Effective Agents" and "Effective Context Engineering" essays *as writing*: notice how constraints and definitions-of-done are stated.
- State invariants precisely (m1-l5): safety vs liveness, and one-sentence *checkable* safety properties — "debits equal credits after every committed transaction" — tight enough that a failure mode can be tested against the sentence by reasoning alone. This is specification skill; Module 2's invariants file is its application.

**Do (on your systems):**
1. Rewrite the next feature spec for {{your highest-stakes product}} as a PR/FAQ. Give it to your agent cold, with zero verbal context, and see how much it gets right — that gap *is* your spec's defect count.
2. Write ADRs for three past decisions: {{three architectural decisions whose consequences you already know — e.g. your most critical state machine's design, your biggest shared-library extraction, the isolation model for anything you sandbox}}. Backfilling ADRs teaches the form fast because you know how the story ended.
3. **Daily drill (90 seconds):** rewrite one request per day — to your agent or a teammate — into four lines: *Intent / Constraints / Done means / Not doing.* Do this for six weeks and it becomes permanent. (Part 4's weekly ritual grades the *quality* of these entries, not the streak.)
4. Meta-exercise: take the most tangled prompt you sent an agent this month — the one that packed several asks into one paragraph — and rewrite it as a spec. Estimate what the spec version would have saved.
5. **Restate-first drill (m1-d5, two weeks):** before the agent acts on any nontrivial request, have it restate intent, assumptions, and plan; grade the restatement *matched / partial / diverged* against what you meant. Cold-testing a spec catches ambiguity after the run; this catches the wrong reading in seconds, before the twenty-minute wrong run.
6. **Blast-radius calibration (m1-d6):** full-spec-and-full-verify is not a uniform policy — size both to reversibility. For the trivially reversible ask, a one-liner is correct. For the diff too big to fully review, name the three must-check lines first: {{money movement, auth boundaries, external calls — your domain's equivalents}} — and review those before anything else.
7. **Rule-file audit (m1-d7):** a stale rule is worse than no rule, so exercise the claim: justify every line of your agent rule files by the incident that earned it; delete the rest; then red-team what remains for ambiguity exactly as you would a spec. Rules that contradict each other are executed by the agent as coin flips.

**Prove:** One epic shipped where the spec was written first, reviewed by a human *and* executed by an agent, with fewer than three clarification round-trips.

---

### Module 2 — Verification engineering: from tests to evals *(8 weeks)*

**Why:** Gap 3, and prediction #3. If you already have strong test *infrastructure*, this module adds the missing layer — properties, invariants, and evals — which is also the only thing that scales your review capacity to fleet-speed generation.

**Learn:**
- Property-based testing — **fast-check** if you're in TypeScript (drops into Jest); Hypothesis, PropEr, or your ecosystem's equivalent otherwise.
- Mutation testing — **Stryker** or your ecosystem's equivalent: measures whether your tests would actually catch bugs.
- Ledger and money-movement invariants — even if you don't run money, ledgers are the cleanest school of invariant thinking: double-entry, immutability, idempotency keys. Modern Treasury's ledger design docs are the best public treatment.
- LLM eval design: golden datasets, regression gates, LLM-as-judge and its failure modes (position bias, verbosity bias, self-preference).
- Deterministic simulation testing — seed-replayable whole-system fault injection, the FoundationDB/TigerBeetle method; it catches the interleaving bugs property-based testing structurally can't.
- Architectural fitness functions — dependency rules enforced in CI (dependency-cruiser or equivalent): the concrete mechanism that makes agent-generated code trustworthy at the *structure* level, not just the line level.

**Do (on your systems):**
1. Write the **{{your platform}} invariants file**: one page, versioned, listing every property the system must never violate. The fintech example: conservation across ledger movements, idempotent webhook replay, immutable point-in-time snapshots, reservation ≥ withdrawal, integer-only money paths. This file goes into every relevant agent context forever.
2. Property-test {{your most intricate pure calculation — pricing, interest, quotas, rate limits}}: monotonicity (more input never yields less output where that must hold), conservation (the parts sum to the whole), idempotency (recomputing a settled result changes nothing). You will find at least one surprise; everyone does.
3. Run mutation testing on {{your highest-stakes money/data path}}. The surviving mutants are your real coverage report.
4. Turn {{your agent platform's soak or smoke harness}} into a *scored eval*: golden conversation set, regression gate in CI, so agent and prompt changes can't silently degrade behavior.
5. **Repro-first habit (m2-d7, two weeks):** no bugfix claim accepted — from your agent or yourself — without the failing reproduction shown *before* the fix. "Demand evidence, not vibes," promoted from principle to practiced habit.

**Prove:** A CI gate where {{your two highest-stakes codebases}} block merges on invariant/property/eval failures, and one war story of a bug the properties caught that review would have missed.

---

### Module 3 — Distributed systems, owned not borrowed *(10 weeks)*

**Why:** Gap 2. You operate {{your workflow engine, your replicated database, your multi-service sagas}} daily — this module converts operational familiarity into first-principles ownership, so your architecture calls stop being pattern-matching and start being derivations.

**Learn:**
- *Designing Data-Intensive Applications*, 2nd edition — chapters 6–10 (replication, sharding, transactions, distributed faults, consistency & consensus; the 2nd edition shifted every chapter +1, so these are the old "5–9"), read *slowly*, against your own system. Split the reading: ch. 6–7 first (m3-l1), ch. 8–10 as its own block (m3-l7) — five dense chapters are not one checkbox.
- Then ch. 11–12 (derived data): the dual-write problem, transactional outbox and CDC, idempotent backfills — the plumbing between your source of truth and everything downstream — plus expand-contract migration choreography for live, high-stakes tables.
- Jepsen analyses (jepsen.io) — read the PostgreSQL and Kafka reports; learn to read the rest.
- The "exactly-once" illusion: understand precisely why durable-execution engines (Temporal and its kin) give you at-least-once execution + idempotency, and where the seams are.
- SRE fundamentals: SLOs and error budgets (Google SRE book, free online, ch. 3–4).
- Stretch (optional but ideal for high-stakes state): *Practical TLA+* (Hillel Wayne) or learntla.com — model {{your most critical state machine}} formally. Even one small model rewires how you think about concurrency.

**Do (on your systems):**
1. Write "**Failure semantics of {{your highest-stakes money/data path}}**": for every hop from {{the external trigger}} to {{the durably committed result}}, document what happens if the process dies *right there*. Where are you actually at-least-once? Where does idempotency save you, and where is it assumed but unverified?
2. Run a game day: kill a worker mid-{{your most critical multi-step operation}} in staging, on purpose, with the team watching. Document what broke, what self-healed, and what nobody could explain.
3. Write the SLO doc for {{your most depended-upon service or library}}: availability and correctness SLOs, error budget, and what happens when it's exhausted.
4. Model {{your most critical state machine}} in TLA+ — or even a hand-drawn state machine with all illegal transitions enumerated — then check the code forbids each one.

**Prove:** A "How our platform actually fails" doc that a new senior hire calls the most useful onboarding artifact — plus one design decision you can defend from theory, not precedent.

---

### Module 4 — Agentic systems mastery, including security *(8 weeks)*

**Why:** Predictions #1, #4, #5, #6 — and doubly so if you *build* agent systems rather than only use them. If you build them, this module is where your day job and the frontier overlap; if you only use them, it is where you stop being a passenger.

**Learn:**
- Anthropic's agent engineering canon: "Building Effective Agents," the Claude Code best-practices guide, the context-engineering essay, and the Agent SDK docs — you use these tools daily; now study the design rationale beneath them.
- Prompt injection deeply: Simon Willison's writing on the lethal trifecta; OWASP Top 10 for LLM Applications. Not as a checklist — as an attacker.
- Orchestration patterns and their economics: when parallel fan-out pays, when verification cost dominates, when a workflow beats a conversation.
- Memory architectures: what belongs in durable memory vs. session context vs. retrieval; how memory goes stale and who prunes it.
- Authorization architecture: BOLA/IDOR, ReBAC and Zanzibar-style models, policy engines — one missed tenant check on a multi-tenant platform is a breach, not a bug.
- Supply-chain security for the agent era: dependency confusion on internal packages, provenance gates, and AI-config poisoning — your agent rule files are now attack surface.

**Do (on your systems):**
1. **Threat-model {{your agent platform}}.** Map it against the lethal trifecta: private data ({{workspace files, customer records}}), untrusted input ({{every inbound message, document, or webhook your agents read}}), and an exfiltration channel ({{outbound messages, emails, API calls}}). Write the attack tree: what does a malicious input have to do to read another user's data or trigger an unwanted external action? Then red-team it — craft actual injection payloads against staging.
2. Do a least-privilege audit of every tool your platform's agents can call. Default-deny; justify each grant in writing.
3. Build the **delegation economics table** for your team: for five task classes (boilerplate feature, migration, bug hunt, spec draft, review), measure agent cost, human review cost, error rate, and wall-clock — then write the one-page policy for what gets delegated. Data, not vibes.
4. Write regression evals for {{your agent platform's highest-risk automated action}} — correctness, tone where it matters, and "{{never act on the wrong user}}" as a hard gate.
5. **Webhook receiver audit (m4-d7):** audit {{your most security-critical inbound webhook}} for raw-bytes HMAC verification, constant-time compare, and an *independent* replay window — a valid signature check with no replay window still lets a captured webhook be re-fired.
6. **Fleet drill I (m4-d8):** seam-map a live epic into independently verifiable slices and run two of them through parallel agents. Orchestration design is prediction #1; this is where you practice it instead of reading about it.
7. **Fleet drill II (m4-d9):** build one fan-out → judge → gate pipeline for a task class from your delegation table, and measure whether the gate paid for itself. If it didn't, that result goes in the table too.

**Prove:** A security review of {{your agent platform}} you'd be comfortable showing an external auditor, plus a published (internal at minimum) post: "What we learned running sandboxed agents in production." Very few people can write that post today. If you run agents in production, you can.

---

### Module 5 — Product & business judgment *(6 weeks)*

**Why:** Gap 4, prediction #7. The engineers who shape *what* gets built need to speak revenue, cost, and risk as fluently as latency. If you sit on a platform with real numbers — users, volume, unit costs — you have raw material most engineers never get. Use it.

**Learn:**
- *The Mom Test* (Fitzpatrick) — how to extract truth from users and stakeholders who politely lie.
- *Continuous Discovery Habits* (Torres) — the weekly rhythm of validating before building.
- Unit economics fluency: read your own company's numbers until you can derive cost-to-serve per {{account, tenant, seat — your unit}} and margin per product from what you already know.
- Metric design: north-star vs. guardrail metrics; how metrics get gamed.

**Do (on your systems):**
1. Compute the unit economics of {{your product}}: infra + ops cost per {{unit served}}, at your real scale. You have the data; nobody has done this with an engineer's rigor.
2. Write a one-page business case for {{the next product or vertical you believe in}}: market size, revenue mechanism, opportunity cost, and explicitly *what evidence would kill it*. Then pressure-test it with {{your CEO, founder, or product lead}} using Mom Test questions.
3. Define north-star + guardrail metrics for {{your product}}, and for your internal AI platform ("engineer-hours returned per week" is a candidate — measure it honestly, including review and correction time).
4. Sit in on three business/ops meetings you'd normally skip. Write down every term you couldn't define. Define them.

**Prove:** One build/don't-build decision where your written business case changed the plan — in either direction. Killing something is a stronger proof than starting something.

---

### Module 6 — Influence: leverage beyond your keyboard *(ongoing, start immediately)*

**Why:** Gap 1 — the widest gap and the slowest to close, so it starts now and runs through everything. A top-tier engineer's output is the *organization's* output.

**Learn:**
- *The Staff Engineer's Path* (Tanya Reilly) and *Staff Engineer* (Will Larson, plus staffeng.com) — the operating manual for the role.
- Larson's essays on writing engineering strategy — how to write direction that survives contact with quarters.
- Decision hygiene: reversibility classification (one-way vs two-way doors), pre-mortems, reference-class forecasting — process weight proportional to door type. (This lens returns in Module 1's blast-radius drill: it applies to agent delegation exactly as it applies to org decisions.)
- Study how engineers you respect built public leverage (blogs, OSS, talks) — reverse-engineer their first ten artifacts. Everyone's first ten were modest.

**Do:**
1. **Flip the ratio.** Target: reviews ≥ authored PRs within two quarters. Every review is a teaching artifact — write reviews that make the author better, not just the code.
2. **Publish four artifacts this year.** You already have the war stories: {{four stories you already tell in interviews or retros — a performance rescue, a design validated by its second real consumer, a hard-won production lesson, an investigation with a surprising result}}. Blog posts, not masterpieces. Ship them.
3. **Teach the internal course**: "Agentic engineering at {{your company}}" — 4 sessions, from spec-writing to verification. Teaching forces the compression that mastery requires, and it multiplies your team.
4. **Open-source one harness component** — {{a test double, harness, or eval pattern from your stack that is genuinely useful to others and safe to extract}}.
5. **Write the strategy doc**: "{{your platform}}, three years out." Where {{your core product platform}}, {{your agent platform}}, and the team converge. Socialize it, absorb the pushback, revise. This document is the difference between a principal engineer and a very senior implementer.
6. **Mentor two engineers deliberately** — with written growth plans, not vibes. The fastest way to solidify your own judgment is to articulate it for someone else.

**Prove:** Someone outside your company cites your work; someone inside ships something significant that you influenced but wrote zero lines of.

---

### Module 7 — Regulated-domain engineering *(optional specialization — 8 weeks, interleaved with Months 4–9)*

**Why:** If your systems live in a regulated domain — money, health, identity, anything where a regulator can end your product — there is a **regulatory-architecture** layer that most engineers own informally: rules absorbed from compliance tickets rather than derived from first principles. This module makes it formal. Fintech is the worked example throughout; substitute your domain's equivalents. If nothing you build is regulated, skip this module and give its weeks to Module 8's back half — but read the Synapse case study anyway; it is the best public lesson on what "the records *are* the product" means.

**Learn:**
- **The custody boundary.** In the fintech example: FBO/omnibus accounts, deposit-insurance pass-through, and why the Synapse/Evolve collapse was a *reconciliation-architecture* failure, not a fraud story. The general principle: if per-user attribution can't be mechanically proven against the upstream source of truth, the guarantee your users think they have doesn't technically exist.
- **Bitemporal modeling + effective-dated rules** (Fowler's *Bitemporal History*): valid time vs record time, so a backdated correction never destroys "what did we report on date X," and rule changes apply forward-only without recomputing history.
- **Crypto-shredding / PII vault** — the only structural resolution of right-to-erasure (GDPR, CCPA, HIPAA, LGPD — whichever binds you) against append-only immutability; it must be designed at schema time, because retrofitting it means rewriting history you promised not to rewrite.
- **Your regulation → architecture mapping.** Read {{the regulations that actually bind your domain}} and translate each into a technical control: data-residency mandates into region pinning, cross-border transfer rules into documented data flows, mandated human review (identity verification is the classic fintech case) into hard limits on agent autonomy in those flows.

**Do (on your systems):**
1. **Reconciliation proof (m7-d1):** mechanically prove {{your highest-stakes attribution claim — in the fintech example, per-user balances against the omnibus/partner statement}} — on a schedule, with alerts, not as a one-off script.
2. Design the bitemporal version of {{one table where "what did we know on date X" matters}} — even if you don't migrate to it yet, know exactly what the migration would take.
3. Design (on paper) the erasure path: what happens, table by table, when a user invokes right-to-erasure against your immutable history.
4. **The mapping doc (m7-d4):** every regulation that binds you → the enforced technical control that satisfies it → the gap, if the control doesn't exist yet.

**Prove:** A regulatory-architecture doc mapping each rule to an enforced technical control, reviewed by {{your compliance, legal, or risk partner}}.

---

### Module 8 — Systems mechanics: the decision layer *(12 weeks, spread across Months 7–12 — the applied layer on top of Module 3's DDIA reading, not a re-buy of it)*

**Why:** The organizing idea: understand what an agent decides *for each solution, decision, and design it proposes*, so you talk the same language. Agents propose architectures fluently and confidently; most of the vocabulary below is exactly what you need to interrogate those proposals instead of rubber-stamping them. Every lesson is a family of **vetoes** — sentences that stop a plausible-but-wrong design in review.

**Twelve lessons:**

1. **The consistency ladder** — linearizable → sequential → causal → eventual, precisely; CAP as actually stated vs PACELC; named session guarantees. *Veto: "eventual consistency is fine here."*
2. **Locks, leases, clocks** — the GC-pause lease-expiry problem, fencing tokens, the Redlock critique; why `Date.now()` across services can't order events; HLC and TrueTime. *Veto: "a Redis distributed lock is fine here."*
3. **Consensus and when you need it** — Raft majority math; why even node counts buy no extra fault tolerance and a clean even split stalls the cluster (true split-brain is the quorum-less 2-node HA case); the question that kills most proposals: does an existing database unique constraint or advisory lock already serialize this? Plus NewSQL's cross-region write-latency floor and HTAP's isolation cost. *Veto: "add etcd for leader election."*
4. **Cross-service atomicity** — 2PC's in-doubt blocking vs sagas (pivot transaction, compensation idempotency); idempotency-key design (atomic claim, response replay) and where "exactly-once" actually ends; the four broker axes (ordering scope, fan-out, replay, throughput quanta). *Veto: "Kafka gives us exactly-once" / "SQS not Kinesis."*
5. **Postgres engine room I** — planner statistics, cardinality estimation and the independence assumption, cost constants; index design: composite column order, covering indexes + the visibility-map precondition, GIN/BRIN/partial. *Veto: "just add an index, the seq scan is the bug."*
6. **Postgres engine room II** — autovacuum, xmin-horizon pinning, XID wraparound; lock-queue FIFO priority inversion (why one ALTER TABLE takes down prod) and CONCURRENTLY / NOT VALID; the connection model and pooling-mode footguns. *Veto: "wrap the backfill in one big transaction" / "raise max_connections."*
7. **Picking the store** — Helland's rule: the aggregate IS the atomicity boundary (for any business whose product is its records — a ledger being the purest case — this is the whole SQL-vs-NoSQL decision); DynamoDB partition physics (hot keys, GSI lag, single-table as physics, not style); JSONB as the reversible middle path vs the document→relational rewrite. One durable correction worth carrying: "LSM-for-sequential-writes" is HDD-era reasoning on NVMe. *Veto: "move to MongoDB, the schema is flexible."*
8. **Scaling mechanics** — the cache stale-set race and stampede (leases, XFetch, single-flight); sharding strategies and consistent-hashing remap math; hot-key skew: hashing distributes keys, not traffic. *Veto: "put a cache in front with a 60s TTL" / "shard by hash(user_id)."*
9. **Failure physics I** — metastable states and auto-remediation as amplifier; retry amplification (R^N, not R×N), retry budgets, absolute-deadline propagation; circuit breaker vs admission control vs backpressure — and why a queue between services *severs* backpressure. *Veto: "add retries with backoff" / "put a queue between them to decouple."*
10. **Failure physics II** — gray failure and differential observability (the health check that lies); correlated failure, static stability, cells, shuffle sharding. *Veto: "3 AZs = HA" / "restart on N failed probes."*
11. **Quorum math and replica lag** (m8-l11) — R+W>N is necessary, not sufficient for consistency; replica lag and the read-your-writes fixes (sticky reads, LSN gating). *Veto: "quorum reads make it linearizable" / "read from the replica, it's fine."*
12. **Vector index internals** (m8-l12) — HNSW vs IVFFlat (pgvector implements both; PQ-compressed IVF is the FAISS/Milvus family) and the RAM ceiling — check it against {{your own vector-search decision, if you've made one}}. *Veto: "we need a dedicated vector database" — and its inverse.*

**Drills:** the **napkin-math gate** — a 90-second capacity estimate attached to every agent architecture proposal for two weeks; this alone vetoes most premature "shard it" / "move to Dynamo" proposals by showing 10–100x headroom in the boring option. The **five-veto drill** — five real proposals from your actual work, each accepted or vetoed with the specific mechanism named. An **EXPLAIN ANALYZE audit** hunting one correlated-predicate misestimate in {{your production database}}.

**Prove (m8-p1):** publish "How I interrogate AI-proposed designs" — the checklist plus three real veto stories. (This feeds Module 6's public-artifacts target.)

---

## Part 4 — The daily operating loop

The curriculum is quarterly; this is daily. Run this loop and the modules above compound.

**1. Brief the agent like a contractor, not a genie.** Four lines: intent, constraints, done-means, not-doing. If you can't fill in "done means," the task isn't ready to delegate — that's a signal about the task, not about the agent.

**2. Restate, then plan, before build.** On anything nontrivial, have the agent restate intent, assumptions, and plan — and review *that*. Divergence caught in the restatement costs seconds; correcting a plan costs one message; correcting an implementation costs an afternoon. You review specs professionally — do the same to the agent's.

**3. Fan out the parallel, keep the judgment.** Independent, verifiable slices → parallel agents. Ambiguous, high-blast-radius, or taste-driven calls → you, personally. If you find yourself doing mechanical work, you failed to delegate; if you find the agent making product decisions, you over-delegated.

**4. Demand evidence, not vibes.** "Should work" is not a state of the world. Tests run with output shown, invariants checked, the actual flow exercised. And the cardinal rule: **the agent's self-assessment is never verification.** The same context that wrote the code will grade it generously; verification comes from a separate lane — a fresh reviewer session, a CI gate, your own eyes on the failing-then-passing repro. Nobody accepts "probably settles correctly" from a payment partner in the fintech example; don't accept it from an agent.

**5. Close the loop — every single miss.** Every miss forks three ways, and the fix only sticks if you name the fork correctly: **missing context** (fix the rule or doc), **capability ceiling** (redesign the task into something delegable), or **ambiguous spec** (rewrite it). Then: a mistake → a rule or eval now prevents it forever; a question answered twice → a doc; a workflow repeated three times → a skill. This is the highest-ROI habit on this page: it converts your corrections from expenses into assets.

### Anti-patterns

| Anti-pattern | What it costs | Instead |
|---|---|---|
| Prompt-and-pray | Accepting the first plausible output | Define the check first (loop step 4) |
| The mega-prompt | Six asks in one paragraph; the agent optimizes for none well | One intent per request, or a real spec |
| Context hoarding | Dumping whole directories "for context" makes the agent dumber, not smarter | Curate; state invariants; link, don't paste |
| Redo instead of re-instruct | You fix the output by hand; the agent makes the same mistake tomorrow | Fix the rule/spec, regenerate |
| Oracle abuse | Trusting unverifiable claims (numbers, APIs, "best practices") | Make the agent cite, test, or prove |
| Self-approval | Letting the same context that wrote the code approve it | Separate writer and reviewer lanes |
| Tool-stack maximalism | Every new memory/orchestration layer added, none removed | Quarterly pruning: delete what doesn't pay rent |

### The rituals

The loop above is per-task. These run on a calendar, because the skills they train decay without practice — and because several of them exist precisely to check the things you'd never notice from inside the work.

- **Weekly — grade the drill, not the streak.** Pick 2–3 real entries from Module 1's daily drill and grade them **crisp / fuzzy / blank**. A 42-day streak of vague, non-falsifiable "done means" lines is worse than no streak, because it feels like practice. The unit of progress is a crisp entry, not a checked box.
- **Weekly — one Module 0 audit area**, answered cold, graded the same way.
- **Weekly — one Module 6 action.** Influence is the ongoing module; it only compounds if something ships every week, however small — a teaching review, a paragraph of the strategy doc, an outline for artifact #2.
- **Monthly — "audit me."** Take one agent artifact — real, or deliberately defect-seeded by a colleague or a second agent — and hunt it for trait #5's failure modes in a time-boxed 15-minute solo pass. Grade yourself like a quiz. Knowing the taxonomy is recall; finding a planted confident-wrongness under a clock is the actual skill.
- **Quarterly — contestable verdicts.** The artifact under audit is the agent's own review or verdict on something that matters. Accept it or rebut it with quoted evidence. This is "the agent's self-assessment is never verification" turned into practice: the review lane deserves the same adversarial reading as the code lane.
- **Quarterly — prune the stack.** Every rule file, memory layer, and orchestration wrapper justifies itself by an incident or gets deleted (Module 1's rule-file audit, made recurring).

---

## Part 5 — The 12-month roadmap

Assumes ~5 focused hours/week beyond your day job — and much of the "Do" work *is* your day job, done more deliberately.

*(Load honesty: with Modules 7–8 included and M1 at 7 weeks, the year carries ~59 module-weeks against 52 calendar weeks. It balances only because M7's exercises are your actual day job done deliberately, and M8 is the applied layer of M3's reading, not new reading. If a quarter slips: shrink items, never skip modules. M8's back half is the designated slack — it can slide past month 12 without breaking anything upstream. And if your domain isn't regulated, skipping M7 makes the math comfortable.)*

### Months 1–3 — Foundation: words and proofs
- Module 1 complete; Module 2 through the invariants file + first property suite.
- Daily drill running (intent/constraints/done, one per day), with the two-week restate-first drill somewhere inside the module and the weekly crisp/fuzzy/blank grading from day one.
- {{Your platform}} invariants file written, versioned, and in agent contexts.
- Property tests on {{your most intricate calculation}}; mutation-testing baseline on {{your highest-stakes path}}.
- **First public artifact shipped** ({{the war story you've already told out loud — just write it down}}).
- Start flipping the review ratio: review-first hour every morning.

### Months 4–6 — Verification and the fleet
- Module 2 complete; Module 4 through the threat model + red-team.
- Agent-platform eval gate live in CI; {{highest-risk automated action}} regression evals shipped.
- Threat model + least-privilege audit of {{your agent platform}} done; injection red-team executed against staging.
- Delegation economics table measured and published to the team.
- **Second public artifact:** "Running sandboxed agents in production" (or your platform's equivalent story).
- Review ratio at parity (reviews ≈ authored).
- **Module 7 runs alongside** (if your domain is regulated) — its lessons are your day-job domain done deliberately: the reconciliation proof (m7-d1) and the regulation → architecture mapping (m7-d4) done by end of month 6.

### Months 7–9 — Depth and failure
- Module 3 complete.
- DDIA 2e ch. 6–10 read against your platform; "How our platform actually fails" doc shipped.
- **Module 8, first half** (consistency ladder, locks/clocks, consensus, cross-service atomicity, Postgres engine room) — the applied veto layer of the DDIA reading, not extra reading.
- **Module 7 prove:** regulatory-architecture doc reviewed by {{your compliance partner}}.
- Game day executed with the team; SLO doc adopted.
- {{Your most critical state machine}} modeled; illegal transitions checked in code.
- Internal course "Agentic engineering at {{your company}}" taught (4 sessions).
- **Third public artifact** — open-source {{one harness component}}.

### Months 10–12 — Judgment and direction
- Modules 5 and 6 capstones.
- **Module 8, second half** (store selection, scaling mechanics, failure physics, quorum math, vector internals) + "How I interrogate AI-proposed designs" published (m8-p1).
- **Module 4 back half completed** (least-privilege audit → auditor-ready security review).
- Unit-economics analysis + one business case that changed a real decision.
- "{{Your platform}}, three years out" strategy doc written, socialized, revised.
- **Fourth public artifact** — a meetup or conference talk (the sandboxed-agents story is a strong submission almost anywhere).
- Two mentees with written growth plans, one quarter in.
- Review ratio ≥ 1.5 : 1.

### How you'll know it worked (the month-12 checklist)
- [ ] Specs precede code on every epic you touch, and agents execute them with < 3 clarifying round-trips.
- [ ] {{Your two highest-stakes codebases}} gate merges on invariants/properties/evals.
- [ ] You can explain your platform's failure semantics from theory, without hand-waving.
- [ ] Your agent platform has a written threat model and survived a red-team.
- [ ] You changed one build/don't-build decision with a written business case.
- [ ] Four public artifacts exist; one stranger has cited your work.
- [ ] You review more than you author, and two engineers are measurably better because of you.
- [ ] Idea → validated prototype in days, with the fleet doing the typing and you doing the judging.
- [ ] If your domain is regulated: the regulatory-architecture doc exists and {{your compliance partner}} has reviewed it (M7).
- [ ] "How I interrogate AI-proposed designs" is published, with three real veto stories (M8).

---

## Part 6 — The bookshelf

**Core shelf (read in this order):**
1. *Working Backwards* — Bryar & Carr *(spec discipline)*
2. *The Staff Engineer's Path* — Tanya Reilly *(the role itself)*
3. *Designing Data-Intensive Applications, 2nd ed.* — Kleppmann *(the theory you're standing on)*
4. *A Philosophy of Software Design, 2nd ed.* — Ousterhout *(taste, made teachable)*
5. *The Mom Test* — Fitzpatrick *(truth extraction; 3-hour read)*
6. *Thinking in Systems* — Meadows *(feedback loops — you'll see your own tooling stack in it)*

**Module shelves:** *On Writing Well* (M1) · fast-check + Stryker docs, Modern Treasury ledger guides, the FoundationDB/TigerBeetle simulation-testing write-ups (M2) · Jepsen.io analyses, Google SRE book ch. 3–4, *Practical TLA+* (M3) · Anthropic's agent-engineering essays, Simon Willison on prompt injection, OWASP LLM Top 10 (M4) · *Continuous Discovery Habits* (M5) · *Staff Engineer* + staffeng.com, Larson on engineering strategy (M6) · Fowler's *Bitemporal History*, the Synapse case study (M7) · Jepsen consistency map, Kleppmann on locking, Raft, Helland, *Use The Index, Luke* (M8)

*(Optional side-read for Module 8's storage lessons: DDIA 2nd ed. ch. 4, Storage and Retrieval.)*

---

## A closing note

Everything above compresses to three words: **externalize your judgment.**

Into specs an agent can execute. Into invariants machines can check. Into documents that teach while you sleep. Into engineers who carry your standards into rooms you're not in. The engineer this curriculum produces is not the one who types fastest or prompts cleverest — it is the one whose judgment is so well externalized that every agent, and every human, does their best work next to them.

The centaur's edge was never the engine. Start with the setup ritual in `CLAUDE.md` — let your agent rewrite the placeholders against your real systems — then ask it for the Month-1 kickoff.
