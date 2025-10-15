import React from "react"
import Logo from "../img/logo_transparent.png"
import { Link } from "react-router-dom"
import Navbar from "./Navbar"

const TitleRow = () => {
  return (
      <header className="bg-white/80 backdrop-blur-sm border-b-4 border-teal-400 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="bg-gradient-to-r from-blue-500 via-teal-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                  The Bay Area Data Dump
                </h1>
                <p className="text-muted-foreground mt-1">
                  Your daily dose of local news & wholesome chaos
                </p>
              </div>
              <div className="hidden md:flex items-center gap-4">
                {/* <Badge variant="secondary" className="bg-teal-100 text-teal-700 border-teal-300">
                  3 Fresh Stories
                </Badge> */}
              </div>
            </div>
          </div>
        </div>
      </header>
  )
}
export default TitleRow
