import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router";

import * as api from "../lib/api";
import * as context from "../context";
import * as constants from "../constants";

function EditProfile() {
  const { currentUser, setCurrentUser } =
    useOutletContext<context.OutletContext>();

  const [displayName, setDisplayName] = useState<string | undefined>(
    currentUser!.display_name
  );
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");

    const url = `${import.meta.env.VITE_SERVER_URL}/api/users/${
      currentUser!.id
    }`;
    const result: api.UserResult = await api.apiFetch<api.UserResult>(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        display_name: displayName,
        profile_image: currentUser!.id,
      }),
    });

    if (result.ok) {
      setCurrentUser(result.data.user);
      localStorage.setItem(
        constants.LOCAL_STORAGE_KEY_USER,
        JSON.stringify(result.data.user)
      );

      navigate("/");
    } else {
      setErrorMessage("Unable to save profile details");
    }
  };

  return (
    <div>
      <h1>Edit Profile</h1>
      <form onSubmit={handleSave}>
        <div>
          <label htmlFor="display-name">Display Name</label>
          <input
            id="display-name"
            type="text"
            name="display-name"
            value={displayName}
            onChange={(event) => {
              setDisplayName(event.target.value);
            }}
          ></input>
        </div>
        <div>
          <label htmlFor="profile-image">Profile Picture</label>
          <input id="profile-image" type="file" name="profile-image"></input>
        </div>
        <div>
          <button type="submit">Save</button>
          <button type="button" onClick={() => navigate("/")}>
            Cancel
          </button>
        </div>
        {errorMessage && <div>{errorMessage}</div>}
      </form>
    </div>
  );
}

export default EditProfile;
