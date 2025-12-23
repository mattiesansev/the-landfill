"""Utility functions for parsing SF Board of Supervisors meeting minutes."""

import re
from typing import List, Dict, Optional

# Current SF Board of Supervisors (as of 2025)
SUPERVISORS = {
    "Chan": "Connie Chan",
    "Chen": "Chyanne Chen",
    "Dorsey": "Matt Dorsey",
    "Fielder": "Jackie Fielder",
    "Mahmood": "Bilal Mahmood",
    "Mandelman": "Rafael Mandelman",
    "Melgar": "Myrna Melgar",
    "Sauter": "Danny Sauter",
    "Sherrill": "Stephen Sherrill",
    "Walton": "Shamann Walton",
    "Wong": "Alan Wong",
}

SUPERVISOR_LAST_NAMES = list(SUPERVISORS.keys())


def normalize_supervisor_name(name: str) -> Optional[str]:
    """
    Normalize a supervisor name to their last name.

    Args:
        name: Full or partial name of a supervisor

    Returns:
        Normalized last name or None if not found
    """
    name = name.strip()

    # Check if it's already a last name
    if name in SUPERVISORS:
        return name

    # Check if the last name is in the full name
    for last_name in SUPERVISOR_LAST_NAMES:
        if last_name.lower() in name.lower():
            return last_name

    return None


def parse_supervisor_list(text: str) -> List[str]:
    """
    Parse a comma-separated list of supervisor names.

    Args:
        text: String like "Chan, Chen, Dorsey, Fielder, Mahmood, Mandelman, Melgar, Sauter, Sherrill, Walton, Wong"

    Returns:
        List of normalized supervisor last names
    """
    # Handle "and" in the list
    text = text.replace(" and ", ", ")

    # Split by comma
    names = [n.strip() for n in text.split(",")]

    # Normalize each name
    result = []
    for name in names:
        normalized = normalize_supervisor_name(name)
        if normalized:
            result.append(normalized)

    return result


def clean_text(text: str) -> str:
    """
    Clean extracted PDF text.

    Args:
        text: Raw text from PDF

    Returns:
        Cleaned text
    """
    # Remove page headers/footers
    text = re.sub(r'Board of Supervisors\s+Meeting Minutes - Draft\s+\d+/\d+/\d+', '', text)
    text = re.sub(r'City and County of San Francisco\s+Page \d+\s+Printed at.*', '', text)

    # Normalize whitespace
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = re.sub(r' {2,}', ' ', text)

    return text.strip()


def extract_file_number(text: str) -> Optional[str]:
    """
    Extract a 6-digit file number from text.

    Args:
        text: Text that may contain a file number

    Returns:
        File number string or None
    """
    match = re.search(r'\b(\d{6})\b', text)
    return match.group(1) if match else None


def extract_title_from_brackets(text: str) -> Optional[str]:
    """
    Extract title text from brackets.

    Args:
        text: Text like "251123 [Settlement of Unlitigated Claim - ...]"

    Returns:
        Title without brackets or None
    """
    match = re.search(r'\[([^\]]+)\]', text)
    return match.group(1).strip() if match else None


def parse_sponsors(text: str) -> Dict[str, any]:
    """
    Parse sponsors from a sponsors line.

    Args:
        text: Text like "Sponsors: Mandelman; Dorsey, Sauter and Mahmood"

    Returns:
        Dict with 'primary' and 'co_sponsors' keys
    """
    # Remove "Sponsors:" prefix
    text = re.sub(r'^Sponsors?:\s*', '', text, flags=re.IGNORECASE)

    # Split by semicolon - first is primary, rest are co-sponsors
    parts = text.split(';')

    primary = None
    co_sponsors = []

    if parts:
        # Primary sponsor
        primary_names = parse_supervisor_list(parts[0])
        if primary_names:
            primary = primary_names[0]

    if len(parts) > 1:
        # Co-sponsors
        co_sponsors = parse_supervisor_list(parts[1])

    return {
        "primary": primary,
        "co_sponsors": co_sponsors
    }


def determine_item_type(title: str, description: str) -> str:
    """
    Determine the type of legislative item.

    Args:
        title: Item title
        description: Item description

    Returns:
        Type string like "Ordinance", "Resolution", "Motion"
    """
    combined = f"{title} {description}".lower()

    if "ordinance" in combined:
        return "Ordinance"
    elif "resolution" in combined:
        return "Resolution"
    elif "motion" in combined:
        return "Motion"
    elif "hearing" in combined:
        return "Hearing"
    else:
        return "Unknown"


def is_unanimous(ayes: int, noes: int, total_members: int = 11) -> bool:
    """
    Check if a vote was unanimous.

    Args:
        ayes: Number of yes votes
        noes: Number of no votes
        total_members: Total board members (default 11)

    Returns:
        True if unanimous (all present voted yes)
    """
    return noes == 0 and ayes > 0
