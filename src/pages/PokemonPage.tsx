import { useQuery } from "@tanstack/react-query";
import PokemonType from "../types/PokemonType";
import "../styles/pokemon-page.css";
import "../styles/App.css";
import { useParams } from "react-router-dom";

const useFetchPokemonQuery = (id: string) => {
  return useQuery<PokemonType>(["pokemon", id], async () =>
    (await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)).json()
  );
};

const PokemonPage = () => {
  const searchParams = useParams();
  console.log("params ", searchParams.id);
  const { data, isLoading, isError } = useFetchPokemonQuery(
    searchParams.id?.toString() ?? "1"
  );

  if (isLoading) {
    return <h1 className="loading">Loading...</h1>;
  }
  if (isError) {
    return <h1 className="loading">Error fetching...</h1>;
  }

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
      <div className="pokemon-page__container">
        <img
          className="pokemon-page__image"
          src={data.sprites.front_default}
          alt="Image of pokémon"
        />
        <div className="pokemon-page__intro">
          <h1 className="pokemon-page__intro-header">{data.name}</h1>
          {data.is_default ? (
            <h2>This is a default pokémon</h2>
          ) : (
            <h2>This is not a default pokémon</h2>
          )}
        </div>

        <div className="pokemon-page__info-left">
          <h3>General info:</h3>
          <hr />
          <p>Height: {data.height / 10} meters</p>
          <p>Weight: {data.weight / 10} kg</p>
          <div>
            Type(s):{" "}
            {data.types.map((typeObject, index) => {
              return (
                <div
                  key={`${index}-${typeObject.type.name}`}
                  className={`pokemon-page__type pokemon-page__type-${typeObject.type.name}`}
                >
                  {typeObject.type.name}
                </div>
              );
            })}
          </div>
          <p>Abilities: </p>
          <ol>
            {data.abilities.map((ability, index) => {
              return (
                <div key={`${index}-${ability.ability.name}`}>
                  <li className="pokemon-page__abilities">
                    {ability.ability.name}{" "}
                    {ability.is_hidden && <span>(hidden ability)</span>}
                  </li>
                </div>
              );
            })}
          </ol>
        </div>
        <div className="pokemon-page__info-right">
          <h3>Base stats:</h3>
          <hr />
          <table className="pokemon-page__stats-table">
            <tbody>
              {data.stats.map((stat, index) => {
                return (
                  <tr
                    className="pokemon-page__stats-row"
                    key={`${index}-${stat.stat.name}`}
                  >
                    <th className="pokemon-page__stats-header">
                      {stat.stat.name}
                    </th>
                    <td>{stat.base_stat}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PokemonPage;
