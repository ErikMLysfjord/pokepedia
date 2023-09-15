import { useState, useEffect } from "react";
import Card from "../components/card/Card";
import Navbar from "../components/card/navbar/Navbar";
import { useQuery } from "@tanstack/react-query";
import PokemonColors from "../types/PokemonColors";
import { Pokemons } from "../types/Pokemons";
import PokemonSpecies from "../types/PokemonSpecies";
import Pagination from "../components/pagination/Pagination";

const useFetchPokemonQuery = (
  resultsPerPage: number,
  pageNumber: number,
  filter: string
) => {
  return useQuery(["pokemon", resultsPerPage, pageNumber, filter], async () => {
    if (filter !== "none") {
      /* Get data of all pokemon species */
      return (await fetch(`https://pokeapi.co/api/v2/pokemon-color/${filter}`))
        .json()
        .then(async (data: PokemonColors) => {
          /* Get URL of all pokémon-species of the specified color */
          /* Sliced based on how many results per page and current page number */
          const speciesUrl = data.pokemon_species
            .map((species) => {
              return species.url;
            })
            .slice(
              (pageNumber - 1) * resultsPerPage,
              pageNumber * resultsPerPage
            );
          /* Get data of all the species with the relevant color */
          const speciesData: PokemonSpecies[] = await Promise.all(
            speciesUrl.map(async (url) => {
              const res = await fetch(url);
              return res.json() as unknown as PokemonSpecies;
            })
          );

          /* Get name and URL of the default pokémon in every species */
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
    /* Get data of pokémons. Limit decides the amount of pokémons we get */
    /* Offset decides from which pokémon we want. If we have 2 results per page and we are on page 2,
    then we want pokémon 21-40, so offset = 20. */
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
  /* States based on filters that are set in session storage */
  const [itemsPerPage, setItemsPerPage] = useState(
    parseInt(sessionStorage.getItem("itemsPerPage") ?? "5")
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

  const {
    data: pokemonList,
    isLoading,
    isError,
  } = useFetchPokemonQuery(itemsPerPage, currentPage, currentFilter);

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
      <Navbar />

      {/* navbar */}
      <div className="filtering-gap">
        {/* Button that says favorites */}
        <button className="favorite-button">Favorites</button>

        {/* Option for selecting results per page */}
        <div className="app__rpp-container">
          <p className="app__rpp-text">Results per page:</p>

          <select
            className="app__rpp-select"
            value={itemsPerPage}
            onChange={(e) => {
              handleResetPage();
              setItemsPerPage(parseInt(e.target.value));
            }}
          >
            <option value="1">1</option>
            <option value="5" defaultChecked>
              5
            </option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>

        {/* Option for filtering by color */}
        <div className="app__fbc-container">
          <p className="app__fbc-text">Filter by color:</p>

          <select
            className="app__fbc-select"
            value={currentFilter}
            onChange={(e) => {
              handleResetPage();
              handleChangeFilter(e.target.value);
            }}
          >
            <option value="none">None</option>
            <option value="green">Green</option>
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option value="black">Black</option>
            <option value="purple">Purple</option>
            <option value="yellow">Yellow</option>
            <option value="brown">Brown</option>
            <option value="gray">Gray</option>
            <option value="pink">Pink</option>
            <option value="white">White</option>
          </select>
        </div>
      </div>

      <div className="app__main-body">
        {/* Mapping over all pokémons, and rendering a Card for each one */}
        {pokemonList?.map((pokemon, index) => {
          return <Card key={`${pokemon.name}-${index}`} id={pokemon.url} />;
        })}
      </div>
      <div className="app__pagination-container">
        <Pagination
          count={100}
          currentIndex={0}
          onChange={function (index: number): void {
            console.log(index);
          }}
        />
      </div>
    </>
  );
};

export default App;
