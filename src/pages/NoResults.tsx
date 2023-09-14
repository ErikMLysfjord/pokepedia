import { useNavigate } from "react-router-dom";
import "../styles/App.css";

const NoResults = () => {
  const navigate = useNavigate();

  return (
    <div className="no-results">
      <h1>{"No results :("}</h1>
      <button className="no-results__button" onClick={() => navigate("/")}>
        {"Go to home page?"}
      </button>
    </div>
  );
};

export default NoResults;