import { useNavigate, useOutletContext } from "react-router";

import * as api from "../lib/api";
import * as constants from "../constants";
import * as context from "../context";

import buttonStyles from "../styles/Buttons.module.css";

import logoutIcon from "../assets/icons/logout.svg";

function Logout() {
  const navigate = useNavigate();
  const { setUserToken, setCurrentUser } =
    useOutletContext<context.OutletContext>();

  const handleLogout = () => {
    setUserToken("");
    setCurrentUser({} as api.User);
    localStorage.removeItem(constants.LOCAL_STORAGE_KEY_USER_TOKEN);
    localStorage.removeItem(constants.LOCAL_STORAGE_KEY_USER);
    navigate("/login", { replace: true });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`${buttonStyles.button} ${buttonStyles.yellow}`}
    >
      <img
        src={logoutIcon}
        alt="logout icon"
        className={`${buttonStyles.icon} ${buttonStyles.logout}`}
      />
    </button>
  );
}

export default Logout;
