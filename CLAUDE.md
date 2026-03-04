# The Landfill - Claude Code Instructions

## Project Overview

This is a React website for San Francisco civic data journalism. It includes weekly recaps of SF Board of Supervisors meetings showing how each supervisor voted on important legislation.

## Adding Weekly Supervisor Meeting Minutes

When the user asks to add a new Board of Supervisors meeting to the website, follow these steps:

### Step 1: Extract Data from PDF (if using the script)

If the user provides a path to a meeting minutes PDF, you can use the extraction script:

```bash
cd scripts
python extract_minutes.py /path/to/minutes.pdf -o extracted.json --pretty
```

However, the script output needs transformation to match the website format (see Step 2).

### Step 2: Create the Vote JSON File

Create a JSON file at `public/votes/{YYYY-MM-DD}.json` with this exact structure:

```json
{
  "meeting": {
    "date": "YYYY-MM-DD",
    "display_date": "Month DD, YYYY"
  },
  "supervisors": [
    { "district": 1, "lastName": "Chan", "fullName": "Connie Chan", "image": "/img/supervisors/connie_chan.png" },
    { "district": 2, "lastName": "Sherrill", "fullName": "Stephen Sherrill", "image": "/img/supervisors/D02-Stephen_Sherrill_2025_roster.png" },
    { "district": 3, "lastName": "Sauter", "fullName": "Danny Sauter", "image": "/img/supervisors/D03-Danny_Sauter_2025_roster.png" },
    { "district": 4, "lastName": "Wong", "fullName": "Alan Wong", "image": "/img/supervisors/D04-Alan_Wong_2025_roster.png" },
    { "district": 5, "lastName": "Mahmood", "fullName": "Bilal Mahmood", "image": "/img/supervisors/D05-Bilal_Mahmood_2025_roster.png" },
    { "district": 6, "lastName": "Dorsey", "fullName": "Matt Dorsey", "image": "/img/supervisors/matt_dorsey_roster92622.png" },
    { "district": 7, "lastName": "Melgar", "fullName": "Myrna Melgar", "image": "/img/supervisors/D07-Myrna_Melgar_2025_roster.png" },
    { "district": 8, "lastName": "Mandelman", "fullName": "Rafael Mandelman", "image": "/img/supervisors/D08-Rafael_Mandelman_2025_roster.png" },
    { "district": 9, "lastName": "Fielder", "fullName": "Jackie Fielder", "image": "/img/supervisors/D09-Jackie-Fielder_2025_roster.png" },
    { "district": 10, "lastName": "Walton", "fullName": "Shamann Walton", "image": "/img/supervisors/D10-Shamann_Walton_2025_roster.png" },
    { "district": 11, "lastName": "Chen", "fullName": "Chyanne Chen", "image": "/img/supervisors/D11-Chyanne_Chen_2025_roster.png" }
  ],
  "importantVotes": [
    {
      "file_number": "XXXXXX",
      "title": "Short descriptive title",
      "description": "Longer description of what the legislation does",
      "action": "FINALLY PASSED|ADOPTED|PASSED ON FIRST READING|APPROVED|etc.",
      "vote": {
        "ayes_names": ["LastName1", "LastName2"],
        "noes_names": ["LastName3"],
        "excused": ["LastName4"]
      },
      "sponsors": {
        "primary": "LastName or Mayor or null",
        "co_sponsors": ["LastName1", "LastName2"]
      }
    }
  ]
}
```

### Step 3: Select Important Votes

From the meeting minutes, select votes that are:
- **Contentious** (not unanimous 11-0 votes) - these are the most interesting
- **High impact** (large budget items, charter amendments, policy changes)
- **Newsworthy** (relates to current events, controversial topics)

Skip routine items like:
- Unanimous consent agenda items
- Approval of previous meeting minutes
- Routine appointments (unless notable)
- Procedural motions

Aim for 5-15 important votes per meeting.

### Step 4: Update the Meeting Dates List

Edit `src/pages/posts/SupervisorUpdates.jsx` and add the new date to the `MEETING_DATES` array at the TOP (newest first):

```javascript
const MEETING_DATES = [
  { date: "YYYY-MM-DD", display: "Month DD, YYYY" },  // Add new date here
  { date: "2026-02-03", display: "February 3, 2026" },
  // ... existing dates
];
```

### Step 5: Verify the Build

Run the build to ensure no errors:

```bash
npm run build
```

## Vote Action Types

Common action types from meeting minutes:
- `FINALLY PASSED` - Ordinance passed on second/final reading
- `PASSED ON FIRST READING` - Ordinance passed first reading, needs second
- `ADOPTED` - Resolution adopted
- `ADOPTED AS AMENDED` - Resolution adopted with amendments
- `APPROVED` - Motion approved
- `ORDERED SUBMITTED` - Charter amendment ordered to ballot
- `CONTINUED` - Item continued to future meeting

## Current Supervisors (2025-2026)

| District | Name | lastName |
|----------|------|----------|
| 1 | Connie Chan | Chan |
| 2 | Stephen Sherrill | Sherrill |
| 3 | Danny Sauter | Sauter |
| 4 | Alan Wong | Wong |
| 5 | Bilal Mahmood | Mahmood |
| 6 | Matt Dorsey | Dorsey |
| 7 | Myrna Melgar | Melgar |
| 8 | Rafael Mandelman | Mandelman |
| 9 | Jackie Fielder | Fielder |
| 10 | Shamann Walton | Walton |
| 11 | Chyanne Chen | Chen |

## File Locations

- Vote JSON files: `public/votes/{YYYY-MM-DD}.json`
- Supervisor images: `public/img/supervisors/`
- Main component: `src/pages/posts/SupervisorUpdates.jsx`
- Weekly report page: `src/pages/posts/WeeklyReport.jsx`
- Vote card component: `src/components/votes/VoteCard.jsx`
- Extraction script: `scripts/extract_minutes.py`

## Reading Meeting Minutes PDF

When reading a meeting minutes PDF, look for these sections:
1. **Roll Call** - Who was present/absent
2. **Regular Agenda / Unfinished Business** - Main votes with recorded vote counts
3. **New Business** - First reading items
4. **For Adoption Without Committee Reference** - Usually ceremonial resolutions

Vote format in minutes typically looks like:
```
FINALLY PASSED by the following vote:
Ayes: 9 - Chan, Chen, Dorsey, Mahmood, Mandelman, Melgar, Sauter, Sherrill, Wong
Noes: 2 - Fielder, Walton
```

---

## SF Parks Bracket Feature (Branch: `park-madness`)

A 16-park single-elimination bracket tournament for SF parks. Users fill out a bracket predicting winners, then per-round community voting determines actual outcomes.

### Architecture

- **Backend**: Supabase (PostgreSQL + RLS + anonymous auth). Falls back to localStorage mock when env vars are missing.
- **Deployment**: Netlify (site: `data-dump` / bayareadatadump.com). Env vars `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set in Netlify.
- **Supabase project URL**: `https://xlgqsmhrurrsdoqttgpa.supabase.co`

### Key Files

| File | Purpose |
|------|---------|
| `src/pages/posts/parksBracket/useBracketVoting.js` | Core hook: all voting state, display gating, progressive reveal logic |
| `src/pages/posts/parksBracket/BracketContainer.jsx` | Main bracket UI, desktop + mobile layouts, `getMatchupVotingProps` |
| `src/pages/posts/parksBracket/MatchupCard.jsx` | Single matchup card: displays parks, winner highlight, votes, badges |
| `src/pages/posts/parksBracket/ParkCard.jsx` | Individual park in a matchup: winner/loser/user-pick styling |
| `src/pages/posts/parksBracket/AdminPanel.jsx` | Admin controls: lock/unlock, round-selector, tie breakers, overrides |
| `src/pages/posts/parksBracket/RoundVoting.jsx` | Per-round voting UI (active when a round is selected) |
| `src/pages/posts/parksBracket/bracketData.js` | Static data: `PARKS`, `INITIAL_BRACKET`, `BRACKET_PROGRESSION` |
| `src/pages/posts/parksBracket/useBracketState.js` | Visual bracket state management (tracks selections for rendering) |
| `src/services/api/bracketApi.js` | API router: picks real vs mock based on env vars |
| `src/services/api/realBracketApi.js` | Supabase API implementation |
| `src/services/api/mockBracketApi.js` | localStorage mock API |
| `src/services/api/supabaseClient.js` | Supabase client init + anonymous auth |
| `src/services/bracketVoteService.js` | Re-exports from bracketApi for backward compat |
| `src/style.scss` | All styles including bracket, park-card voting states, admin panel |

### Progressive Reveal System

Results (CORRECT/INCORRECT badges, vote bars) are **only shown for rounds that the admin has progressed past** via the round-selector in AdminPanel.

**How it works (in `useBracketVoting.js`):**

1. `activeRound` — admin-controlled, stored in Supabase config. Values: `null`, `"round16"`, `"quarterfinals"`, `"semifinals"`, `"finals"`, `"completed"`.
2. `isRoundClosedLocal(roundKey)` — a round is closed when `activeRound` is past it, or when `activeRound === "completed"`. **NOT** tied to `isLocked` (locking only prevents bracket submissions).
3. `viewingPhase` — auto-derived from `activeRound`:
   - `activeRound === "completed"` → `"complete"` (all revealed)
   - `activeRound === null` → `"preRound"` (nothing revealed)
   - Otherwise → last closed round (e.g., QF active → R16 revealed)
4. `isRoundRevealedByPhase(roundKey)` — returns true if round should show results given current phase.
5. Three gating functions check both `isRoundClosedLocal` AND `isRoundRevealedByPhase`:
   - `doesUserPickMatch(matchupId)` → returns `true`/`false`/`null`
   - `getVotesForMatchup(matchupId)` → returns votes object or `null`
   - `getDisplayWinner(matchupId)` → returns actual winner or user's pick
6. `shouldShowResults(matchupId)` — exported for BracketContainer to set per-matchup `displayMode`.

**Admin round progression example:**
| Admin sets activeRound to | R16 results | QF results | SF results | Finals results |
|---|---|---|---|---|
| `"round16"` | hidden | hidden | hidden | hidden |
| `"quarterfinals"` | shown | hidden | hidden | hidden |
| `"semifinals"` | shown | shown | hidden | hidden |
| `"finals"` | shown | shown | shown | hidden |
| `"completed"` | shown | shown | shown | shown |

### Key Design Decisions

- **`isLocked` is independent from result visibility.** Locking prevents bracket submissions/edits. Result visibility is controlled solely by `activeRound` progression.
- **`displayMode` is per-matchup** in `BracketContainer.getMatchupVotingProps`: `shouldShowResults(matchupId) ? "results" : "user"`. Unrevealed matchups show user's bracket picks; revealed matchups show actual results.
- **`MatchupCard.displayWinner` validates `actualWinner`** against displayed parks (`parkA`/`parkB`). This prevents a "CORRECT!" badge from appearing when the user's predicted park didn't actually advance to that round (the `doesUserPickMatch` validParks check catches this as a wrong pick, but the old code still highlighted it as a winner).
- **Bracket view always shows user's predicted parks** in each matchup slot (from `useBracketState`), not the actual parks that advanced. The results overlay (badges, vote bars) is layered on top.

### Uncommitted Changes (as of session end)

All changes are on the `park-madness` branch, unstaged. Key modifications:
- `useBracketVoting.js` — progressive reveal logic, decoupled `isLocked` from round closure/reveal, added `shouldShowResults` export
- `BracketContainer.jsx` — per-matchup `displayMode`, removed ProgressStepper UI (was briefly added then removed per user request — stepper controls belong in AdminPanel, not user-facing)
- `MatchupCard.jsx` — `actualWinnerIsDisplayed` guard on `displayWinner`
- `AdminPanel.jsx` — added "Completed" to round-selector
- `supabaseClient.js` — guarded `createClient` when env vars missing (fixed white page bug)
- `style.scss` — removed `.progress-stepper` styles

### Common Gotchas

- **White page on deploy**: If Supabase env vars are missing, `supabaseClient.js` must NOT call `createClient('')`. The guard `supabaseUrl && supabaseAnonKey ? createClient(...) : null` prevents this.
- **`getActualMatchupParks` vs `actualWinners`**: These can disagree. `actualWinners` is from aggregate/per-round votes (who users voted for). `getActualMatchupParks` traces actual bracket progression from feeding matchup winners. For later rounds, a park might "win" in votes but not have actually advanced. Always validate `actualWinner` against the displayed parks before using it.
- **Admin auth**: AdminPanel requires a password stored in Supabase `bracket_config.admin_password_hash`. The `getConfigData` query must select only `bracket_locked, active_round` — never `admin_password_hash`.
