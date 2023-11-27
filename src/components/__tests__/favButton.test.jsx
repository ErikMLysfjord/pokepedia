import { describe, expect } from "vitest";
import FavouriteButton from "../favouriteButton/FavouriteButton";
import { render, screen, fireEvent } from "@testing-library/react";

describe("FavouriteButton", () => {
  it("matches snapshot", () => {
    const { container } = render(<FavouriteButton favID={1} />);
    expect(container).toMatchSnapshot();
  });

  it("should render without errors", () => {
    render(<FavouriteButton favID={1} />);
    expect(screen.getByRole("svg")).toBeInTheDocument();
  });

  it("should add to favorites when clicked", () => {
    localStorage.setItem("favorites", JSON.stringify([]));
    render(<FavouriteButton favID={1} />);
    fireEvent.click(screen.getByRole("svg"));
    expect(JSON.parse(localStorage.getItem("favorites") ?? "[]")).toEqual([1]);
  });

  it("should remove from favorites when clicked", () => {
    localStorage.setItem("favorites", JSON.stringify([1]));
    render(<FavouriteButton favID={1} />);
    fireEvent.click(screen.getByRole("svg"));
    expect(JSON.parse(localStorage.getItem("favorites") ?? "[]")).toEqual([]);
  });

  it("should add to favorites when clicked", () => {
    localStorage.clear();
    render(<FavouriteButton favID={1} />);
    fireEvent.click(screen.getByRole("svg"));
    expect(JSON.parse(localStorage.getItem("favorites") ?? "[]")).toEqual([1]);
  });
});
