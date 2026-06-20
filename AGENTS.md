# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

# Dependency Approval Rule

No new dependency may be added without documenting:

- Why it is needed
- Bundle size impact
- Expo/native alternatives considered
- Long-term maintenance cost

Default answer to new dependencies should be "no".

Before adding any dependency, provide a short justification and wait for approval.

# AGENTS.md

## Project Overview

Manzil (منزل) is a focused Islamic application dedicated exclusively to reading and listening to Manzil.

This is NOT a Quran application.
This is NOT a prayer times application.
This is NOT an Islamic super app.

Every feature must directly support one of the following user goals:

1. Read Manzil
2. Listen to Manzil
3. Read while listening
4. Resume previous progress

If a proposed feature does not improve one of these goals, it should not be implemented.

---

# Core Product Principles

## Simplicity First

Always choose the simplest implementation that satisfies requirements.

Avoid:

- Feature creep
- Premature abstractions
- Enterprise architecture
- Over-engineering

---

## Lightweight By Default

Minimize:

- Dependencies
- Bundle size
- Runtime memory usage
- Startup time

Before adding any package:

1. Verify Expo does not already provide the capability.
2. Verify React Native does not already provide the capability.
3. Justify why a dependency is required.

---

## Offline First

The application should remain fully functional without internet access after content has been downloaded.

Persist:

- Last reading position
- Playback position
- User preferences
- Downloaded audio

---

## Performance Budget

Targets:

- Cold start under 1.5 seconds
- Smooth scrolling
- No dropped frames during audio playback
- Low memory footprint

Always prefer performance over unnecessary visual effects.

---

# Technical Standards

## Stack

- React Native
- Expo
- TypeScript
- Expo Router

Avoid introducing:

- Redux
- MobX
- Recoil
- Zustand
- Heavy UI frameworks

Use:

- React Context
- Custom Hooks
- Composition

---

## Architecture

Feature-first organization.

Use Expo Router structure with routes in project-root `app/` and shared logic under `src/`.

app/

- \_layout.tsx
- index.tsx
- home.tsx
- reader.tsx
- player.tsx
- settings.tsx

src/

- features/ (optional, when a feature grows)
- components/
- hooks/
- services/
- storage/ (or `services/storage` if simpler)
- assets/ (optional for source-managed assets)
- types/
- utils/

Business logic must not live inside screens.

---

## TypeScript

Rules:

- Strict mode enabled
- No `any`
- No disabled lint rules
- Prefer explicit typing

---

## Components

Prefer:

- Small
- Focused
- Reusable
- Pure

Avoid components exceeding 300 lines.

Extract logic into hooks.

---

## State Management

Use local state whenever possible.

Use Context only for:

- Audio playback
- Reader preferences
- App settings
- Reading/audio progress persistence

Do not create global state unnecessarily.

---

# Audio Requirements

Audio playback is a core feature.

Changes affecting playback must ensure:

- Background playback continues
- Lock screen controls continue working
- Progress persistence remains functional
- Resume playback works correctly

Audio functionality should never regress.

---

# Reader Requirements

The reading experience is the primary product experience.

Maintain:

- Excellent Arabic rendering
- Smooth scrolling
- Accurate verse highlighting
- Reliable resume position

Reader performance takes priority over visual enhancements.

---

# Design Guidelines

The UI should feel:

- Calm
- Respectful
- Minimal
- Focused

Avoid:

- Excessive animations
- Bright colors
- Gamification
- Social mechanics
- Engagement tricks

This is a spiritual utility, not a social product.

---

# Content Rules

Do not modify:

- Arabic text
- Verse ordering
- Translation content

Content should originate from approved sources only.

For this project, approved sources are:

- Quran text/translations from verified Quran APIs or approved local data files
- Audio from approved reciter/source URLs provided by product owner

Treat religious content as immutable data.

---

# Future Features

Allowed future additions:

- Multiple reciters
- Additional translations
- Sleep timer
- Bookmarks
- Audio quality selection

Not allowed:

- Prayer times
- Qibla finder
- Tasbeeh counter
- Social features
- Chat
- Accounts
- Ads-driven engagement features
- Community feeds

These belong in separate products.

---

# Pull Request Checklist

Before submitting changes:

- Does this improve reading or listening?
- Can this be done with fewer dependencies?
- Does it work offline?
- Does it increase bundle size?
- Does it impact startup time?
- Does it affect audio playback?
- Does it affect reading performance?

If uncertain, choose the simpler solution.
