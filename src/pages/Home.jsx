import React from "react";
import { Link } from "react-router-dom";
import AuthorFooter from "../components/AuthorFooter";
import { authors } from "../authors/authors";
import landfillCover from "/src/header.jpg"

const Home = () => {
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
      img: "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
      authors: [],
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
                <div className="authors">
                  { post.authors.map((author) => {
                    return <AuthorFooter
                      authorImageUrl={author.photo}
                      postDate="July 15, 2024"
                      authorName={author.name}
                    />
                  })}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Home;
