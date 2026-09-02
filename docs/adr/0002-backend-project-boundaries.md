# ADR 0002: Start with four backend projects

- **Status:** Accepted
- **Date:** 2026-09-02

## Context

GymPi needs domain boundaries that can grow without becoming tightly coupled, while remaining understandable to a solo developer learning C# and software design. The application will initially be deployed as one ASP.NET Core process on a resource-constrained Raspberry Pi.

Separating every candidate business module into its own assembly immediately would create many projects and dependency-registration paths before real behaviours have validated those boundaries. Keeping everything in one project would make dependency direction harder to see and enforce.

## Decision

The backend will begin as a modular monolith with four projects:

- `GymPi.Api` owns HTTP transport, composition, authentication integration, and process hosting.
- `GymPi.Application` owns application use cases and orchestration.
- `GymPi.Domain` owns domain concepts, invariants, and deterministic policy.
- `GymPi.Infrastructure` owns PostgreSQL persistence and external integrations.

Dependencies point inward. `GymPi.Domain` has no project dependencies. `GymPi.Application` may depend on Domain. Infrastructure may depend on Application and Domain. API may depend on Application and Infrastructure.

Business capabilities will be introduced as cohesive feature areas through vertical slices. Architecture tests will protect the dependency direction once the test infrastructure is introduced.

## Why

This structure makes the most important Clean Architecture boundary visible without introducing a separate assembly for every hypothetical module. It supports focused tests, replaceable infrastructure, and progressive discovery of domain boundaries while keeping the solution easy to navigate.

## Alternatives considered

- **One project for the entire backend:** Simpler initially, but makes it easier for domain policy to become coupled to HTTP, EF Core, and external integrations.
- **One assembly per domain module from the start:** Stronger compile-time isolation, but creates premature structure and more maintenance before module boundaries are proven.

## Consequences

- **Positive:** Clear dependency direction, familiar solution structure, focused testing boundaries, and low operational complexity.
- **Negative:** Feature isolation relies partly on conventions and architecture tests rather than assembly boundaries.

## Deliberately deferred

- Module-specific assemblies.
- Microservices and independent deployments.
- A message broker or distributed event bus.
- A separate background-worker process.
- Module-specific databases.
