import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
const authContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const getProfile = async () => {
    try {
      const res = await axios.get("http://localhost:3000/auth/profile", {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getProfile();
  }, []);
  return (
    <authContext.Provider value={{ user, getProfile, setUser }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(authContext);
};
