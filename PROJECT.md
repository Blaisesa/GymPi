# GymPi

## Purpose

GymPi is an open-source, local-first household fitness and wellness platform designed to run on one Raspberry Pi per household. It helps owners, adults, and dependants manage training, nutrition, household food planning, habits, and progress while keeping sensitive information private by default.

## Goals

- Make household fitness, nutrition, and wellness planning available without mandatory cloud accounts or subscriptions.
- Keep personal workouts, nutrition, metrics, habits, and progress photos private while supporting deliberate household sharing.
- Build an understandable, maintainable learning project with strong tests and resource-conscious Raspberry Pi deployment.
- Add bounded local AI explanations without making AI the source of truth.

## Success criteria

- GymPi installs and runs reliably on a Raspberry Pi 5 with 8 GB RAM using an ARM64 deployment.
- A household owner can initialise GymPi and manage adult and dependant profiles.
- Core workout, nutrition, pantry, shopping, and tracking functions work without internet access or the AI service.
- Automated tests demonstrate that one profile cannot access another profile's private information without explicit permission.
- Household data can be exported, backed up, restored, and migrated.
- The core API and database remain responsive during optional local inference.
- Representative Pi benchmarks show no swapping or thermal throttling under the accepted combined workload.

## Scope

### In scope

- Household ownership, adult profiles, dependant profiles, and permissions.
- Exercise library, workout-plan creation, scheduling, logging, history, progression, and personal records.
- Meals, recipes, portions, calorie, macro, and micronutrient tracking.
- Dietary requirements, restrictions, and allergy enforcement.
- Deterministic meal planning based on targets, pantry contents, dietary rules, budget, and available recipes.
- Barcode scanning and an external food database.
- Pantry inventory, shopping lists, budgets, receipts, supermarket prices, and bounded supermarket price collection.
- Body measurements, metrics, charts, habits, streaks, and progress photos.
- Household challenges and notifications.
- Selective sharing and copying of plans without exposing private history.
- Offline-capable PWA behaviour and safe synchronisation.
- Backup, export, restore, and household migration.
- Optional local AI for weekly summaries, verified trend explanations, progression explanations, and explanations of deterministically selected meals.
- LAN access and private remote access through Tailscale.

### Out of scope

- Garmin, Fitbit, Health Connect, and Apple Health integrations.
- Native mobile applications.
- Mandatory cloud accounts, cloud storage, or cloud synchronisation.
- Public profiles, public social features, and cross-household competition.
- Home Assistant integration.
- RabbitMQ, Redis, and microservices.
- Cloud AI fallback, general chatbot behaviour, medical diagnosis, autonomous agents, AI tools, direct AI writes, image analysis, voice, RAG, and fine-tuning.

## Constraints

- Primary target: Raspberry Pi 5 with 8 GB RAM and ARM64 Linux.
- GymPi must coexist comfortably with PostgreSQL, reverse proxying, Pi-hole or equivalent ad blocking, Tailscale, and the optional local model.
- The core platform must remain usable without internet access or AI.
- Personal health and wellness information is private by default.
- Nutrition or plans are shared only with explicitly selected household members.
- AI receives only authorised, precomputed context and has no database credentials, direct internet access, or mutation authority.
- The design must remain understandable to a solo developer and future open-source contributors.
- The interface must follow `DESIGN.md` and consume the semantic tokens in `src/web/styles/tokens.css`.

## Technology decisions

- **Web client:** React 19.2 and TypeScript PWA — installable, responsive, and capable of offline local state.
- **Web tooling:** Vite — focused frontend tooling without a server-rendering framework GymPi does not require.
- **Backend:** ASP.NET Core on .NET 10 LTS — efficient ARM64 support and a strong fit for the project's C# learning goals.
- **Architecture:** Single-origin modular monolith using four Clean Architecture projects — one efficient deployment with explicit internal boundaries, governed by ADRs 0002 and 0004.
- **Persistence:** PostgreSQL 18 with EF Core migrations — reliable relational storage for connected household data.
- **Deployment:** ARM64 Docker Compose — reproducible local and Pi environments.
- **Offline client data:** IndexedDB with explicit synchronisation rules.
- **Remote access:** Tailscale, without public internet exposure.
- **Local AI:** Quantized Qwen3.5 0.8B through a configurable, reusable, database-blind llama.cpp service, governed by ADRs 0001 and 0005.
- **Visual system:** Warm Charcoal + Balanced Apricot through semantic CSS tokens, governed by ADR 0003.

Record consequential decisions in `docs/adr/` after approval.

## Architecture summary

The production React PWA and ASP.NET Core API share one origin and one application deployment. The API owns authentication integration, transport validation, and process hosting; Application owns use-case orchestration and authorisation; Domain owns deterministic business rules; and Infrastructure owns PostgreSQL and external adapters. PostgreSQL is the authoritative store.

External food and supermarket integrations enter through infrastructure adapters and are cached locally. IndexedDB supports deliberate offline client behaviour and synchronises through explicit API contracts.

The optional llama.cpp service receives small, authorised, precomputed contexts through an internal adapter. It cannot access PostgreSQL directly or change application state. Its configurable boundary allows another local application to reuse the loaded model while retaining a separate database, permissions, prompts, schemas, and evaluations.

## Current phase

Approved system architecture, threat modelling, and first vertical-slice planning.

## Next vertical slice

First-run household bootstrap: launch the local stack, create the household owner securely, sign in, and display an authenticated empty dashboard with data persisted in PostgreSQL.

## Open questions

- Which open-source licence GymPi will use.
- Which reverse proxy will be included in the Pi deployment.
- Which external food database will be the initial provider.
- Which Irish and US supermarkets can be supported safely and maintainably.
- Which notification channels will be included first.
