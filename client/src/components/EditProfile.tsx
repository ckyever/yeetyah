import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router";

import * as api from "../lib/api";
import * as context from "../context";
import * as constants from "../constants";

import styles from "../styles/EditProfile.module.css";

import defaultIcon from "../assets/default-icon.png";

function EditProfile() {
  const { currentUser, setCurrentUser } =
    useOutletContext<context.OutletContext>();

  const [displayName, setDisplayName] = useState<string | undefined>(
    currentUser!.display_name,
  );
  const [saveStatus, setSaveStatus] = useState("");
  const [imagePreview, setImagePreview] = useState(
    currentUser?.profile_image ? currentUser?.profile_image : defaultIcon,
  );

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
        JSON.stringify(result.data.user),
      );

      navigate("/");
    } else {
      setSaveStatus("Unable to save profile details");
    }
  };

  const handleProfileImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files) return;

    const uploadedImage = files[0];

    if (uploadedImage) {
      const imageUrl = URL.createObjectURL(uploadedImage);
      setImagePreview(imageUrl);

      return () => URL.revokeObjectURL(imageUrl);
    }
  };

  return (
    <div className={styles["edit-profile"]}>
      <h1>Edit Profile</h1>
      <form onSubmit={handleSave} className={styles["edit-form"]}>
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
        <div className={styles["profile-image-select"]}>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="your profile picture"
              className={styles["image-preview"]}
            ></img>
          )}
          <input
            id="profile-image"
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={handleProfileImageChange}
          ></input>
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
