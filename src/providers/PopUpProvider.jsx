/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [formType, setFormType] = useState("login");

  const triggerPopup = (type = "login") => {
    setFormType(type);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <PopupContext.Provider
      value={{ showPopup, formType, triggerPopup, closePopup }}
    >
      {children}
    </PopupContext.Provider>
  );
};

export const usePopupContext = () => useContext(PopupContext);
