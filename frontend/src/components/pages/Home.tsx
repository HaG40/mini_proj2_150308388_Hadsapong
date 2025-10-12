import React, { useContext } from "react";
import { AuthContext, UserContext } from "../../App";

function Home() {
  const authContext = useContext(AuthContext);
  const userContext = useContext(UserContext);

  if (!authContext || !userContext) {
    return <h1>Context not available</h1>;
  }

  const { isAuthenticated } = authContext;
  const { user } = userContext;

  return (
    <div>
      <h1>{isAuthenticated ? `Welcome, ${user}` : "Please login"}</h1>
    </div>
  );
}

export default Home;
