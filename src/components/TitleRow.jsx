import React from "react"
import Logo from "/logo_tmp.jpeg"
import { Link } from "react-router-dom"
import Navbar from "./Navbar"

const TitleRow = () => {
  return (
    <div className="title_row">
      <div className="container">
        <Link className="link" to="/">
          <div className="logo">
            <img src={Logo} alt="" />
          </div>
        </Link>
        <div className="title">the bay area data dump</div>
        <Navbar />
      </div>
    </div>
  )
}
export default TitleRow
