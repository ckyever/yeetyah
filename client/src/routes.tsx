import { redirect } from "react-router";

import App from "./App";
import Authenticate from "./components/Authenticate";
import Chat from "./components/Chat";
import Error from "./components/Error";
import Home from "./components/Home";

import * as constants from "./constants";

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
        loader: async () => {
          if (!localStorage.getItem(constants.LOCAL_STORAGE_KEY_USER_TOKEN)) {
            return redirect("/login");
          }
        },
      },
      {
        path: "login",
        element: <Authenticate authMode="Login" />,
        loader: async () => {
          if (localStorage.getItem(constants.LOCAL_STORAGE_KEY_USER_TOKEN)) {
            return redirect("/");
          }
        },
      },
      {
        path: "signup",
        element: <Authenticate authMode="Signup" />,
        loader: async () => {
          if (localStorage.getItem(constants.LOCAL_STORAGE_KEY_USER_TOKEN)) {
            return redirect("/");
          }
        },
      },
      {
        path: "chat",
        element: <Chat />,
        loader: async () => {
          if (!localStorage.getItem(constants.LOCAL_STORAGE_KEY_USER_TOKEN)) {
            return redirect("/login");
          }
        },
      },
    ],
    errorElement: <Error />,
  },
];

export default routes;
