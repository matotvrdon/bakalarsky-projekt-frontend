import React from "react";
import { createRoot } from "react-dom/client";

import AppNext from "./app/App";
import "../src/styles/index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <React.StrictMode>
    <AppNext />
  </React.StrictMode>,
);
