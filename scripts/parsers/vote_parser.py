"""Vote parser for SF Board of Supervisors meeting minutes."""

import re
from typing import Dict, List, Optional, Any
from .utils import (
    parse_supervisor_list,
    extract_file_number,
    extract_title_from_brackets,
    parse_sponsors,
    determine_item_type,
    is_unanimous,
)


# Regex patterns for vote parsing
FILE_NUMBER_PATTERN = r'\b(\d{6})\b'
TITLE_PATTERN = r'\[([^\]]+)\]'

# Vote action patterns
ACTION_PATTERNS = [
    r'(FINALLY PASSED)\s*(?:AS AMENDED\s*)?by the following vote:',
    r'(PASSED, ON FIRST READING)\s*(?:AS AMENDED\s*)?by the following vote:',
    r'(ADOPTED)\s*(?:AS AMENDED\s*)?by the following vote:',
    r'(APPROVED)\s*(?:AS AMENDED\s*)?by the following vote:',
    r'(CONTINUED)\s*(?:OPEN\s*)?to the Board',
    r'(HEARD AND FILED)',
]

# Vote breakdown patterns - capture all names up to next section
# Note: PDF extraction may have leading whitespace before Ayes/Noes/Excused
AYES_PATTERN = r'Ayes:\s*(\d+)\s*-\s*([A-Za-z,\s]+?)(?=\s*\n|\s*$)'
NOES_PATTERN = r'Noes:\s*(\d+)\s*-\s*([A-Za-z,\s]+?)(?=\s*\n|\s*$)'
EXCUSED_PATTERN = r'Excused:\s*(\d+)\s*-\s*([A-Za-z,\s]+?)(?=\s*\n|\s*$)'

# Sponsors pattern
SPONSORS_PATTERN = r'Sponsors?:\s*([^\n]+)'

# Committee pattern
COMMITTEE_PATTERN = r'Recommend(?:ation)?s? of the ([A-Za-z\s]+) Committee'


def parse_vote_breakdown(text: str) -> Dict[str, Any]:
    """
    Parse vote breakdown from text.

    Args:
        text: Text containing vote breakdown (Ayes: X - names, Noes: Y - names)

    Returns:
        Dictionary with vote counts and names
    """
    result = {
        "ayes": 0,
        "noes": 0,
        "ayes_names": [],
        "noes_names": [],
        "excused": [],
    }

    # Parse ayes
    ayes_match = re.search(AYES_PATTERN, text, re.IGNORECASE | re.DOTALL)
    if ayes_match:
        result["ayes"] = int(ayes_match.group(1))
        result["ayes_names"] = parse_supervisor_list(ayes_match.group(2))

    # Parse noes
    noes_match = re.search(NOES_PATTERN, text, re.IGNORECASE | re.DOTALL)
    if noes_match:
        result["noes"] = int(noes_match.group(1))
        result["noes_names"] = parse_supervisor_list(noes_match.group(2))

    # Parse excused
    excused_match = re.search(EXCUSED_PATTERN, text, re.IGNORECASE | re.DOTALL)
    if excused_match:
        result["excused"] = parse_supervisor_list(excused_match.group(2))

    return result


def parse_action(text: str) -> Optional[str]:
    """
    Parse the action taken on an item.

    Args:
        text: Text containing action

    Returns:
        Action string or None
    """
    for pattern in ACTION_PATTERNS:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            action = match.group(1).upper()
            # Normalize action names
            if "AS AMENDED" in text[match.start():match.end() + 20].upper():
                action += " AS AMENDED"
            return action.replace(",", "")
    return None


def parse_single_vote_item(text: str) -> Optional[Dict[str, Any]]:
    """
    Parse a single vote item from text.

    Args:
        text: Text containing a single vote item

    Returns:
        Dictionary with vote item data or None
    """
    # Extract file number
    file_number = extract_file_number(text)
    if not file_number:
        return None

    # Extract title
    title = extract_title_from_brackets(text)
    if not title:
        return None

    # Extract description (text between title and action/vote)
    desc_match = re.search(r'\]\s*\n?\s*(.+?)(?=(?:FINALLY|PASSED|ADOPTED|APPROVED|CONTINUED|HEARD|The foregoing|Ayes:))',
                          text, re.DOTALL | re.IGNORECASE)
    description = desc_match.group(1).strip() if desc_match else ""

    # Clean up description - remove sponsors line from it
    description = re.sub(r'Sponsors?:\s*[^\n]+\n?', '', description)
    description = re.sub(r'\s+', ' ', description).strip()

    # Extract sponsors
    sponsors_match = re.search(SPONSORS_PATTERN, text)
    sponsors = parse_sponsors(sponsors_match.group(0)) if sponsors_match else {"primary": None, "co_sponsors": []}

    # Extract action
    action = parse_action(text)

    # Extract vote breakdown
    vote = parse_vote_breakdown(text)

    # Determine item type
    item_type = determine_item_type(title, description)

    # Check for fiscal impact
    fiscal_impact = "(Fiscal Impact)" in text

    # Check for first reading no votes
    first_reading_noes = []
    fr_match = re.search(r'\(Supervisor[s]?\s+([A-Za-z,\s]+)\s+voted No on First Reading\)', text)
    if fr_match:
        first_reading_noes = parse_supervisor_list(fr_match.group(1))

    return {
        "file_number": file_number,
        "title": title,
        "description": description[:500] + "..." if len(description) > 500 else description,
        "type": item_type,
        "sponsors": sponsors,
        "action": action,
        "vote": vote,
        "is_unanimous": is_unanimous(vote["ayes"], vote["noes"]),
        "fiscal_impact": fiscal_impact,
        "first_reading_noes": first_reading_noes if first_reading_noes else None,
    }


def parse_votes(text: str) -> List[Dict[str, Any]]:
    """
    Parse all vote items from document text.

    Args:
        text: Full document text or section text

    Returns:
        List of vote item dictionaries
    """
    votes = []

    # Split text into potential vote items by file number
    # Each file number starts a new item
    pattern = r'(\d{6})\s+\['
    matches = list(re.finditer(pattern, text))

    for i, match in enumerate(matches):
        start = match.start()

        # Find end (next file number or end of text)
        if i + 1 < len(matches):
            end = matches[i + 1].start()
        else:
            # Look for section boundaries
            end_patterns = [
                r'\nSPECIAL ORDER',
                r'\nCOMMITTEE REPORTS',
                r'\nFOR ADOPTION WITHOUT',
                r'\nPUBLIC COMMENT',
                r'\nIMPERATIVE AGENDA',
                r'\nLEGISLATION INTRODUCED',
                r'\nADJOURNMENT',
            ]
            end = len(text)
            for ep in end_patterns:
                em = re.search(ep, text[start:])
                if em:
                    end = min(end, start + em.start())

        item_text = text[start:end]
        vote_item = parse_single_vote_item(item_text)

        if vote_item and vote_item.get("action"):
            votes.append(vote_item)

    return votes


def parse_consent_agenda(text: str) -> Dict[str, Any]:
    """
    Parse consent agenda section.

    Args:
        text: Consent agenda section text

    Returns:
        Dictionary with consent agenda items and shared vote
    """
    result = {
        "items": [],
        "vote": None,
    }

    # Find all file numbers in consent agenda
    file_numbers = re.findall(FILE_NUMBER_PATTERN, text)
    result["items"] = list(set(file_numbers))  # Deduplicate

    # Find the shared vote (usually at the end of consent section)
    vote_match = re.search(r'The foregoing items were acted upon by the following vote:', text, re.IGNORECASE)
    if vote_match:
        vote_text = text[vote_match.end():]
        result["vote"] = parse_vote_breakdown(vote_text)

    return result


def parse_grouped_votes(text: str) -> List[str]:
    """
    Find file numbers that were called/voted together.

    Args:
        text: Document text

    Returns:
        List of lists, each containing file numbers voted together
    """
    groups = []

    # Pattern for "File Nos. X, Y, Z be called together"
    pattern = r'File Nos?\.\s*([\d,\s]+)\s*be called together'
    for match in re.finditer(pattern, text, re.IGNORECASE):
        file_nums = re.findall(r'\d{6}', match.group(1))
        if file_nums:
            groups.append(file_nums)

    return groups


def parse_severed_items(text: str) -> List[Dict[str, str]]:
    """
    Find items that were severed for separate consideration.

    Args:
        text: Document text

    Returns:
        List of dicts with file_number and supervisor who severed it
    """
    severed = []

    pattern = r'Supervisor\s+(\w+)\s+requested.*?File No\.\s*(\d{6})\s*be severed'
    for match in re.finditer(pattern, text, re.IGNORECASE):
        severed.append({
            "file_number": match.group(2),
            "severed_by": match.group(1),
        })

    return severed


def parse_amendments(text: str) -> List[Dict[str, Any]]:
    """
    Parse amendments to items.

    Args:
        text: Document text

    Returns:
        List of amendment details
    """
    amendments = []

    # Pattern for amendments
    pattern = r'(\d{6}).*?AMENDED,?\s*(AN AMENDMENT OF THE WHOLE[^\.]+)'
    for match in re.finditer(pattern, text, re.IGNORECASE | re.DOTALL):
        amendments.append({
            "file_number": match.group(1),
            "amendment_type": match.group(2).strip(),
        })

    return amendments
