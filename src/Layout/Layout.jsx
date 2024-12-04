/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { login, registerUser } from "../services/api";
import perfil from "../assets/perfil.png";
import logo from "../assets/logo.png";
import { usePopupContext } from "../providers/PopUpProvider";
import { useUserContext } from "../providers/UserProvider";
import "./Layout.css";

const Layout = () => {
  const [userLogin, setUserLogin] = useState({});
  const [userRegister, setUserRegister] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const { setUser } = useUserContext();
  const { showPopup, formType, triggerPopup, closePopup } = usePopupContext(); // Aquí usamos el PopupContext

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    if (storedIsLoggedIn === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await login({
        username: userLogin.username,
        password: userLogin.password,
      });
      if (user && user.id && user.token) {
        setUser(user);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userId", user.id);
        localStorage.setItem("token", user.token);
        setIsLoggedIn(true);
        closePopup();
      } else {
        setErrorMessage("Usuario o contraseña incorrectos.");
      }
    } catch (error) {
      setErrorMessage("Error al iniciar sesión. Inténtalo de nuevo.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (userRegister.password !== userRegister.confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }
    try {
      await registerUser(userRegister);
      closePopup();
    } catch {
      setErrorMessage("Error al registrar el usuario.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/");
  };

  return (
    <>
      <nav className="navbar-container">
        <div className="navbar">
          <div className="navbar-left">
            <a href="/">
              <img src={logo} alt="Logo" className="logo" />
            </a>
          </div>
          <div className="navbar-right">
            {!isLoggedIn ? (
              <>
                <button
                  className="navbar-button login"
                  onClick={() => triggerPopup("login")}
                >
                  Login
                </button>
                <button
                  className="navbar-button register"
                  onClick={() => triggerPopup("register")}
                >
                  Register
                </button>
              </>
            ) : (
              <div className="profile">
                <a href="/perfil">
                  <img src={perfil} alt="Perfil" className="profile-image" />
                </a>
                <button className="navbar-button logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {showPopup && (
        <div className="overlay">
          <div className="popup">
            <h2>{formType === "login" ? "Login" : "Register"}</h2>
            <form
              onSubmit={formType === "login" ? handleLogin : handleRegister}
            >
              <label>
                Usuario:
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ingresa tu usuario"
                  onChange={(e) =>
                    formType === "login"
                      ? setUserLogin({ ...userLogin, username: e.target.value })
                      : setUserRegister({
                          ...userRegister,
                          username: e.target.value,
                        })
                  }
                />
              </label>
              <label>
                Contraseña:
                <input
                  type="password"
                  className="input-field"
                  placeholder="Ingresa tu contraseña"
                  onChange={(e) =>
                    formType === "login"
                      ? setUserLogin({ ...userLogin, password: e.target.value })
                      : setUserRegister({
                          ...userRegister,
                          password: e.target.value,
                        })
                  }
                />
              </label>
              {formType === "register" && (
                <label>
                  Confirmar Contraseña:
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Confirma tu contraseña"
                    onChange={(e) =>
                      setUserRegister({
                        ...userRegister,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </label>
              )}
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <div className="button-group">
                <button
                  type="button"
                  className="close-button"
                  onClick={closePopup}
                >
                  Cerrar
                </button>
                <button type="submit" className="submit-button">
                  {formType === "login" ? "Ingresar" : "Registrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="main-content">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
