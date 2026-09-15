# ADR 0006: Use EF Core for profile persistence

- **Status:** Accepted
- **Date:** 2026-09-15

## Context

GymPi needs its first persistent product data: local household profiles that will own hydration and later wellness records. PostgreSQL 18 is already the authoritative datastore, and the modular monolith requires persistence details to remain in Infrastructure. The solution must remain understandable for one developer, testable against real PostgreSQL behaviour, and efficient on a Raspberry Pi 5.

## Decision

Use EF Core 10 with the Npgsql provider and version-controlled migrations. Keep profile rules in Domain, profile use cases and the storage boundary in Application, EF Core mappings and storage in Infrastructure, and HTTP contracts in API. Verify PostgreSQL behaviour with disposable Testcontainers databases.

The first persistent model is `HouseholdProfile`, identified by a UUID and containing a display name, IANA time-zone ID, daily hydration goal in millilitres, and UTC creation timestamp.

## Why

EF Core supplies change tracking, LINQ queries, relational mapping, and schema migrations without requiring GymPi to build its own data-access framework. Npgsql provides native PostgreSQL support. Real PostgreSQL integration tests detect provider and migration behaviour that an in-memory substitute would miss.

## Alternatives considered

- **Raw Npgsql with hand-written SQL:** Offers more direct SQL control but adds mapping and migration boilerplate without a current product benefit.
- **EF Core in-memory provider for integration tests:** Runs without Docker but does not verify PostgreSQL constraints, types, or migrations.

## Consequences

- **Positive:** Schema changes are versioned, persistence stays behind the application boundary, and tests exercise the production database engine.
- **Negative:** Local integration tests require Docker and take longer than unit tests. EF Core and Testcontainers add maintained dependencies.
- **Negative:** Profile selection is not authentication. Until authentication is implemented, GymPi must not expose profile data beyond its local development boundary.

## Deliberately deferred

- Authentication, authorisation, and remote access.
- Profile editing and deletion.
- Hydration history and correction.
- Production migration automation, backup, restore, and deployment configuration.
