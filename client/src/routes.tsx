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
      { path: "login", element: <Authenticate authMode="Login" /> },
      { path: "signup", element: <Authenticate authMode="Signup" /> },
    ],
    errorElement: <Error />,
  },
];

export default routes;
