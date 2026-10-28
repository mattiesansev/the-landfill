import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import rentControlCover from "/src/rent_control.jpeg"
import supervisorCover from "/src/img/RepsMap.png"
import { authors } from "../authors/authors";
import landfillCover from "/src/header.jpg"
import aboutUsCover from "../img/group.jpg"
import ReactGA from 'react-ga4';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Logo from "../img/logo_transparent.png"
import treeArticleCover from "../img/cover_tree_article.png"


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
      id: "monthly-roundup",
      title: "Board of Supervisors Monthly Roundup",
      desc: "A monthly digest of the most discussed and debated topics from the SF Board of Supervisors.",
      img: supervisorCover,
      imgFit: "contain",
      authors: [authors.mattie],
      category: CATEGORIES.POLITICS
    },
    {
      id: "urban-forestry-history",
      title: "The History of San Francisco's Urban Forest",
      desc: "San Francisco’s urban forest has taken many different shapes over the past century. From sand dunes and sidewalks to a budding urban forest, this article follows the story of the City’s urban forest and its past, present, and future.",
      img: treeArticleCover,
      authors:[authors.destiny],
      category: CATEGORIES.HISTORICAL
    },
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
      id: "supervisor-updates",
      title: "What is my district supervisor up to?",
      desc: "Weekly recaps of SF Board of Supervisors meetings - votes, debates, and decisions that affect your neighborhood.",
      img: supervisorCover,
      imgFit: "contain",
      authors: [authors.mattie],
      category: CATEGORIES.POLITICS
    },
    {
      id: "how-board-works",
      title: "How the Board of Supervisors Works",
      desc: "Dive into how the board of supervisors functions in San Francisco",
      img: supervisorCover,
      imgFit: "contain",
      authors: [authors.mattie],
      category: CATEGORIES.POLITICS
    },
    {
      id: "about",
      title: "Learn more about our team!",
      desc: "Curious to learn about the people who put this site together?",
      img: aboutUsCover,
      imgPosition: "50% 15%",
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
                <div className="img" style={post.imgFit ? { background: '#e2eef3' } : undefined}>
                  <img src={post.img} alt="" style={{ objectFit: post.imgFit, objectPosition: post.imgPosition }} />
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
