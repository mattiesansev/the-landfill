# Add Monthly Supervisor Roundup

Populate a new monthly Board of Supervisors roundup from a markdown file and images directory.

**Usage:** `/add-roundup /path/to/Roundup.md /path/to/Images/`

The argument `$ARGUMENTS` contains two space-separated paths: the markdown file and the images directory.

---

## Step 1: Read the source files

Parse `$ARGUMENTS` to extract the two paths. Read the full markdown file. List the images directory to see what image files are present.

## Step 2: Extract the markdown structure

The markdown has a consistent structure:

**Headline stats** at the very top:
```
\# of Meetings: 19
\# of Items: 197
\# of Hearings: 4
```
Strip the `\#` prefix — these become the `headline_stats` array with `value` and `label`.

**Isles** each have:
1. A heading like `## **2\. Title of Isle**` — strip the number prefix to get the title
2. A `***Sticky Note Description***` label followed by italic text — this is the sticky note preview text, goes into `stats` as `{ "value": "", "label": "..." }`
3. (Isle 1 only) A `***Article Text***` label marking the start of the article body
4. Body paragraphs — plain text with inline markdown links like `[display text](url)`
5. Image placeholders like `\<ImageName.png\>` or `*\<ImageName.png\>*` — note where they appear relative to paragraphs
6. No explicit section titles — you must create logical section titles based on the content

## Step 3: Flag typos before creating files

Read the full article text carefully and surface any apparent typos or errors to the user **before writing any files**. Common things to look for:
- Missing words (e.g. "District Brooke Jenkins" missing "Attorney")
- Transposed acronym letters (e.g. "SFSZ" instead of "SFZS")
- Committee or proper noun names that seem off
- Numbers that don't add up (e.g. vote counts that don't sum to 11)

Ask the user whether to fix each typo or leave it. Wait for confirmation before proceeding.

## Step 4: Copy images

For each image referenced in the markdown:
- Source: `{images_dir}/{original filename}`
- Destination: `public/img/roundups/{sanitized_filename}` where spaces and hyphens become underscores

```bash
cp "/path/to/Images/Original Name.png" "/Users/mattiesanseverino/Code/the-landfill/public/img/roundups/Sanitized_Name.png"
```

Note the destination paths — they'll be used as `"image"` values in the JSON (prefixed with `/img/roundups/`).

## Step 5: Determine the month

From the markdown filename or content, determine `YYYY-MM` (e.g. `2026-05`). Check if `public/roundups/YYYY-MM.json` already exists — if so, confirm with the user before overwriting.

## Step 6: Build the isle sections

For each isle, divide the article body into logical sections. Since the markdown has no section headings, create titles that accurately reflect what each section covers. Each section has:

```json
{
  "title": "Descriptive Section Title",
  "body": "Paragraph text...\n\nSecond paragraph...",
  "image": "/img/roundups/Image_Name.png",
  "links": [
    { "text": "Link display text", "url": "https://..." }
  ]
}
```

**Body text rules:**
- Separate paragraphs with `\n\n` (literal backslash-n-backslash-n in the JSON string)
- Remove inline markdown link syntax — keep the display text, move the URL to `links`
- Strip markdown escapes like trailing `\.` → `.`
- Preserve all wording verbatim (unless the user approved typo fixes in Step 3)
- Smart/curly quotes from the markdown are valid UTF-8 in JSON — keep them as-is

**Image placement:** If an image appears between two paragraphs, put the paragraphs before the image in one section's `body`, set `"image"` on that section, and start a new section for the paragraphs after. The IsleModal renders `image` after `body` within a section.

**Links:** Collect all inline links from the section's paragraphs into the `links` array. Use the original display text as `"text"`.

**No image / no links:** Always include `"links": []` even if empty. Omit `"image"` key if there's no image for that section.

## Step 7: Create the JSON file

Write `public/roundups/YYYY-MM.json`:

```json
{
  "month": "YYYY-MM",
  "display_month": "Month YYYY",
  "authors": ["destiny"],
  "headline_stats": [
    { "value": "19", "label": "Meetings" },
    { "value": "197", "label": "Items" },
    { "value": "4", "label": "Hearings" }
  ],
  "isles": [
    {
      "id": "kebab-case-slug",
      "number": 1,
      "date": "YYYY-MM-DD",
      "title": "Isle Title",
      "stats": [
        { "value": "", "label": "Sticky note description text..." }
      ],
      "sections": [
        {
          "title": "Section Title",
          "body": "Paragraph one.\n\nParagraph two.",
          "links": []
        }
      ]
    }
  ]
}
```

**`id`:** kebab-case slug derived from the isle title (e.g. "drug-court-investigation")

**`date`:** The date the item was heard. Use approximate dates based on context clues in the article (e.g. "signed on May 29" → board vote was before May 29). SFBOS meets Tuesdays; committee meetings are typically Wed/Thu. The date field is not displayed in the UI, so approximate is fine.

**`authors`:** Default to `["destiny"]` unless context indicates otherwise.

## Step 8: Update the roundup index

Edit `src/pages/posts/monthlyRoundup/roundupIndex.js` and add the new month at the **top** of the array (newest first):

```javascript
export const AVAILABLE_ROUNDUPS = [
  { yearMonth: "2026-05", label: "May 2026" },   // ← add here
  { yearMonth: "2026-04", label: "April 2026" },
  // ...
];
```

## Step 9: Verify the build

```bash
npm run build --prefix /Users/mattiesanseverino/Code/the-landfill 2>&1 | tail -10
```

Fix any errors before finishing. Report to the user: month added, number of isles, images copied, and any typos that were left as-is per their decision.
