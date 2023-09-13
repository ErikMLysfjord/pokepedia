import { useState, useEffect } from "react";
import Card from "../components/card/Card";
import Navbar from "../components/card/navbar/Navbar";
import { useQuery } from "@tanstack/react-query";
import PokemonColors from "../types/PokemonColors";
import { Pokemons } from "../types/Pokemons";
import PokemonSpecies from "../types/PokemonSpecies";

const useFetchPokemonQuery = (
  resultsPerPage: number,
  pageNumber: number,
  filter: string
) => {
  return useQuery(["pokemon", resultsPerPage, pageNumber, filter], async () => {
    if (filter !== "none") {
      return (await fetch(`https://pokeapi.co/api/v2/pokemon-color/${filter}`))
        .json()
        .then(async (data: PokemonColors) => {
          const speciesUrl = data.pokemon_species
            .map((species) => {
              return species.url;
            })
            .slice(
              (pageNumber - 1) * resultsPerPage,
              pageNumber * resultsPerPage
            );
          const speciesData: PokemonSpecies[] = await Promise.all(
            speciesUrl.map(async (url) => {
              const res = await fetch(url);
              return res.json() as unknown as PokemonSpecies;
            })
          );
          const pokemonData = speciesData.map((pokemon) => {
            return pokemon.varieties[0].pokemon;
          });

          /* If we ever want to include non-default pokémons as well, then this code allows it */
          /* However, then we run into a bug where each page will display more results than we want */
          /* const pokemonData: { name: string; url: string }[] = [];
          speciesData.forEach((pokemon) => {
            pokemon.varieties.forEach((element) => {
              pokemonData.push(element.pokemon);
            });
          }); */

          return pokemonData;
        });
    }
    return (
      await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${resultsPerPage}&offset=${
          (pageNumber - 1) * resultsPerPage
        }`
      )
    )
      .json()
      .then((data: Pokemons) => {
        return data.results;
      });
  });
};

const App = () => {
  const [itemsPerPage, setItemsPerPage] = useState(
    parseInt(localStorage.getItem("itemsPerPage") ?? "4")
  );
  const [currentFilter, setCurrentFilter] = useState(
    localStorage.getItem("currentFilter") ?? "none"
  );

  const [currentPage, setCurrentPage] = useState(
    parseInt(localStorage.getItem("currentPage") ?? "1")
  );

  const handleChangeFilter = (filter: string) => {
    setCurrentFilter(filter);
    localStorage.setItem("currentFilter", filter);
  };

  const {
    data: pokemonList,
    isLoading,
    isError,
  } = useFetchPokemonQuery(itemsPerPage, currentPage, currentFilter);

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

  if (isError) {
    return <h1 className="loading">Error fetching...</h1>;
  }

  if (isLoading) {
    return <h1 className="loading">Loading...</h1>;
  }

  return (
    <>
      <Navbar />

      {/* navbar */}
      <div className="filtering-gap">
        {/* Button that says favorites */}
        <button className="favorite-button">Favorites</button>

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
            onChange={(e) => handleChangeFilter(e.target.value)}
          >
            <option value="none">none</option>
            <option value="green">green</option>
            <option value="red">red</option>
            <option value="blue">blue</option>
            <option value="black">black</option>
            <option value="purple">purple</option>
          </select>
        </div>
      </div>

      {/* Main body */}
      <div className="app__main-body">
        {/* Card */}

        {pokemonList?.map((temp, index) => {
          return <Card key={`${temp.name}-${index}`} id={temp.url} />;
        })}
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
          style={{ marginLeft: "10px" }}
          /* disabled={endIndex >= list.length} */
          onClick={handleNextPage}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default App;
