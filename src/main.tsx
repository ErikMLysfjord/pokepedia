import React from "react";
import ReactDOM from "react-dom/client";
/* import App from "./App.tsx"; */
import Pokemon from "./PokemonPage.tsx";
import "./index.css";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <React.StrictMode>
      {/* <App /> */}
      <Pokemon id="701" />
    </React.StrictMode>
  </QueryClientProvider>
);
