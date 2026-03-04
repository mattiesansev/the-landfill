# SF Parks Bracket — Voting Functionality Test Plan

This is a manual testing checklist for confirming reliable vote state, cross-device behavior, and UI accuracy.

---

## Prerequisites

- Two devices (or two browsers / an incognito window) for cross-device tests
- Access to `/bracket-admin` to control bracket state
- Supabase dashboard access to inspect raw table state (optional but useful for edge cases)
- Bracket is **unlocked** and **no active round** set before starting

---

## 1. Bracket Submission (Initial)

### 1.1 Basic Submission
- [ ] Fill out all 15 matchup picks on the bracket
- [ ] Click **Save** — confirm "Bracket saved!" alert
- [ ] Refresh the page — confirm all 15 picks are restored exactly
- [ ] Check Supabase `brackets` table: confirm 1 row exists with correct `user_id` and `picks` JSONB

### 1.2 Re-submission (Editing)
- [ ] Change 3–4 picks on an already-saved bracket
- [ ] Click **Save** — confirm "Bracket updated!" alert
- [ ] Refresh — confirm updated picks load correctly
- [ ] Check Supabase: confirm still only 1 row for this `user_id`, `submitted_at` updated, `first_submitted_at` unchanged

### 1.3 Incomplete Bracket
- [ ] Reset bracket (remove all picks)
- [ ] Confirm **Save** button is disabled
- [ ] Fill only 10/15 picks — confirm Save is still disabled
- [ ] Fill all 15 — confirm Save becomes enabled

### 1.4 Rapid Resubmission (Spam)
- [ ] Click Save 5 times quickly in succession
- [ ] Check Supabase: confirm only 1 row exists (UPSERT prevents duplicates)
- [ ] Confirm UI does not show an error state after rapid saves
- [ ] Check vote aggregate counts in Debug Stats — no vote inflation from spam clicks

---

## 2. Bracket Submission — Cross-Device

### 2.1 Independent Submissions
- [ ] Submit a bracket on **Device A** (picks favoring high seeds)
- [ ] Submit a bracket on **Device B** (picks favoring low seeds)
- [ ] Go to `/bracket-admin` → **Debug Stats** → confirm `Total Bracket Voters: 2`
- [ ] Confirm aggregate vote counts reflect both brackets (no overwrites)

### 2.2 Same User Across Sessions (Anonymous Auth)
- [ ] Note: anonymous sessions are device/browser-specific. Same person, different browser = different `user_id`
- [ ] Open same browser, clear localStorage/session storage, reload bracket
- [ ] Confirm the page treats this as a new user (no saved picks)
- [ ] Submit a new bracket — confirm voter count increases to 3

---

## 3. Per-Round Voting

### 3.1 Basic Round Vote
- [ ] In admin: set **Active Round** to "Round of 16"
- [ ] Navigate to **Round Voting** tab
- [ ] Vote on all 8 matchups
- [ ] Click **Submit Votes** — confirm success state
- [ ] Reload page — confirm submitted votes are still shown as your picks
- [ ] Check Supabase `round_votes` table: 8 rows for your `user_id`

### 3.2 Changing a Round Vote
- [ ] After submitting round votes, go back and change 2 picks
- [ ] Click **Submit Votes** again
- [ ] Check Supabase: confirm same 8 rows updated (upsert on `user_id, matchup_id`) — no duplicate rows
- [ ] Check `/bracket-admin` Debug Stats: vote counts for changed matchups reflect the new picks, not both

### 3.3 Round Vote from Second Device
- [ ] On Device B, also submit Round of 16 votes (different picks than Device A)
- [ ] Check admin Debug Stats: Round Votes section shows combined counts from both devices
- [ ] No cross-contamination between Device A and Device B picks

### 3.4 Voting on Wrong Round
- [ ] Set Active Round to "Quarterfinals" in admin
- [ ] Confirm Round Voting tab shows QF matchups, not R16
- [ ] Attempting to submit R16 votes via API directly should return an error (matchup doesn't belong to active round)

---

## 4. Vote Count UI Display

### 4.1 Progressive Reveal
- [ ] With **Active Round = null**: confirm no vote bars or winner badges appear anywhere on the bracket
- [ ] Set **Active Round = "quarterfinals"** in admin
- [ ] Confirm Round of 16 matchups now show vote bars and winner highlights
- [ ] Confirm Quarterfinal matchups still show user's bracket picks (no results)
- [ ] Set **Active Round = "semifinals"** — confirm QF results now revealed too
- [ ] Set **Active Round = "completed"** — confirm all rounds show results

### 4.2 Live UI Update After Vote Change
- [ ] Admin reveals R16 results (set active round to "quarterfinals")
- [ ] On Device A: open bracket page — note vote percentages for a matchup
- [ ] On Device B: change vote on that matchup and submit
- [ ] On Device A: refresh page — confirm vote percentages updated to reflect Device B's change
- [ ] Confirm no stale cache issue (vote bars show new numbers)

### 4.3 Winner Badge Accuracy
- [ ] Confirm parks with more votes show the ✓ winner indicator
- [ ] Confirm losing parks show reduced opacity (loser style)
- [ ] If user's bracket pick matches the actual winner: confirm **CORRECT** badge appears
- [ ] If user's bracket pick lost: confirm **INCORRECT** badge appears
- [ ] If the park a user picked didn't even advance to that slot (bracket mismatch): confirm no false "CORRECT" badge

---

## 5. Bracket Lock Behavior

### 5.1 Locking Prevents Submission
- [ ] Lock bracket in admin
- [ ] Attempt to submit/edit bracket — confirm error "Bracket is locked"
- [ ] Confirm **Save** button is hidden/disabled in UI
- [ ] Confirm **Reset** button is hidden/disabled in UI

### 5.2 Lock ≠ Results Visible
- [ ] Lock bracket but leave Active Round as null
- [ ] Confirm vote results are still hidden (lock only prevents new submissions)
- [ ] Unlock bracket — confirm users can edit again

### 5.3 Re-submission After Lock/Unlock Cycle
- [ ] Lock → Unlock → have user submit a new bracket
- [ ] Confirm the new submission is accepted and `first_submitted_at` preserves original date

---

## 6. Edge Cases

### 6.1 Tied Vote
- [ ] Use Debug Stats simulator to create a tie on a matchup (equal votes for both parks)
- [ ] Confirm no winner is declared (no ✓ badge, no loser opacity)
- [ ] In `/bracket-admin`: confirm the tied matchup appears under **Tie Breakers**
- [ ] Set an admin override for the tie — confirm winner now shows on bracket
- [ ] Remove override — confirm tie state returns

### 6.2 Zero Votes on a Matchup
- [ ] Reveal R16 results when some matchups have 0 votes
- [ ] Confirm no winner shown (no crash, no badge, no vote bars)
- [ ] Confirm empty vote bars don't show NaN% or 0%/0%

### 6.3 Partial Round Votes
- [ ] Submit votes on only 4/8 R16 matchups
- [ ] Reload — confirm those 4 are persisted and the other 4 are blank
- [ ] Submit the remaining 4 in a separate session — confirm all 8 now have your votes

### 6.4 No Internet / Supabase Offline
- [ ] Disable network (DevTools → Offline)
- [ ] Attempt to save a bracket — confirm graceful error, no white page
- [ ] Confirm the UI falls back to localStorage mock (if env vars are available, this won't apply)

### 6.5 Admin Page Without Supabase Env Vars
- [ ] Remove or blank out `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- [ ] Load any bracket page — confirm no white page (supabaseClient returns null gracefully)
- [ ] Confirm mock backend is used (votes stored in localStorage)
- [ ] `/bracket-admin` password check should auto-pass in mock mode

---

## 7. Admin Controls

### 7.1 Round Progression
- [ ] Progress through all rounds: R16 → QF → SF → Finals → Completed
- [ ] At each step confirm only the closed rounds have results visible
- [ ] Revert back one round — confirm results are re-hidden

### 7.2 Clear All Data
- [ ] Export a full backup first (Export Full Backup button)
- [ ] Click **Clear All Data** and confirm
- [ ] Check Debug Stats: Total Voters = 0, all vote counts = 0
- [ ] Check Supabase: `brackets` and `round_votes` tables empty

### 7.3 Export / Import CSV
- [ ] Export votes CSV
- [ ] Clear all data
- [ ] Import the CSV back
- [ ] Confirm vote counts match the original export

---

## 8. Supabase Table State Verification

Run these queries in Supabase SQL editor to verify expected state:

```sql
-- Total brackets submitted
SELECT COUNT(*) FROM brackets;

-- Duplicate check (should return 0 rows)
SELECT user_id, COUNT(*) FROM brackets GROUP BY user_id HAVING COUNT(*) > 1;

-- Round votes — duplicate check per user per matchup (should return 0)
SELECT user_id, matchup_id, COUNT(*) FROM round_votes
GROUP BY user_id, matchup_id HAVING COUNT(*) > 1;

-- Aggregate vote counts per matchup
SELECT * FROM get_aggregate_votes();

-- Per-round vote counts
SELECT * FROM get_per_round_votes();

-- Current config state
SELECT bracket_locked, active_round FROM config WHERE id = 1;

-- Any admin overrides
SELECT * FROM admin_overrides;
```

---

## Expected Database Guarantees

| Scenario | Expected behavior |
|---|---|
| Same user submits bracket twice | 1 row in `brackets` (upsert) |
| Same user votes on same matchup twice | 1 row in `round_votes` (upsert) |
| 100 rapid bracket saves | 1 row, `submitted_at` = last save |
| Vote count after changing pick | Old count decremented, new count incremented |
| Tie in combined votes | No winner returned by `get_combined_matchup_votes` |
| Admin override set | `admin_overrides` row; `getAllWinners` respects it |
