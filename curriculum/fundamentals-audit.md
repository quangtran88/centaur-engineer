# The Fundamentals Audit

**Module 00 — interleaved, ongoing.** Everything here is something you use *every day* and therefore believe you know. Daily use trains **interface knowledge** (what to call, what happens normally). It does not train **mechanism knowledge** (why it works, where it breaks). Abstractions are *designed* to let you not-know — right up until they leak, and the leak cases are exactly what a top-tier engineer is paid for.

Your own war stories are the evidence. A batch job that OOMs only above a certain input size is a backpressure/GC gap surfacing. A money bug that only appears past a certain magnitude is a floating-point gap surfacing. Every check-then-act race you catch in review is a transaction-isolation gap surfacing. The audit below turns those surprises into a checklist you clear on purpose — and {{a real production incident of yours}} should seed its first custom question (see the war-story-autopsy rule at the bottom).

## How to run it (honestly)

1. Pick one area. Answer each question **out loud or in writing, before looking anything up**. Recognition is not recall — if you'd "know it when you see it," you don't know it.
2. Grade harshly: **crisp** (could teach it), **fuzzy** (hand-waving), **blank**.
3. Anything fuzzy or blank → do the reading, then re-test yourself a week later by explaining it to your agent and letting it attack your explanation.
4. An area is *done* when every question is crisp in one sitting. Expect none to be done on the first pass — that's the point.

Or just tell your agent **"quiz me"** — it picks an area, asks **one question at a time** (never multiple choice — recognition is not recall), and grades you crisp/fuzzy/blank.

Fintech is the running worked example throughout, because money makes the failure modes concrete. Substitute your own domain's highest-stakes equivalent — the setup ritual in this repo's AGENTS.md will rewrite every {{placeholder}} against your real systems. The running stack — Node/TypeScript, Postgres, Redis, AWS — is equally deliberate: the most common web-backend profile, not anyone's biography. If yours differs, setup swaps the stack-specific areas (D, E, I, J, Q, R) for your equivalents; the mechanisms transfer, the API names don't.

---

# Part 1 — Classic CS fundamentals

## A. Numbers & money (the one that can cost real money)

1. Why exactly does `0.1 + 0.2 !== 0.3`? At what magnitude do JS numbers stop representing integers exactly, and why that number?
2. Even after you move amounts to integers or bigints: where can a large amount *still* silently lose precision in a JSON pipeline? (Hint: what does `JSON.parse` produce before your code ever sees the value?)
3. You must distribute 100 cents of interest across 3 accounts proportionally. Where does the leftover cent go? Is your allocation deterministic, order-independent, and auditable? (Look up: largest-remainder method.)
4. Banker's rounding vs round-half-up: which one does {{your highest-stakes money/data calculation}} use — and does the counterparty system use the same one? How would you detect a mismatch before reconciliation does?

*If fuzzy:* "What Every Computer Scientist Should Know About Floating-Point" (Goldberg) — the intro sections; float.exposed to play; then reread {{a precision-sensitive PR of yours}} with new eyes.

## B. Time (daily-cutoff semantics live here)

1. Your "end of day" snapshot or cutoff: end of day in *which* timezone, and is the boundary computed in UTC or a local offset? Where in code is that decision made — and where is it accidentally re-made differently?
2. `Date.now()` can go backwards. Why (NTP step), and what should your latency measurements use instead? (Wall clock vs monotonic clock.)
3. Two timestamps from two services, 40ms apart — can you conclude which event happened first? Why not?
4. A third party timestamps in their local zone, you store UTC, a user views in browser-local. Name the three places an off-by-one-*day* bug can enter a daily report.

*If fuzzy:* {{your own daily-cutoff or settlement code}} — trace one timestamp end-to-end; "Falsehoods programmers believe about time" as a checklist against {{a third-party integration you own}}.

## C. Text & Unicode (identity matching lives here)

1. What does `"José".length` return when the é is decomposed? Why can two *visually identical* names compare unequal — and which normalization (NFC/NFD) does {{your identity/name-matching code}} apply, if any?
2. String `.length`, code points, grapheme clusters: which does JS give you, and which does the human mean?
3. `Buffer.byteLength(s)` vs `s.length` — what does each measure? Why might your CSV export need a BOM for Excel, and what does that do to the first header cell if a parser is naive?

*If fuzzy:* "The Absolute Minimum Every Software Developer Must Know About Unicode" (Spolsky, and the 2023 update by Nikita Prokopov); then grep {{your identity-matching code}} for `normalize(`.

## D. PostgreSQL transactions & locking (check-then-act races, formalized)

1. Under READ COMMITTED (the default), two concurrent transactions each do: read balance → check sufficient → write new balance. What exactly goes wrong? Name your three defenses and when you'd pick each. (`SELECT ... FOR UPDATE`, optimistic version column, atomic `UPDATE ... SET x = x - $1 WHERE x >= $1`.)
2. What is *write skew*? Construct a double-withdrawal scenario against {{your most contention-prone table}} — under REPEATABLE READ, would it be caught?
3. Name three reasons Postgres ignores an index you created. What does composite-index column order change?
4. What does one long-running transaction do to VACUUM and bloat on {{your highest-volume table}}?
5. Partition pruning: when does a query hit *all* partitions despite the partition key being "in" the WHERE clause?

*If fuzzy:* Postgres docs ch. "Transaction Isolation" (read it twice — it's short and everyone skips it); "Use The Index, Luke" for index mechanics; DDIA ch. 7 overlaps here.

## E. Node.js runtime (streaming pipelines, explained back to you)

1. Execution order: `process.nextTick` vs `Promise.then` vs `setTimeout(0)` vs `setImmediate` — and in which order do microtasks drain relative to each phase?
2. In {{a streaming pipeline of yours}} (say, database → transform → object-storage upload): if the upload is slower than the read, what mechanism stops memory from growing? What is `highWaterMark` actually a limit on?
3. `a.pipe(b)` vs `pipeline(a, b, cb)`: what happens differently when `b` errors mid-stream? Which one leaks?
4. A buffered report job OOMs at a specific population size — why *that* size? What are V8 new/old space, and what actually triggers the heap-limit crash?
5. `Promise.all` vs `allSettled` in a batch job: after the first rejection, what happens to the other in-flight operations? (They keep running — then what?)

*If fuzzy:* Node docs "Event Loop, Timers, process.nextTick" + "Backpressuring in Streams" — then re-read {{a pipeline PR of yours}} and annotate where each concept appears.

## F. HTTP & networking (third-party integrations live here)

1. Connect timeout vs read timeout: which did you configure on {{your most critical outbound integration}}, and what does the *caller's retry* do if you processed successfully but responded slowly? What makes that safe (or not) in your system?
2. Idempotency keys: for which of your webhook/partner endpoints is replay a no-op, and what enforces it — a unique constraint, or hope?
3. Keep-alive connection pools in Node: what symptom appears when the pool is exhausted, and why do Lambdas famously see stale DNS?
4. What does TLS actually authenticate — and what does an application-level HMAC request signature add that TLS doesn't already give you?

*If fuzzy:* High Performance Browser Networking (hpbn.co, free) ch. 1–4; your own retry/timeout config files, audited against question 1.

## G. Security primitives (own the signing scheme you use)

1. Why `HMAC(secret, message)` instead of `hash(secret + message)`? What is a length-extension attack?
2. Why must signature comparison be timing-safe, and what does `crypto.timingSafeEqual` do that `===` doesn't?
3. A timestamp-tolerance window on signed requests: what attack does it bound, and what exactly trades off when you pick 5 minutes vs 30 seconds?
4. What does a JWT *guarantee*, what does it *not* (revocation!), and when is a random opaque session token simply better?

*If fuzzy:* {{a request-signing or checksum scheme you own or consume}} — rewrite its "why" section from memory, then diff against the real design.

## H. Containers & Linux (your agent sandboxes)

1. Define a container in one sentence using kernel primitives (namespaces, cgroups). No Docker words allowed.
2. Why do zombie processes accumulate in a sandbox whose entrypoint isn't an init process? What does PID 1 have to do that your agent process doesn't?
3. A container hits its memory limit: who kills what, what does exit code 137 mean, and how does that differ from the Node heap-limit crash in area E?
4. Image layers: why does changing one early Dockerfile line rebuild everything after it, and what does that mean for {{your CI's build times}}?

*If fuzzy:* "What even is a container?" (Julia Evans' comics/posts on namespaces & cgroups); `docker run --init` docs; then `ps` inside {{one of your own containers or agent sandboxes}}.

## I. Redis (cache and lock, the two famous footguns)

1. Cache stampede: an expired hot key gets 10k simultaneous requests. What happens to your database, and name two mitigations (jittered TTL, single-flight lock, stale-while-revalidate).
2. A `SET NX PX` lock: the holder hits a long GC pause and the TTL expires while it still thinks it holds the lock. What corrupts, and what's a fencing token?
3. Redis is single-threaded: what does one `KEYS *` or a big `SMEMBERS` do to every other caller — and what should you use instead?

*If fuzzy:* Kleppmann's "How to do distributed locking" (the Redlock critique) — the single best essay on why "it works locally" isn't knowledge.

## J. Git & TypeScript (lighter, but daily)

1. What *is* a commit, structurally (blob/tree/commit objects)? Why is rebase "history rewriting" if nothing is ever mutated — and how does reflog recover "lost" work?
2. Where does TypeScript's type system stop existing? Why does `JSON.parse(x) as UserDto` provide exactly zero safety, and what actually enforces your trust boundaries (zod or similar, at the edge)?
3. Structural typing: why does an object with *extra* properties pass where you didn't expect, and when does excess-property checking actually fire?

*If fuzzy:* "Git from the Bottom Up" (free); the TypeScript handbook section on structural typing — read against one of your own DTO boundaries.

---

# Part 2 — AI-era fundamentals

You spend hours a day driving an LLM — which makes this the *most* exposed "I use it daily, therefore I know it" surface you have. Industry consensus is converging on what's durable here: spec-driven development, context engineering, evals as an engineering discipline, agent security, and orchestration. Clever prompting as a standalone skill is the transient part. These areas test the mechanism knowledge under the durable skills.

## K. LLM mechanics (how the thing you talk to all day actually works)

1. What is a token — roughly how many per English word and per line of TypeScript — and why do models struggle to count the letters in a word or multiply 6-digit numbers?
2. Temperature and top-p: what distribution are they reshaping? Why does temperature 0 still not guarantee reproducible output in practice?
3. Why does hallucination exist *structurally* — what is the model optimizing when it fabricates? And why can "are you sure?" flip a *correct* answer to a wrong one?
4. What is the KV cache? Why is the first token of a response slow and the rest fast, and what does that imply for how you structure repeated agent calls?
5. "Lost in the middle": what degrades as a context window fills, and what does that imply for *where* you place invariants and instructions in a long prompt?

*If fuzzy:* Karpathy's "Deep Dive into LLMs like ChatGPT" (3.5 hrs, worth every minute); 3Blue1Brown's GPT + attention lessons; the Lost in the Middle paper.

## L. Context & agent-loop mechanics (the machinery of your collaboration)

1. Prompt caching: why does it only apply to an unchanged *prefix*, and what does that imply for message ordering — and for the cost of editing something early in a long session?
2. Describe the agent loop mechanically: model → tool call → result appended → model again. Why does every verbose tool output permanently tax the rest of the session?
3. How does a model "call" a tool — what is actually generated, what enforces the schema, and what happens on malformed output?
4. What does MCP standardize (tools/resources/prompts over a protocol), and what *new* attack surface does every connected MCP server open?
5. Why does pasting a whole repo into context make answers *worse*, not better — and when does retrieval beat context-stuffing?
6. An agent botched a task. Walk the diagnostic fork: what evidence tells you it was (a) missing context → fix the spec or rule, (b) a capability ceiling → redesign the task or stop delegating it, (c) an ambiguous spec → rewrite it? Classify 3 real misses from your own sessions — a rule-file entry bolted onto a capability ceiling fixes nothing and bloats the file.

*If fuzzy:* Anthropic's prompt-caching docs + context-engineering essay; modelcontextprotocol.io; then audit {{one of your own agent transcripts}} for context waste. For Q6: reread the diagnostic fork in guide.md Part 4, then classify 3 real misses from your own sessions.

## M. Retrieval, embeddings & memory

1. What *is* an embedding, what does cosine similarity actually measure — and name two kinds of "similar" it fails at (negation, exact identifiers/error codes)?
2. Why does chunking determine retrieval quality? What breaks when a chunk boundary splits a semantic unit?
3. Why do dense embeddings miss exact-match queries that BM25 catches trivially, and what does a hybrid pipeline look like?
4. Retrieve-then-rerank: why does the two-stage design beat one-stage, and what does it cost you?
5. Stale memory: when a retrieval/memory layer serves an agent a fact that *used to be true*, the agent states it confidently and nothing flags it — the poisoning is silent. Walk the failure end-to-end, then answer: what is the invalidation story in {{your retrieval/memory system, if you run one}} — and if you don't run one, what would yours be?

*If fuzzy:* Simon Willison's "Embeddings" explainer; Anthropic's Contextual Retrieval post; then re-ask question 5 against {{your retrieval/memory system, if you run one}} with real data.

## N. Evals & the statistics of measurement (trusting your own numbers)

1. Two systems score 34.1% vs 32.8% on your eval — is that a real difference? What determines the answer (sample size, confidence interval), and when is "tie" the only honest verdict?
2. Base rates: a 95%-accurate judge flags a failure; the true failure rate is 2%. What's the probability it's a real failure? (Work it out — most engineers get this wrong.)
3. Goodhart's law: give one concrete example of an agent improving your eval score while getting *worse* at the job.
4. Why does average latency lie? Who experiences p99 — and why does one slow dependency dominate tail latency under fan-out?
5. LLM-as-judge: name two systematic biases (position, verbosity, self-preference) and one mitigation for each.

*If fuzzy:* Hamel Husain's LLM-judge guide (Module 2 refs); "The Tail at Scale"; then put a confidence interval on {{a benchmark or eval number you've quoted recently}} — do it once, make it reflex.

## O. Queueing & performance (load testing, formalized)

1. Little's Law (L = λ·W): a load run shows throughput flat as you raise concurrency — what does the growing queue tell you? What throughput-vs-concurrency signature betrays a system that serializes internally behind a concurrent-looking API?
2. Why does latency hockey-stick past ~70–80% utilization instead of degrading linearly?
3. Coordinated omission: how does a load generator that politely waits for responses systematically *hide* the worst latencies — and does {{your load-testing harness, if you have one}} have this bug?
4. The USE method: for a saturated service, what three questions do you ask of every resource?
5. Why is a single cold benchmark run on a shared cloud instance a lie? Name three distorting effects (JIT warm-up, GC timing, noisy neighbors) and the minimal protocol that defeats them.

*If fuzzy:* Gil Tene's "How NOT to Measure Latency"; Brendan Gregg's USE method page; then re-audit {{your load-testing harness}} against question 3.

## P. AI security mechanics (why injection is not just another input-validation bug)

1. Why can't prompt injection be fully solved at the model layer? (What privilege separation exists between instructions and data in a token stream? None — say why that matters.)
2. The lethal trifecta: name the three ingredients and point to each one in {{your agent platform or setup}}. Which is the only one you can actually *remove* per-agent?
3. Why is "detect injection with another LLM" defense-in-depth at best and a losing primary defense?
4. Design: an agent must read inbound messages from external users AND browse workspace files. What architecture prevents a poisoned message from exfiltrating files — and what does it cost in capability?

*If fuzzy:* Willison's lethal trifecta + prompt-injection series (Module 4 refs) — but answer from *your* setup's architecture, not from the essays.

---

# Part 3 — Platform & design mechanics

Six areas that daily practice trains least and incidents punish most. Each survived the same test as everything above: necessity, non-redundancy, and durability.

## Q. Cloud IAM & metadata-service blast radius

1. From inside any container, what does `curl 169.254.169.254` return, and why does full IAM-role compromise require no code-level secret to leak? What did this mechanism cost Capital One?
2. What does IMDSv2 change (session token, hop limit) — and why does the hop limit specifically break container-hopping attacks?
3. {{Your agent sandboxes or CI runners}}: which IAM role do they inherit right now, and can an agent-driven HTTP request reach the metadata endpoint? (If you can't answer immediately, that *is* the finding.)
4. One broad instance role vs per-task scoped roles: what exactly is the blast-radius difference when one sandbox is compromised?
5. An agent's policy diff adds an `Allow` and nothing changes. Walk IAM evaluation order: where can an SCP or permission boundary silently cap the new Allow into a no-op, and why does an explicit `Deny` anywhere always win?
6. How can a resource-based policy alone grant a cross-account principal access with zero identity-side policy on your account — and what does that mean for how you audit "who can touch this bucket"?

*If fuzzy:* AWS IMDSv2 docs + IAM "Policy evaluation logic" docs; then run the curl from inside one of your own sandboxes in staging, and trace one agent-authored policy diff through the Deny→SCP→boundary→identity/resource evaluation order.

## R. Secrets & data-protection lifecycle

1. Envelope encryption: what are the DEK and KEK, and why encrypt data keys instead of encrypting data directly with the KMS key?
2. {{A third-party API credential of yours}} leaks *right now*: walk your actual rotation path. Minutes, hours, or a weekend window? What would make it one API call with zero downtime?
3. Tokenization vs encryption for high-sensitivity identifiers (account numbers, national IDs): what's the blast-radius difference when the database dumps?
4. Why is disk-level "encrypted at rest" (EBS/RDS) nearly irrelevant to an application-layer breach?

*If fuzzy:* AWS KMS envelope-encryption docs; then trace one credential and one high-sensitivity field end-to-end through your own pipeline.

## S. Observability economics

1. Why can a metrics system structurally not answer "why did it fail for customer=X AND product=Y AND cohort=new-user" post-hoc? What is the cardinality problem?
2. Wide structured events (one rich row per request): what do they buy, what do they cost, and when is pre-aggregation actively harmful?
3. Mid-incident, {{one instance of your system}} misbehaves for one user: list the fields you'd need to have logged *in advance* (request id, tenant/user, dependency versions, the failing instance's state — whatever reconstructs the incident). Does your platform log them today?
4. Metrics vs logs vs traces vs wide events: which one answers questions you didn't predict when instrumenting?

*If fuzzy:* Honeycomb's writing on observability vs monitoring; then try to answer question 3 against your real telemetry.

## T. Contracts & compatibility

1. State Hyrum's Law. Name one *undocumented* behavior of {{your most-depended-upon API}} (rounding, field ordering, error shape, timing) that a consumer could be silently depending on right now.
2. Backward vs forward compatibility for an event schema: which does the producer need, which does the consumer need, and why do rolling deploys force you to hold both at once?
3. What is consumer-driven contract testing, and what class of break does it catch that your integration tests don't?
4. When a third party's response crosses into your core domain: what does an anti-corruption layer do, and what leaks into your core aggregates when you skip it?

*If fuzzy:* DDIA ch. 4 (encoding & evolution); Hyrum's Law (hyrumslaw.com); then diff two external integrations' response shapes against your core DTOs.

## U. Concurrency models

1. Actors vs CSP vs structured concurrency — one sentence each: what is the isolation/communication primitive?
2. Structured concurrency's rule ("no child task outlives its parent scope"): what bug class does it eliminate — and where in {{your agent platform's session lifecycle}} can an orphaned LLM call or process outlive its cancelled session today?
3. Why is `Promise.all` plus a hand-rolled `AbortController` *not* structured concurrency? What guarantee is missing?
4. If you run per-user isolated workers (a common agent-platform shape), that's an actor model wearing a runtime costume: which actor property (no shared mutable state, message-only) does {{your concurrent-session design}} already satisfy, and where does state still leak between concurrent sessions?

*If fuzzy:* "Notes on structured concurrency, or: Go statement considered harmful" (Nathaniel Smith); then trace one session-cancellation path through {{your agent platform}}.

## V. Type-driven design

1. Parse-don't-validate: what's the difference between a validator returning `boolean` and a parser returning a *proven type*? Where in your DTO layer do you validate and then keep passing the raw shape anyway?
2. An upstream system adds a new status code. With a discriminated union + exhaustive `switch`, what happens at compile time? With `switch … default`, what happens at 2am?
3. Typestate: take the running fintech example — funded → accruing → settled → reconciled — or {{your most critical state machine}}. Sketch how it could be encoded so `reconcile(unsettledAccount)` fails to compile.
4. The cost side: where does type-level encoding tip into obfuscation, and what's your rule for stopping?

*If fuzzy:* "Parse, don't validate" (Alexis King); TypeScript handbook on discriminated unions; then find one real lifecycle bug from your history that typestate would have caught.

---

## The meta-skill: detecting the illusion in the future

- **Teach-back test:** if you can't explain it to a junior (or to your agent, which will push back), you have interface knowledge only.
- **Predict-then-run:** before running a query plan, a load test, a migration — write down what you expect. Surprise = gap found. This is free and almost nobody does it.
- **War-story autopsy:** every production surprise gets one question added to this file. The audit grows from your own incidents, not from a textbook.
