import "./Navbar.css";
import PokemonBall from "../../assets/pokemon-ball.svg";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * A navigation bar component that displays a logo and two buttons for navigating to the home page and the favorites page.
 * @returns {JSX.Element} - A React component that renders a navigation bar.
 */
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="navbar__red-bar">
      <img
        onClick={() => navigate("/")}
        src={PokemonBall}
        alt="Pokémon ball"
        className="navbar__pokemon-ball"
      />
      <div className="navbar__button-container">
        <button
          disabled={location.pathname === "/favorites"}
          className="navbar__buttons"
          onClick={() => {
            navigate("/favorites");
            localStorage.setItem("previousPage", "favorites");
          }}>
          Favorites
        </button>
        <button
          disabled={location.pathname === "/"}
          className="navbar__buttons"
          onClick={() => navigate("/")}>
          Home
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
