import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom"
import Home from "./pages/Home"
import Footer from "./components/Footer"
import "./style.scss"
import LandfillMap from "./pages/posts/LandfillMap"
import AboutUs from "./pages/AboutUs"
import TitleRow from "./components/TitleRow"
import Contact from "./pages/Contact";
import Parcels from "./pages/posts/RentControl"
import SupervisorUpdates from "./pages/posts/SupervisorUpdates"
import WeeklyReport from "./pages/posts/WeeklyReport"
import UrbanForestryHistory from "./pages/posts/UrbanForestryHistory"
import MonthlyRoundup from "./pages/posts/MonthlyRoundup"
import HowBoardWorks from "./pages/posts/HowBoardWorks"
import AffordableHousingBonds from "./pages/posts/AffordableHousingBonds"

const Layout = () => {
  return (
    <>
      <TitleRow />
      <Outlet />
      <Footer />
    </>
  )
}
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/post/bay-area-landfills",
        element: <LandfillMap />,
      },
      {
        path: "/post/about",
        element: <AboutUs />,
      },
      {
        path:"/post/contact",
        element: <Contact/>
      },
      {
        path: "/post/rent-control-analysis",
        element: <Parcels />
      },
      {
        path: "/post/supervisor-updates",
        element: <SupervisorUpdates />
      },
      {
        path: "/post/supervisor-updates/:date",
        element: <WeeklyReport />
      },
      {
        path: "/post/urban-forestry-history",
        element: <UrbanForestryHistory/>
      },
      {
        path: "/post/monthly-roundup",
        element: <MonthlyRoundup />
      },
      {
        path: "/post/monthly-roundup/:month",
        element: <MonthlyRoundup />
      },
      {
        path: "/post/how-board-works",
        element: <HowBoardWorks />
      },
      {
        path: "/post/affordable-housing-bonds",
        element: <AffordableHousingBonds />
      },
    ],
  },
])
function App() {
  return (
    <div className="app">
      <div className="container">
        <RouterProvider router={router} />
      </div>
    </div>
  )
}

export default App
