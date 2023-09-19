import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { fireEvent } from "@testing-library/dom";
import SearchField from "../searchfield/SearchField";

const mockUseNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockUseNavigate,
  };
});

describe("SearchField", () => {
  test("should render searchfield", () => {
    const { container } = render(<SearchField />);
    expect(container).toMatchSnapshot();
    expect(screen.getByRole("searchfield")).toBeInTheDocument();
    expect(screen.getByRole("searchfield")).toHaveValue("");
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("should change textfield value", () => {
    render(<SearchField />);
    const search = screen.getByRole("searchfield");
    fireEvent.change(search, { target: { value: "pikachu" } });
    expect(search.toHaveValue("pikachu"));
  });

  test("Pokemon page for the searched pokemon is shown on search submit", () => {
    render(<SearchField />);
    const search = screen.getByRole("searchfield");
    fireEvent.change(search, { target: { value: "vulpix" } });
    screen.getByRole("button").click;
    expect(mockUseNavigate).toHaveBeenCalledWith("/pokemon/vulpix");
  });

  test("Case sensitive search", () => {
    mockUseNavigate.mockClear();
    render(<SearchField />);
    const search = screen.getByRole("searchfield");
    fireEvent.change(search, { target: { value: "Vulpix" } });
    screen.getByRole("button").click;
    expect(mockUseNavigate).toHaveBeenCalledWith("/pokemon/vulpix");
  });
});
