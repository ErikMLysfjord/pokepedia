import { useQuery } from "@tanstack/react-query";
import "../../styles/Card.css";
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
      className={"card__Container card__type-" + data?.types[0].type.name}
      href={`/pokemon/${data?.id}`}>
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
