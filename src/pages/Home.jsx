import React from "react";
import { Link } from "react-router-dom";
import AuthorFooter from "../components/AuthorFooter";
import { authors } from "../authors/authors";

const Home = () => {
  const posts = [
    {
      id: "bay-area-landfills",
      title:
        "An analysis and visualization of abandoned and illegal landfills across the Bay Area",
      desc: "We researched and visualized all of the abandoned landfills across the bay area.",
      img: "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
    },
    {
      id: "about",
      title: "About us",
      desc: "Curious to learn about the people who put this site together?",
      img: "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
    },
    {
      id: "about",
      title: "About us",
      desc: "Curious to learn about the people who put this site together?",
      img: "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
    },
    {
      id: "about",
      title: "About us",
      desc: "Curious to learn about the people who put this site together?",
      img: "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
    },
    {
      id: "about",
      title: "About us",
      desc: "Curious to learn about the people who put this site together?",
      img: "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
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
                  <AuthorFooter
                    authorImageUrl={authors["mattie"]["photo"]}
                    postDate="July 15, 2024"
                    authorName={authors["mattie"]["name"]}
                  />
                  <AuthorFooter
                    authorImageUrl={authors["destiny"]["photo"]}
                    postDate="July 15, 2024"
                    authorName={authors["destiny"]["name"]}
                  />
                  <AuthorFooter
                    authorImageUrl={authors["destiny"]["photo"]}
                    postDate="July 15, 2024"
                    authorName={authors["destiny"]["name"]}
                  />
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
