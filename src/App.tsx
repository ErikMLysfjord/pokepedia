import { useState } from "react";
import "./App.css";

function Card() {
  return (
    <div
      style={{
        backgroundColor: "lightgrey",
        height: "300px",
        width: "200px",
        borderRadius: "10px",
        margin: "10px",
      }}
    />
  );
}

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
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </>
  );
}

export default App;
