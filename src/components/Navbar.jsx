import React from "react"
import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <nav className="flex items-center space-x-6">
      <Link 
        to="/post/about" 
        className="text-gray-700 hover:text-accent font-medium transition-colors duration-200 ease-in-out relative group"
      >
        about
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-200 group-hover:w-full"></span>
      </Link>
      <Link 
        to="/post/contact" 
        className="text-gray-700 hover:text-accent font-medium transition-colors duration-200 ease-in-out relative group"
      >
        contact
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-200 group-hover:w-full"></span>
      </Link>
    </nav>
  )
}
export default Navbar
