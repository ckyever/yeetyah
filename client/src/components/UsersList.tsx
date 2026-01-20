import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";

import * as api from "../lib/api";
import * as context from "../context";

import CloseButton from "./CloseButton";
import UserTitle from "./UserTitle";

import styles from "../styles/UsersList.module.css";
import windowStyles from "../styles/Window.module.css";

interface UsersListProps {
  setSelectedUser: React.Dispatch<
    React.SetStateAction<api.UsersListItem | null>
  >;
  closeUsersList: () => void;
}

function UsersList({ setSelectedUser, closeUsersList }: UsersListProps) {
  const [usersList, setUsersList] = useState<api.UsersListItem[]>([]);

  const { currentUser } = useOutletContext<context.OutletContext>();

  useEffect(() => {
    const getUsers = async () => {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/users`;
      const result: api.UsersListResult =
        await api.apiFetch<api.UsersListResult>(url);
      if (result) {
        setUsersList(
          result.data.users.filter((user) => user.id !== currentUser!.id),
        );
      }
    };
    getUsers();
  }, [currentUser]);

  const handleUserClick = (user: api.UsersListItem) => {
    setSelectedUser(user);
  };

  const usersListTitle =
    usersList.length > 0 ? `Users (${usersList.length})` : "Users";

  return (
    <div className={windowStyles.window}>
      <div className={windowStyles["title-bar"]}>
        <h2 className={windowStyles["title-bar"]}>{usersListTitle}</h2>
        <CloseButton handleClick={closeUsersList} />
      </div>
      {usersList.length === 0 ? (
        <div>Loading...</div>
      ) : (
        <ul className={styles["users-list"]}>
          {usersList &&
            usersList.map((profile) => {
              // Only show user if it isn't the current one
              return (
                <li
                  key={profile.id}
                  className={styles["users-list-item"]}
                  onClick={() => handleUserClick(profile)}
                >
                  <UserTitle user={profile} showListLayout={true} />
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}

export default UsersList;
