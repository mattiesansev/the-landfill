import React from "react";

const Menu = () => {
  const posts = [
    {
      id: 1,
      title: "Test title 1",
      desc: "Descriptions",
      img: "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
    },
    // {
    //   id: 2,
    //   title: "Test title 1",
    //   desc: "Descriptions",
    //   img: "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
    // },
    // {
    //   id: 3,
    //   title: "Test title 1",
    //   desc: "Descriptions",
    //   img: "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
    // },
    // {
    //   id: 4,
    //   title: "Test title 1",
    //   desc: "Descriptions",
    //   img: "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
    // },
    // {
    //   id: 5,
    //   title: "Test title 1",
    //   desc: "Descriptions",
    //   img: "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
    // },
  ];
  return (
    <div className="menu">
      <h1>Other posts</h1>
      {posts.map((post) => (
        <div className="post" key={post.id}>
          <img src={post.img}></img>
          <h2>{post.title}</h2>
          <button>Read More</button>
        </div>
      ))}
    </div>
  );
};
export default Menu;
