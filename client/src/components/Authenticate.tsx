import { useState } from "react";
import { Link } from "react-router";

import * as api from "../lib/api";

import ValidationErrors from "./ValidationErrors";

import styles from "../styles/Authenticate.module.css";

interface AuthenticateProps {
  authMode: "Login" | "Signup";
}

function Authenticate({ authMode }: AuthenticateProps) {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleAuthModeSwitch = () => {
    setUsername("");
    setDisplayName("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setValidationErrors([]);

    if (authMode === "Login") {
      console.log("Logging in");
    } else {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/users`;
      const result: api.FetchResult = await api.apiFetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, display_name: displayName }),
      });

      const errorMessages: string[] = [];
      if (!result.ok) {
        errorMessages.push("Unable to create an account");
      }

      if (result.data.errors) {
        errorMessages.push(
          ...result.data.errors.map((error: api.ValidatorError) => error.msg)
        );
      }
      setValidationErrors(errorMessages);

      // CKYTODO Save token and bring user to home page
    }
  };

  return (
    <div className={styles["page-authenticate"]}>
      <form
        className={styles["authenticate-form"]}
        onSubmit={(event) => handleSubmit(event)}
      >
        <h1>{authMode === "Login" ? "Yeetyah" : "Sign Up"}</h1>
        {validationErrors && <ValidationErrors errors={validationErrors} />}
        <div className={styles.field}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          ></input>
        </div>
        {authMode === "Signup" && (
          <div className={styles.field}>
            <label htmlFor="display-name">Display Name</label>
            <input
              type="text"
              id="display-name"
              name="display-name"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
            ></input>
          </div>
        )}
        <div className={styles.field}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          ></input>
        </div>
        {authMode === "Signup" && (
          <div className={styles.field}>
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            ></input>
          </div>
        )}
        <button type="submit" className={styles["submit-button"]}>
          {authMode === "Login" ? "Login" : "Create account"}
        </button>
      </form>
      {authMode === "Login" ? (
        <p>
          New to Yeetyah?{" "}
          <Link onClick={handleAuthModeSwitch} to="/signup">
            Create an account
          </Link>
        </p>
      ) : (
        <p>
          Already have an account?{" "}
          <Link onClick={handleAuthModeSwitch} to="/login">
            Login
          </Link>
        </p>
      )}
    </div>
  );
}

export default Authenticate;
