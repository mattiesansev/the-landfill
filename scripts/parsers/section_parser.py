"""Section parser for SF Board of Supervisors meeting minutes."""

import re
from typing import Dict, List, Tuple

# Major section headers in order they typically appear
SECTION_HEADERS = [
    "ROLL CALL AND PLEDGE OF ALLEGIANCE",
    "COMMUNICATIONS",
    "APPROVAL OF MEETING MINUTES",
    "AGENDA CHANGES",
    "SPECIAL ORDER 2:00 P.M. - Mayor's Appearance Before The Board",
    "CONSENT AGENDA",
    "REGULAR AGENDA",
    "UNFINISHED BUSINESS",
    "NEW BUSINESS",
    "SPECIAL ORDER 2:30 P.M. - Recognition of Commendations",
    "SPECIAL ORDER 3:00 P.M.",
    "COMMITTEE REPORTS",
    "FOR ADOPTION WITHOUT COMMITTEE REFERENCE",
    "PUBLIC COMMENT",
    "IMPERATIVE AGENDA",
    "LEGISLATION INTRODUCED",
    "ADJOURNMENT",
]

# Simplified section names for the output
SECTION_MAP = {
    "ROLL CALL AND PLEDGE OF ALLEGIANCE": "roll_call",
    "COMMUNICATIONS": "communications",
    "APPROVAL OF MEETING MINUTES": "minutes_approval",
    "AGENDA CHANGES": "agenda_changes",
    "SPECIAL ORDER 2:00 P.M. - Mayor's Appearance Before The Board": "mayors_appearance",
    "CONSENT AGENDA": "consent_agenda",
    "REGULAR AGENDA": "regular_agenda",
    "UNFINISHED BUSINESS": "unfinished_business",
    "NEW BUSINESS": "new_business",
    "SPECIAL ORDER 2:30 P.M. - Recognition of Commendations": "commendations",
    "SPECIAL ORDER 3:00 P.M.": "special_order_3pm",
    "COMMITTEE REPORTS": "committee_reports",
    "FOR ADOPTION WITHOUT COMMITTEE REFERENCE": "adoption_without_committee",
    "PUBLIC COMMENT": "public_comment",
    "IMPERATIVE AGENDA": "imperative_agenda",
    "LEGISLATION INTRODUCED": "legislation_introduced",
    "ADJOURNMENT": "adjournment",
}


def find_section_boundaries(text: str) -> List[Tuple[str, int, int]]:
    """
    Find the start and end positions of each section in the document.

    Args:
        text: Full document text

    Returns:
        List of tuples (section_name, start_pos, end_pos)
    """
    boundaries = []

    # Find all section headers and their positions
    header_positions = []
    for header in SECTION_HEADERS:
        # Create pattern that matches the header (case-insensitive for flexibility)
        pattern = re.escape(header)
        for match in re.finditer(pattern, text, re.IGNORECASE):
            header_positions.append((header, match.start()))

    # Also find committee recommendation headers
    committee_pattern = r'Recommend(?:ation)?s? of the ([A-Za-z\s]+) Committee'
    for match in re.finditer(committee_pattern, text):
        header_positions.append((f"Committee: {match.group(1).strip()}", match.start()))

    # Sort by position
    header_positions.sort(key=lambda x: x[1])

    # Create boundaries (start to next section start)
    for i, (header, start) in enumerate(header_positions):
        if i + 1 < len(header_positions):
            end = header_positions[i + 1][1]
        else:
            end = len(text)
        boundaries.append((header, start, end))

    return boundaries


def split_sections(text: str) -> Dict[str, str]:
    """
    Split document text into named sections.

    Args:
        text: Full document text

    Returns:
        Dictionary mapping section names to their content
    """
    sections = {}
    boundaries = find_section_boundaries(text)

    for header, start, end in boundaries:
        # Get simplified section name
        section_key = SECTION_MAP.get(header, header.lower().replace(" ", "_"))

        # Handle committee headers specially
        if header.startswith("Committee:"):
            section_key = "committee:" + header.replace("Committee:", "").strip().lower().replace(" ", "_")

        # Extract content (skip the header line itself)
        content = text[start:end]

        # Remove the header from the content
        lines = content.split('\n')
        if lines:
            # Skip first line (the header)
            content = '\n'.join(lines[1:]).strip()

        # If section already exists, concatenate content (handles duplicate section headers)
        if section_key in sections:
            sections[section_key] = sections[section_key] + "\n\n" + content
        else:
            sections[section_key] = content

    return sections


def extract_committee_subsections(section_text: str) -> Dict[str, str]:
    """
    Extract committee subsections from a section.

    Args:
        section_text: Text of a section that may contain committee recommendations

    Returns:
        Dictionary mapping committee names to their content
    """
    subsections = {}

    # Pattern for committee headers
    pattern = r'Recommend(?:ation)?s? of the ([A-Za-z\s]+) Committee'

    matches = list(re.finditer(pattern, section_text))

    for i, match in enumerate(matches):
        committee_name = match.group(1).strip()
        start = match.end()

        # Find end (next committee or end of text)
        if i + 1 < len(matches):
            end = matches[i + 1].start()
        else:
            end = len(section_text)

        subsections[committee_name] = section_text[start:end].strip()

    return subsections


def is_consent_agenda_item(text: str) -> bool:
    """
    Check if text indicates a consent agenda item.

    Args:
        text: Item text

    Returns:
        True if this appears to be a consent agenda item
    """
    # Consent items are typically listed under "CONSENT AGENDA" header
    # and are voted on together
    return "consent agenda" in text.lower()


def extract_present_members(roll_call_text: str) -> List[str]:
    """
    Extract list of present members from roll call section.

    Args:
        roll_call_text: Roll call section text

    Returns:
        List of supervisor last names who were present
    """
    from .utils import parse_supervisor_list

    # Look for "Members Present:" line
    match = re.search(r'Members Present:\s*([^\n]+(?:\n[^\n]+)?)', roll_call_text)
    if match:
        members_text = match.group(1)
        # Clean up multi-line
        members_text = re.sub(r'\s+', ' ', members_text)
        return parse_supervisor_list(members_text)

    # Alternative: look for "On the call of the roll" pattern
    match = re.search(r'Supervisors?\s+([A-Za-z,\s]+)\s+were noted present', roll_call_text)
    if match:
        return parse_supervisor_list(match.group(1))

    return []
