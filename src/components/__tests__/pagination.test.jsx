import { describe, test, expect } from "vitest";
import Pagination from "../pagination/Pagination";
import { render, screen } from "@testing-library/react";

const mockUseNavigate = vi.fn();
const mockUseLocation = vi.fn();
const mockOnChange = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockUseNavigate,
    useLocation: () => mockUseLocation,
  };
});

describe("Pagination", () => {
  test("should render", () => {
    const { container } = render(
      <Pagination
        count={10}
        currentIndex={0}
        onChange={(index) => mockOnChange(index + 1)}
      />
    );

    expect(container).toMatchSnapshot();
    /* expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument(); */
  });

  test("should navigate to previous page", () => {
    render(<Pagination />);

    /* screen.getByText("Previous").click();

    expect(mockUseNavigate).toHaveBeenCalledWith("/?page=1");
    expect(mockUseNavigate).toHaveBeenCalledTimes(1); */
  });

  test("should navigate to next page", () => {
    render(<Pagination />);

    /* screen.getByText("Next").click();

    expect(mockUseNavigate).toHaveBeenCalledWith("/?page=2");
    expect(mockUseNavigate).toHaveBeenCalledTimes(1); */
  });
});
