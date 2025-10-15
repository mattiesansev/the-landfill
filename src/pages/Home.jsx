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
    
  ];
  
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {posts.map((post) => (
            <article 
              key={post.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden card-hover group"
            >
              <Link to={`/post/${post.id}`} className="block">
                {/* Image Container */}
                <div className="relative h-64 sm:h-80 overflow-hidden">
                  <img 
                    src={post.img} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="image-overlay group-hover:opacity-100"></div>
                </div>
                
                {/* Content */}
                <div className="p-6 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-display font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-200">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                    {post.desc}
                  </p>
                  
                  {/* Authors */}
                  {post.authors && post.authors.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.authors.map((author, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <img 
                            src={author.img} 
                            alt={author.name}
                            className="w-8 h-8 rounded-full object-cover border border-gray-200"
                          />
                          <span className="text-xs text-gray-500 font-medium">
                            {author.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
};
export default Home;
