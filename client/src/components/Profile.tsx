import { Link } from "react-router";

import Logout from "./Logout";

import styles from "../styles/Profile.module.css";

interface Props {
  username: string | null;
  displayName: string | null;
}

function Profile({ username, displayName }: Props) {
  const profileName = displayName ? `${displayName} (${username})` : username;
  return (
    <div className={styles.profile}>
      <div className={styles.title}>
        <h1>{profileName}</h1>
        <Link to="/profile">Edit</Link>
      </div>
      <Logout />
    </div>
  );
}

export default Profile;
