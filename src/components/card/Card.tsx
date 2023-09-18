import { useQuery } from "@tanstack/react-query";
import "./Card.css";
import "../../styles/App.css";
import PokemonType from "../../types/PokemonType";
import TypeCircle from "../typecircle/TypeCircle";
import FavouriteButton from "../favouriteButton/FavouriteButton";
import { useNavigate } from "react-router-dom";

const useFetchPokemonQuery = (id: string) => {
  return useQuery<PokemonType>(["pokemon", id], async () =>
    (await fetch(id)).json()
  );
};

const Card = ({ id }: { id: string }) => {
  const { data, isError, isLoading } = useFetchPokemonQuery(id);
  const navigate = useNavigate();

  return (
    <>
      <div
        className={"card__container"}
        onClick={() => navigate(`/pokemon/${data?.id}`)}
      >
        <div className="card__header">
          <p>{"#" + data?.id}</p>
          <p className="card__header-name">
            {isError
              ? "error"
              : isLoading
              ? "Loading..."
              : data.name.toUpperCase()}
          </p>
          {data?.types.length == 2 ? (
            <TypeCircle
              primaryType={data?.types[0].type.name}
              secondaryType={data?.types[1].type.name}
            />
          ) : (
            <TypeCircle primaryType={data?.types[0].type.name} />
          )}
        </div>

        <div className="card__header-separator-line"></div>

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
        <FavouriteButton id={data?.id ?? -1} />
      </div>
    </>
  );
};

export default Card;
