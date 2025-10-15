import React from "react"
import Logo from "../img/logo_transparent.png"
import { Link } from "react-router-dom"
import Navbar from "./Navbar"

const TitleRow = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="flex items-center">
              <img 
                src={Logo} 
                alt="The Bay Area Data Dump" 
                className="h-12 w-auto sm:h-16"
              />
            </div>
          </Link>
          
          {/* Title */}
          <div className="flex-1 flex justify-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-primary text-center">
              the bay area data dump
            </h1>
          </div>
          
          {/* Navigation */}
          <div className="flex-shrink-0">
            <Navbar />
          </div>
        </div>
      </div>
    </header>
  )
}
export default TitleRow
