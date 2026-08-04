# Reinstating the SF Park Madness bracket feature

This folder contains the full "SF Park Madness" bracket feature, removed from
the public site on `archive/park-madness` (see git log for the removal
commit). Nothing was deleted — files were moved here with `git mv`, so file
history is preserved and `git log --follow` on any file in this archive will
show its pre-archive history.

## What's here

```
archive/park-madness/
├── pages/
│   ├── BracketAdmin.jsx              -> was src/pages/BracketAdmin.jsx
│   └── posts/
│       ├── ParksBracket.jsx          -> was src/pages/posts/ParksBracket.jsx
│       └── parksBracket/             -> was src/pages/posts/parksBracket/
├── services/
│   ├── bracketVoteService.js         -> was src/services/bracketVoteService.js
│   └── api/                          -> was src/services/api/
│       ├── bracketApi.js
│       ├── index.js
│       ├── mockBracketApi.js
│       ├── realBracketApi.js
│       └── supabaseClient.js
└── img/
    └── park_madness_drawing.png      -> was src/img/park_madness_drawing.png
```

## Steps to bring it back

1. **Move the files back** (use `git mv` to keep history):
   ```bash
   git mv archive/park-madness/pages/BracketAdmin.jsx src/pages/BracketAdmin.jsx
   git mv archive/park-madness/pages/posts/ParksBracket.jsx src/pages/posts/ParksBracket.jsx
   git mv archive/park-madness/pages/posts/parksBracket src/pages/posts/parksBracket
   git mv archive/park-madness/services/bracketVoteService.js src/services/bracketVoteService.js
   git mv archive/park-madness/services/api src/services/api
   git mv archive/park-madness/img/park_madness_drawing.png src/img/park_madness_drawing.png
   ```

2. **Restore the routes in `src/App.jsx`**:
   - Re-add imports:
     ```js
     import ParksBracket from "./pages/posts/ParksBracket"
     import BracketAdmin from "./pages/BracketAdmin"
     ```
   - Re-add route entries inside the `Layout` children array:
     ```js
     {
       path: "/post/sf-parks-bracket",
       element: <ParksBracket />
     },
     {
       path: "/bracket-admin",
       element: <BracketAdmin />
     },
     ```

3. **Restore the homepage card in `src/pages/Home.jsx`**:
   - Re-add the import:
     ```js
     import parkMadnessCover from "../img/park_madness_drawing.png"
     ```
   - Re-add the entry to the `posts` array:
     ```js
     {
       id: "sf-parks-bracket",
       title: "SF Park Madness",
       desc: "A bracket-based competition featuring 16 SF Parks. Vote for winners each week until we name a champion!",
       img: parkMadnessCover,
       authors: [authors.mattie],
       category: CATEGORIES.FIELD_NOTES
     },
     ```

4. **Restore the bracket CSS in `src/style.scss`**: pull the removed rules back
   from git history — find the commit that archived this feature
   (`git log --oneline -- src/style.scss`) and check out the previous version
   of the relevant blocks with `git show <commit>^:src/style.scss`, or `git
   diff <commit>^ <commit> -- src/style.scss` to see exactly what was removed
   and re-apply it. The removed selectors included (non-exhaustive):
   `.bracket-callout`, `.bracket-section`, `.bracket-wrapper`,
   `.bracket-container`, `.bracket-side`, `.bracket-round`, `.bracket-center`,
   `.matchup-card`, `.park-card`, `.champion-display`,
   `.bracket-action-buttons`, `.reset-bracket-btn`, `.save-bracket-btn`,
   `.stats-comparison-overlay`, `.park-detail-overlay`, `.park-detail-modal`,
   `.comparison-header`, `.comparison-stats`, `.comparison-blurbs`,
   `.park-stats-section`, mobile bracket layout rules, `.live-results-banner`,
   `.build-bracket-banner`, `.bracket-view-toggle`, `.display-mode-toggle`,
   `.bracket-submit-panel`, `.vote-results-overlay`,
   `.matchup-card`/`.park-card` voting-state variants, `.admin-panel*`,
   `.round-voting-section`, `.round-vote-card`, `.round-vote-btn`,
   `.round-selector`, `.active-round-info`, and `.bracket-admin-*`. **Do not**
   restore `.view-toggle`/`.view-toggle-btn` from that diff as a duplicate —
   that block is shared with `SupervisorUpdates.jsx` and was intentionally
   left in place in `src/style.scss`.

5. **Dependencies / env vars** — these were left untouched during the archive,
   so they should already be in place:
   - `@supabase/supabase-js` is still listed in `package.json`.
   - `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` should still be set in
     Netlify (site `data-dump` / bayareadatadump.com) and in local `.env`.
   - Supabase project: `https://xlgqsmhrurrsdoqttgpa.supabase.co`. Confirm the
     project (and its tables/RLS policies) is still live before reinstating —
     it may have been paused or the schema may have drifted since archiving.

6. **Verify**: run `npm run build` (or `yarn build`), then click through
   `/post/sf-parks-bracket` and `/bracket-admin` locally before deploying.

See the root `CLAUDE.md` file's "SF Parks Bracket Feature" section for full
architecture notes (progressive reveal system, key design decisions, common
gotchas) — that documentation was left in place and still applies.
