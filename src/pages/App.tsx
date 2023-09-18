import { useState, useEffect } from "react";
import "../styles/App.css";
import Card from "../components/card/Card";
import Navbar from "../components/card/navbar/Navbar";
import { useQuery } from "@tanstack/react-query";

const App = () => {
  const allPokemons = async () => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/`);
    return res.json();
  };

  const { isLoading, isError, data } = useQuery<{ count: number }>({
    queryKey: [`all-pokemons`],
    queryFn: allPokemons,
  });

  const itemsPerPage = 4;

  const [currentPage, setCurrentPage] = useState(
    parseInt(localStorage.getItem("currentPage") ?? "1")
  );
  const list = Array.from(
    { length: data?.count ?? 0 },
    (_, index) => index + 1
  );

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage.toString());
  }, [currentPage]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentList = list.slice(startIndex, endIndex);

  return (
    <>
      <Navbar />

      {/* navbar */}
      <div className="filtering-gap">
        {/* Button that says favorites */}
        <a
          href="/favorites"
          onClick={() => localStorage.setItem("currentPage", "1")}
        >
          <button className="favorite-button">Favorites</button>
        </a>
      </div>

      {/* Main body */}
      <div className="app__main-body">
        {/* Card */}
        {isError ? (
          <h1>Could not get all pokemons</h1>
        ) : isLoading ? (
          <h1>Loading</h1>
        ) : data ? (
          currentList.map((id) => <Card key={id} id={id} />)
        ) : (
          <h1>Something went wrong</h1>
        )}
      </div>

      {/* Page system */}
      <div className="app__page-system">
        <button
          className="app__prev-page-button"
          disabled={currentPage === 1}
          onClick={handlePrevPage}
        >
          Prev
        </button>
        <div className="app__current-page">Page {currentPage}</div>
        <button
          className="app__next-page-button"
          disabled={endIndex >= list.length}
          onClick={handleNextPage}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default App;
