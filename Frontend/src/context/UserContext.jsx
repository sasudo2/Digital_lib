import React, { createContext, useState, useEffect } from "react";

export const UserDataContext = createContext();

const defaultUser = {
  email: "",
  fullname: { firstname: "", lastname: "" },
  profilePic: "",
  readBooks: [],
  timeSpentMinutes: 0,
  createdAt: new Date().toISOString(),
};

const UserContext = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("pathsala_user");
      return raw ? JSON.parse(raw) : defaultUser;
    } catch (e) {
      return defaultUser;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("pathsala_user", JSON.stringify(user));
    } catch (e) {
      // ignore storage errors
    }
  }, [user]);

  return (
    <UserDataContext.Provider value={{ user, setUser }}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContext;
