import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const posts = [
    {
      id: "bay-area-landfills",
      title: "Landfills across the Bay Area",
      desc: "We researched and visualized all of the abandoned landfills across the bay area.",
      img: "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
    },
    {
      id: "about",
      title: "About us",
      desc: "Curious to learn about the people who put this site together?",
      img: "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
    },
    // {
    //   id: "about",
    //   title: "About us",
    //   desc: "Curious to learn about the people who put this site together?",
    //   img: "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
    // },
    // {
    //   id: "about",
    //   title: "About us",
    //   desc: "Curious to learn about the people who put this site together?",
    //   img: "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
    // },
    // {
    //   id: "about",
    //   title: "About us",
    //   desc: "Curious to learn about the people who put this site together?",
    //   img: "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
    // },
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
                <h1>{post.title}</h1>
                <p>{post.desc}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Home;
