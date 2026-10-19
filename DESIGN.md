---
name: AutoAI Clean
description: International car-comparison convention (Carwow / Autotrader / Edmunds) for a Hebrew-first monthly-cost car finder. White ground, big car photos, one savings-green action colour.
colors:
  page: "#ffffff"
  mist: "#f3f6f9"
  line: "#e2e7ee"
  ink: "#0e1b2c"
  muted: "#4d5b6c"
  go: "#0a7c59"
  go-deep: "#075e44"
  go-soft: "#e3f4ec"
  gap: "#b4bcc7"
  alert: "#c2410c"
  go-on-ink: "#5fd3a7"
  muted-on-ink: "#c3cbd6"
typography:
  display:
    fontFamily: "Rubik, Assistant, system-ui, sans-serif"
    fontSize: "clamp(2.3rem, 4.8vw, 4rem)"
    fontWeight: 700
    lineHeight: 1.06
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Rubik, Assistant, system-ui, sans-serif"
    fontSize: "clamp(1.8rem, 3.6vw, 2.8rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  headline-sm:
    fontFamily: "Rubik, Assistant, system-ui, sans-serif"
    fontSize: "clamp(1.8rem, 3.2vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  title-lg:
    fontFamily: "Rubik, Assistant, system-ui, sans-serif"
    fontSize: "clamp(1.35rem, 2.3vw, 1.7rem)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Rubik, Assistant, system-ui, sans-serif"
    fontSize: "1.4rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  title-sm:
    fontFamily: "Rubik, Assistant, system-ui, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  body-lg:
    fontFamily: "Assistant, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Assistant, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.75
  body-sm:
    fontFamily: "Assistant, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Assistant, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.4
  caption:
    fontFamily: "Assistant, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.5
  micro:
    fontFamily: "Assistant, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.4
  figure-xl:
    fontFamily: "Rubik, Assistant, system-ui, sans-serif"
    fontSize: "44px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.01em"
    fontFeature: "tnum"
  figure-lg:
    fontFamily: "Rubik, Assistant, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.01em"
    fontFeature: "tnum"
  figure:
    fontFamily: "Rubik, Assistant, system-ui, sans-serif"
    fontSize: "21px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
    fontFeature: "tnum"
  figure-sm:
    fontFamily: "Rubik, Assistant, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.01em"
    fontFeature: "tnum"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  tile: "12px"
  card: "16px"
  media: "24px"
  pill: "9999px"
spacing:
  gutter: "16px"
  gutter-wide: "32px"
  stack-sm: "8px"
  stack: "12px"
  card-sm: "20px"
  card: "24px"
  card-lg: "32px"
  grid: "24px"
  section: "64px"
  section-lg: "80px"
  container: "1280px"
components:
  button-primary:
    backgroundColor: "{colors.go}"
    textColor: "{colors.page}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.go-deep}"
  button-primary-lg:
    backgroundColor: "{colors.go}"
    textColor: "{colors.page}"
    rounded: "{rounded.pill}"
    padding: "0 28px"
    height: "48px"
  button-ghost:
    backgroundColor: "{colors.page}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "44px"
  button-ghost-on:
    backgroundColor: "{colors.go-soft}"
    textColor: "{colors.go-deep}"
  button-on-ink:
    backgroundColor: "{colors.go-on-ink}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 28px"
    height: "48px"
  card:
    backgroundColor: "{colors.page}"
    rounded: "{rounded.card}"
    padding: "24px"
  answer-tile:
    backgroundColor: "{colors.page}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tile}"
    padding: "12px 16px"
  answer-tile-selected:
    backgroundColor: "{colors.go-soft}"
    textColor: "{colors.ink}"
  match-pill:
    backgroundColor: "{colors.go-soft}"
    textColor: "{colors.go-deep}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
  tab:
    backgroundColor: "{colors.mist}"
    textColor: "{colors.muted}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "40px"
  tab-active:
    backgroundColor: "{colors.page}"
    textColor: "{colors.ink}"
  input:
    backgroundColor: "{colors.page}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tile}"
    padding: "10px 12px"
    height: "48px"
  input-chat:
    backgroundColor: "{colors.page}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "48px"
  dark-panel:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.page}"
    rounded: "{rounded.media}"
    padding: "32px"
---

# Design System: AutoAI Clean

## Overview

**Creative North Star: "The Honest Showroom Floor"**

AutoAI Clean is the international car-comparison convention, executed straight: white page, cool mist section grounds, deep navy type, large rounded car photographs, and white cards that sit on soft two-layer shadows. It is deliberately unthemed. Convention is the commitment; the craft bar is Carwow, Autotrader UK and Edmunds, not a local costume or a dark showroom.

What makes it AutoAI rather than a generic listings site is that money is the headline and every figure carries its provenance. The monthly cost of ownership is the biggest, greenest number on any card, and each cost line is drawn with a coded bar: solid navy for official, green hatch for estimate, dashed outline for missing. The visual system exists to make those two things legible at a glance on a phone.

Density is moderate and mobile-first: 16px gutters on phones, 32px from `sm`, a 1280px container, generous 44–48px touch targets everywhere. Hebrew RTL is the primary direction; every horizontal placement is written with logical start/end properties so the English (LTR) toggle mirrors cleanly.

**Key Characteristics:**
- White and mist grounds, navy ink, one savings-green for actions and money.
- Rubik (display + figures) over Assistant (body), both with Hebrew subsets.
- Pill-shaped buttons, tabs and badges; 12px tiles, 16px cards, 24px photos and dark panels.
- Soft ambient shadows; the floating card overlapping a photo is the signature depth move.
- Provenance code (official / estimate / missing) is a semantic system, never decoration.
- RTL first, logical properties, bidi-isolated ₪ amounts.

## Colors

A cool, near-neutral palette (navy-tinted greys) with a single saturated green that carries actions and money.

### Primary
- **Savings Green** (go): the one action colour. Primary buttons, the monthly-cost figure (MonthlyTag), the progress bar, selected answer tiles' icon well and checkbox, links, focus rings, caret, range and checkbox accent, the wordmark "AI" and "A" mark.
- **Deep Savings Green** (go-deep): hover state of primary buttons; text colour on green-soft surfaces (match pill, "in compare" state, 3-year savings callout).
- **Green Wash** (go-soft): selected answer tile ground, active ghost button ("in compare"), the highlighted 15,000 km ladder cell, the savings callout, text selection.
- **Bright Green on Ink** (go-on-ink): the green re-tuned for navy grounds: the lead-CTA button and insurance figure on dark panels, the footer "AI". Hover lightens to #7fe0bb.

### Neutral
- **Paper White** (page): page ground, cards, ghost buttons, inputs.
- **Cool Mist** (mist): section grounds (hero, legend), tab rails, bar tracks, stat tiles, checklist rows, icon wells, alternating table rows (at 60%).
- **Hairline** (line): every border and divider; card outlines, ghost-button strokes, table rules.
- **Deep Navy Ink** (ink): text, footer, dark CTA panels, the official provenance bar, score bars, photo-credit chip (at 70%), modal scrim (at 60%).
- **Slate** (muted): secondary text, labels, inactive tabs (7:1 on white).
- **Pale Slate on Ink** (muted-on-ink): secondary text on navy panels and footer.
- **Gap Grey** (gap): the dashed "missing" outline and unselected multi-select checkbox stroke.

### Semantic
- **Burnt Orange** (alert): destructive / error text, con (X) icons in pros/cons, and the filled saved-heart.

### Named Rules
**The Green Means Money Rule.** Green is reserved for things the user can do (buttons, links, focus, their own selections and progress) and for money figures. Scores, ranks, specs and decoration use ink or muted. If a green element is neither clickable, a selection state, nor a shekel amount, it is wrong. The wordmark is the one brand exception.

*Divergence in the current build (not canonized):* the solid-green #1 rank badge, the green user chat bubble, green trust-list icons and green pros checkmarks use green outside this rule; the filled saved-heart borrows the alert colour.

**The Provenance Code Rule.** The three bar fills are semantic and only semantic: solid navy (`.code-off`) = official, green hatch (`.code-est`, 135° stripes of go and #7fc6ab) = estimate, transparent with an inset 1.5px gap-grey outline and pale hatch (`.code-miss`) = missing. Never use these fills for decoration, and never show a figure in a cost breakdown without its code. Insurance is always coded estimate.

## Typography

**Display Font:** Rubik 500/600/700 (fallback Assistant, system-ui, sans-serif), Hebrew + Latin subsets via Fontsource.
**Body Font:** Assistant 400/600/700 (fallback system-ui, sans-serif).
**Figures:** Rubik 600, tabular numerals, -0.01em, never wrapping (`.num`).

**Character:** Rubik's soft geometric rounds give headings and numbers a friendly, consumer-automotive voice; Assistant is a quiet, highly legible Hebrew text face at a generous 17px base.

### Hierarchy
- **Display** (700, clamp(2.3rem, 4.8vw, 4rem), 1.06): the hero headline only, max 15ch.
- **Headline** (700, clamp(1.8rem, 3.6vw, 2.8rem), 1.1): section titles (legend, advisor), max 14–20ch. The workspace title uses clamp(1.8rem, 3.2vw, 2.5rem).
- **Title** (700): questionnaire question clamp(1.35rem, 2.3vw, 1.7rem); leader card clamp(1.3rem, 2vw, 1.6rem); detail clamp(1.6rem, 3vw, 2.1rem); lead modal 1.7rem; top result 1.6rem; panels 1.4rem; dark CTA 1.35rem; legend and history 1.25rem; detail sub-sections 1.2rem; result cards 1.2rem; saved rows and ladder 1.15rem; compare column heads 1.05rem; footer wordmark 1.5rem (text-2xl).
- **Body** (400): 17px base (body, hero sub, section subs; sm:18px on the hero sub), 16px for running copy in cards and inputs (line-height 1.75), 15px for secondary copy, nav, buttons and table text.
- **Label** (600–700): 14px for chips, mode toggle, select labels, consent, notes; 13px for stat labels, code chips, captions, match pills; 12px for chat timestamps; 11px for the photo-credit chip only.
- **Figures** (`.num`, Rubik 600 tabular): 38px / sm:44px hero monthly cost; 30px insurance range on ink; 28px medium monthly cost; 26px analysis score; 22px budget tiles, market price, ladder cells; 21px small monthly cost, stats; 20px running total, km readout; 19px compare match and 15k row, detail price; 18px cost lines and compare rows; 17px breakdown values and compare detail rows; 16px score values; 15px inline price.

Full size inventory (every size used in Home.tsx and LeadRequestModal.tsx): 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 26, 28, 30, 38, 44px; 1.05, 1.15, 1.2, 1.25, 1.35, 1.4, 1.5, 1.6, 1.7rem; the five clamp() heading sizes above; text-lg (18px) on the hero sub at `sm`.

### Named Rules
**The Figures Are Rubik Rule.** Every number a user compares (₪, %, km, scores) is set in `.num`: Rubik 600, tabular, nowrap. Body copy never carries a comparable figure in Assistant.

**The Isolated Shekel Rule.** Every ₪ amount goes through `shekel()`, which wraps "₪" + the locale-formatted number in U+2066/U+2069 (LTR isolate) so it never reorders inside Hebrew. Pre-formatted ranges and Latin model strings are wrapped in `<bdi>`. (Current exceptions that hand-build "₪": catalog market ranges, the per-km figure, MonthlyTag's aria-label.)

## Layout

Single-column on phones; from `lg` (1024px) the hero splits into two equal columns (start: headline, sub-copy, three trust facts, questionnaire card; end: leader photo with floating card). Container `max-w-[1280px]`, gutters 16px → 32px at `sm` (640px). Sections alternate white and mist grounds: hero (mist, 40–56px top, 56–80px bottom), workspace (white, 56px top, 80px bottom), legend (mist, 64–80px), advisor (white, 64–96px), footer (ink).

Results: one wide featured card (photo 1.15fr / content 1fr from `lg`), then a 1 / 2 / 3 column grid (`sm` / `lg`) with 24px gaps. Detail is 1.2fr / 1fr. Compare is a horizontally scrollable table (min 620px). Answer tiles go two-up from `sm` when a step has four choices. Card padding steps 20 → 24 → 28/32px. Readable measure is capped with ch widths (46–70ch for paragraphs). Anchored sections use `scroll-mt-20` under the sticky 95%-white blurred header.

**The Logical Direction Rule.** Horizontal placement uses start/end only (`start-*`, `end-*`, `ps/pe`, `text-start/end`, `rounded-ss/se`), directional arrows swap by `dir`, `.grow` flips its transform-origin under `[dir="rtl"]`, and dividers use `rtl:divide-x-reverse`. Physical left/right is not used for layout.

## Elevation & Depth

A light, ambient system: surfaces sit on soft navy-tinted shadows, and depth is otherwise carried by tonal grounds (white on mist).

### Shadow Vocabulary
- **Card** (`--shadow-card`: `0 1px 2px rgba(14,27,44,.06), 0 8px 24px -12px rgba(14,27,44,.18)`): every card at rest, active tab and mode pills, small floating badges and save buttons over photos.
- **Float** (`--shadow-float`: `0 2px 6px rgba(14,27,44,.08), 0 22px 48px -18px rgba(14,27,44,.35)`): the leader card overlapping the hero photo, result cards on hover, the lead modal.

**The Overlap Rule.** The signature depth move is a white card lifted with Float and pulled up over the bottom of a 24px-rounded photo (-64px margin, inset 12–24px). Use it for the single most important car on the screen, not for every card.

## Shapes

Rounded and friendly without being bubbly. Pills (9999px) for every button, tab, select, chip, badge and the chat input. Tiles, inputs, stat cells, saved-row thumbnails and the demo note use 12px. Cards and chat bubbles use 16px. Photos, the dark lead-CTA panel and the modal use 24px (the modal is top-rounded only as a phone bottom sheet). Provenance bars and score bars are fully rounded 8–14px-tall lozenges. Borders are 1px hairlines; selection is shown with a 2px border. Empty states use a 2px dashed hairline on mist.

## Components

### Buttons
- **Shape:** full pill (9999px), min height 44px (48px for the questionnaire Continue / Show matches and form submits), 15–17px bold Assistant, 8px icon gap.
- **Primary:** Savings Green ground, white text, 20px inline padding (28px on large). Hover: Deep Savings Green. Disabled: 40–50% opacity.
- **Ghost:** white ground, 1px hairline, ink text, 16px padding. Hover: border turns ink. Toggled on (in compare): green-soft ground, green border, deep-green text.
- **On ink:** bright green ground with navy text on dark panels; hover #7fe0bb. Secondary on ink is an outline (#4a5a70) that turns white on hover.
- **Icon buttons:** 36–44px circles with a hairline (restart, close, save).
- **Focus:** global 3px Savings Green outline, 2px offset.

### Answer Tiles (questionnaire)
- 12px radius, 2px border, 12×16px padding, start-aligned. Unselected: hairline border on white, hover border #9fb0c2. Selected: green border on green-soft.
- Leading element is either a `.num` budget amount (22px, LTR) or a 40px icon well (mist / green-on-selection).
- Multi-select steps (use, priority, powertrain) are `role="checkbox"` with a trailing 24px check box and end with an explicit Continue primary button plus a "N picked" count; single-select steps show a trailing direction arrow and auto-advance after 180ms.

### Chips and Pills
- **Match pill:** green-soft ground, deep-green 13px bold text.
- **Rank badge on photos:** white pill with Card shadow, 13px bold ink (#2 onward). The #1 badge currently ships solid green, which conflicts with the Green Means Money Rule.
- **Advisor suggestion chips:** white pill, hairline, 14px semibold; hover green border and deep-green text.
- **Code chip:** a 20×10px provenance lozenge plus a 13px muted label.

### Cards / Containers
- **Corner Style:** 16px.
- **Background:** white; stat tiles inside cards on mist.
- **Shadow Strategy:** Card at rest, Float on hover for browsable result cards.
- **Border:** 1px hairline.
- **Internal Padding:** 20–32px; result cards with photos clip overflow and pad their body 16px.

### Inputs / Fields
- **Style:** 48px tall, 12px radius (lead form) or pill (chat, filters), 1px hairline, white, 16px text (prevents iOS zoom), green caret.
- **Focus:** border turns Savings Green, plus the global focus outline on keyboard focus.
- **Error / Disabled:** error message in alert, 15px semibold; disabled at 50–60% opacity.

### Navigation
- Sticky header, 95% white with backdrop blur and a hairline bottom border. Wordmark "Auto" in ink + "AI" in green, LTR-isolated, beside a 32px green "A" mark. Links 15px semibold muted, hover ink; the language toggle is a 40px ghost pill.
- Workspace tabs: a mist pill rail; active tab is a white pill with Card shadow, inactive muted text. Scrolls horizontally on phones.

### Monthly Tag (signature)
The money headline: a Savings Green `.num` figure (44/28/21px by size) followed by a 14px muted "per month" label, baseline-aligned, with a full spoken aria-label.

### Cost Breakdown (signature)
A three-column grid (label, bar, figure): muted label, a 10px mist track with a provenance-coded bar that grows from the start edge (`.grow`), and an end-aligned 17px `.num` figure (or the word "missing" in muted). Followed by the three code chips and the km basis.

### Lead Modal
Navy scrim at 60%; a 520px white sheet with 24px radius and Float shadow (bottom sheet on phones). Fields as above, consent checkbox below a hairline, full-width primary submit, success state with a green check.

### Motion
`.swap` fades content up 8px over 0.4s on step and car changes; `.grow` scales bars in from the start edge over 0.7s; both use `cubic-bezier(.16,1,.3,1)`. The progress bar eases width over 500ms. All motion collapses under `prefers-reduced-motion`.

## Do's and Don'ts

### Do:
- **Do** make the monthly ownership cost the largest figure on any car surface, in Savings Green `.num`.
- **Do** code every cost line with official / estimate / missing, and show "missing" as missing rather than inventing a value.
- **Do** route every ₪ amount through `shekel()` and wrap ranges and Latin model names in `<bdi>`.
- **Do** use logical start/end properties and direction-aware arrows so Hebrew RTL and English LTR both work.
- **Do** keep touch targets at 44px minimum (48px for primary questionnaire and form actions) and inputs at 16px text.
- **Do** use mist grounds and white cards with the Card shadow to separate content before reaching for borders or colour.

### Don't:
- **Don't** use green for scores, ranks, specs, icons or decoration; it belongs to actions, selection state and money.
- **Don't** use the provenance fills (solid navy, green hatch, dashed outline) as decorative bars or patterns.
- **Don't** introduce a second accent hue or a dark hero; the ground is white and mist.
- **Don't** set comparable numbers in the body face or let them wrap.
- **Don't** use physical left/right for layout or concatenate "₪" into a string by hand.
- **Don't** fabricate testimonials, user counts, partner logos or reviews as visual proof.
