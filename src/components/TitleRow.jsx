import React from "react"
import { Link, useSearchParams } from "react-router-dom"

const CATEGORIES = {
  ALL: "all",
  HISTORICAL: "historical",
  POLITICS: "politics",
  FIELD_NOTES: "field-notes"
};

const TitleRow = () => {
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || CATEGORIES.ALL;

  return (
    <div className="title_row">
      <div className="container">
        <div className="nav-links">
          <Link
            className={`nav-link ${activeCategory === CATEGORIES.ALL ? 'active' : ''}`}
            to="/"
          >
            All Stories
          </Link>
          <Link
            className={`nav-link ${activeCategory === CATEGORIES.HISTORICAL ? 'active' : ''}`}
            to="/?category=historical"
          >
            Historical Deep Dives
          </Link>
          <Link
            className={`nav-link ${activeCategory === CATEGORIES.POLITICS ? 'active' : ''}`}
            to="/?category=politics"
          >
            Local Politics
          </Link>
          <Link
            className={`nav-link ${activeCategory === CATEGORIES.FIELD_NOTES ? 'active' : ''}`}
            to="/?category=field-notes"
          >
            Field Notes
          </Link>
        </div>
        <div className="nav-secondary">
          <Link className="link" to="/post/about">
            About
          </Link>
          <Link className="link" to="/post/contact">
            Contact
          </Link>
        </div>
      </div>
    </div>
  )
}
export default TitleRow
