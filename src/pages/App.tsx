import { useState, useEffect } from "react";
import Card from "../components/card/Card";
import { useQuery } from "@tanstack/react-query";
import PokemonColors from "../types/PokemonColors";
import { Pokemons } from "../types/Pokemons";
import PokemonSpecies from "../types/PokemonSpecies";
import Pagination from "../components/pagination/Pagination";
import FilterSelect from "../components/filter-select/FilterSelect";
import SearchField from "../components/searchfield/SearchField";

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

          return { pokemonData, listLength: data.pokemon_species.length };
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
        return { pokemonData: data.results, listLength: data.count };
      });
  });
};

const colorFilters = [
  "none",
  "green",
  "red",
  "blue",
  "black",
  "purple",
  "yellow",
  "brown",
  "gray",
  "pink",
  "white",
];

const App = () => {
  /* States based on filters that are set in session storage */
  const [itemsPerPage, setItemsPerPage] = useState(
    parseInt(sessionStorage.getItem("itemsPerPage") ?? "1")
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
      <div className="app__searchbar-filter-wrapper">
        <FilterSelect
          options={colorFilters}
          selected={currentFilter}
          label="Filter by color"
          handleChange={(e) => {
            handleResetPage();
            handleChangeFilter(e.target.value);
          }}
        />
        <FilterSelect
          label="Results per page"
          options={["1", "5", "10", "20"]}
          selected={itemsPerPage.toString()}
          handleChange={(e) => {
            handleResetPage();
            setItemsPerPage(parseInt(e.target.value));
          }}
        />
        <SearchField />
      </div>

      <div className="app__main-body">
        {/* Mapping over all pokémons, and rendering a Card for each one */}
        {pokemonList.pokemonData?.map((pokemon, index) => {
          return <Card key={`${pokemon.name}-${index}`} id={pokemon.url} />;
        })}
      </div>
      <div className="app__pagination-container">
        <Pagination
          /* The count is not actually 100. This will be fixed in Sondres MR */
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
