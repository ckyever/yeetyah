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

  return <div>{title}</div>;
}

export default UserTitle;
