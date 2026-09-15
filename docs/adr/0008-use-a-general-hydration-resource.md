# ADR 0008: Use a general hydration resource

- **Status:** Accepted
- **Date:** 2026-09-15

## Context

GymPi needs today’s hydration state, multi-day graphs, and later date-range views. Adding one HTTP endpoint for each screen or period would couple the API to the current interface and produce overlapping query contracts.

## Decision

Expose profile hydration summaries through `GET /api/profiles/{profileId}/hydration?days={count}`. The bounded `days` parameter represents between 1 and 31 consecutive profile-local days ending today. The response contains daily buckets, the current daily goal, profile time zone, and today’s entries.

Keep individual hydration events under the separate `/hydration-entries` collection. That collection remains the write boundary and will later expose paginated history.

## Why

One range-based hydration resource supports today’s tank and seven-day graph without defining endpoints around particular screens. Server-side bucketing keeps time-zone and daylight-saving rules in one tested boundary. A 31-day maximum bounds database and application work on Raspberry Pi hardware.

## Alternatives considered

- **Dedicated overview and weekly-total endpoints:** Simple per screen, but duplicates hydration query concepts and couples contracts to current UI composition.
- **Generic tracking endpoint for every metric:** Could reduce route count, but hydration, body measurements, nutrition, and workouts have different rules and data shapes that are not yet understood.

## Consequences

- **Positive:** One stable hydration query supports several date ranges and clients.
- **Positive:** Zero-entry days are explicit and profile-local date calculations remain server-owned.
- **Negative:** The response includes today’s entries alongside aggregate buckets until general history pagination is delivered.
- **Negative:** Range aggregation reads bounded source entries rather than stored daily totals.

## Deliberately deferred

- Cursor-paginated hydration entry history.
- Arbitrary start and end dates.
- Stored daily aggregates and query optimization without measured need.
- Authentication and profile authorization.
