import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
} from "react-router-dom";
import Single from "./pages/Single";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./style.scss";
import LandfillMap from "./pages/posts/LandfillMap";
import AboutUs from "./pages/AboutUs";
import TitleRow from "./components/TitleRow";
import Contact from "./pages/Contact";

const Layout = () => {
  return (
    <>
      <TitleRow />
      <Outlet />
      <Footer />
    </>
  );
};
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
    ],
  },
]);
function App() {
  return (
    <div className="app">
      <div className="container">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
