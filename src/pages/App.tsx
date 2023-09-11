import { useState, useEffect } from "react";
import "../styles/App.css";
import Card from "../components/card/Card";

function App() {
  // Use state
  // const [count, setCount] = useState(0);

  // Use fetch
  fetch("https://pokeapi.co/api/v2/pokemon/1")
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error(error));

  // Use local storage
  localStorage.setItem("key", "value");
  const value = localStorage.getItem("key");
  console.log(value);

  // Acual code
  const itemsPerPage = 4;

  const [currentPage, setCurrentPage] = useState(
    parseInt(localStorage.getItem("currentPage") ?? "1")
  );
  const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage.toString());
  }, [currentPage]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentList = list.slice(startIndex, endIndex);

  return (
    <>
      {/* pokeball theme */}
      <div
        style={{
          backgroundColor: "red",
          height: "150px",
        }}
      />
      {/* black line */}
      <div
        style={{
          backgroundColor: "black",
          height: "8px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Circle in the middle */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "50%",
            height: "50px",
            width: "50px",
            border: "4px solid black",
          }}
        />
      </div>

      {/* navbar */}
      <div
        style={{
          margin: "50px auto",
          height: "50px",
          width: "85%",
        }}
      >
        {/* Button that says favorites */}
        <button
          style={{
            backgroundColor: "lightgrey",
            height: "30px",
            width: "100px",
            borderRadius: "10px",
            border: "none",
            margin: "10px",
            color: "black",
            cursor: "pointer",
          }}
        >
          Favorites
        </button>
      </div>

      {/* Main body */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          margin: "auto",
          width: "85%",
        }}
      >
        {/* Card */}
        {currentList.map((id) => (
          <Card key={id} id={id} />
        ))}
      </div>

      {/* Page system */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "20px",
        }}
      >
        <button
          style={{ marginRight: "10px" }}
          disabled={currentPage === 1}
          onClick={handlePrevPage}
        >
          Prev
        </button>
        <div style={{ margin: "0 10px", color: "black" }}>
          Page {currentPage}
        </div>
        <button
          style={{ marginLeft: "10px" }}
          disabled={endIndex >= list.length}
          onClick={handleNextPage}
        >
          Next
        </button>
      </div>
    </>
  );
}

export default App;
