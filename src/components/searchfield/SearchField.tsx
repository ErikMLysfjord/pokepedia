import { useState } from "react";
import "./SearchField.css";
import { useNavigate } from "react-router-dom";
import SearchIcon from "../../assets/search.png";

const SearchField = () => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  return (
    <div className="searchfield__container">
      <input
        type="search"
        placeholder="Pokemon Name"
        className="searchfield"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <button
        className="searchfield__button"
        onClick={() => navigate("/pokemon/" + searchText)}
      >
        <img className="searchfield__image" src={SearchIcon} />
      </button>
    </div>
  );
};
export default SearchField;
