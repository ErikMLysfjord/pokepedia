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
  return useQuery(
    ["pokemon", resultsPerPage, pageNumber],
    async () => {
      if (filter !== "none") {
        return (
          await fetch(`https://pokeapi.co/api/v2/pokemon-color/${filter}`)
        )
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

            const speciesData = await Promise.all(
              speciesUrl
                .map(async (url) => {
                  return await fetch(url).then((res: PokemonSpecies) =>
                    res.json()
                  );
                })
                .slice(
                  (pageNumber - 1) * resultsPerPage,
                  pageNumber * resultsPerPage
                )
            );
            const pokemonData = [];
            speciesData.forEach((pokemon) => {
              pokemon.varieties.forEach((element) => {
                pokemonData.push(element.pokemon);
              });
            });
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
    }
    /* {
      onSuccess: (data) => {
        console.log(data.results);
      },
    } */
  );
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

  /* const list: number[] = [];
  for (let index = 1; index <= 35; index++) {
    list.push(index);
  } */

  /* const getGreenSpecies = async () => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon-color/green`);
    return res.json();
  };

  const getRedSpecies = async () => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon-color/red`);
    return res.json();
  };

  const getBlueSpecies = async () => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon-color/blue`);
    return res.json();
  };

  const getPurpleSpecies = async () => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon-color/purple`);
    return res.json();
  };

  const getBlackSpecies = async () => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon-color/black`);
    return res.json();
  };

  const greenSpecies = useQuery<PokemonColors>({
    queryKey: ["greenSpecies"],
    queryFn: getGreenSpecies,
  }).data?.pokemon_species;

  const redSpecies = useQuery<PokemonColors>({
    queryKey: ["redSpecies"],
    queryFn: getRedSpecies,
  }).data?.pokemon_species;

  const blueSpecies = useQuery<PokemonColors>({
    queryKey: ["blueSpecies"],
    queryFn: getBlueSpecies,
  }).data?.pokemon_species;

  const purpleSpecies = useQuery<PokemonColors>({
    queryKey: ["purpleSpecies"],
    queryFn: getPurpleSpecies,
  }).data?.pokemon_species;

  const blackSpecies = useQuery<PokemonColors>({
    queryKey: ["blackSpecies"],
    queryFn: getBlackSpecies,
  }).data?.pokemon_species; */

  //create list of pokemonIDs based on color
  /* const greenList = greenSpecies?.map((species) => {
    const id = species.url.split("/")[6];
    return parseInt(id);
  });

  const redList = redSpecies?.map((species) => {
    const id = species.url.split("/")[6];
    return parseInt(id);
  });

  const blueList = blueSpecies?.map((species) => {
    const id = species.url.split("/")[6];
    return parseInt(id);
  });

  const purpleList = purpleSpecies?.map((species) => {
    const id = species.url.split("/")[6];
    return parseInt(id);
  });

  const blackList = blackSpecies?.map((species) => {
    const id = species.url.split("/")[6];
    return parseInt(id);
  }); */

  //create list of pokemonIDs based on color

  /* const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  useEffect(() => {
    if (currentFilter === "green") {
      setCurrentList((greenList ?? []).slice(startIndex, endIndex));
    } else if (currentFilter === "red") {
      setCurrentList((redList ?? []).slice(startIndex, endIndex));
    } else if (currentFilter === "blue") {
      setCurrentList((blueList ?? []).slice(startIndex, endIndex));
    } else if (currentFilter === "purple") {
      setCurrentList((purpleList ?? []).slice(startIndex, endIndex));
    } else if (currentFilter === "black") {
      setCurrentList((blackList ?? []).slice(startIndex, endIndex));
    } else {
      setCurrentList(list.slice(startIndex, endIndex));
    }
  }, [currentFilter, startIndex, endIndex]); */

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
