import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";

import * as api from "../lib/api";
import * as context from "../context";

function UsersList() {
  const [usersList, setUsersList] = useState<api.UsersListItem[]>([]);

  const { user } = useOutletContext<context.OutletContext>();

  useEffect(() => {
    const getUsers = async () => {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/users/`;
      const result: api.UsersListResult =
        await api.apiFetch<api.UsersListResult>(url);
      if (result) {
        setUsersList(result.data.users);
      }
    };
    getUsers();
  }, []);

  return (
    <div>
      <h2>Users ({usersList.length - 1})</h2>
      {usersList.length === 0 ? (
        <div>*Cricket noises* 🦗</div>
      ) : (
        <ul>
          {usersList &&
            usersList.map((profile) => {
              // Only show user if it isn't the current one
              if (user && user.id !== profile.id) {
                let profileTitle;
                if (profile.display_name) {
                  profileTitle = `${profile.display_name} (${profile.username})`;
                } else {
                  profileTitle = profile.username;
                }
                return <li>{profileTitle}</li>;
              }
            })}
        </ul>
      )}
    </div>
  );
}

export default UsersList;
