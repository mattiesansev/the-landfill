import React from "react"
import Logo from "../img/logo_transparent.png"

const Footer = () => {
  return (
          <footer className="bg-white/80 backdrop-blur-sm border-t-4 border-blue-400 mt-12">
          <div className="max-w-6xl mx-auto px-4 py-8 text-center">
            <p className="text-muted-foreground">
              Made with 💙 in the Bay Area | The Bay Area Data Dump © 2025
            </p>
            <p className="text-muted-foreground mt-2">
              Serving up local news with a side of fun since 2025
            </p>
          </div>
        </footer>
  )
}
export default Footer
