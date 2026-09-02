# ADR 0005: Keep local inference reusable and database-blind

- **Status:** Accepted
- **Date:** 2026-09-02

## Context

GymPi's accepted local-AI design uses a quantized Qwen3.5 0.8B model through llama.cpp. Loading the same model separately for multiple Raspberry Pi applications would waste memory and CPU headroom. Embedding GymPi's rules or database access inside the model process would prevent safe reuse and create an unnecessary path between private application datastores.

The initial GymPi AI behaviours require language summarisation and explanation, while authentication, authorisation, health-data access, calculations, allergy enforcement, meal ranking, and state changes remain deterministic application responsibilities.

## Decision

Local inference will run outside the GymPi application process behind a narrow, configurable client boundary.

- The inference service loads the model, performs tokenisation and generation, and enforces model-level context, output, concurrency, timeout, and resource limits.
- It has no GymPi database credentials, no direct database access, no application tools, and no authority to change state.
- GymPi authenticates and authorises the request, reads only permitted data, computes verified facts, builds a bounded feature-specific context, validates the structured response, and provides the fallback.
- Prompts, rules, schemas, evaluations, privacy decisions, and user-visible behaviour remain owned and versioned by each calling application.
- Conversation history is not shared between applications or retained by the inference service as application state.
- Raw prompts, private context, and generated health-related content are not written to routine inference logs or telemetry.
- The endpoint is internal to approved local application processes and is not exposed directly to browsers, LAN clients, Tailscale users, or the public internet.
- One model and an initially single-request global inference queue protect Raspberry Pi headroom.
- The endpoint is configurable so a future second application can use the same model service with its own database, prompts, schemas, and rules.

GymPi may provision the optional inference service initially. When a second real consumer exists, the service may be promoted to independently managed host-level infrastructure without changing GymPi's business logic.

## Why

This boundary loads the model once while preventing the inference process from becoming a shared business-logic or data-access service. Application-owned policy keeps deterministic authority in C# and makes privacy boundaries testable.

A configurable client interface also allows the service lifecycle to move from GymPi-owned deployment to host-level deployment without rewriting AI features.

## Alternatives considered

- **Run a separate model process for every application:** Provides stronger resource isolation but duplicates model memory and increases Pi load.
- **Put prompts, rules, and database access in a central AI gateway:** Centralises behaviour but creates a high-value service with cross-application data authority and duplicated business rules.

## Consequences

- **Positive:** One loaded model, reusable inference, separate databases, application-owned privacy, independent AI failure, and a reversible deployment boundary.
- **Negative:** Applications contend for one bounded queue; model upgrades can affect multiple consumers and must pass each application's evaluation suite.

## Deliberately deferred

- A general AI platform or separate repository.
- A central multi-client gateway.
- Per-application priority scheduling and quotas.
- Multiple simultaneously loaded models.
- Shared prompt or conversation storage.
- Tools, agents, RAG, embeddings, and vector databases.
- Model hot-swapping.
