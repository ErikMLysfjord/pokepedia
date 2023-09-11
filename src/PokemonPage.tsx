import { useQuery } from "@tanstack/react-query";
import PokemonType from "./types/PokemonType";
import "./pokemon-page.css";
import "./App.css";

const useFetchPokemonQuery = (id: string) => {
  return useQuery<PokemonType>(["pokemon", id], async () =>
    (await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)).json()
  );
};

const PokemonPage = ({ id }: { id: string }) => {
  const { data, isLoading, isError } = useFetchPokemonQuery(id);

  if (isLoading) {
    return <h1 className="loading">Loading...</h1>;
  }
  if (isError) {
    return <h1 className="loading">Error fetching...</h1>;
  }
  console.log(data.height);

  return (
    <>
      <div
        style={{
          backgroundColor: "red",
          height: "150px",
        }}
      />
      {/* black line */}
      <div
        style={{
          backgroundColor: "black",
          height: "8px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Circle in the middle */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "50%",
            height: "50px",
            width: "50px",
            border: "4px solid black",
          }}
        />
      </div>

      {/* navbar */}
      {/* <div
        style={{
          margin: "50px auto",
          height: "50px",
          width: "85%",
        }}
      /> */}
      <div className="pokemon-page__container">
        <img className="pokemon-page__image" src={data.sprites.front_default} />
        <div className="pokemon-page__info">
          <h1>{data.name}</h1>
          <h2>Height: {data.height}</h2>
          <h2>Weight: {data.weight}</h2>
          {data.abilities.map((ability, index) => {
            return (
              <div key={index}>
                <p>{ability.ability.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default PokemonPage;
