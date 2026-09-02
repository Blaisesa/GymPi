# ADR 0003: Use semantic design tokens as the visual contract

- **Status:** Accepted
- **Date:** 2026-09-02

## Context

GymPi will be developed through an AI pair-programming workflow across many vertical slices. Without one visual source of truth, generated screens can gradually introduce inconsistent colours, component treatments, emotional tone, and accessibility behaviour.

The approved visual direction uses warm charcoal surfaces with pastel apricot orange as the primary colour. It must support fitness, nutrition, private health information, household planning, and data visualisation without feeling clinical, aggressive, or judgemental.

## Decision

GymPi will use a semantic token contract for its visual system.

- `DESIGN.md` defines the emotional intent and human-facing usage rules.
- `src/web/styles/tokens.css` is the implementation source of truth for colour values.
- Components consume semantic tokens rather than raw colour values.
- Pastel apricot represents primary actions, current selection, active progress, and deliberate encouragement.
- Recovery, information, and danger use separate semantic colours.
- Colour is always paired with another indicator when it communicates meaning.

The initial theme is dark-only and uses the Warm Charcoal + Balanced Apricot palette.

## Why

Semantic names preserve meaning when components and features grow. Separating intent from values allows the palette to evolve without rewriting feature code, while the usage rules prevent orange from losing emphasis through overuse.

This approach uses native CSS custom properties and introduces no design-system dependency or runtime cost.

## Alternatives considered

- **Document the palette without code tokens:** Simple, but future components could still copy values inconsistently and detach colours from their semantic roles.
- **Adopt a third-party design system immediately:** Provides ready-made components, but adds a dependency and visual conventions before GymPi's own interaction patterns are established.

## Consequences

- **Positive:** Consistent generation, accessible colour roles, inexpensive palette changes, stable chart meanings, and no new dependency.
- **Negative:** Contributors must follow the token contract, and enforcement initially relies on review until automated linting is justified.

## Deliberately deferred

- Light theme tokens.
- Exact typography and type-scale tokens.
- A complete component library.
- Full chart-series colours.
- Storybook or equivalent tooling.
- Automated raw-colour linting and visual-regression testing.
