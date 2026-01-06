import App from "./App";
import Authenticate from "./components/Authenticate";
import Error from "./components/Error";
import Home from "./components/Home";

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Authenticate /> },
      { path: "signup", element: <Authenticate /> },
    ],
    errorElement: <Error />,
  },
];

export default routes;
