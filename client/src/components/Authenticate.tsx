interface AuthenticateProps {
  authMode: "Login" | "Signup";
}

function Authenticate({ authMode }: AuthenticateProps) {
  return (
    <>
      <h1>{authMode} Page</h1>
    </>
  );
}

export default Authenticate;
