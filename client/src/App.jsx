import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
} from 'react-router-dom'
import Single from "./pages/Single"
import Home from "./pages/Home"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import "./style.scss"

const Layout = () => {
  return (
    <>
    <Navbar />
    <Outlet />
    <Footer />
    </>
  )
}
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children:[
      {
        path:"/",
        element: <Home/>
      },
      {
        path:"/post/:id",
        element: <Single/>
      },
    ]
  },
])
function App() {
  return (
  <div className='app'>
    <div className='container'>
      <RouterProvider router={router}/>
    </div>
  </div>
  );
}

export default App;
