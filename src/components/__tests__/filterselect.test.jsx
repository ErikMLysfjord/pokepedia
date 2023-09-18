import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import FilterSelect from "../filter-select/FilterSelect";
import { fireEvent } from "@testing-library/dom";

describe("FilterSelect", () => {
  test("should render", () => {
    const { container } = render(
      <FilterSelect
        options={["test", "test2"]}
        handleChange={(e) => {
          console.log(e.target.value);
        }}
        selected="test"
      />
    );

    expect(container).toMatchSnapshot();
    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveValue("test");
    expect(screen.getAllByRole("option")).toHaveLength(2);
  });

  test("should change option", () => {
    render(
      <FilterSelect
        options={["test", "test2"]}
        handleChange={(e) => e.target.value}
        selected="test"
      />
    );

    const select = screen.getByRole("combobox");

    fireEvent.select(select, { target: { value: "test2" } });
    expect(screen.getByRole("combobox")).toHaveValue("test2");
  });
});
