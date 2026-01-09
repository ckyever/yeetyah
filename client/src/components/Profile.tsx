import Logout from "./Logout";

interface Props {
  username: string | null;
  displayName: string | null;
}

function Profile({ username, displayName }: Props) {
  const profileName = displayName ? `${displayName} (${username})` : username;
  return (
    <div>
      <h1>{profileName}</h1>
      <Logout />
    </div>
  );
}

export default Profile;
