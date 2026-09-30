---
name: Watchtower
description: Observe the price. Make your own call.
colors:
  light-paper: "#f4f7fb"
  light-surface: "#fff"
  light-soft: "#e9eef7"
  light-ink: "#172d4b"
  light-muted: "#576982"
  light-line: "#d5dfec"
  light-accent: "#2d5fb3"
  light-button: "#2855a3"
  light-button-text: "#fff"
  light-button-hover: "#214887"
  light-accent-soft: "#e2ebfc"
  light-success: "#246247"
  light-success-bg: "#e2f1e9"
  light-warning: "#775018"
  light-warning-bg: "#f6edd9"
  light-error: "#a12f34"
  light-error-bg: "#fbe9e9"
  light-chart-target: "#687c96"
  light-image-well: "#edf1f7"
  light-control-line: "#788aa3"
  dark-control-line: "#8298b5"
  dark-paper: "#0e192b"
  dark-surface: "#17263d"
  dark-soft: "#21344e"
  dark-ink: "#e7effc"
  dark-muted: "#afbed5"
  dark-line: "#344862"
  dark-accent: "#95baff"
  dark-button: "#acccff"
  dark-button-text: "#10274b"
  dark-button-hover: "#c2dbff"
  dark-accent-soft: "#263e65"
  dark-success: "#9cd9be"
  dark-success-bg: "#193c33"
  dark-warning: "#e9c181"
  dark-warning-bg: "#3d3020"
  dark-error: "#ffb0b3"
  dark-error-bg: "#40262f"
  dark-chart-target: "#a7b7d0"
  dark-image-well: "#e7eef9"
typography:
  display-community:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(3rem, 5.5vw, 5rem)"
    fontWeight: 500
    lineHeight: 1.06
    letterSpacing: "-0.035em"
  display-track:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(2.75rem, 4.7vw, 4.25rem)"
    fontWeight: 500
    lineHeight: 1.06
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.035em"
  section:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  body:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
  small:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  price:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "2.75rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.035em"
rounded:
  compact: "4px"
  control: "6px"
  segmented: "8px"
  card: "12px"
spacing:
  step-4: "4px"
  step-8: "8px"
  step-12: "12px"
  step-16: "16px"
  step-20: "20px"
  step-24: "24px"
  step-28: "28px"
  step-32: "32px"
  step-40: "40px"
  step-48: "48px"
  step-64: "64px"
  step-80: "80px"
components:
  button-primary:
    backgroundColor: "{colors.light-button}"
    textColor: "{colors.light-button-text}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "11px 20px"
  button-primary-dark:
    backgroundColor: "{colors.dark-button}"
    textColor: "{colors.dark-button-text}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "11px 20px"
  button-primary-hover:
    backgroundColor: "{colors.light-button-hover}"
  button-primary-dark-hover:
    backgroundColor: "{colors.dark-button-hover}"
  button-secondary:
    backgroundColor: "{colors.light-surface}"
    textColor: "{colors.light-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "11px 20px"
  button-quiet:
    textColor: "{colors.light-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "10px 12px"
  input:
    backgroundColor: "{colors.light-surface}"
    textColor: "{colors.light-ink}"
    rounded: "{rounded.control}"
    padding: "11px 13px"
  state-label:
    backgroundColor: "{colors.light-soft}"
    textColor: "{colors.light-ink}"
    rounded: "{rounded.compact}"
    padding: "6px 8px"
  product-card:
    backgroundColor: "{colors.light-surface}"
    textColor: "{colors.light-ink}"
    rounded: "{rounded.card}"
  dialog:
    backgroundColor: "{colors.light-surface}"
    textColor: "{colors.light-ink}"
    rounded: "{rounded.card}"
    padding: "32px"
---

# Design System: Watchtower

## Overview

**Creative North Star: "Price Observatory"**

Watchtower is a price observatory for shoppers considering a purchase over time. Its interface presents observed prices, availability and explained assessments with enough context for users to make their own buying decision. The private watchlist and explicitly published snapshot have a visible boundary.

The visual language is precise and approachable: cool paper surfaces, ink-blue hierarchy, clear blue observation accents, measured grotesque headings and an open radar frame. Marketing introductions have an asymmetric rhythm; task screens use aligned evidence, short labels and predictable controls. Identity comes from the observation language rather than decorative sale urgency.

**Key Characteristics:**
- Radar frame and observation dots attached to real states.
- Tabular price notation, recorded currencies and dated evidence.
- Fine horizontal rules separating observations, choices and settings.
- Self-hosted typography and deliberately paired light and dark surfaces.

### Historical directions considered

The following candidates document the original direction exploration; their color values are historical, not the current palette. After an interim restoration of Watchtower’s original green palette, the user requested a blue palette. The observation identity, typography and composition remain intact; the frontmatter records the current blue system.

1. **Price Observatory (identity chosen; palette subsequently revised)**: a shopper's observation notebook. Space Grotesk headings and IBM Plex Sans interface text; asymmetric introductions, aligned data and fine rules. Signal orange #B64029, charcoal #202832, mineral white #F3F5F5. Radar icon, observation dots, tabular prices, quiet state transitions. Recognizable through the relationship between observation, evidence and a buying decision. This is the clearest fit for history, alerts and explicitly shared snapshots.
2. **Buying Ledger**: a consumer purchase journal. Heavy grotesque headlines, receipt-like stacked composition, black #222323, vermilion #D44531 and cool gray #ECEEEE. Squared stamp shapes, compact cost breakdowns and short mechanical reveals. Strong financial clarity, but the receipt metaphor suggests transactions the product does not process.
3. **Finders' Bulletin**: a social recommendations publication. Broad newsprint-style columns, humanist sans headlines, blue #214CAA, white #F7F8FA and graphite #29313C. Marginal annotations, open image crops and page-turn disclosure. More sociable, but weakens the private tracker as the product's core.

Price Observatory was chosen because history, alerts and explicitly shared snapshots all depend on observing evidence over time. The receipt direction implied transactions Watchtower does not process; the bulletin direction gave public browsing priority over the private tracker.

The existing radar asset and Watchtower name remain binding. Product truth and the user's brief take precedence over generic resource defaults. No invented charts, social proof or claims are used as decoration.

## Colors

The user-requested blue palette pairs cool paper and ink-blue text in light mode, with deep navy layers and pale blue accents in dark mode. The frontmatter records actual CSS values, including both theme variants.

### Primary

Medium blue is the link-hover, chart and observation accent in light mode; pale blue carries those roles in dark mode. Primary buttons use a separately defined stronger blue background in light mode and a lighter blue action background in dark mode. Button text has its own theme-specific token, and hover colors are separately designed. The accent-soft background identifies selected reactions and text selection.

### Neutral

Paper is the page ground, surface supports task panels, and soft separates secondary regions. Ink and muted text establish hierarchy; line separates content without ornamental containers. Control-line is a stronger, theme-specific boundary for native fields; it stays distinct from quiet content rules. Retailer image wells use their own neutral layer to preserve product-cutout legibility in either theme. Chart-target is intentionally distinct from the observed-price line.

### Semantic feedback

Success, warning and error each have paired foreground/background tokens. Green is reserved for meaningful semantic success, separate from the blue observation and action palette. State labels keep a readable status name beside the observation dot. Form failures include an alert or explanatory text; successful feedback uses a status announcement. Color never supplies the sole meaning.

**The Observation Rule.** Use the observation accent for chart evidence, link feedback and observation marks. Primary actions use the separate button token. Feedback uses its own semantic color and an explicit text label.

Theme is assigned before hydration from a saved override or system preference. The system preference continues to apply until the user chooses an override; the override persists on the device. Controls, charts and dialogs consume the same semantic variables.

## Typography

**Display Font:** Space Grotesk, sans-serif fallback  
**Body Font:** IBM Plex Sans, sans-serif fallback  
**Code Font:** ui-monospace, monospace fallback

Both primary fonts are self-hosted variable Latin WOFF2 files. Their SIL Open Font Licenses are retained in public/fonts. The pairing makes major decisions recognizable while keeping dense task text readable. Font sizes use rem units; chart library tick/tooltips retain their explicit numeric sizing.

### Hierarchy

- **Community display:** the frontmatter's display-community role, reduced to 3rem below 600px.
- **Tracking display:** the display-track role, reduced to 2.75rem below 800px.
- **Task headline:** headline role, reduced to 2rem below 600px.
- **Section and title:** body-family headings use the section/title roles; special introduction and verdict headings use the display family.
- **Body:** body role; reading paragraphs are limited to 70ch, with tighter introductory measures.
- **Label and supporting text:** label/small roles. Labels use sentence case, not a repeated uppercase eyebrow.
- **Prices:** price role on detail screens; compact card prices use 1.75rem. Numeric values use tabular figures.

**The Evidence Rule.** Show recorded currency, time and uncertainty beside the relevant value. Use tabular numbers for prices and compact measurements.

## Layout

Main pages have a 1240px maximum content width with 48px side gutters on wide screens. The header has a 1360px maximum width and 32px gutters. Breakpoints at 1100px, 800px, 600px and 360px progressively adjust composition and density; the sidecar records these.

Feed grids use three desktop columns, two at tablet widths and one on mobile. Below 600px, public entries use a small image/name region followed by full-width price, evidence, reactions and retailer action. This is a deliberate list treatment rather than a scaled desktop card. Watchlist entries keep a compact price history and direct controls.

Tracking uses a two-part introduction/form composition on wide screens. It becomes a single column below 600px; explanatory steps are condensed into the introductory copy. Form pairs use auto-fit columns with a minimum limited to the smaller of the available width and 10rem. Settings and detail evidence reorganize into single-column groups at narrower widths.

The layout uses observed 4px-based spacing steps from the frontmatter, with region-specific gaps. Main task buttons are at least 46px high, inputs at least 48px and standard icon targets at least 44px. Mobile navigation expands in document flow. The storage notice is part of the page above the footer, so it does not cover a task form. Dialogs fit the viewport and scroll internally.

## Elevation & Depth

Tone and one-pixel rules provide ordinary depth. Cards and panels are flat at rest. Only the modal dialog uses the theme-specific ambient shadow and a dark translucent backdrop. Sticky navigation retains a solid page ground and dividing rule.

**The Quiet Depth Rule.** Ordinary surfaces use tone and fine borders. Dialogs alone use a large ambient shadow; hover feedback does not lift cards.

## Shapes

Small, measured curves soften the observation language without making every control a pill. Controls use the control radius, cards and dialogs the card radius; compact status labels use the compact radius. Segmented sorting controls have their own modest outer curve. A radar mark framed by a fine square and small circular observation dots are recurring signatures. Lucide SVGs use a consistent 1.75 stroke.

## Components

### Buttons

Primary buttons carry the action token and contrasting button-text token, with 11px by 20px padding and a 46px minimum height. Secondary actions use surface, ink and line; quiet actions use transparent backgrounds and muted text. Hover changes tone and border. Active primary/secondary buttons move by 1px. Focus is an explicit accent outline; disabled actions reduce opacity and keep their semantic label. Destructive actions use error tokens and a named confirmation.

### Google sign-in

The Google sign-in control follows Google's branding requirements: an unmodified official G asset, Google Sans label, white ground and neutral boundary in both themes. It uses the product's six-pixel control curve, a 48px touch target and the shared visible focus treatment. Provider feedback uses the app's semantic error/status tokens. Google sits first on the sign-in screen, followed by a fine-rule email separator; account linking stays within the existing settings rhythm.

### Inputs and native menus

Inputs, selects and textareas use surface/ink, a contrasting control-line border, control radius and 11px by 13px padding. Hover strengthens the border; focus uses an accent border and outline. Invalid fields use the error border, and helper text stays associated with its input. Textareas resize vertically. Native select options inherit surface and ink; operating-system pickers keep their native behavior. Password visibility is a labelled button within the field.

### Navigation

The desktop header combines the radar wordmark, named destinations and search/theme controls. Current destinations use ink and an accent underline. Below 800px, a labelled menu control opens vertically stacked destinations in document flow; current destinations also receive a soft surface. Escape closes the menu and restores focus to its trigger. The skip link exposes direct keyboard access to content.

### Cards and evidence panels

Product cards use surface, a fine line border and card radius. Public entries have retailer image wells; watchlist entries use small thumbnails and compact price histories. Detail panels use measured interior spacing. Evidence, settings and comparisons are separated with horizontal rules instead of nesting every region inside another card.

### Observation states and price history

State labels pair a small dot with meaningful text and semantic tone. Price history uses a blue linear trace, a subtle fading area fill and a distinct dashed target line. It does not animate or smooth the evidence. Detailed charts provide an accessible summary and native disclosure of all recorded prices as a dated table.

### Disclosures, dialogs and feedback

FAQ disclosures use native details/summary, a fine rule and a rotating Lucide chevron. Dialogs use native dialog, labelled title/description, Cancel as initial focus and platform Escape behavior. On mobile their actions become full-width and Cancel remains spatially separate. Feedback includes explicit text and alert/status semantics. Skeletons reserve content structure; busy actions describe the work.

### Motion

Interaction feedback uses 160ms color/border transitions; disclosure chevrons rotate over 160ms. Loading uses a one-second spinner and 1.6-second skeleton shimmer. Reduced motion removes animations and transitions and disables smooth scrolling. There is no decorative page choreography or continuous radar sweep.

### Voice

Use specific actions and natural shopper language. Explain uncertainty where it changes a decision. Product names, navigation, labels, badges and short headings have no decorative periods. Complete sentences retain punctuation. External-link indicators, back navigation and disclosure cues remain meaningful.

## Do's and Don'ts

### Do:
- **Do** use semantic CSS variables so every state retains the same role in both themes.
- **Do** keep price history, stock status and private/public boundaries explicit.
- **Do** use native controls and associated helper text; keep visible keyboard focus and task-specific confirmation labels.
- **Do** let mobile feed entries become compact lists and task forms use the available width.
- **Do** use Lucide SVG icons for meaningful actions and keep observation dots subordinate to text.

### Don't:
- **Don't** invent statistics, reviews, badges, retailer certainty or product capabilities.
- **Don't** add decorative punctuation to names, headings, controls or fragments.
- **Don't** add decorative arrows, emoji, glowing backgrounds or unrelated icon styles.
- **Don't** hide routine actions behind hover or use continuous radar sweeps and chart animation.
- **Don't** extend display type to task labels or replace accessible controls with clickable containers.

### References and use

Read [Taste](https://github.com/Leonxlnx/taste-skill) marketing/redesign guidance, [Impeccable](https://github.com/pbakaus/impeccable) product, craft, adaptation and copy guidance, and [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) token architecture. Reviewed the [21st navigation collection](https://21st.dev/community/components/s/navigation-menu) and [Abraham's disclosure example](https://21st.dev/@anubra266/components/accordion-1/accordion-tabs-w-plus-minus). Borrowed only the interaction idea of a visible disclosure indicator; the implementation uses original native details and Lucide chevrons, without copied component code or demo styles. Reviewed [Awesome UI tools](https://github.com/maxbogo/awesome-ai-tools-for-ui); used its listed skill/component resources, existing browser tools and local contrast calculations. No unavailable design service was claimed or installed.

### Coverage and verification

The completed route, interaction-state, theme and viewport checklist, performed checks and concrete limitations are recorded in [DESIGN_VERIFICATION.md](DESIGN_VERIFICATION.md). This design document describes durable shipped rules; it does not turn isolated visual-test fixture data into product claims.

