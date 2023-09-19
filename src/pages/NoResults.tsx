import "../styles/App.css";

interface NoResultsProps {
  title: string;
  underTitle: string;
}

/* Page to tell user that there are no results */
const NoResults = ({ title, underTitle }: NoResultsProps) => {
  return (
    <div className="no-results">
      <h1 className="no-results__title">{title}</h1>
      <h2 className="no-results__under-title">{underTitle}</h2>
    </div>
  );
};

export default NoResults;
