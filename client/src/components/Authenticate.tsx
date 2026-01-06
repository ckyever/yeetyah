import { useState } from "react";
import { Link } from "react-router";

import styles from "../styles/Authenticate.module.css";

interface AuthenticateProps {
  authMode: "Login" | "Signup";
}

function Authenticate({ authMode }: AuthenticateProps) {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleAuthModeSwitch = () => {
    setUsername("");
    setDisplayName("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className={styles["page-authenticate"]}>
      <form className={styles["authenticate-form"]}>
        <h1>{authMode === "Login" ? "Yeetyah" : "Sign Up"}</h1>
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
