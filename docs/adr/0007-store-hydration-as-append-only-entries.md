# ADR 0007: Store hydration as append-only entries

- **Status:** Accepted
- **Date:** 2026-09-15

## Context

GymPi must let a household member record drinks throughout the day, calculate progress against their profile goal, and later provide graphs, history, corrections, and notifications. Updating one daily counter would lose the individual events needed for those capabilities and would risk lost updates when several drinks are recorded close together.

## Decision

Store each drink as a `HydrationEntry` in PostgreSQL with a UUID, owning profile UUID, amount in millilitres, and UTC consumption timestamp. Calculate local-day totals using the owning profile's IANA time zone and half-open UTC boundaries. Index entries by profile and consumption time.

Expose commands and queries through Application boundaries, EF Core mappings through Infrastructure, and profile-scoped HTTP endpoints through API. The first UI slice provides a dedicated mobile-first page, confirmed-save water animation, and optional procedurally generated Web Audio feedback without adding a media asset or dependency.

## Why

Append-only entries preserve history and avoid counter-update races while remaining simple to query over bounded time ranges. UTC timestamps plus profile-local day boundaries handle daylight-saving changes without storing ambiguous local timestamps. Procedural audio keeps the interaction small, local, and license-free.

## Alternatives considered

- **Store one mutable total per profile and date:** Simpler storage initially, but loses history, complicates correction, and can suffer lost updates.
- **Store a bundled audio file:** More realistic, but adds asset licensing, distribution, and preload concerns before the experience requires them.

## Consequences

- **Positive:** Every drink remains traceable, daily totals can be rebuilt, and later graphs and corrections use the same source data.
- **Positive:** Database constraints and a foreign key protect basic integrity.
- **Negative:** Totals require bounded aggregation rather than one counter read.
- **Negative:** Profile-scoped routes are not authorisation; GymPi remains local-only until the security phase.

## Deliberately deferred

- Seven-day graphs and paginated history.
- Removing mistaken entries.
- Manual historical timestamps and offline synchronisation.
- Hydration reminders and notifications.
- Authentication, authorisation, and remote exposure.
