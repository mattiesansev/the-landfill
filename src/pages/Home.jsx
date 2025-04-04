import React from "react";
import { Link } from "react-router-dom";
import AuthorFooter from "../components/AuthorFooter";
import { authors } from "../authors/authors";
import landfillCover from "/src/header.jpg"
import aboutUsCover from "../img/group_photo.jpg"
import ReactGA from 'react-ga4';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom'; 


ReactGA.initialize('G-NR2T70PVBG'); 

const Home = () => {
  const location = useLocation();

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
      authors: [authors.mattie, authors.destiny, authors.nick, authors.maggie]
    },
    {
      id: "about",
      title: "Learn more about our team!",
      desc: "Curious to learn about the people who put this site together?",
      img: aboutUsCover,
      authors: [],
    },
    {
      id: 'rent-control-analysis',
      title:
        "WIP rent control analysis",
      desc: "WIP.",
      img: landfillCover,
      authors: [authors.mattie, authors.destiny, authors.nick]
    },
    
  ];
  return (
    <div className="home">
      <div className="posts">
        {posts.map((post) => (
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
        ))}
      </div>
    </div>
  );
};
export default Home;
