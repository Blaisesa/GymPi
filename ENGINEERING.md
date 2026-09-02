# GymPi Engineering Guide

## Purpose

This guide defines how GymPi is designed and developed by the project owner in an AI pair-programming workflow. It is tool-neutral: the repository, its tests, and its architecture records remain the source of truth.

## Pair-programming agreement

- The project owner decides product behaviour, scope, and consequential architecture.
- The AI partner inspects the current repository before proposing changes, explains unfamiliar design choices, and presents realistic trade-offs.
- Architecture, schema, integration, security, deployment, and dependency changes require explicit approval before implementation.
- A broad instruction to build a feature does not approve an architecture that has not yet been presented.
- Work proceeds one small, verifiable checkpoint at a time.
- The AI partner must surface assumptions, uncertainty, scope changes, and blockers early.

## Design principles

### Keep it simple

- Apply KISS and YAGNI. Build for known requirements and demonstrated extension points.
- Prefer clear names, small cohesive units, and straightforward control flow over clever abstractions.
- Do not introduce an interface, service, base class, event, or layer solely because it may be useful later.

### Keep responsibilities focused

- Apply the Single Responsibility Principle at type, use-case, and module boundaries.
- Keep domain rules independent from HTTP, persistence, UI, and third-party integrations.
- Keep controllers and endpoints thin; they translate transport concerns and invoke application use cases.
- Put invariants where they cannot be bypassed accidentally.

### Control coupling

- Dependencies point inward: API and infrastructure depend on application and domain policy, not the reverse.
- Depend on abstractions at real volatile boundaries such as external food providers, supermarket sources, notifications, time, and local AI.
- Prefer composition over inheritance.
- Apply DRY to stable knowledge, not merely similar-looking code. Duplication is acceptable until a shared concept is proven.

### Make behaviour explicit

- Use explicit inputs, outputs, errors, permissions, and state transitions.
- Keep nutrition calculations, allergy enforcement, privacy decisions, progression rules, and state changes deterministic.
- Treat dates, units, portions, measurement systems, ownership, and sharing permissions as domain concepts rather than loose primitives when their rules justify it.

## Scalability principles

GymPi must scale in maintainability, data volume, and product capability while remaining efficient on one Raspberry Pi. Scalability does not mean beginning with microservices.

- Organise the modular monolith around cohesive business capabilities, not technical folders alone.
- Add modules through vertical slices only when real behaviour establishes their boundaries.
- Keep the API stateless where practical; keep authoritative state in PostgreSQL.
- Use bounded queries, pagination, suitable indexes, and measured query plans for growing histories and food datasets.
- Make scheduled and background operations bounded, observable, retry-safe, and idempotent where required.
- Isolate external providers behind small adapters so a provider can be replaced without changing domain rules.
- Use versioned, forward-tested database migrations and maintain verified backup and restore procedures.
- Set resource budgets for always-running services and benchmark combined workloads on ARM64 hardware.
- Split a module or service only when measured performance, deployment independence, reliability, security, or team ownership provides a concrete reason.

## Test-driven delivery

For every new observable behaviour or regression:

1. Define one behaviour and its acceptance boundary.
2. Write the smallest meaningful test first.
3. Run it and confirm it fails for the intended reason.
4. Add only enough implementation to pass.
5. Refactor while the tests remain green.
6. Run the relevant broader test suite.

Tests should favour observable behaviour over implementation details. Use unit tests for domain rules, integration tests for persistence and application boundaries, architecture tests for dependency rules, and end-to-end tests only for critical user journeys.

## Architecture governance

- Record consequential accepted decisions as short ADRs in `docs/adr/`.
- Include context, the decision, material alternatives, consequences, and deliberately deferred work.
- Revisit a decision when evidence or constraints change; do not silently work around it.
- Keep `PROJECT.md` aligned with durable product scope and architecture.

## Privacy, security, and reliability

- Treat every profile's fitness, nutrition, health, habit, and progress information as private unless an explicit permission grants access.
- Enforce authorisation at the application boundary and verify it with integration tests.
- Never make an internet connection, AI service, or optional integration a prerequisite for core behaviour.
- Do not give an AI model database credentials, direct internet access, tools, or mutation authority.
- Never commit secrets. Provide documented environment-variable examples using non-sensitive placeholders.
- Design schema changes with backup, migration, restoration, and rollback or roll-forward implications in mind.

## Definition of done

A change is complete only when:

- its accepted behaviour is covered by meaningful tests;
- relevant tests, formatting, static analysis, and builds pass;
- privacy and authorisation implications have been considered;
- resource implications on the Raspberry Pi have been considered;
- documentation and ADRs reflect any durable decision;
- unrelated scope has not been added;
- the code is understandable without relying on the AI conversation that produced it.
