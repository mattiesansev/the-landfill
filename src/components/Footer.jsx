import React from "react"
import Logo from "../img/logo_transparent.png"

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center space-y-4">
          <img 
            src={Logo} 
            alt="The Bay Area Data Dump" 
            className="h-12 w-auto opacity-60"
          />
          <p className="text-gray-600 text-sm font-medium">
            Made with love in San Francisco
          </p>
        </div>
      </div>
    </footer>
  )
}
export default Footer
