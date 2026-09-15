import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const container = document.getElementById("root");

// Message explicite plutôt qu'un `!` : si le point de montage disparaît de
// `index.html`, l'erreur dit quoi corriger.
if (!container) {
  throw new Error("Point de montage introuvable : #root est absent du document.");
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
