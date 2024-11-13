import React from "react";
import Logo from "../img/logo_tmp.jpeg";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar">
          <Link className="link" to="/post/about">
            about us
          </Link>
          <Link className="link" to="/contact">
            contact
          </Link>
    </div>
  );
};
export default Navbar;
