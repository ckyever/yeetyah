import * as api from "../lib/api";

interface UserTitleProps {
  user: api.UsersListItem;
}

function UserTitle({ user }: UserTitleProps) {
  let title;
  if (user.display_name) {
    title = `${user.display_name} (${user.username})`;
  } else {
    title = user.username;
  }

  return (
    <div>
      {user.profile_image && (
        <img src={user.profile_image} alt={`${title}'s profile picture`} />
      )}
      <div>{title}</div>
    </div>
  );
}

export default UserTitle;
