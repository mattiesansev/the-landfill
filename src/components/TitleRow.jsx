import React from "react"
import { Link, useSearchParams, useLocation } from "react-router-dom"
import Logo from "../img/logo_transparent.png"

const CATEGORIES = {
  ALL: "all",
  HISTORICAL: "historical",
  POLITICS: "politics",
  FIELD_NOTES: "field-notes"
};

const TitleRow = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const activeCategory = searchParams.get("category") || CATEGORIES.ALL;

  // Check if we're on an article page (any /post/... route)
  const isArticlePage = location.pathname.startsWith("/post/");

  return (
    <div className="title_row">
      <div className="container">
        <Link to="/" className="nav-logo">
          <img src={Logo} alt="The Bay Area Data Dump" />
        </Link>

        {!isArticlePage && (
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
        )}

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
