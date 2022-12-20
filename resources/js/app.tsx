import React from "react";
import { createRoot } from "react-dom/client";
import RoutesConfig from "@/routes/RoutesConfig";
import { useGetQueryClient } from "@sefirosweb/react-crud";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';


if (document.getElementById("root")) {
  const root = createRoot(document.getElementById("root"));

  const queryClient = useGetQueryClient()

  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RoutesConfig />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </React.StrictMode>,
  );
}
