# SF Board of Supervisors Meeting Minutes Extractor

A Python CLI tool to extract structured data from SF Board of Supervisors meeting minutes PDFs.

## Installation

```bash
cd scripts
pip install -r requirements.txt
```

## Usage

```bash
# Output JSON to stdout
python extract_minutes.py /path/to/minutes.pdf

# Output JSON to file (pretty printed)
python extract_minutes.py /path/to/minutes.pdf -o output.json --pretty

# Output CSV (for spreadsheets)
python extract_minutes.py /path/to/minutes.pdf -c votes.csv

# Output Markdown summary (for blog posts)
python extract_minutes.py /path/to/minutes.pdf -m recap.md

# All formats at once
python extract_minutes.py /path/to/minutes.pdf -o output.json -c votes.csv -m recap.md
```

### Options

| Flag | Description |
|------|-------------|
| `-o, --output` | Output JSON file path |
| `-c, --csv` | Output CSV file path (votes only) |
| `-m, --markdown` | Output markdown summary file path |
| `--pretty` | Pretty print JSON output |
| `-q, --quiet` | Suppress progress messages |

## JSON Output Structure

```json
{
  "meeting": {
    "date": "2025-12-16",
    "day_of_week": "Tuesday",
    "start_time": "2:03 PM",
    "end_time": "4:49 PM",
    "location": "Legislative Chamber, Room 250, City Hall",
    "type": "Regular Meeting"
  },

  "members": {
    "present": ["Chan", "Chen", "Dorsey", ...],
    "absent": [],
    "president": "Mandelman"
  },

  "votes": [
    {
      "file_number": "250929",
      "title": "Business and Tax Regulations Code - Extending Suspension of Cannabis Business Tax",
      "description": "Ordinance amending the Business and Tax Regulations Code...",
      "type": "Ordinance",
      "action": "FINALLY PASSED",
      "sponsors": {
        "primary": "Mandelman",
        "co_sponsors": ["Dorsey", "Sauter", "Mahmood"]
      },
      "vote": {
        "ayes": 8,
        "noes": 3,
        "ayes_names": ["Chen", "Dorsey", "Fielder", "Mahmood", "Mandelman", "Melgar", "Sauter", "Sherrill"],
        "noes_names": ["Chan", "Walton", "Wong"],
        "excused": []
      },
      "is_unanimous": false,
      "fiscal_impact": true,
      "first_reading_noes": ["Chan", "Walton"],
      "is_consent_agenda": false,
      "committee": "Budget and Finance"
    }
  ],

  "consent_agenda": {
    "items": ["251123", "251124", "251078"],
    "vote": {
      "ayes": 11,
      "noes": 0,
      "ayes_names": ["Chan", "Chen", ...],
      "noes_names": [],
      "excused": []
    }
  },

  "grouped_votes": [
    ["250001", "250002", "250003"]
  ],

  "severed_items": [
    {
      "file_number": "251228",
      "severed_by": "Chan"
    }
  ],

  "notable_events": {
    "commendations": [
      {
        "presenter": "Fielder",
        "honoree": "Cameo House",
        "accepted_by": "Charity Harris",
        "description": "Recognition for providing residential alternative to incarceration"
      }
    ],
    "mayors_appearance": {
      "topic": "Fentanyl State of Emergency Ordinance",
      "questioner": "Mahmood",
      "summary": null
    },
    "appeals": [],
    "amendments": [
      {
        "file_number": "251228",
        "amendment_type": "AN AMENDMENT OF THE WHOLE..."
      }
    ]
  },

  "public_comment_summary": [
    {
      "speaker": "Dennis Williams",
      "topic": "Mayor's housing policies"
    }
  ]
}
```

### Field Descriptions

#### `meeting`
| Field | Type | Description |
|-------|------|-------------|
| `date` | string | Meeting date (YYYY-MM-DD) |
| `day_of_week` | string | Day of the week |
| `start_time` | string | Meeting start time |
| `end_time` | string | Meeting end time |
| `location` | string | Meeting location |
| `type` | string | "Regular Meeting", "Special Meeting", or "Closed Session" |

#### `members`
| Field | Type | Description |
|-------|------|-------------|
| `present` | array | List of supervisor last names who were present |
| `absent` | array | List of supervisor last names who were absent |
| `president` | string | Board president's last name |

#### `votes[]`
| Field | Type | Description |
|-------|------|-------------|
| `file_number` | string | 6-digit file number (e.g., "250929") |
| `title` | string | Short title from brackets |
| `description` | string | Full description (truncated to 500 chars) |
| `type` | string | "Ordinance", "Resolution", "Motion", "Hearing", or "Unknown" |
| `action` | string | "ADOPTED", "FINALLY PASSED", "PASSED ON FIRST READING", "APPROVED", "CONTINUED", etc. |
| `sponsors.primary` | string | Primary sponsor's last name |
| `sponsors.co_sponsors` | array | List of co-sponsor last names |
| `vote.ayes` | int | Number of yes votes |
| `vote.noes` | int | Number of no votes |
| `vote.ayes_names` | array | List of supervisors who voted yes |
| `vote.noes_names` | array | List of supervisors who voted no |
| `vote.excused` | array | List of supervisors excused from voting |
| `is_unanimous` | bool | True if all present members voted yes |
| `fiscal_impact` | bool | True if item has fiscal impact notation |
| `first_reading_noes` | array | Supervisors who voted no on first reading (for ordinances) |
| `is_consent_agenda` | bool | True if item was part of consent agenda |
| `committee` | string | Originating committee name |

## CSV Output

The CSV output contains one row per vote with these columns:

| Column | Description |
|--------|-------------|
| `meeting_date` | Meeting date (YYYY-MM-DD) |
| `file_number` | 6-digit file number |
| `title` | Item title |
| `type` | Ordinance, Resolution, Motion, etc. |
| `action` | Vote action taken |
| `ayes` | Number of yes votes |
| `noes` | Number of no votes |
| `ayes_names` | Comma-separated list of yes voters |
| `noes_names` | Comma-separated list of no voters |
| `excused` | Comma-separated list of excused members |
| `is_unanimous` | True/False |
| `primary_sponsor` | Primary sponsor name |
| `co_sponsors` | Comma-separated list of co-sponsors |
| `fiscal_impact` | True/False |
| `description` | Item description (truncated) |

## Current Supervisors (2025)

The parser recognizes these supervisor last names:

- Chan (Connie Chan)
- Chen (Chyanne Chen)
- Dorsey (Matt Dorsey)
- Fielder (Jackie Fielder)
- Mahmood (Bilal Mahmood)
- Mandelman (Rafael Mandelman)
- Melgar (Myrna Melgar)
- Sauter (Danny Sauter)
- Sherrill (Stephen Sherrill)
- Walton (Shamann Walton)
- Wong (Alan Wong)

## Project Structure

```
scripts/
├── extract_minutes.py      # CLI entry point
├── requirements.txt        # Python dependencies
├── parsers/
│   ├── __init__.py
│   ├── minutes_parser.py   # Main PDF parsing orchestrator
│   ├── section_parser.py   # Splits document into sections
│   ├── vote_parser.py      # Extracts vote details
│   └── utils.py            # Helper functions
└── formatters/
    ├── __init__.py
    └── markdown_formatter.py  # Generates blog recap
```
