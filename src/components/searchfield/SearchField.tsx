import { useState } from "react";
import "./SearchField.css";
import { useNavigate } from "react-router-dom";
import SearchIcon from "../../assets/search.png";

const SearchField = () => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  return (
    <form
      className="searchfield__container"
      onSubmit={() => navigate("/pokemon/" + searchText.toLowerCase())}
    >
      <input
        type="search"
        placeholder="Pokemon name"
        className="searchfield"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <input type="image" src={SearchIcon} className="searchfield__button" />
    </form>
  );
};
export default SearchField;
