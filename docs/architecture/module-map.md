# GymPi module map

## Purpose

Modules organise GymPi around business capabilities while the application remains one deployable modular monolith. A module is not automatically a C# project, service, database, or network boundary.

Module folders are introduced only when an approved vertical slice creates real behaviour. The map guides ownership without requiring empty speculative structure.

## Candidate modules

| Module | Owns | Does not own |
| --- | --- | --- |
| Identity and Access | Credentials, authenticated identity, sessions, recovery, security events | Household privacy policy or fitness data |
| Households | Household membership, roles, profiles, dependants, invitations, sharing grants | Password verification or module-specific records |
| Training | Exercises, workout plans, sessions, progression, and personal records | Nutrition targets or identity credentials |
| Nutrition | Foods, recipes, meal plans, portions, targets, dietary requirements, and allergies | Pantry stock or supermarket prices |
| Pantry and Shopping | Inventory, shopping lists, budgets, receipts, provider prices, and item acquisition | Nutrition authority or AI explanations |
| Tracking and Progress | Measurements, habits, streaks, charts, and progress-photo metadata | Authentication credentials or training-plan rules |
| Notifications | Notification preferences, scheduling intent, delivery attempts, and delivery status | The business decision that an event occurred |
| Intelligence | Feature-specific authorised contexts, prompts, schemas, validations, evaluations, and explanations | Authentication, domain calculations, direct database access, or state changes |

These are candidate capability boundaries. The first implemented slice may refine their names or ownership when concrete domain evidence appears. A material boundary change is documented rather than hidden.

## How one feature crosses projects

A household bootstrap feature may occupy:

```text
src/backend/GymPi.Api/Features/Households/
src/backend/GymPi.Application/Households/BootstrapOwner/
src/backend/GymPi.Domain/Households/
src/backend/GymPi.Infrastructure/Households/
tests/backend/GymPi.Domain.Tests/Households/
tests/backend/GymPi.Application.Tests/Households/BootstrapOwner/
tests/backend/GymPi.IntegrationTests/Households/BootstrapOwner/
```

The repeated `Households` language makes the capability visible across Clean Architecture layers. The feature is still one vertical user outcome rather than four layer-based delivery phases.

## Ownership rules

- A module is responsible for changing its own authoritative information.
- Cross-module workflows are coordinated by Application use cases.
- Domain types do not call Infrastructure or another module's adapters.
- API routes do not mutate module data directly.
- Dashboards may use focused read models across modules when no invariant is bypassed.
- Shared code is created only after stable shared knowledge is demonstrated.
- Do not create generic `Common`, `Helpers`, `Services`, or `Shared` dumping grounds.
- An in-process event is introduced only when a real reaction benefits from decoupling; no event bus is assumed.

## Growth rules

A module may become a separate assembly or process only when evidence shows a concrete benefit such as stronger security isolation, independent deployment, incompatible runtime needs, sustained resource contention, reliability containment, or separate ownership. Size or hypothetical future growth alone is not sufficient.
