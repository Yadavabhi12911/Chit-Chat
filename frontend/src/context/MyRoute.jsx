

import { createBrowserRouter } from "react-router-dom"
import Home from "../pages/Home.jsx"
import Login from "../pages/Login.jsx"
import Resgister from "../pages/Resgister.jsx"
import Layout from "../components/Layout.jsx"

 export const myRoutes = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/register",
                element: <Resgister />
            },

        ]
    }
])

