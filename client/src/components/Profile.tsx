import { Link } from "react-router";

import Logout from "./Logout";

import styles from "../styles/Profile.module.css";

import defaultIcon from "../assets/default-icon.png";

interface Props {
  profileImage: string | null;
  username: string | null;
  displayName: string | null;
  toggleUserList: () => void;
}

function Profile({
  profileImage,
  username,
  displayName,
  toggleUserList,
}: Props) {
  const profileName = displayName ? `${displayName} (${username})` : username;
  const imagePreview =
    profileImage && profileImage.length > 0 ? profileImage : defaultIcon;
  return (
    <div className={styles.profile}>
      <div className={styles.title}>
        {imagePreview && <img src={imagePreview} alt="your profile picture" />}
        <div className={styles["profile-text"]}>
          <h1 className={styles["profile-title"]}>{profileName}</h1>
          <Link to="/profile" className={styles["edit-link"]}>
            Edit
          </Link>
        </div>
      </div>
      <button className={styles["users-button"]} onClick={toggleUserList}>
        Users
      </button>
      <div className={styles["logout-button"]}>
        <Logout />
      </div>
    </div>
  );
}

export default Profile;
