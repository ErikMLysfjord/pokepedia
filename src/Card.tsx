import { useQuery } from "@tanstack/react-query";
import "./Card.css";


// props, id: number
function Card(props: { id: number }) {

  const getPokemon = async () => {
		const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${props.id}`);
		return res.json();
	};

  const { isLoading, isError, data } = useQuery({
    queryKey: [`pokemon+${props.id}`],
    queryFn: getPokemon,
  })


  return (
    <div id="cardContainer">

      <div id="nameContainer">
        {isError? "error" : (isLoading? "Loading..." : (data? data.name.toUpperCase() : "Something went wrong"))}
      </div> 
    
      <div id="imageContainer">
        {isError? "error" : (isLoading? "Loading..." : (data? <img src={data.sprites.front_default} alt=""/> : "Someting went wrong"))}
      </div>

    </div>
  );
}

export default Card;