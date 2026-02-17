import React from 'react';
import './ComparisonTable.css';

const ComparisonTable = ({ data }) => {
  if (!data || !data.movies || data.movies.length === 0) {
    return (
      <div className="no-results">
        <p>No comparison data available</p>
      </div>
    );
  }

  const { towns, movies } = data;

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '—';
    if (amount >= 100) {
      return `₹${(amount / 100).toFixed(2)} Cr`;
    }
    return `₹${amount.toFixed(2)}L`;
  };

  const getHighestForTown = (town) => {
    const amounts = movies
      .map(m => m.collections[town])
      .filter(a => a !== null && a !== undefined);
    return amounts.length > 0 ? Math.max(...amounts) : null;
  };

  const getWinner = () => {
    return movies.reduce((prev, current) =>
      current.total > prev.total ? current : prev
    );
  };

  const winner = getWinner();

  return (
    <div className="comparison-results">
      <div className="results-header">
        <h2>📊 Comparison Results</h2>
        <div className="stats-summary">
          <div className="stat-card">
            <span className="stat-label">Movies</span>
            <span className="stat-value">{movies.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Towns</span>
            <span className="stat-value">{towns.length}</span>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Town</th>
              {movies.map(movie => (
                <th key={movie.movieCode}>
                  {movie.title}
                  <br />
                  <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                    {movie.heroName}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {towns.map(town => {
              const highest = getHighestForTown(town);
              return (
                <tr key={town}>
                  <td className="town-cell">{town}</td>
                  {movies.map(movie => {
                    const amount = movie.collections[town];
                    const isHighest = amount !== null && amount === highest && highest > 0;
                    return (
                      <td
                        key={`${movie.movieCode}-${town}`}
                        className={`amount-cell ${isHighest ? 'highest' : ''}`}
                      >
                        {formatCurrency(amount)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            <tr className="total-row">
              <td className="town-cell total-label">🏆 Total</td>
              {movies.map(movie => (
                <td key={`${movie.movieCode}-total`} className="total-cell">
                  {formatCurrency(movie.total)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Winner Badge */}
      <div className="winner-section">
        <div className="winner-badge">
          <span className="trophy">🏆</span>
          <div className="winner-info">
            <h3>{winner.title}</h3>
            <p>Highest Collection: {formatCurrency(winner.total)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;
