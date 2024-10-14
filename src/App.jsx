import { HashRouter as Router, Route, Routes } from "react-router-dom"
import Single from "./pages/Single"
import Home from "./pages/Home"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import "./style.scss"
import LandfillMap from "./pages/posts/LandfillMap"
import AboutUs from "./pages/AboutUs"
import TitleRow from "./components/TitleRow"

const Layout = ({ children }) => {
  return (
    <>
      <TitleRow />
      {children}
      <Footer />
    </>
  )
}

function App() {
  return (
    <div className="app">
      <div className="container">
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/post/bay-area-landfills"
                element={<LandfillMap />}
              />
              <Route path="/post/about" element={<AboutUs />} />
              {/* Uncomment when Contact component is ready */}
              {/* <Route path="/post/contact" element={<Contact />} /> */}
            </Routes>
          </Layout>
        </Router>
      </div>
    </div>
  )
}

export default App
