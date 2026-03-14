import React from "react"
import { Link } from "react-router-dom"
import { authors } from "../authors/authors"
import groupPhoto from "../img/group_cropped.jpg"

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
      desc: "Nick never wrote a bio.",
      img: authors.nick.photo,
    },
    {
      name: "Maggie Carroll",
      desc: "Maggie Carroll is an SF-based lady about town. Maggie graduated from UC Berkeley in 2022, majoring in Global Studies and Media Studies, and minoring in Journalism. She now works for the great state of California in a government oversight role. Maggie has really enjoyed working on the blog article with this incredible team! In her free time, Maggie enjoys doing ceramics, chatting with strangers, and meticulously decorating for various holidays.",
      img: authors.maggie.photo,
    },
    {
      name: "Megan Roche",
      desc: "Megan Roche is a software engineer with a degree in Physics from Carnegie Mellon, and this is her first time working on a non-work coding project since college! She has a passion for learning- whether by reading books, taking CCSF courses, or going to seminars. She's excited to learn more about the beautiful city of San Francisco through working on the Bay Area Data Dump!",
    }
  ]
  return (
    <div className="about">
      <div className="about-group-photo">
        <img src={groupPhoto} alt="The Bay Area Data Dump team" />
      </div>
      <div className="about-section">
        <h2>About the blog</h2>
        <p>The Bay Area Data Dump is a space for us to explore and share just about anything related to the San Francisco Bay Area. We are San Francisco residents who are excited to share our love for the place we live!</p>
      </div>
      <div className="about-section">
        <h2>AI Disclaimer</h2>
        <p>The Bay Area Data Dump team does not use AI for any research, written content or art. We do use AI tools to help with coding and designing the website. We're a small team, and we are doing our best to put some genuine content out there!</p>
      </div>
      <h2 className="meet-the-team">Meet the team</h2>
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
