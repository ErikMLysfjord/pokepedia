import "./pagination.css";
import ButtonLeft from "../../assets/button-left.svg";
import ButtonRight from "../../assets/button-right.svg";

interface PaginationProps {
  count: number;
  currentIndex: number;
  onChange: (index: number) => void;
}

const Pagination = ({ count, currentIndex, onChange }: PaginationProps) => {
  return (
    <div className="pagination">
      <button
        className="pagination__button pagination__left-button"
        onClick={() => onChange(currentIndex - 1)}
        disabled={currentIndex === 0}
      >
        <img src={ButtonLeft} alt="Previous" />
      </button>
      <span className="pagination__index">{currentIndex + 1}</span>
      <button
        className="pagination__button pagination__right-button"
        onClick={() => onChange(currentIndex + 1)}
        disabled={currentIndex === count - 1}
      >
        <img src={ButtonRight} alt="Next" />
      </button>
    </div>
  );
};

export default Pagination;
