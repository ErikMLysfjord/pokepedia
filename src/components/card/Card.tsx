import { useQuery } from "@tanstack/react-query";
import "./Card.css";
import "../../styles/App.css";

interface pokemonData {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  is_default: boolean;
  order: number;
  weight: number;
  abilities: [];
  forms: [];
  game_indices: [];
  held_items: [];
  location_area_encounters: string;
  moves: [];
  species: {
    name: string;
    url: string;
  };
  sprites: {
    back_default: string;
    back_female: string;
    back_shiny: string;
    back_shiny_female: string;
    front_default: string;
    front_female: string;
    front_shiny: string;
    front_shiny_female: string;
  };
  stats: [];
  types: [
    {
      type: {
        name: string;
        url: string;
      };
    }
  ];
  past_types: [];
}

// props, id: number
const Card = ({ id }: { id: string }) => {
  const getPokemon = async () => {
    /* Sjekker hva jeg henter og returnerer kun pokemonene */
    /* if (id.includes("pokemon-species")) {
      const res = await fetch(`${id}`);
      return res.json().then((data: PokemonSpecies) => {
        return {
          pokemons: data.varieties.map((variety) => {
            return variety.pokemon;
          }),
        };
      });
    } */
    const res = await fetch(`${id}`);
    return res.json(); /* .then((data: pokemonData) => {
      return {
        pokemons: data.name,
      };
    }); */
  };

  const { isLoading, isError, data } = useQuery<pokemonData>({
    queryKey: ["pokemon", id],
    queryFn: getPokemon,
    /* Jeg må finne en måte at den henter enten pokemon species eller pokemon */
  });

  /* return (<>
    {data?.pokemons.map((pokemon) => {
      return (<div></div>)
    })}</>
  ) */

  return (
    <a
      className={"card__Container card__type-" + data?.types[0].type.name}
      href={`/pokemon/${data?.id}`}
    >
      <div className="card__nameContainer">
        {isError ? "error" : isLoading ? "Loading..." : data.name.toUpperCase()}
      </div>

      <div className="card__imageContainer">
        {isError ? (
          "error"
        ) : isLoading ? (
          "Loading..."
        ) : data ? (
          <img src={data.sprites.front_default} alt="" />
        ) : (
          "Someting went wrong"
        )}
      </div>
    </a>
  );
};

export default Card;
