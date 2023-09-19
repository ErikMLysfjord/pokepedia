import { useState, useEffect } from "react";
import Card from "../components/card/Card";
import { useQuery } from "@tanstack/react-query";
import PokemonColors from "../types/PokemonColors";
import { Pokemons } from "../types/Pokemons";
import PokemonSpecies from "../types/PokemonSpecies";
import Pagination from "../components/pagination/Pagination";
import { useLocation } from "react-router-dom";

import FilterSelect from "../components/filter-select/FilterSelect";

const useFetchPokemonQuery = (
  resultsPerPage: number,
  pageNumber: number,
  filter: string,
  pokemonLength: number,
  sort: string,
  favorites: boolean
) => {
  return useQuery(
    [
      "pokemon",
      resultsPerPage,
      pageNumber,
      filter,
      pokemonLength,
      sort,
      favorites,
    ],
    async () => {
      // If we are on the favorites page, we want to fetch the data of the pokémons that are in the favorites
      if (favorites) {
        const fav = (
          JSON.parse(localStorage.getItem("favorites") ?? "[]") as number[]
        ).sort((a, b) => (sort == "Ascending" ? a - b : b - a));

        const pokemonData = fav
          .slice((pageNumber - 1) * resultsPerPage, pageNumber * resultsPerPage)
          .map((id) => {
            return {
              name: "",
              url: "https://pokeapi.co/api/v2/pokemon/" + id,
            };
          });

        return { pokemonData, listLength: fav.length };
      }

      if (filter !== "none") {
        /* Get data of all pokemon species */
        return (
          await fetch(`https://pokeapi.co/api/v2/pokemon-color/${filter}`)
        )
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
            return { pokemonData, listLength: data.pokemon_species.length };
          });
      }
      /* Get data of pokémons. Limit decides the amount of pokémons we get */
      /* Offset decides from which pokémon we want. If we have 2 results per page and we are on page 2,
    then we want pokémon 21-40, so offset = 20. */

      /* If we have already fetched the data of all pokémons, then we don't need to fetch it again, since 
        we only need the length of the list if there are no filters
      */
      const prewPage = localStorage.getItem("previousPage");
      if (prewPage === "favorites") {
        localStorage.setItem("previousPage", "");
      }

      // if prew page is favorites, we want to fetch the data of the pokémons to update the list length
      return pokemonLength === 0 || prewPage === "favorites"
        ? (
            await fetch(
              `https://pokeapi.co/api/v2/pokemon?limit=${resultsPerPage}&offset=${
                (pageNumber - 1) * resultsPerPage
              }`
            )
          )
            .json()
            .then((data: Pokemons) => {
              return { pokemonData: data.results, listLength: data.count };
            })
        : {
            pokemonData: Array.from(Array(resultsPerPage).keys()).map((i) => {
              return {
                name: "",
                url:
                  "https://pokeapi.co/api/v2/pokemon/" +
                  ((pageNumber - 1) * resultsPerPage + i + 1),
              };
            }),
            listLength: pokemonLength,
          };
    }
  );
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
      <div className="app__filtering-gap">
        {isFavoritesPage ? (
          <div className="app__filtering-container">
            <span className="app__filtering-text">Sorting</span>
            <FilterSelect
              options={["Ascending", "Descending"]}
              selected={sort}
              handleChange={(e) => {
                handleResetPage();
                setSort(e.target.value);
                sessionStorage.setItem("sort", e.target.value);
              }}
            />
          </div>
        ) : (
          <div className="app__filtering-container">
            <span className="app__filtering-text">Filter by color</span>
            <FilterSelect
              options={colorFilters}
              selected={currentFilter}
              handleChange={(e) => {
                handleResetPage();
                handleChangeFilter(e.target.value);
                if (e.target.value === "none") {
                  setPokemonLength(0);
                }
              }}
            />
          </div>
        )}

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
