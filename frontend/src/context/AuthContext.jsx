import React from "react";
import { createContext } from "react";
export const authDataContext = createContext();

function AuthContext({ children }) {
  const serverUrl = "https://linkedin-backend-7kvt.onrender.com";
  let value = {
    serverUrl
  };
  return (
    <div>
      <authDataContext.Provider value={value}>
        {children}
      </authDataContext.Provider>
    </div>
  );
}

export default AuthContext;
