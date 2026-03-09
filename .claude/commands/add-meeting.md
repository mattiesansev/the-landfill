# Add New Board of Supervisors Meeting

Add a new SF Board of Supervisors meeting to the supervisor updates page.

**Usage:** `/add-meeting /path/to/minutes.pdf`

The argument `$ARGUMENTS` is the path to the meeting minutes PDF.

---

## Steps

### 1. Extract the PDF

Run the extraction script on the provided PDF path:

```bash
cd /Users/mattiesanseverino/Code/the-landfill/scripts
python extract_minutes.py $ARGUMENTS -o /tmp/extracted_minutes.json --pretty
```

Read `/tmp/extracted_minutes.json` after extraction.

### 2. Determine the meeting date

From the extracted JSON, get `meeting.date` (format: `YYYY-MM-DD`) and `meeting.display_date` if present. If `display_date` is missing, derive it from the date (e.g. "2026-03-04" → "March 4, 2026").

Check whether `public/votes/{date}.json` already exists. If it does, confirm with the user before overwriting.

### 3. Select important votes

From `votes[]` in the extracted JSON, select 5–15 important votes using these criteria:

**Prioritize:**
- Non-unanimous votes (noes > 0 or `is_unanimous: false`) — most interesting
- High fiscal impact items (large dollar amounts)
- Charter amendments and ballot measures (`ORDERED SUBMITTED`)
- Policy changes with citywide effect
- Items that appeared contentious (severed from consent agenda)

**Skip:**
- Consent agenda items (`is_consent_agenda: true`) unless severed or contentious
- Routine ceremonial resolutions (commendations, recognitions)
- Approval of previous meeting minutes
- Purely procedural motions

### 4. Create the vote JSON file

Create `public/votes/{YYYY-MM-DD}.json` with this exact structure:

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
      "title": "Short descriptive title (under 80 chars)",
      "description": "1-2 sentence plain-English summary of what the legislation does and why it matters",
      "action": "FINALLY PASSED|ADOPTED|PASSED ON FIRST READING|APPROVED|ORDERED SUBMITTED|ADOPTED AS AMENDED|CONTINUED",
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

**Writing descriptions:** Write in plain English for a general audience. Include:
- What the item does concretely (dollar amounts, timeframes, scope)
- Why it's notable or what it changes
- Keep to 1–3 sentences

**Vote data mapping from extracted JSON:**
- `file_number` → from `votes[].file_number`
- `title` → from `votes[].title` (rewrite to be concise and descriptive if needed)
- `description` → from `votes[].description` (rewrite in plain English if needed)
- `action` → from `votes[].action`
- `vote.ayes_names` → from `votes[].vote.ayes_names`
- `vote.noes_names` → from `votes[].vote.noes_names`
- `vote.excused` → from `votes[].vote.excused`
- `sponsors.primary` → from `votes[].sponsors.primary`
- `sponsors.co_sponsors` → from `votes[].sponsors.co_sponsors`

### 5. Update MEETING_DATES

Edit `src/pages/posts/SupervisorUpdates.jsx` and add the new date to the top of the `MEETING_DATES` array:

```javascript
const MEETING_DATES = [
  { date: "YYYY-MM-DD", display: "Month DD, YYYY" },  // ← insert here
  { date: "2026-02-10", display: "February 10, 2026" },
  // ... existing entries
];
```

### 6. Verify the build

```bash
npm run build --prefix /Users/mattiesanseverino/Code/the-landfill
```

Fix any errors before finishing. Report the new meeting date and number of votes added to the user.
