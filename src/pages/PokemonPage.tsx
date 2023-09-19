import { useQuery } from "@tanstack/react-query";
import PokemonType from "../types/PokemonType";
import "../styles/pokemon-page.css";
import "../styles/App.css";
import { useParams } from "react-router-dom";
import PokemonTable from "../components/pokemonTable/PokemonTable";
import TypeBadge from "../components/typeBadge/TypeBadge";
import InfoCard from "../components/infoCard/InfoCard";
import PokeBall from "../assets/pokemon-ball.svg";
import NoResults from "./NoResults";

const useFetchPokemonQuery = (id: string) => {
  return useQuery<PokemonType>(["pokemon", id], async () =>
    (await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)).json()
  );
};

const PokemonPage = () => {
  const searchParams = useParams();
  const { data, isLoading, isError } = useFetchPokemonQuery(
    searchParams.id?.toString() ?? "1"
  );

  if (isLoading) {
    return <h1 className="loading">Loading...</h1>;
  }

  if (isError) {
    return <NoResults title={"404"} underTitle={"No pokemon found"} />;
  }

  return (
    // <>
    //   <div className="pokemon-page__container">
    //     <img
    //       className="pokemon-page__image"
    //       src={data.sprites.front_default}
    //       alt="Image of pokémon"
    //     />
    //     <div className="pokemon-page__intro">
    //       <h1 className="pokemon-page__intro-header">{data.name}</h1>
    //       {data.is_default ? (
    //         <h2>This is a default pokémon</h2>
    //       ) : (
    //         <h2>This is not a default pokémon</h2>
    //       )}
    //     </div>

    //     <div className="pokemon-page__info-left">
    //       <h3>General info:</h3>
    //       <hr />
    //       <p>Height: {data.height / 10} meters</p>
    //       <p>Weight: {data.weight / 10} kg</p>
    //       <div>
    //         Type(s): {/* Mapping over type(s) and displays it */}
    //         {data.types.map((typeObject, index) => {
    //           return (
    //             <div
    //               key={`${index}-${typeObject.type.name}`}
    //               className={`pokemon-page__type pokemon-page__type-${typeObject.type.name}`}
    //             >
    //               {typeObject.type.name}
    //             </div>
    //           );
    //         })}
    //       </div>
    //       <p>Abilities: </p>
    //       <ol>
    //         {/* Mapping over a pokémons abilities and displays it in a table */}
    //         {data.abilities.map((ability, index) => {
    //           return (
    //             <div key={`${index}-${ability.ability.name}`}>
    //               <li className="pokemon-page__abilities">
    //                 {ability.ability.name}{" "}
    //                 {ability.is_hidden && <span>(hidden ability)</span>}
    //               </li>
    //             </div>
    //           );
    //         })}
    //       </ol>
    //     </div>
    //     <div className="pokemon-page__info-right">
    //       <h3>Base stats:</h3>
    //       <hr />
    //       <table className="pokemon-page__stats-table">
    //         <tbody>
    //           {/* Mapping over a pokémons stats and displays it in a table */}
    //           {data.stats.map((stat, index) => {
    //             return (
    //               <tr
    //                 className="pokemon-page__stats-row"
    //                 key={`${index}-${stat.stat.name}`}
    //               >
    //                 <th className="pokemon-page__stats-header">
    //                   {stat.stat.name}
    //                 </th>
    //                 <td>{stat.base_stat}</td>
    //               </tr>
    //             );
    //           })}
    //         </tbody>
    //       </table>
    //     </div>
    //   </div>
    // </>

    <div className="pokemonPage__centerContent">
      <div className="pokemonPage__mainPanel">
        <div className="pokemonPage__pokemonIngress">
          <div className="pokemonPage__ImageCircle">
            <img
              className="pokemonPage__image"
              src={data.sprites.front_default}
              alt="Image of pokémon"
            />
          </div>
          <div className="pokemonPage__nameNumber">
            <p className="pokemonPage__id">#{data.id}</p>
            <p className="pokemonPage__pokemonName">{data.name}</p>
          </div>
          <div className="pokemonPage__typeBadges">
            {data.types.map((type, index) => {
              return (
                <TypeBadge
                  key={`${index}-${type.type.name}`}
                  pokeType={type.type.name}
                />
              );
            })}
          </div>
        </div>
        <div className="pokemonPage__dataContainer">
          <div>
            <div className="pokemonPage__InfoCard-split-row">
              <InfoCard label="Weight" value="xxx" icon={PokeBall} />
              <InfoCard label="Height" value="xxx" icon={PokeBall} />
            </div>
            <InfoCard label="Ability" value="xxx" icon={PokeBall} />
            <InfoCard label="Hidden Ability" value="xxx" icon={PokeBall} />
          </div>
          <PokemonTable {...data} />
        </div>
      </div>
    </div>
  );
};

export default PokemonPage;
