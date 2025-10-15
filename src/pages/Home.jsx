import React from "react";
import { Link } from "react-router-dom";
import AuthorFooter from "../components/AuthorFooter";
import { authors } from "../authors/authors";
import landfillCover from "/src/header.jpg"
import aboutUsCover from "../img/group_photo.jpg"
import ReactGA from 'react-ga4';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom'; 
import { Card } from '../components/Card';
import { ImageWithFallback } from "../components/ImageWithFallback";


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
      excerpt: "We researched and visualized all of the abandoned landfills across the bay area.",
      image: landfillCover,
      authors: [authors.mattie, authors.destiny, authors.nick, authors.maggie],
      date: "Oct 20, 2025"
    },
    {
      id: "about",
      title: "Learn more about our team!",
      excerpt: "Curious to learn about the people who put this site together?",
      image: aboutUsCover,
      authors: [],
      date: "Oct 20, 2025"
    },
    
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 via-pink-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {posts.map((article) => (
            <Card 
              key={article.id} 
              className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-teal-300 bg-white cursor-pointer"
              onClick={() => setSelectedArticle(article.id)}
            >
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                {/* <Badge 
                  className="absolute top-3 left-3 bg-white/90 text-blue-700 border-blue-200"
                  variant="secondary"
                >
                  {"category"}
                </Badge> */}
              </div>
              
              <div className="p-6">
                <h3 className="mb-3 line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {article.excerpt}
                </p>

                <div className="flex flex-col gap-2 pt-4 border-t">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {/* <User className="w-4 h-4" /> */}
                    {/* <span className="truncate">{article.author}</span> */}
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <div className="flex items-center gap-2">
                      {/* <Calendar className="w-4 h-4" /> */}
                      <span>{article.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* <Clock className="w-4 h-4" /> */}
                      {/* <span>{article.readTime}</span> */}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Coming Soon Message */}
        <div className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-lg border-2 border-dashed border-green-300">
          <div className="max-w-md mx-auto">
            <div className="mb-4">✨</div>
            <h3 className="mb-2">More Stories Coming Soon!</h3>
            <p className="text-muted-foreground">
              We're just getting started. Check back soon for more local Bay Area goodness!
            </p>
          </div>
        </div>
        </div>
    </div>
  );

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
