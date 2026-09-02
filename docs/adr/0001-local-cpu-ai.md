# ADR 0001: Local CPU AI for metrics and meals

- **Status:** Accepted
- **Date:** 2026-09-01

## Context

GymPi is an open-source, local-first household fitness and wellness platform intended to run on a Raspberry Pi 5 with 8 GB RAM. Its normal workload includes the React/PWA frontend, ASP.NET Core API, PostgreSQL, reverse proxy, Pi-hole or equivalent ad blocking, and Tailscale. Personal workouts, health metrics, habits, nutrition records, and progress photos are private by default.

The product will benefit from natural-language explanations that combine a user's authorised metrics and meal data. The AI must fit comfortably on the existing Pi without making the core application dependent on probabilistic output or mandatory cloud services.

## Decision

GymPi will include an optional, CPU-only local AI capability based initially on a quantized Qwen3.5 0.8B model served through llama.cpp.

The first AI scope is personal metrics and meals:

- explain verified metric and adherence trends;
- summarise a user's recent fitness and nutrition data;
- explain deterministic workout progression suggestions;
- explain and compare meals that the application has already determined fit the user's targets, dietary requirements, allergies, pantry state, and budget constraints.

The ASP.NET Core application remains the authority for authentication, privacy, calculations, nutrition values, targets, recipe ranking, allergy enforcement, and state changes. It supplies only a small, authorised, precomputed context to the model. The model has no database credentials, direct database access, internet access, or tools, and cannot change a plan or record.

Initial operating boundaries:

- text-only inference;
- one queued request at a time;
- approximately 2,000-4,000 input tokens;
- short outputs, normally 100-200 tokens;
- bounded memory and CPU allocation so the core application remains responsive;
- a deterministic fallback whenever AI is unavailable or its output fails validation;
- AI features remain optional and the offline core works without the model.

The AI must not diagnose conditions, independently prescribe calorie or macro targets, invent nutrition facts, expose another member's private data, or make unreviewed changes. Health-related conclusions remain outside its authority.

## Why

Metrics and meals are where natural-language interpretation can add substantial value without asking the model to become the source of truth. Keeping calculations and permissions deterministic allows a small model to focus on summarisation and explanation, which is a better fit for the Raspberry Pi's constraints.

Qwen3.5 0.8B is small enough for a CPU-first validation on the 8 GB Pi, is supported by llama.cpp, and uses the Apache 2.0 licence, which aligns with the project's open-source direction. CPU-first validation avoids additional hardware cost and preserves a reversible deployment boundary.

## Alternatives considered

- **No AI in V1:** Rejected because tightly integrated explanations across metrics and meals are considered a high-value product capability.
- **Cloud model API:** Not selected because it would weaken offline operation, privacy, predictable cost, and household control of sensitive health data.
- **Raspberry Pi AI HAT+ 2:** Deferred until measured CPU-only performance or model quality proves insufficient.
- **Larger local model:** Not selected because it would reduce memory and CPU headroom for the primary household services.

## Consequences

- **Positive:** Private, offline-capable explanations; no per-request cloud cost; strong integration with verified household data; open-source-compatible deployment; optional failure mode.
- **Negative:** Short answers may take several seconds; sub-billion-parameter output quality is limited; only one request can run at once; careful evaluation and resource benchmarking are required.

## Deliberately deferred

- General-purpose chatbot behaviour.
- AI-generated nutrition targets or medical guidance.
- AI agents, autonomous tools, internet browsing, and direct writes.
- Image analysis of meals or progress photos.
- Voice input and speech output.
- Fine-tuning, RAG, embeddings, and a vector database.
- AI accelerator hardware.
- Cross-household AI features or cloud inference fallback.

## Acceptance gates

Before the feature is included in V1, a Raspberry Pi 5 benchmark and representative evaluation set must confirm:

- no swapping or thermal throttling during normal combined workloads;
- adequate memory headroom and responsive API/database behaviour during inference;
- acceptable latency for short summaries;
- strict household and profile privacy boundaries;
- valid structured responses and deterministic fallback behaviour;
- useful, non-fabricated output for normal, ambiguous, adversarial, and insufficient-data cases.
