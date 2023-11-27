import { useState, useEffect } from "react";
import Card from "../components/card/Card";
import Pagination from "../components/pagination/Pagination";
import { useLocation } from "react-router-dom";
import FilterSelect from "../components/filter-select/FilterSelect";
import SearchField from "../components/searchfield/SearchField";
import { useFetchPokemonQuery } from "../utils/UseFetchPokemonQuery";
import { colorFilters, resultsPerPage } from "../config/filterValues";

/**
 * Renders the main page of the application.
 * @returns {JSX.Element} - A React component that renders the main page.
 */
const App = () => {
  const location = useLocation();
  const isFavoritesPage = location.pathname.endsWith("/favorites");

  /* States based on filters that are set in session storage */
  const [itemsPerPage, setItemsPerPage] = useState(
    parseInt(sessionStorage.getItem("itemsPerPage") ?? "1")
  );

  const [sort, setSort] = useState(
    sessionStorage.getItem("sort") ?? "Ascending"
  );
  const [currentFilter, setCurrentFilter] = useState(
    sessionStorage.getItem("currentFilter") ?? "none"
  );

  const [currentPage, setCurrentPage] = useState(
    parseInt(sessionStorage.getItem("currentPage") ?? "1")
  );

  const handleChangeFilter = (filter: string) => {
    setCurrentFilter(filter);
    sessionStorage.setItem("currentFilter", filter);
  };

  //  if at new page, set current page to 1
  useEffect(() => {
    if (
      isFavoritesPage ||
      (!isFavoritesPage && localStorage.getItem("previousPage") === "favorites")
    ) {
      setCurrentPage(1);
    }
  }, [isFavoritesPage]);

  const [pokemonLength, setPokemonLength] = useState(0);

  const {
    data: pokemonList,
    isLoading,
    isError,
  } = useFetchPokemonQuery(
    itemsPerPage,
    currentPage,
    currentFilter,
    pokemonLength,
    sort,
    isFavoritesPage
  );

  useEffect(() => {
    if (pokemonList?.listLength) {
      setPokemonLength(pokemonList.listLength);
    }
  }, [pokemonList?.listLength]);

  /* Setting filtering values in session storage */
  useEffect(() => {
    sessionStorage.setItem("currentPage", currentPage.toString());
  }, [currentPage]);

  useEffect(() => {
    sessionStorage.setItem("itemsPerPage", itemsPerPage.toString());
  }, [itemsPerPage]);

  useEffect(() => {
    sessionStorage.setItem("currentFilter", currentFilter);
  }, [currentFilter]);

  const handleResetPage = () => {
    setCurrentPage(1);
  };

  if (isError) {
    return <h1 className="loading">Error fetching...</h1>;
  }

  if (isLoading) {
    return <h1 className="loading">Loading...</h1>;
  }

  return (
    <>
      <div className="app__searchbar-filter-wrapper">
        <div className="app__filter-wrapper">
          {isFavoritesPage ? (
            <FilterSelect
              options={["Ascending", "Descending"]}
              selected={sort}
              label="Sorting"
              handleChange={(e) => {
                handleResetPage();
                setSort(e.target.value);
                sessionStorage.setItem("sort", e.target.value);
              }}
            />
          ) : (
            <FilterSelect
              options={colorFilters}
              selected={currentFilter}
              label="Filter by color"
              handleChange={(e) => {
                handleResetPage();
                handleChangeFilter(e.target.value);
                if (e.target.value === "none") {
                  setPokemonLength(0);
                }
              }}
            />
          )}

          <div className="app__filtering-container">
            <FilterSelect
              label="Results per page"
              options={resultsPerPage}
              selected={itemsPerPage.toString()}
              handleChange={(e) => {
                handleResetPage();
                setItemsPerPage(parseInt(e.target.value));
              }}
            />
          </div>
        </div>
        <div className="app__form-wrapper">
          <SearchField />
        </div>
      </div>

      <div className="app__main-body">
        {/* Mapping over all pokémons, and rendering a Card for each one */}
        {pokemonList.pokemonData?.map((pokemon, index) => {
          return <Card key={`${pokemon.name}-${index}`} id={pokemon.url} />;
        })}
      </div>
      <div className="app__pagination-container">
        <Pagination
          count={Math.ceil(pokemonList.listLength / itemsPerPage)}
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
