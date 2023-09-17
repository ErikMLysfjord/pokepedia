import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import FilterSelect from "../filter-select/FilterSelect";

describe("FilterSelect", () => {
  test("should render", () => {
    render(
      <FilterSelect
        options={["noe"]}
        handleChange={(e) => {
          console.log(e);
        }}
        selected="test"
      />
    );

    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});
