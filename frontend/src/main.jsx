import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#1a103f",
            color: "#e2d9f3",
            border: "1px solid rgba(231,121,193,0.3)",
            fontFamily: "Ubuntu, sans-serif",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#e779c1", secondary: "#1a103f" } },
          error:   { iconTheme: { primary: "#ef9fbc", secondary: "#1a103f" } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
