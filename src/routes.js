import { createBrowserRouter } from "react-router-dom";
import Home from "Pages/Home";
import Layout from "Pages/Layout";
import Projetos from "Pages/Projetos";
import NotFound from "Pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "/projetos",
        element: <Projetos />
      }
    ]
  },
  {
    path: "/*",
    element: <NotFound />
  }
])

export default router;
