import React from "react";
import { Link } from "react-router-dom";
import Landing from "../img/temp_landing.png";

const AboutUs = () => {
  const people = [
    {
      name: "Mattie Sanseverino",
      desc: "Mattie is a software engineer at Figma. She loves picnics and crafting. She is so excited to be working on this blog!",
      img: "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
    },
    {
      name: "Destiny Santana",
      desc: "Mattie is a software engineer at Figma. She loves picnics and crafting. She is so excited to be working on this blog!",
      img: "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
    },
    {
      name: "Nick Vargas",
      desc: "Mattie is a software engineer at Figma. She loves picnics and crafting. She is so excited to be working on this blog!",
      img: "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
    },
  ];
  return (
    <div className="about">
      <div className="people">
        {people.map((person) => (
          <div className="person" key={person.name}>
            <div className="img">
              <img src={person.img} alt="" />
            </div>
            <div className="content">
              <h1>{person.name}</h1>
              <p>{person.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AboutUs;
