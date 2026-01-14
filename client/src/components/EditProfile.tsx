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
  const [saveStatus, setSaveStatus] = useState("");

  const navigate = useNavigate();

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaveStatus("Saving...");

    const formData = new FormData(event.currentTarget);

    const url = `${import.meta.env.VITE_SERVER_URL}/api/users/${
      currentUser!.id
    }`;
    const result: api.UserResult = await api.apiFetch<api.UserResult>(url, {
      method: "PUT",
      body: formData,
    });

    if (result.ok) {
      setCurrentUser(result.data.user);
      localStorage.setItem(
        constants.LOCAL_STORAGE_KEY_USER,
        JSON.stringify(result.data.user)
      );

      navigate("/");
    } else {
      setSaveStatus("Unable to save profile details");
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
            name="displayName"
            value={displayName}
            onChange={(event) => {
              setDisplayName(event.target.value);
            }}
          ></input>
        </div>
        <div>
          {currentUser?.profile_image && (
            <img
              src={currentUser?.profile_image}
              alt="your profile picture"
            ></img>
          )}
          <label htmlFor="profile-image">Profile Picture</label>
          <input id="profile-image" type="file" name="profileImage"></input>
        </div>
        <div>
          <button type="submit">Save</button>
          <button type="button" onClick={() => navigate("/")}>
            Cancel
          </button>
        </div>
        {saveStatus && <div>{saveStatus}</div>}
      </form>
    </div>
  );
}

export default EditProfile;
