import React from "react"
import Logo from "../img/logo_tmp.jpeg"
import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <div className="navbar">
          <Link className="link" to="/post/about">
            about
          </Link>
          <Link className="link" to="/post/contact">
            contact
          </Link>
    </div>
  )
}
export default Navbar
