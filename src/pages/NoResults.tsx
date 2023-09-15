import { useNavigate } from "react-router-dom";
import "../styles/App.css";
import Navbar from "../components/navbar/Navbar";

/* Page to tell user that there are no results */
const NoResults = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="no-results">
        <h1>{"No results :("}</h1>
        <button className="no-results__button" onClick={() => navigate("/")}>
          {"Go to home page?"}
        </button>
      </div>
    </>
  );
};

export default NoResults;
