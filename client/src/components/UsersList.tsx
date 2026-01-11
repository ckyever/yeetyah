import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";

import * as api from "../lib/api";
import * as context from "../context";

import UserTitle from "./UserTitle";

interface UsersListProps {
  setSelectedUser: React.Dispatch<
    React.SetStateAction<api.UsersListItem | null>
  >;
}

function UsersList({ setSelectedUser }: UsersListProps) {
  const [usersList, setUsersList] = useState<api.UsersListItem[]>([]);

  const { user } = useOutletContext<context.OutletContext>();

  useEffect(() => {
    const getUsers = async () => {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/users`;
      const result: api.UsersListResult =
        await api.apiFetch<api.UsersListResult>(url);
      if (result) {
        setUsersList(result.data.users);
      }
    };
    getUsers();
  }, []);

  const handleUserClick = (user: api.UsersListItem) => {
    setSelectedUser(user);
  };

  return (
    <div>
      <h2>Users ({usersList.length})</h2>
      {usersList.length === 0 ? (
        <div>*Cricket noises* 🦗</div>
      ) : (
        <ul>
          {usersList &&
            usersList.map((profile) => {
              // Only show user if it isn't the current one
              return (
                <li key={profile.id} onClick={() => handleUserClick(profile)}>
                  <UserTitle user={profile} />
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}

export default UsersList;
