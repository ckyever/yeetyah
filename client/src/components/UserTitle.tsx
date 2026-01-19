import * as api from "../lib/api";

import styles from "../styles/UserTitle.module.css";

import defaultIcon from "../assets/default-icon.png";

interface UserTitleProps {
  user: api.UsersListItem;
  showProfileImage?: boolean;
  showListLayout?: boolean;
  showDisplayNameOnly?: boolean;
}

function UserTitle({
  user,
  showProfileImage = true,
  showListLayout = false,
  showDisplayNameOnly = false,
}: UserTitleProps) {
  let title;

  if (showDisplayNameOnly) {
    title = user.display_name.length > 0 ? user.display_name : user.username;
  } else {
    if (user.display_name) {
      title = `${user.display_name} (${user.username})`;
    } else {
      title = user.username;
    }
  }

  const userTitleClass = showListLayout
    ? `${styles["user-title"]} ${styles["list-item"]}`
    : `${styles["user-title"]}`;

  const profileImage =
    user.profile_image.length > 0 ? user.profile_image : defaultIcon;

  return (
    <div className={userTitleClass}>
      <div>{title}</div>
      {showProfileImage && (
        <img src={profileImage} alt={`${title}'s profile picture`} />
      )}
    </div>
  );
}

export default UserTitle;
