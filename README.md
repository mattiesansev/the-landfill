# The Bay Area Data Dump

## Tech Stack

- **Framework**: React + Vite
- **Styling**: SCSS
- **Routing**: React Router
- **Backend**: Supabase (for the parks bracket feature)
- **Deployment**: Netlify

## Local Development

```bash
yarn install
yarn dev
```

## Adding a New Article

Each article is its own react compoenent. Here's some instructions for how to put one together:

### 1. Create the page component

Add a new file at `src/pages/posts/YourArticle.jsx`. Use an existing article (e.g. `RentControl.jsx`) as a reference for structure.

### 2. Register the route

In `src/App.jsx`, import your component and add a route inside the `createBrowserRouter` children array:

```jsx
import YourArticle from "./pages/posts/YourArticle"

// inside router children:
{
  path: "/post/your-article-slug",
  element: <YourArticle />
}
```

That corresponds with the url that your article will be at! So it'll look like
bayareadatadump.com/post/your-article-slug

### 3. Add it to the homepage

In `src/pages/Home.jsx`, add an entry to the `posts` array:

```js
{
  id: "your-article-slug",       // must match the route path above
  title: "Your article title",
  desc: "Short description shown on the card.",
  img: yourCoverImage,           // import the image at the top of the file
  authors: [authors.mattie],     // see src/authors/authors.js for available authors
  category: CATEGORIES.POLITICS  // HISTORICAL | POLITICS | FIELD_NOTES | ALL
}
```

### 4. Verify the build

```bash
yarn build
```

Fix any errors before pushing.

---

## Adding a Weekly Supervisor Meeting

For the weekly Board of Supervisors recap specifically, there's a more detailed workflow (data-driven rather than a new component). See `CLAUDE.md` for the full process, or run the `/add-meeting` slash command in Claude Code with a path to the meeting minutes PDF.

The short version:

1. Create `public/votes/YYYY-MM-DD.json` with the vote data
2. Add the date to `MEETING_DATES` in `src/pages/posts/SupervisorUpdates.jsx`
3. Run `yarn build` to verify

## Deployment

Pushes to `main` auto-deploy via Netlify.
