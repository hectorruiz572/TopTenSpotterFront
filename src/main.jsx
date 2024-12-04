import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import UserProvider from "./providers/UserProvider.jsx";
import { PopupProvider } from "./providers/PopUpProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <PopupProvider>
        <App />
      </PopupProvider>
    </UserProvider>
  </StrictMode>
);
