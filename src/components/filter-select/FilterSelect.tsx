import { ChangeEvent } from "react";
import "./filter-select.css";

const Capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const FilterSelect = ({
  options,
  selected,
  handleChange,
}: {
  options: string[];
  selected: string;
  handleChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}) => {
  return (
    <select
      value={selected}
      onChange={handleChange}
      className="filter-select"
      placeholder="Select a color"
    >
      {options.map((option, index) => {
        if (option === "none") {
          return (
            <option key={`${option}-${index}`} value={option}>
              Select a color
            </option>
          );
        }
        return (
          <option key={`${option}-${index}`} value={option}>
            {Capitalize(option)}
          </option>
        );
      })}
    </select>
  );
};

export default FilterSelect;
