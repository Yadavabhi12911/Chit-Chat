

import { createBrowserRouter } from "react-router-dom"
import Home from "../pages/Home.jsx"
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

        ]
    }
])