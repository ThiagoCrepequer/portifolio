import { createBrowserRouter } from "react-router-dom";
import Home from "Pages/Home";
import Layout from "Pages/Layout";
import Projetos from "Pages/Projetos";
import NotFound from "Pages/NotFound";
import Contatos from "Pages/Contatos";
import SobreMim from "Pages/SobreMim";
import SobreProjetos from "Pages/SobreProjetos";

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
        element: <Projetos />,
        children: [
            {
                path: "/projetos/sobre/*",
                element: <SobreProjetos />
            }
        ]
      },
      {
        path: "/contatos",
        element: <Contatos />
      },
      {
        path: "/sobremim",
        element: <SobreMim />
      }
    ]
  },
  {
    path: "/*",
    element: <NotFound />
  }
])

export default router;
