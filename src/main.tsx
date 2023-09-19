import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./pages/App.tsx";
import Pokemon from "./pages/PokemonPage.tsx";
import PokemonFav from "./pages/Favorites.tsx";
import "./styles/index.css";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import NoResults from "./pages/NoResults.tsx";
import Navbar from "./components/navbar/Navbar.tsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <React.StrictMode>
      <BrowserRouter basename="/project1">
        <Navbar />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/pokemon/:id" element={<Pokemon />} />
          <Route path="/favorites" element={<PokemonFav />} />
          <Route path="*" element={<NoResults />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  </QueryClientProvider>
);
