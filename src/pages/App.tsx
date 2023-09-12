import { useState, useEffect } from "react";
import "../styles/App.css";
import Card from "../components/card/Card";
import Navbar from "../components/card/navbar/Navbar";
import { useQuery } from "@tanstack/react-query";
import PokemonColors from "../types/PokemonColors";
import PokemonSpecies from "../types/PokemonSpecies";

const App = () => {
  // Acual code

  const [itemsPerPage, setItemsPerPage] = useState(
    parseInt(localStorage.getItem("itemsPerPage") ?? "4")
  );

  const [currentPage, setCurrentPage] = useState(
    parseInt(localStorage.getItem("currentPage") ?? "1")
  );

  const [currentFilter, setCurrentFilter] = useState(
    localStorage.getItem("currentFilter") ?? "none"
  );

  const list = [];

  for (let index = 1; index <= 35; index++) {
    list.push(index);
  }

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage.toString());
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem("itemsPerPage", itemsPerPage.toString());
  }, [itemsPerPage]);

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
        <button className="favorite-button">Favorites</button>

<<<<<<< HEAD
        <p
          style={{
            display: "inline-block",
            color: "black",
            marginRight: "10px",
            marginLeft: "20px",
          }}
        >
          Results per page:
        </p>

        {/* Option for selecting views per page */}
        <select
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
        >
          <option value="1">1</option>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
=======
        {/* Option for selecting views per page */}
        <div
          style={{
            display: "inline-block",
          }}
        >
          <p
            style={{
              display: "inline-block",
              color: "black",
              marginRight: "10px",
              marginLeft: "20px",
            }}
          >
            Results per page:
          </p>

          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
          >
            <option value="1">1</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>

        {/* Option for filtering by color */}
        <div
          style={{
            display: "inline-block",
          }}
        >
          <p
            style={{
              display: "inline-block",
              color: "black",
              marginRight: "10px",
              marginLeft: "20px",
            }}
          >
            Filter by color:
          </p>

          <select
            value={currentFilter}
            onChange={(e) => setCurrentFilter(e.target.value)}
          >
            <option value="none">none</option>
            <option value="green">green</option>
            <option value="red">red</option>
            <option value="blue">blue</option>
            <option value="black">black</option>
            <option value="purple">purple</option>
          </select>
        </div>
>>>>>>> a9780c0 (WIP filtering)
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

export default App;
