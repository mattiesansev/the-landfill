"""Markdown formatter for SF Board of Supervisors meeting recaps."""

from typing import Dict, Any, List


def format_vote_result(vote: Dict[str, Any]) -> str:
    """Format a single vote result line."""
    action = vote.get("action", "UNKNOWN")
    ayes = vote.get("vote", {}).get("ayes", 0)
    noes = vote.get("vote", {}).get("noes", 0)

    if vote.get("is_unanimous"):
        return f"**Result:** {action} UNANIMOUSLY ({ayes}-0)"
    else:
        return f"**Result:** {action} ({ayes}-{noes})"


def format_vote_breakdown(vote: Dict[str, Any]) -> str:
    """Format the vote breakdown with names."""
    lines = []
    vote_data = vote.get("vote", {})

    ayes_names = vote_data.get("ayes_names", [])
    noes_names = vote_data.get("noes_names", [])
    excused = vote_data.get("excused", [])

    if ayes_names:
        lines.append(f"- **Yes:** {', '.join(ayes_names)}")
    if noes_names:
        lines.append(f"- **No:** {', '.join(noes_names)}")
    if excused:
        lines.append(f"- **Excused:** {', '.join(excused)}")

    return "\n".join(lines)


def format_sponsors(sponsors: Dict[str, Any]) -> str:
    """Format sponsors line."""
    if not sponsors:
        return ""

    parts = []
    if sponsors.get("primary"):
        parts.append(sponsors["primary"])
    if sponsors.get("co_sponsors"):
        parts.extend(sponsors["co_sponsors"])

    if parts:
        return f"- **Sponsors:** {', '.join(parts)}"
    return ""


def format_key_vote(vote: Dict[str, Any]) -> str:
    """Format a key vote section."""
    lines = []

    # Title with file number
    file_num = vote.get("file_number", "")
    title = vote.get("title", "Unknown Item")
    lines.append(f"### {title} ({file_num})")

    # Result
    lines.append(format_vote_result(vote))

    # Vote breakdown
    breakdown = format_vote_breakdown(vote)
    if breakdown:
        lines.append(breakdown)

    # Sponsors
    sponsors_line = format_sponsors(vote.get("sponsors", {}))
    if sponsors_line:
        lines.append(sponsors_line)

    # Description (truncated)
    desc = vote.get("description", "")
    if desc:
        # Take first sentence or 200 chars
        if "." in desc[:200]:
            desc = desc[:desc.index(".") + 1]
        else:
            desc = desc[:200] + "..." if len(desc) > 200 else desc
        lines.append(f"\n{desc}")

    # First reading noes if applicable
    fr_noes = vote.get("first_reading_noes")
    if fr_noes:
        lines.append(f"\n*Note: {', '.join(fr_noes)} voted No on First Reading*")

    return "\n".join(lines)


def format_contested_votes_table(votes: List[Dict[str, Any]]) -> str:
    """Format table of contested (non-unanimous) votes."""
    contested = [v for v in votes if not v.get("is_unanimous")]

    if not contested:
        return ""

    lines = [
        "## Contested Votes (Non-Unanimous)",
        "",
        "| Item | Result | Ayes | Noes |",
        "|------|--------|------|------|",
    ]

    for vote in contested:
        file_num = vote.get("file_number", "")
        title = vote.get("title", "Unknown")
        # Truncate title
        if len(title) > 40:
            title = title[:37] + "..."
        action = vote.get("action", "").replace(" AS AMENDED", "*")
        ayes = vote.get("vote", {}).get("ayes", 0)
        noes = vote.get("vote", {}).get("noes", 0)

        lines.append(f"| {title} ({file_num}) | {action} | {ayes} | {noes} |")

    return "\n".join(lines)


def format_consent_agenda(consent_data: Dict[str, Any]) -> str:
    """Format consent agenda section."""
    if not consent_data or not consent_data.get("items"):
        return ""

    lines = ["## Consent Agenda"]

    vote = consent_data.get("vote", {})
    ayes = vote.get("ayes", 0)
    noes = vote.get("noes", 0)

    if ayes > 0:
        lines.append(f"*Passed {ayes}-{noes}*")
    lines.append("")

    # List items
    items = consent_data.get("items", [])
    for item in items[:10]:  # Limit to first 10
        lines.append(f"- File No. {item}")

    if len(items) > 10:
        lines.append(f"- *...and {len(items) - 10} more items*")

    return "\n".join(lines)


def format_commendations(commendations: List[Dict[str, Any]]) -> str:
    """Format commendations section."""
    if not commendations:
        return ""

    lines = ["### Commendations"]

    for comm in commendations:
        honoree = comm.get("honoree", "Unknown")
        presenter = comm.get("presenter")
        desc = comm.get("description", "")

        line = f"- **{honoree}**"
        if presenter:
            line += f" (presented by Sup. {presenter})"
        if desc:
            line += f" - {desc}"

        lines.append(line)

    return "\n".join(lines)


def format_notable_events(events: Dict[str, Any]) -> str:
    """Format notable events section."""
    sections = []

    # Commendations
    if events.get("commendations"):
        sections.append(format_commendations(events["commendations"]))

    # Mayor's appearance
    mayor = events.get("mayors_appearance")
    if mayor and mayor.get("topic"):
        mayor_section = ["### Mayor's Appearance"]
        mayor_section.append(f"**Topic:** {mayor['topic']}")
        if mayor.get("questioner"):
            mayor_section.append(f"- Sup. {mayor['questioner']} asked questions")
        if mayor.get("summary"):
            mayor_section.append(f"\n{mayor['summary']}")
        sections.append("\n".join(mayor_section))

    # Amendments
    amendments = events.get("amendments", [])
    if amendments:
        amend_section = ["### Amendments"]
        for amend in amendments:
            file_num = amend.get("file_number", "")
            amend_type = amend.get("amendment_type", "")
            amend_section.append(f"- File No. {file_num}: {amend_type}")
        sections.append("\n".join(amend_section))

    if sections:
        return "## Notable Events\n\n" + "\n\n".join(sections)
    return ""


def format_markdown(data: Dict[str, Any]) -> str:
    """
    Generate markdown summary from parsed meeting data.

    Args:
        data: Parsed meeting data dictionary

    Returns:
        Formatted markdown string
    """
    lines = []

    # Header
    meeting = data.get("meeting", {})
    date = meeting.get("date", "Unknown Date")
    day = meeting.get("day_of_week", "")

    lines.append("# SF Board of Supervisors Meeting Recap")
    if day and date:
        lines.append(f"## {day}, {date}")
    else:
        lines.append(f"## {date}")
    lines.append("")

    # Members present
    members = data.get("members", {})
    present = members.get("present", [])
    absent = members.get("absent", [])

    if len(present) == 11:
        lines.append("**Members Present:** All 11 supervisors")
    elif present:
        lines.append(f"**Members Present:** {', '.join(present)}")
    if absent:
        lines.append(f"**Members Absent:** {', '.join(absent)}")

    if members.get("president"):
        lines.append(f"**President:** {members['president']}")

    # Meeting times
    if meeting.get("start_time"):
        time_str = f"**Meeting Time:** {meeting['start_time']}"
        if meeting.get("end_time"):
            time_str += f" - {meeting['end_time']}"
        lines.append(time_str)

    lines.append("")
    lines.append("---")
    lines.append("")

    # Key votes section
    votes = data.get("votes", [])
    if votes:
        lines.append("## Key Votes")
        lines.append("")

        # Show non-unanimous votes first as they're most interesting
        contested = [v for v in votes if not v.get("is_unanimous")]
        unanimous = [v for v in votes if v.get("is_unanimous")]

        # Show top contested votes
        for vote in contested[:5]:
            lines.append(format_key_vote(vote))
            lines.append("")
            lines.append("---")
            lines.append("")

        # Show a few unanimous votes
        if unanimous:
            lines.append("### Unanimous Votes")
            lines.append("")
            for vote in unanimous[:3]:
                lines.append(format_key_vote(vote))
                lines.append("")

    # Contested votes table
    contested_table = format_contested_votes_table(votes)
    if contested_table:
        lines.append("")
        lines.append(contested_table)
        lines.append("")

    # Notable events
    notable = data.get("notable_events", {})
    notable_section = format_notable_events(notable)
    if notable_section:
        lines.append("")
        lines.append(notable_section)
        lines.append("")

    # Consent agenda
    consent = data.get("consent_agenda", {})
    consent_section = format_consent_agenda(consent)
    if consent_section:
        lines.append("")
        lines.append("---")
        lines.append("")
        lines.append(consent_section)
        lines.append("")

    # Public comments summary
    comments = data.get("public_comment_summary", [])
    if comments:
        lines.append("")
        lines.append("## Public Comment Highlights")
        for comment in comments[:5]:
            speaker = comment.get("speaker", "Unknown")
            topic = comment.get("topic", "")
            if topic:
                lines.append(f"- **{speaker}** spoke regarding {topic}")
            else:
                lines.append(f"- **{speaker}** addressed the board")

    # Footer
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("*Data extracted from official SF Board of Supervisors meeting minutes.*")

    return "\n".join(lines)
