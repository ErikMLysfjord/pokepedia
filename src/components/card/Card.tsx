import { useQuery } from "@tanstack/react-query";
import "./Card.css";
import "../../styles/App.css";
import PokemonType from "../../types/PokemonType";

const useFetchPokemonQuery = (id: string) => {
  return useQuery<PokemonType>(["pokemon", id], async () =>
    (await fetch(id)).json()
  );
};

const Card = ({ id }: { id: string }) => {
  const { data, isError, isLoading } = useFetchPokemonQuery(id);

  return (
    <a
      className={"card__container card__type-" + data?.types[0].type.name}
      href={`/pokemon/${data?.id}`}
    >
      <div className="card__name-container">
        {isError ? "error" : isLoading ? "Loading..." : data.name.toUpperCase()}
      </div>

      <div className="card__image-container">
        {isError ? (
          "error"
        ) : isLoading ? (
          "Loading..."
        ) : data ? (
          <img src={data.sprites.front_default} alt="" />
        ) : (
          "Something went wrong"
        )}
      </div>
    </a>
  );
};

export default Card;
