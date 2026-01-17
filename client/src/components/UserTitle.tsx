import * as api from "../lib/api";

import styles from "../styles/UserTitle.module.css";

interface UserTitleProps {
  user: api.UsersListItem;
  showProfileImage?: boolean;
  showListLayout?: boolean;
  showUsernameOnly?: boolean;
}

function UserTitle({
  user,
  showProfileImage = true,
  showListLayout = false,
  showUsernameOnly = false,
}: UserTitleProps) {
  let title;

  if (showUsernameOnly) {
    title = user.username;
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

  return (
    <div className={userTitleClass}>
      <div>{title}</div>
      {showProfileImage && user.profile_image && (
        <img src={user.profile_image} alt={`${title}'s profile picture`} />
      )}
    </div>
  );
}

export default UserTitle;
