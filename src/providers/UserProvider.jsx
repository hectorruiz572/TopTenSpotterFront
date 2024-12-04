/* eslint-disable react/prop-types */
import { createContext, useState, useContext, useEffect } from "react";

const AppContext = createContext();
export const useUserContext = () => useContext(AppContext);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Verificar si el usuario está logueado cuando la aplicación se carga
  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    const storedUserId = localStorage.getItem("userId");
    const storedToken = localStorage.getItem("token");

    if (storedIsLoggedIn === "true" && storedUserId && storedToken) {
      setUser({ id: storedUserId, token: storedToken });
    }
  }, []);

  const login = (userData) => {
    setUser(userData); // Almacenar el usuario
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userId", userData.id);
    localStorage.setItem("token", userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
  };

  return (
    <AppContext.Provider value={{ user, login, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export default UserProvider;
