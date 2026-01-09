import { useNavigate } from "react-router";
import * as constants from "../constants";

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem(constants.LOCAL_STORAGE_KEY_USER_TOKEN);
    navigate("/login", { replace: true });
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default Logout;
