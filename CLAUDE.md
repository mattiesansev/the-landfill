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
