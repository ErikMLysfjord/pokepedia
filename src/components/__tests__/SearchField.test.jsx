import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { fireEvent } from "@testing-library/dom";
import SearchField from "../searchfield/SearchField";

describe("SearchField", () => {
  test("should render", () => {
    const { container } = render(<SearchField />);

    expect(container).toMatchSnapshot();
    expect(screen.getByText("Pokemon Name")).toBeInTheDocument();
    expect(screen.getByRole("searchfield")).toBeInTheDocument();
    expect(screen.getByRole("searchfield")).toHaveValue("");
    expect(screen.getByRole("submit-search")).toBeInTheDocument();
  });

  test("should change textfield value", () => {
    render(render(<SearchField />));

    const search = screen.getByRole("searchfield");
    fireEvent.change(search, { target: { value: "pikachu" } });
    expect(search.toHaveValue("pikachu"));
  });

  test("Pokemon page for the searched pokemon is shown on search submit", () => {
    render(render(<SearchField />));
    const search = screen.getByRole("searchfield");
    const submit = screen.getByRole("submit-search");
    fireEvent.change(search, { target: { value: "vulpix" } });
    fireEvent.click(submit);
    expect(screen.getByText("Vulpix")).toBeInTheDocument();
    expect(screen.getByText("Height")).toBeInTheDocument();
    expect(screen.getByText("FIRE")).toBeInTheDocument();
    expect(screen.getByText("Flash-Fire")).toBeInTheDocument();
    expect(screen.getByText("Drought")).toBeInTheDocument();
    expect(screen.getByText("Base stats")).toBeInTheDocument();
  });
});
