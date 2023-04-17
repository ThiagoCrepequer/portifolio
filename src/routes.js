import { createBrowserRouter } from "react-router-dom";
import Home from "./Pages/Home";
import Layout from "./Pages/Layout";
import Projetos from "./Pages/Projetos";

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
  }
])

//createRoutesFromElements(
//  <Route path="/" element={<Layout />}>
//    <Route path="/" element={<Home />}/>
//  </Route>
//)

export default router;
