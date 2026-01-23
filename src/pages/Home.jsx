import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import rentControlCover from "/src/rent_control.jpeg"
import { authors } from "../authors/authors";
import landfillCover from "/src/header.jpg"
import aboutUsCover from "../img/group_photo.jpg"
import ReactGA from 'react-ga4';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Logo from "../img/logo_transparent.png"


ReactGA.initialize('G-NR2T70PVBG');

const CATEGORIES = {
  ALL: "all",
  HISTORICAL: "historical",
  POLITICS: "politics",
  FIELD_NOTES: "field-notes"
};

const Home = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || CATEGORIES.ALL;

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname });
  }, [location]);

  const posts = [
    {
      id: "bay-area-landfills",
      title:
        "An analysis and visualization of abandoned and illegal landfills across the Bay Area",
      desc: "We researched and visualized all of the abandoned landfills across the bay area.",
      img: landfillCover,
      authors: [authors.mattie, authors.destiny, authors.nick, authors.maggie],
      category: CATEGORIES.HISTORICAL
    },
    {
      id: "rent-control-analysis",
      title: "Rent control, taxes, and community uproar in San Francisco",
      desc: "A timeline and history of rent control since the 1970s.",
      img: rentControlCover,
      authors: [authors.mattie, authors.destiny, authors.nick, authors.maggie],
      category: CATEGORIES.HISTORICAL
    },
    {
      id: "sf-parks-bracket",
      title: "SF Parks Bracket: Vote for the Best Park in San Francisco",
      desc: "An interactive tournament bracket comparing 16 of SF's most beloved parks. Compare stats and pick your winners!",
      img: landfillCover,
      authors: [authors.mattie],
      category: CATEGORIES.FIELD_NOTES
    },
    {
      id: "about",
      title: "Learn more about our team!",
      desc: "Curious to learn about the people who put this site together?",
      img: aboutUsCover,
      authors: [],
      category: CATEGORIES.ALL
    },
  ];

  const filteredPosts = activeCategory === CATEGORIES.ALL
    ? posts
    : posts.filter(post => post.category === activeCategory);

  return (
    <div className="home">
      <div className="section-header">
        <Link to="/" className="logo-link">
          <img src={Logo} alt="The Bay Area Data Dump" className="home-logo" />
        </Link>
        <h1 className="section-heading">The Bay Area Data Dump</h1>
        <p className="section-subheading">The Bay Area Data Dump is a local news blog run by four San Francisco residents and enthusiasts. Come hang out with us while we write about anything and everything that we find interesting about the Bay Area, from abandoned landfills to scenic bus routes!</p>
      </div>
      <div className="posts">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div className="post" key={post.id}>
              <Link className="link" to={`/post/${post.id}`}>
                <div className="img">
                  <img src={post.img} alt="" />
                </div>
                <div className="content">
                  <div className="title">{post.title}</div>
                  <div className="description">{post.desc}</div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="no-posts">
            <p>We're hard at work here! Come back soon :)</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Home;
