import * as api from "../lib/api";

import styles from "../styles/UserTitle.module.css";

interface UserTitleProps {
  user: api.UsersListItem;
  showProfileImage?: boolean;
}

function UserTitle({ user, showProfileImage = true }: UserTitleProps) {
  let title;
  if (user.display_name) {
    title = `${user.display_name} (${user.username})`;
  } else {
    title = user.username;
  }

  return (
    <div className={styles["user-title"]}>
      <div>{title}</div>
      {showProfileImage && user.profile_image && (
        <img src={user.profile_image} alt={`${title}'s profile picture`} />
      )}
    </div>
  );
}

export default UserTitle;
