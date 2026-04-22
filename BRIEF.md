# ITS Prototype — Claude Code Brief

## What to build
A working web prototype of an Intelligent Tutoring System (ITS) for math intervention.
One complete student session for the standard: **division beyond known facts** (e.g. 48 ÷ 3, 85 ÷ 5).

React web app, tablet-first landscape (~1024×768).

All content — problems, tutor responses, and available tools — is driven by `content.json` in the project root. The app should read from this file so that future topics can be swapped in without touching the code.

---

## Global design rules — apply to every screen

### Typography
- Font: **DM Sans** (Google Fonts). Import via: `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap')`
- Weights: 400 regular, 500 medium, 700 bold only
- Apply `font-family: 'DM Sans', sans-serif` on all elements

### Colour palette
Fiona is purple. Everything around her should not be. The accent palette is warm and varied:

```css
/* Backgrounds */
--bg-outer: #2a2a3e;          /* outer surround — warm dark */
--bg-card: #fdf8ee;           /* card/panel background — warm off-white */
--bg-card-border: #e8dfc8;    /* card border */
--bg-fiona-panel: #3a3560;    /* Fiona's left column background */

/* Accent colours */
--amber: #ffe6ad;             /* warm yellow — hints, active states, chips */
--amber-dark: #7a5200;        /* text on amber */
--blue-soft: #d3e7f6;         /* story boxes, info chips */
--blue-dark: #1a4a6e;         /* text on blue-soft */
--green-soft: #cde5b8;        /* success states, mastery strip */
--green-dark: #2a5c1a;        /* text on green-soft */

/* Fiona's purple — only for her character and direct speech elements */
--purple: #534AB7;
--purple-light: #eeedfe;
--purple-border: #afa9ec;

/* Neutrals */
--navy: #1a1a2e;
--text-primary: #1a1a2e;
--text-muted: #5F5E5A;
--text-subtle: #888780;
--coral-bg: #FAECE7;
--coral-border: #F0997B;
--coral-dark: #712B13;
```

### Layout — all screens share this structure
Every screen (except Entry and Exit) uses the same **1/3 left + 2/3 right grid**:
- Left (1fr): Fiona's column, dark `#3a3560` background
- Right (2fr): content/workspace, warm off-white `#fdf8ee`

---

## Fiona character (placeholder)
Fiona's SVG assets are not yet available. Use a simple placeholder in her column:
- A rounded rectangle in `--purple` with the letter "F" centered in white
- Size: ~110px wide, proportional height
- She should occupy the same position in all screens so the layout feels consistent
- Four named states to wire up later: `neutral`, `neutral-2`, `gesturing`, `happy`
- For now all states render the same placeholder — just make the state prop available

---

## Screen 1 — Entry card

Centered card (max-width 460px) on `#2a2a3e` background.

**Card top** (`#3a3560` background):
- Fiona placeholder (neutral, ~110px wide) bottom-aligned left
- Right of Fiona: "Extra practice" tag pill + speech bubble: *"I've got something for us to work on."*

**Card body** (`#fdf8ee`):
- Topic row: amber `#ffe6ad` icon with ÷ symbol + topic name and grade pulled from `content.json`
- Three chips in a row: amber "A short story to work through" / blue-soft "Some problems to solve" / green-soft "Fiona to help if you get stuck"
- "Let's go" button — dark navy `#1a1a2e`, full width

---

## Screen 2 — Comic walkthrough (placeholder)

Same 1/3 + 2/3 grid. This screen is a **placeholder only** for now.

**Left panel** (`#3a3560`):
- "Story · Division" badge
- Fiona placeholder
- Speech bubble: *"We'll walk through this together."*

**Right panel** (`#fdf8ee`):
- Centered message: *"Interactive comic coming soon."*
- A "Start problems →" button that navigates directly to Screen 3

This screen should be fully wired into navigation so it can be built out later without structural changes.

---

## Screen 3 — Practice screen

### Layout
1/3 left Fiona column + 2/3 right workspace.

**Left panel** (`#3a3560`):
- "Practice · Division" badge (top)
- Fiona speech bubble — updates based on student state
- Fiona placeholder fills remaining height, bottom-anchored
- 5 progress pips at bottom (green=correct, amber=active, dim=upcoming)

**Right panel** (`#fdf8ee`, padding 20px 22px):
- Problem label ("Problem X of 5") + 5-dot score indicator (row, space-between)
- Story box (`#d3e7f6` background, `#1a4a6e` text): short word problem context (static placeholder text for now — e.g. *"Fiona has 48 stickers to share equally between 3 friends."*)
- Problem display: large numerals `48 ÷ 3 = [input]` (44px, DM Sans 500)
- Feedback box (appears after submission — green-soft for correct, coral for wrong)
- Tool bar: **Hint** button + **Open Toolbox** button + **Check answer** button (navy)

### Tutor response logic
All responses come from `content.json` — no API calls.

On answer submission:
1. If correct → show `tutor_responses.correct` in Fiona's bubble, green feedback box
2. If answer matches a key in `tutor_responses.common_wrong` → show that specific response
3. Otherwise → show `tutor_responses.generic_wrong`

Input border turns coral on wrong answer. Fiona's bubble updates with the response.

### Hint behaviour
When student clicks Hint:
- Fiona's speech bubble changes to hint text (pulled from `content.json` — add a `hint` field per problem: a one-sentence Socratic nudge in Fiona's voice)
- Bubble background turns amber (`#ffe6ad`) to signal hint mode
- Hint button shows as active/pressed
- No second Fiona appears — the left panel Fiona IS the hint
- Pressing Hint again returns bubble to default

### Fiona states
- Default/waiting: neutral
- Hint active: gesturing (placeholder looks the same for now — wire the state)
- Wrong answer: neutral-2
- Correct: happy

---

## Manipulative Toolbox — slide-out drawer

A drawer that slides in from the **right side** of the screen, overlaying the workspace partially.

### Trigger
"Open Toolbox" button in the practice toolbar. Pressing again closes it.

### Drawer design
- Width: ~320px
- Background: `#fdf8ee`, left border: 2px solid `#e8dfc8`
- Header: "Tool Box" label + close (×) button
- Tool list: vertical stack of tool cards, each with a name and icon
- Active tool expands inline within the drawer to show the manipulative

### Tools (read from `content.json` → `tools_enabled`)
Build these two tools for now:

**1. Base-10 blocks**
- Represent the dividend in base-10 (e.g. 48 = 4 rods + 8 units)
- Tens rods: purple-bordered stacks of 10 cells (16×16px each, `#7f77dd` fill, `#afa9ec` border)
- Ones units: borderless orange cells (`#f0997b`)
- 3 group zones below (dashed border), labelled Group 1 / 2 / 3
- Drag rods or units into group zones
- Running count shown in each group zone
- When all groups are equal and correct: show success state, "I've got it" button closes drawer and focuses answer input
- Click a rod → popover: "Split into 10 ones" / "Cancel"

**2. Number line**
- Horizontal number line from 0 to the dividend
- Student can tap to place a marker and count jumps
- Shows jump count and current position
- Simple interaction: click to place/move marker, arrow buttons to step forward/back

### Drawer behaviour
- Drawer slides in over the right panel (does not push content)
- Only one tool is active/expanded at a time
- Closing the drawer preserves tool state for the current problem
- Tool state resets on next problem

---

## Screen 4 — Exit screen

One screen, two states. Same card layout as entry (centered, max-width 500px).

**Card top:** Fiona placeholder + speech bubble. Background colour changes by outcome.

### Mastery state (4/5 correct in session)
- Top background: dark green `#2a4a30`
- Bubble (green-soft `#cde5b8`): *"That chunking strategy is yours now."*
- Headline: **"You got it."**
- Body: *"Working through division like that takes real thinking. The strategy of breaking numbers into chunks — that's one you'll keep using."*
- Score strip (green-soft): label "TODAY'S SESSION", score dots, *"X out of 5 — you've got this standard."*
- Button (dark navy): "Done for now"

### Needs-help state
- Top background: `#3a3560`
- Bubble (white): *"This one needs a bit more time. That's fine."*
- Headline: **"Good work today, mathematician."**
- Body: *"Division with bigger numbers is genuinely hard. You worked through some tricky problems — that counts. Come back to this one and it'll start to click."*
- Score strip (amber `#ffe6ad`): label "TODAY'S SESSION", score dots, *"X out of 5. Keep practising — you're building the foundations."*
- Button (dark navy): "Back to the start"

---

## Session state
```javascript
{
  currentProblem: 0,
  results: [],
  rollingWindow: [],       // last 5 results
  errorCounts: {},
  sessionCeiling: 12,
  totalAttempted: 0
}
```
Mastery: 4/5 correct in session → exit with `outcome: 'mastery'`
Ceiling hit (12 attempts): → exit with `outcome: 'needs-help'`

---

## Navigation
React state routing. Four routes: `entry → comic → practice → exit`.

Include a **dev nav strip** at the top (small, low-contrast) for jumping directly to any screen during testing.

---

## content.json structure
The app reads from `content.json` at the project root. Expected shape:
```json
{
  "topic": "Division Beyond Known Facts",
  "grade": 3,
  "tutor_name": "Fiona",
  "tools_enabled": ["base10_blocks", "number_line"],
  "problems": [
    {
      "id": 1,
      "dividend": 48,
      "divisor": 3,
      "answer": 16,
      "hint": "...",
      "word_problem": "...",
      "tutor_responses": {
        "correct": "...",
        "generic_wrong": "...",
        "common_wrong": {
          "12": "...",
          "24": "..."
        }
      }
    }
  ]
}
```

Place `content.json` in `/public/content.json` so Vite serves it statically. Fetch it on app load with `useEffect`.

---

## What this prototype does NOT need
- Auth, accounts, or teacher dashboard
- Multiple topics (the JSON structure supports it — the UI doesn't need to yet)
- Database or persistence
- Any live API calls — all tutor responses are pre-written in content.json
- Mobile/portrait layout
- Accessibility (post-prototype)

---

## Build order
1. Design tokens / global CSS (DM Sans, colour vars)
2. Load and parse `content.json` on app start
3. Entry card
4. Exit screen — both states
5. Wire session state + navigation + dev nav
6. Practice screen shell — layout, static content, answer input
7. Tutor response logic (correct / common_wrong / generic_wrong lookup)
8. Hint behaviour (Fiona bubble only)
9. Toolbox drawer — shell + tool cards
10. Base-10 blocks tool
11. Number line tool
12. Comic placeholder screen

## If you hit a usage limit
Write `PROGRESS.md` before stopping — what's built, what works, what remains. Leave TODO comments at the stopping point. Read `PROGRESS.md` first on resume.
