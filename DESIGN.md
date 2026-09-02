# GymPi Visual Design System

## Design statement

GymPi should feel **focused enough to train and warm enough to return to**.

The interface combines warm charcoal surfaces with pastel apricot orange. It should communicate control, privacy, energy, and encouragement without becoming clinical, aggressive, or judgemental.

This document defines the human-facing rules. `src/web/styles/tokens.css` is the implementation source of truth for colour values.

## Emotional principles

### Control, not coldness

Dark interfaces can make personal information feel protected and focused, but pure black and blue-black can feel severe or clinical. GymPi uses warm near-black and charcoal so health and household data still feel human.

### Energy, not aggression

Orange suggests motion, warmth, optimism, and appetite. Highly saturated orange can create urgency or performance pressure. GymPi uses a softened apricot that retains energy while lowering visual and emotional intensity.

### Progress, not judgement

Colour should help users recognise actions, progress, recovery, information, and problems. It must never imply that a missed target or difficult week is a personal failure. Language, hierarchy, and interaction states must support the same principle.

### Clarity before decoration

Colour is functional first. It establishes hierarchy, communicates state, and makes important actions easy to find. Decorative colour must never compete with user data.

Emotional responses to colour vary by person, culture, context, and experience. GymPi therefore reinforces meaning with labels, icons, position, and interaction rather than assuming colour alone creates a universal reaction.

## Core palette

| Role | Token | Value | Intended effect |
| --- | --- | --- | --- |
| Application background | `--color-background` | `#11100E` | Focus, privacy, grounded calm |
| Main surface | `--color-surface` | `#1A1815` | Stable content space |
| Raised surface | `--color-surface-raised` | `#23201C` | Quiet hierarchy |
| Subtle border | `--color-border-subtle` | `#3A342D` | Structure without harsh outlines |
| Control border | `--color-border-control` | `#74695E` | Accessible interactive boundaries |
| Primary text | `--color-text-primary` | `#F7F2EC` | Readability without pure-white glare |
| Secondary text | `--color-text-secondary` | `#C9BFB4` | Supporting information |
| Muted text | `--color-text-muted` | `#9E9489` | Non-essential context |
| Primary action | `--color-primary` | `#F2A66D` | Warmth, movement, motivation |
| Primary hover | `--color-primary-hover` | `#FFC79F` | Responsive warmth |
| Primary pressed | `--color-primary-pressed` | `#D98950` | Physical confirmation |
| Primary foreground | `--color-on-primary` | `#23150C` | Readable content on apricot |
| Recovery/success | `--color-positive` | `#B7C9A5` | Balance, restoration, sustainable progress |
| Information | `--color-information` | `#90B7C9` | Neutral guidance and trust |
| Danger/error | `--color-danger` | `#E58C8C` | Clear problems without visual aggression |

The primary orange has approximately 9.46:1 contrast against the application background. Dark primary foreground text has approximately 8.83:1 contrast against the primary orange.

## Colour hierarchy

- Dark neutrals should occupy most of every screen.
- Light neutrals provide text and quiet structure.
- Primary orange should normally occupy no more than roughly 5-8% of a screen.
- Orange identifies the main action, current selection, active progress, or a deliberately celebrated result.
- Most views should have one clearly dominant orange action.
- Do not outline every card, colour every icon, or turn every positive value orange.
- Large orange areas are reserved for deliberate moments such as onboarding or a major confirmation, and must retain comfortable contrast.

## Semantic usage

### Primary orange

Use for:

- the highest-priority action in a view;
- active navigation or selected controls;
- the user's current position or active progress;
- the primary series in a focused chart;
- concise moments of encouragement.

Do not use for:

- errors, destructive actions, or warnings;
- passive decoration on every surface;
- long paragraphs or dense blocks of text;
- every successful metric;
- several actions with equal visual weight.

### Quiet sage

Use for recovery, completed sustainable habits, balanced nutrition states, and positive outcomes that do not require immediate action. Do not use it as a second general-purpose brand colour.

### Soft mineral blue

Use for neutral information, explanations, synchronisation states, and secondary chart comparisons. It should communicate guidance rather than demand attention.

### Muted coral

Use only for errors, danger, destructive actions, and privacy or safety problems. Always pair it with explicit text or an icon.

## Surfaces and geometry

- Prefer a small number of meaningful surfaces rather than placing every item in a card.
- Use subtle borders and tonal separation for passive surfaces; interactive boundaries use the higher-contrast control-border token.
- Corners should feel soft but disciplined: moderate radii for controls and content surfaces, not exaggerated bubbles.
- Reserve pill shapes for compact statuses, tags, and progress tracks.
- A low-opacity apricot atmospheric glow may appear in onboarding or major headers, but never behind dense data or form fields.

## Data visualisation

- Use orange for the primary or currently inspected series, not automatically for every dataset.
- Use neutral structure for axes, grids, inactive ranges, and comparison history.
- Use sage and mineral blue only when persistent secondary meaning is required.
- Keep category mappings stable across screens.
- Pair colour with direct labels, line styles, symbols, or patterns.
- Avoid red-versus-green-only comparisons.
- Charts must remain understandable in monochrome and for users with colour-vision differences.

## Typography and content

The exact typeface will be selected separately. Until then:

- use an approachable, highly legible sans-serif direction;
- prefer sentence case over all caps;
- use weight and spacing before adding another colour;
- use tabular numerals for aligned metrics and changing values;
- keep feedback factual, encouraging, and free from shame-based language.

## Motion

- Motion explains state change, progress, or navigation; it is not decoration.
- Interactions should feel responsive and controlled rather than bouncy or gamified.
- Never loop attention-seeking animation.
- Honour reduced-motion preferences.

## Accessibility requirements

- Text and interactive controls must meet the applicable WCAG contrast requirement against their actual background.
- Colour must never be the only indicator of state, category, progress, or error.
- Keyboard focus must remain clearly visible using the soft apricot focus token.
- Hover, active, focus, selected, and disabled states must remain distinguishable.
- Do not reduce the contrast of essential information to make the interface appear more muted.

## Generation rules

- Components must consume semantic tokens from `src/web/styles/tokens.css`.
- Do not place raw hex, RGB, HSL, or named colour values in component styles.
- Feature-specific colours require an approved semantic meaning before a token is added.
- Do not create a second theme file, parallel palette, or component-specific brand colour.
- New global visual rules require an update to this document.
- A consequential change to the design contract requires an ADR.

## Deliberately deferred

- Exact typography family and full type scale.
- Logo and application icon.
- Light theme.
- A complete multi-series chart palette.
- Illustration and photography direction.
- Storybook or another component workshop dependency.
- Automated raw-colour linting and visual-regression infrastructure.
