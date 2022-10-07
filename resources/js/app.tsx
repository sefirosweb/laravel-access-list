import React from "react";
import { createRoot } from "react-dom/client";
import RoutesConfig from "@/routes/RoutesConfig";

if (document.getElementById("root")) {
  const root = createRoot(document.getElementById("root"));

  root.render(
    <React.StrictMode>
      <RoutesConfig />
    </React.StrictMode>,
  );
}
