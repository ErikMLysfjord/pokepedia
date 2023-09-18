import { useState, useEffect } from "react";
import "../styles/App.css";
import Card from "../components/card/Card";
import Navbar from "../components/card/navbar/Navbar";

const PokemonFav = () => {
  const itemsPerPage = 4;

  const [currentPage, setCurrentPage] = useState(
    parseInt(localStorage.getItem("currentPage") ?? "1")
  );

  const list = JSON.parse(
    localStorage.getItem("favorites") ?? "[]"
  ) as number[];

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
        <a href="/" onClick={() => localStorage.setItem("currentPage", "1")}>
          <button className="favorite-button">Home</button>
        </a>
      </div>

      {/* Main body */}
      <div className="app__main-body">
        {/* Card */}
        {currentList.map((id) => (
          <Card key={id} id={id} />
        ))}
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

export default PokemonFav;
