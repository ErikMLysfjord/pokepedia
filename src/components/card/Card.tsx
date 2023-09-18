import { useQuery } from "@tanstack/react-query";
import "./Card.css";
import { useState, useEffect } from "react";

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
const Card = ({ id }: { id: number }) => {
  const getPokemon = async () => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return res.json();
  };

  const { isLoading, isError, data } = useQuery<pokemonData>({
    queryKey: [`pokemon+${id}`],
    queryFn: getPokemon,
  });

  const fav = (
    JSON.parse(localStorage.getItem("favorites") ?? "[]") as number[]
  ).includes(data?.id ?? -1);

  const [favorites, setFavorites] = useState(fav);

  useEffect(() => {
    setFavorites(fav);
  }, [fav]);

  return (
    <div className={"card__Container card__type-" + data?.types[0].type.name}>
      <a
        className={"card__Container card__type-" + data?.types[0].type.name}
        href={`/pokemon/${data?.id}`}
      >
        ¨
        <div className="card__nameContainer">
          {isError
            ? "error"
            : isLoading
            ? "Loading..."
            : data.name.toUpperCase()}
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
      <button
        onClick={() => {
          if (
            (
              JSON.parse(localStorage.getItem("favorites") ?? "[]") as number[]
            ).includes(data?.id ?? -1)
          ) {
            localStorage.setItem(
              "favorites",
              JSON.stringify(
                (
                  JSON.parse(
                    localStorage.getItem("favorites") ?? "[]"
                  ) as number[]
                ).filter((id) => id != data?.id)
              )
            );
            setFavorites(false);
          } else {
            localStorage.setItem(
              "favorites",
              JSON.stringify(
                (
                  JSON.parse(
                    localStorage.getItem("favorites") ?? "[]"
                  ) as number[]
                ).concat([data?.id ?? -1])
              )
            );
            setFavorites(true);
          }
        }}
      >
        {favorites ? "Unfavorite" : "Favorite"}
      </button>
    </div>
  );
};

export default Card;
