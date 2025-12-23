"""Main parser for SF Board of Supervisors meeting minutes."""

import re
from typing import Dict, Any, Optional
from datetime import datetime
import pdfplumber

from .utils import clean_text, parse_supervisor_list, SUPERVISORS
from .section_parser import split_sections, extract_present_members
from .vote_parser import (
    parse_votes,
    parse_consent_agenda,
    parse_grouped_votes,
    parse_severed_items,
    parse_amendments,
)


def extract_meeting_date(text: str) -> Optional[Dict[str, Any]]:
    """
    Extract meeting date and time from document.

    Args:
        text: Document text

    Returns:
        Dictionary with date info or None
    """
    result = {
        "date": None,
        "day_of_week": None,
        "start_time": None,
        "end_time": None,
        "location": "Legislative Chamber, Room 250, City Hall",
        "type": "Regular Meeting",
    }

    # Pattern for date in header
    # Example: "Tuesday, December 16, 2025"
    date_pattern = r'(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s+(\w+)\s+(\d{1,2}),?\s+(\d{4})'
    match = re.search(date_pattern, text)
    if match:
        result["day_of_week"] = match.group(1)
        month_name = match.group(2)
        day = int(match.group(3))
        year = int(match.group(4))

        # Parse to date object
        try:
            date_str = f"{month_name} {day}, {year}"
            date_obj = datetime.strptime(date_str, "%B %d, %Y")
            result["date"] = date_obj.strftime("%Y-%m-%d")
        except ValueError:
            pass

    # Pattern for meeting times
    # Example: "Members Present at Roll Call: 2:03 p.m."
    start_pattern = r'(?:Roll Call|convened).*?(\d{1,2}:\d{2}\s*[ap]\.?m\.?)'
    start_match = re.search(start_pattern, text, re.IGNORECASE)
    if start_match:
        result["start_time"] = start_match.group(1).upper().replace(".", "")

    # Adjournment time
    adj_pattern = r'(?:adjourned|adjournment).*?(\d{1,2}:\d{2}\s*[ap]\.?m\.?)'
    adj_match = re.search(adj_pattern, text, re.IGNORECASE)
    if adj_match:
        result["end_time"] = adj_match.group(1).upper().replace(".", "")

    # Check for special meeting type
    if "special meeting" in text.lower():
        result["type"] = "Special Meeting"
    elif "closed session" in text.lower():
        result["type"] = "Closed Session"

    return result


def extract_members_info(text: str, roll_call_section: str) -> Dict[str, Any]:
    """
    Extract member presence and president info.

    Args:
        text: Full document text
        roll_call_section: Roll call section text

    Returns:
        Dictionary with member info
    """
    result = {
        "present": [],
        "absent": [],
        "president": None,
    }

    # Get present members from roll call
    if roll_call_section:
        result["present"] = extract_present_members(roll_call_section)

    # If we didn't find present members, try alternative patterns
    if not result["present"]:
        # Look for vote with all members
        ayes_match = re.search(
            r'Ayes:\s*11\s*-\s*([A-Za-z,\s]+?)(?=\n|Noes:|$)',
            text,
            re.IGNORECASE
        )
        if ayes_match:
            result["present"] = parse_supervisor_list(ayes_match.group(1))

    # If still empty, assume all supervisors present
    if not result["present"]:
        result["present"] = list(SUPERVISORS.keys())

    # Find absent members (those not in present list)
    all_supervisors = set(SUPERVISORS.keys())
    present_set = set(result["present"])
    result["absent"] = list(all_supervisors - present_set)

    # Find president
    pres_pattern = r'President\s+(\w+)'
    pres_match = re.search(pres_pattern, text)
    if pres_match:
        from .utils import normalize_supervisor_name
        result["president"] = normalize_supervisor_name(pres_match.group(1))

    return result


def extract_commendations(text: str) -> list:
    """
    Extract commendation/recognition details.

    Args:
        text: Section text containing commendations

    Returns:
        List of commendation dictionaries
    """
    commendations = []

    # Pattern for commendations
    # "Supervisor X presented a commendation to Y"
    pattern = r'Supervisor\s+(\w+)\s+presented\s+(?:a\s+)?commendation[^.]*?to\s+([^.]+)'
    for match in re.finditer(pattern, text, re.IGNORECASE):
        commendations.append({
            "presenter": match.group(1),
            "honoree": match.group(2).strip(),
            "accepted_by": None,
            "description": None,
        })

    # Also look for "Recognition of" pattern
    recog_pattern = r'Recognition of\s+([^-\n]+)'
    for match in re.finditer(recog_pattern, text):
        # Check if already captured
        honoree = match.group(1).strip()
        if not any(c["honoree"] == honoree for c in commendations):
            commendations.append({
                "presenter": None,
                "honoree": honoree,
                "accepted_by": None,
                "description": None,
            })

    return commendations


def extract_mayors_appearance(text: str) -> Optional[Dict[str, Any]]:
    """
    Extract Mayor's appearance details.

    Args:
        text: Section text for mayor's appearance

    Returns:
        Dictionary with appearance details or None
    """
    if not text or len(text) < 50:
        return None

    result = {
        "topic": None,
        "questioner": None,
        "summary": None,
    }

    # Look for topic
    topic_match = re.search(r'(?:regarding|concerning|on)\s+([^.]+)', text, re.IGNORECASE)
    if topic_match:
        result["topic"] = topic_match.group(1).strip()[:200]

    # Look for questioner
    quest_pattern = r'Supervisor\s+(\w+)\s+(?:asked|questioned|inquired)'
    quest_match = re.search(quest_pattern, text, re.IGNORECASE)
    if quest_match:
        result["questioner"] = quest_match.group(1)

    return result


def extract_public_comments(text: str) -> list:
    """
    Extract public comment speakers and topics.

    Args:
        text: Public comment section text

    Returns:
        List of comment dictionaries
    """
    comments = []

    # Pattern for speaker names
    # Often formatted as "Name spoke regarding..."
    pattern = r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\s+(?:spoke|addressed|commented)'
    for match in re.finditer(pattern, text):
        speaker = match.group(1)
        # Find topic
        topic_match = re.search(
            rf'{re.escape(speaker)}[^.]*?(?:regarding|about|on)\s+([^.]+)',
            text
        )
        topic = topic_match.group(1).strip() if topic_match else None

        comments.append({
            "speaker": speaker,
            "topic": topic,
        })

    return comments


def parse_minutes(pdf_path: str) -> Dict[str, Any]:
    """
    Parse meeting minutes from PDF file.

    Args:
        pdf_path: Path to PDF file

    Returns:
        Dictionary with all parsed meeting data
    """
    # Extract text from PDF
    full_text = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text(layout=True)
            if text:
                full_text.append(text)

    raw_text = "\n".join(full_text)
    cleaned_text = clean_text(raw_text)

    # Split into sections
    sections = split_sections(cleaned_text)

    # Extract meeting metadata
    meeting_info = extract_meeting_date(cleaned_text)

    # Extract member info
    roll_call_text = sections.get("roll_call", "")
    members_info = extract_members_info(cleaned_text, roll_call_text)

    # Parse votes from relevant sections
    all_votes = []

    # Regular agenda votes
    if "regular_agenda" in sections:
        regular_votes = parse_votes(sections["regular_agenda"])
        for v in regular_votes:
            v["is_consent_agenda"] = False
        all_votes.extend(regular_votes)

    # Committee reports votes
    for key, content in sections.items():
        if key.startswith("committee:") or key == "committee_reports":
            committee_votes = parse_votes(content)
            for v in committee_votes:
                v["is_consent_agenda"] = False
                # Extract committee name
                if key.startswith("committee:"):
                    v["committee"] = key.replace("committee:", "").strip()
            all_votes.extend(committee_votes)

    # Adoption without committee
    if "adoption_without_committee" in sections:
        adopt_votes = parse_votes(sections["adoption_without_committee"])
        for v in adopt_votes:
            v["is_consent_agenda"] = False
        all_votes.extend(adopt_votes)

    # Unfinished business
    if "unfinished_business" in sections:
        unfinished_votes = parse_votes(sections["unfinished_business"])
        for v in unfinished_votes:
            v["is_consent_agenda"] = False
        all_votes.extend(unfinished_votes)

    # Parse consent agenda
    consent_data = {"items": [], "vote": None}
    if "consent_agenda" in sections:
        consent_data = parse_consent_agenda(sections["consent_agenda"])

    # Parse grouped votes
    grouped = parse_grouped_votes(cleaned_text)

    # Parse severed items
    severed = parse_severed_items(cleaned_text)

    # Parse amendments
    amendments = parse_amendments(cleaned_text)

    # Extract notable events
    notable_events = {
        "commendations": [],
        "mayors_appearance": None,
        "appeals": [],
        "amendments": amendments,
    }

    # Commendations from special order section
    if "commendations" in sections:
        notable_events["commendations"] = extract_commendations(sections["commendations"])

    # Mayor's appearance
    if "mayors_appearance" in sections:
        notable_events["mayors_appearance"] = extract_mayors_appearance(
            sections["mayors_appearance"]
        )

    # Public comments
    public_comments = []
    if "public_comment" in sections:
        public_comments = extract_public_comments(sections["public_comment"])

    # Build final result
    result = {
        "meeting": meeting_info,
        "members": members_info,
        "votes": all_votes,
        "consent_agenda": consent_data,
        "grouped_votes": grouped,
        "severed_items": severed,
        "notable_events": notable_events,
        "public_comment_summary": public_comments,
    }

    return result
