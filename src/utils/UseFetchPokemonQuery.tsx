import { useQuery } from "@tanstack/react-query";
import PokemonColors from "../types/PokemonColors";
import PokemonSpecies from "../types/PokemonSpecies";
import { Pokemons } from "../types/Pokemons";

/**
 * Custom hook that fetches Pokemon data from the PokeAPI based on given parameters.
 * @param resultsPerPage - The number of results to display per page.
 * @param pageNumber - The current page number.
 * @param filter - The filter to apply to the Pokemon data (e.g. by color).
 * @param pokemonLength - The length of the Pokemon list.
 * @param sort - The sorting order for the Pokemon data.
 * @param favorites - A boolean indicating whether to display only favorite Pokemon.
 * @returns An object containing the Pokemon data.
 */
export const useFetchPokemonQuery = (
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
