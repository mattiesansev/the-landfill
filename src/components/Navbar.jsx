import React from "react"
import Logo from "/logo_tmp.jpeg"
import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="container">
        <div className="links">
          <Link className="link" to="/post/about">
            <h6>about us</h6>
          </Link>
          <Link className="link" to="/contact">
            <h6>contact</h6>
          </Link>
        </div>
      </div>
    </div>
  )
}
export default Navbar
