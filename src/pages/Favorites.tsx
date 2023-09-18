import { useState, useEffect } from "react";
import Card from "../components/card/Card";
import Pagination from "../components/pagination/Pagination";
import FilterSelect from "../components/filter-select/FilterSelect";

const App = () => {
  const [currentPage, setCurrentPage] = useState(
    parseInt(localStorage.getItem("currentPage") ?? "1")
  );

  const pokemonList = (
    JSON.parse(localStorage.getItem("favorites") ?? "[]") as number[]
  ).sort();

  /* States based on filters that are set in session storage */
  const [itemsPerPage, setItemsPerPage] = useState(
    parseInt(sessionStorage.getItem("itemsPerPage") ?? "1")
  );

  /* Setting filtering values in session storage */
  useEffect(() => {
    sessionStorage.setItem("currentPage", currentPage.toString());
  }, [currentPage]);

  useEffect(() => {
    sessionStorage.setItem("itemsPerPage", itemsPerPage.toString());
  }, [itemsPerPage]);

  const handleResetPage = () => {
    setCurrentPage(1);
  };

  return (
    <>
      <div className="app__filtering-gap">
        <div className="app__filtering-container">
          <span className="app__filtering-text">Results per page</span>
          <FilterSelect
            options={["1", "5", "10", "20"]}
            selected={itemsPerPage.toString()}
            handleChange={(e) => {
              handleResetPage();
              setItemsPerPage(parseInt(e.target.value));
            }}
          />
        </div>
      </div>

      <div className="app__main-body">
        {/* Mapping over all pokémons, and rendering a Card for each one */}
        {pokemonList
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((id, index) => {
            console.log("test");

            return (
              <Card
                key={`${id}-${index}`}
                id={"https://pokeapi.co/api/v2/pokemon/" + id.toString()}
              />
            );
          })}
      </div>
      <div className="app__pagination-container">
        <Pagination
          /* The count is not actually 100. This will be fixed in Sondres MR */
          count={Math.ceil(pokemonList.length / itemsPerPage)}
          currentIndex={currentPage - 1}
          onChange={(index) => {
            setCurrentPage(index + 1);
          }}
        />
      </div>
    </>
  );
};

export default App;
