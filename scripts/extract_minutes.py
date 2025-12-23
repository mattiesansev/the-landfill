#!/usr/bin/env python3
"""
SF Board of Supervisors Meeting Minutes Extractor

Extract structured data from SF BOS meeting minutes PDFs.

Usage:
    python extract_minutes.py /path/to/minutes.pdf -o output.json
    python extract_minutes.py /path/to/minutes.pdf -c votes.csv
    python extract_minutes.py /path/to/minutes.pdf -o output.json -m recap.md -c votes.csv
"""

import csv
import json
import sys
from pathlib import Path

import click

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from parsers import parse_minutes
from formatters import format_markdown


def sanitize_text(text: str) -> str:
    """Sanitize text for CSV output - replace smart quotes and clean whitespace."""
    if not text:
        return ""
    # Replace smart/curly quotes with straight quotes
    text = text.replace('"', '"').replace('"', '"')
    text = text.replace(''', "'").replace(''', "'")
    # Replace newlines and multiple spaces
    text = text.replace("\n", " ").replace("\r", " ")
    text = " ".join(text.split())  # Normalize whitespace
    return text


def write_csv(result: dict, csv_path: str) -> None:
    """Write votes data to CSV file."""
    votes = result.get("votes", [])
    meeting_date = result.get("meeting", {}).get("date", "")

    with open(csv_path, 'w', newline='', encoding='utf-8-sig') as f:
        writer = csv.writer(f, quoting=csv.QUOTE_ALL)

        # Header row
        writer.writerow([
            "meeting_date",
            "file_number",
            "title",
            "type",
            "action",
            "ayes",
            "noes",
            "ayes_names",
            "noes_names",
            "excused",
            "is_unanimous",
            "primary_sponsor",
            "co_sponsors",
            "fiscal_impact",
            "description",
        ])

        # Data rows
        for vote in votes:
            vote_data = vote.get("vote", {})
            sponsors = vote.get("sponsors", {})

            writer.writerow([
                meeting_date,
                vote.get("file_number", ""),
                sanitize_text(vote.get("title", "")),
                vote.get("type", ""),
                vote.get("action", ""),
                vote_data.get("ayes", 0),
                vote_data.get("noes", 0),
                ", ".join(vote_data.get("ayes_names", [])),
                ", ".join(vote_data.get("noes_names", [])),
                ", ".join(vote_data.get("excused", [])),
                vote.get("is_unanimous", False),
                sponsors.get("primary") or "",
                ", ".join(sponsors.get("co_sponsors", [])),
                vote.get("fiscal_impact", False),
                sanitize_text(vote.get("description", ""))[:500],
            ])


@click.command()
@click.argument('pdf_path', type=click.Path(exists=True))
@click.option(
    '-o', '--output',
    type=click.Path(),
    help='Output JSON file path'
)
@click.option(
    '-m', '--markdown',
    type=click.Path(),
    help='Output markdown summary file path'
)
@click.option(
    '-c', '--csv',
    type=click.Path(),
    help='Output CSV file path (votes only)'
)
@click.option(
    '--pretty',
    is_flag=True,
    help='Pretty print JSON output'
)
@click.option(
    '--quiet', '-q',
    is_flag=True,
    help='Suppress progress messages'
)
def main(pdf_path: str, output: str, markdown: str, csv: str, pretty: bool, quiet: bool):
    """Extract structured data from SF BOS meeting minutes PDF.

    PDF_PATH is the path to the meeting minutes PDF file.
    """
    if not quiet:
        click.echo(f"Parsing: {pdf_path}")

    try:
        # Parse the PDF
        result = parse_minutes(pdf_path)

        # Count what we found
        vote_count = len(result.get("votes", []))
        members_present = len(result.get("members", {}).get("present", []))

        if not quiet:
            click.echo(f"Found {vote_count} votes, {members_present} members present")

        # Generate JSON output
        indent = 2 if pretty else None
        json_output = json.dumps(result, indent=indent, ensure_ascii=False)

        # Write JSON output
        if output:
            with open(output, 'w', encoding='utf-8') as f:
                f.write(json_output)
            if not quiet:
                click.echo(f"JSON written to: {output}")
        elif not csv and not markdown:
            # Print JSON to stdout only if no other output format specified
            click.echo(json_output)

        # Generate and write markdown if requested
        if markdown:
            md_output = format_markdown(result)
            with open(markdown, 'w', encoding='utf-8') as f:
                f.write(md_output)
            if not quiet:
                click.echo(f"Markdown written to: {markdown}")

        # Generate and write CSV if requested
        if csv:
            write_csv(result, csv)
            if not quiet:
                click.echo(f"CSV written to: {csv}")

    except FileNotFoundError:
        click.echo(f"Error: File not found: {pdf_path}", err=True)
        sys.exit(1)
    except Exception as e:
        click.echo(f"Error parsing PDF: {e}", err=True)
        sys.exit(1)


if __name__ == '__main__':
    main()
