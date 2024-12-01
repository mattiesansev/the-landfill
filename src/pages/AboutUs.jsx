import React from "react"
import { Link } from "react-router-dom"
import { authors } from "../authors/authors"

const AboutUs = () => {
  const people = [
    {
      name: "Mattie Sanseverino",
      desc: "Mattie is a software engineer at Figma. She loves picnics and crafting. She is so excited to be working on this blog!",
      img: authors.mattie.photo,
    },
    {
      name: "Destiny Santana",
      desc: "Mattie is a software engineer at Figma. She loves picnics and crafting. She is so excited to be working on this blog!",
      img: authors.destiny.photo,
    },
    {
      name: "Nick Vargas",
      desc: "Mattie is a software engineer at Figma. She loves picnics and crafting. She is so excited to be working on this blog!",
      img: authors.nick.photo,
    },
    {
      name: "Maggie Carroll",
      desc: "Mattie is a software engineer at Figma. She loves picnics and crafting. She is so excited to be working on this blog!",
      img: authors.maggie.photo,
    },
  ]
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
  )
}
export default AboutUs
