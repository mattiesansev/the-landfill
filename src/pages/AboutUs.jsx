import React from "react"
import { Link } from "react-router-dom"
import { authors } from "../authors/authors"

const AboutUs = () => {
  const people = [
    {
      name: "Mattie Sanseverino",
      desc: "Mattie is a software engineer at Figma. When she was a student at UCLA, she worked for the Daily Bruin's engineering and data jornalism department, and is so excited to get back into data driven journalism! So far, she primarily works on the website and data analysis and visualizations. She loves living in San Francisco and frequently jogs and bikes all around it. She also loves to craft, but her favorite thing to do is just hang out!",
      img: authors.mattie.photo,
    },
    {
      name: "Destiny Santana",
      desc: "Destiny Santanna is a data analyst who has worked in mapping and data analysis since 2021. She holds a bachelor’s and master’s degree in Geography from West Chester University. In spring 2024, she began researching landfills and waste management in the Bay Area and began mapping the footprints of historic landfills, which eventually led to the creation of the Bay Area Data Dump. Destiny’s role has been to research, collect data, map, and write articles for the blog. When Destiny isn’t blogging you can find her birding in Golden Gate Park, playing with her cat Milo, or reading on the bus.",
      img: authors.destiny.photo,
    },
    {
      name: "Nick Vargas",
      desc: "",
      img: authors.nick.photo,
    },
    {
      name: "Maggie Carroll",
      desc: "Maggie Carroll is an SF-based lady about town. Maggie graduated from UC Berkeley in 2022, majoring in Global Studies and Media Studies, and minoring in Journalism. She now works for the great state of California in a government oversight role. Maggie has really enjoyed working on the blog article with this incredible team! In her free time, Maggie enjoys doing ceramics, chatting with strangers, and meticulously decorating for various holidays.",
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
