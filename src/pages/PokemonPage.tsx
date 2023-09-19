import { useQuery } from "@tanstack/react-query";
import PokemonType from "../types/PokemonType";
import "../styles/pokemon-page.css";
import "../styles/App.css";
import { useParams } from "react-router-dom";
import PokemonTable from "../components/pokemonTable/PokemonTable";
import TypeBadge from "../components/typeBadge/TypeBadge";
import InfoCard from "../components/infoCard/InfoCard";
import NoResults from "./NoResults";
import weight from "../assets/weight.png";
import height from "../assets/height.png";
import mainability from "../assets/ability.png";
import hiddenability from "../assets/hiddenability.png";

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
              <InfoCard
                label="Weight"
                value={data.weight / 10 + "kg"}
                icon={weight}
              />
              <InfoCard
                label="Height"
                value={data.height / 10 + "m"}
                icon={height}
              />
            </div>
            {data.abilities.map((ability, index) => {
              return (
                <InfoCard
                  key={`${index}-${ability.ability.name}`}
                  label={!ability.is_hidden ? "Ability" : "Hidden Ability"}
                  value={ability.ability.name
                    .charAt(0)
                    .toUpperCase()
                    .concat(ability.ability.name.slice(1))}
                  icon={!ability.is_hidden ? mainability : hiddenability}
                />
              );
            })}
          </div>
          <PokemonTable {...data} />
        </div>
      </div>
    </div>
  );
};

export default PokemonPage;
