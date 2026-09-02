# ADR 0004: Deploy GymPi as a single-origin modular monolith

- **Status:** Accepted
- **Date:** 2026-09-02

## Context

GymPi combines a React PWA, an ASP.NET Core API, PostgreSQL, household authentication, private health data, and optional integrations on one Raspberry Pi. The application needs strong internal boundaries without the resource use and operational complexity of independently deployed frontend and backend services.

Serving the production frontend and API from different origins would require additional CORS, cookie, CSRF, routing, release-compatibility, and deployment configuration. GymPi's frontend and backend are developed in one repository and installed together for one household.

## Decision

GymPi will be deployed as a single-origin modular monolith.

- One ASP.NET Core process hosts the API and serves the production React build.
- API routes use the `/api` path beneath the same origin as the PWA.
- Development may run Vite and ASP.NET Core separately for hot reloading without changing the production boundary.
- PostgreSQL remains a separate stateful service and the authoritative datastore.
- Business capabilities remain modular inside the monolith and follow the four-project dependency direction established by ADR 0002.
- Small bounded background operations run in the ASP.NET Core host until measured needs justify another process.

## Why

One origin simplifies secure browser sessions, deployment, rollback, logging, compatibility, and Raspberry Pi resource use. Internal modularity preserves maintainability without requiring distributed infrastructure.

The frontend can be separated later because it communicates through explicit API contracts; deploying it separately now provides no demonstrated benefit.

## Alternatives considered

- **Separate frontend and API containers:** Allows independent releases, but adds routing, security, compatibility, and operational complexity without a current need.
- **Microservices by business capability:** Provides independent deployment boundaries, but is disproportionate for one household Pi and would introduce network failure modes, distributed data concerns, and higher resource use.

## Consequences

- **Positive:** One secure origin, fewer runtime services, lower resource use, simpler installation, and coordinated frontend/backend releases.
- **Negative:** Frontend-only changes still require rebuilding and releasing the GymPi application image.

## Deliberately deferred

- Independent frontend deployment.
- Public API versioning.
- Microservices and module-specific processes.
- Message brokers and distributed events.
- A separate background-worker process.
- Selection of the private HTTPS gateway or reverse proxy.
