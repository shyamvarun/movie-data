import React, { useEffect, useState } from 'react';
import { getTopMoviesByTown } from '../services/api';
import './TopMoviesByTown.css';

function TopMoviesByTown() {
  const [topMoviesData, setTopMoviesData] = useState({});
  const [dayCode, setDayCode] = useState('DAY1');
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // ✅ NEW

  useEffect(() => {
    fetchTopMovies();
  }, [dayCode, limit]);

  const fetchTopMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTopMoviesByTown(dayCode, limit);
      setTopMoviesData(data);
    } catch (err) {
      console.error('Error fetching top movies:', err);
      setError('Failed to load top movies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Filter towns based on search
  const filteredTowns = Object.keys(topMoviesData).filter(townName =>
    townName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="top-loading-container">
        <div className="spinner"></div>
        <p>Loading top movies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="top-error-container">
        <p>⚠️ {error}</p>
        <button onClick={fetchTopMovies} className="retry-btn">
          🔄 Retry
        </button>
      </div>
    );
  }

  const townNames = Object.keys(topMoviesData);

  if (townNames.length === 0) {
    return (
      <div className="top-no-data">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="top-movies-container">
      <div className="top-header">
        <h2>🏆 Top {limit} Movies by Town</h2>
        <p className="top-subtitle">Day: {dayCode}</p>
      </div>

      <div className="top-controls">
        <div className="control-group">
          <label htmlFor="dayCode">Select Day:</label>
          <select 
            id="dayCode"
            value={dayCode} 
            onChange={(e) => setDayCode(e.target.value)}
            className="control-select"
          >
            <option value="DAY1">Day 1</option>
            <option value="DAY2">Day 2</option>
            <option value="DAY3">Day 3</option>
            <option value="DAY4">Day 4</option>
            <option value="DAY5">Day 5</option>
            <option value="WEEK1">Week 1</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="limit">Show Top:</label>
          <select 
            id="limit"
            value={limit} 
            onChange={(e) => setLimit(Number(e.target.value))}
            className="control-select"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>

      {/* ✅ NEW: Search Filter */}
      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Search towns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button 
            className="clear-search" 
            onClick={() => setSearchTerm('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
        <p className="search-results">
          Showing {filteredTowns.length} of {townNames.length} towns
        </p>
      </div>

      {filteredTowns.length === 0 ? (
        <div className="no-results">
          <p>No towns found matching "{searchTerm}"</p>
        </div>
      ) : (
        <div className="towns-grid">
          {filteredTowns.map((townName) => {
            const movies = topMoviesData[townName];
            
            return (
              <div key={townName} className="town-card">
                <h3 className="town-name">📍 {townName}</h3>
                
                {movies.length === 0 ? (
                  <p className="no-movies">No data available</p>
                ) : (
                  <div className="movies-list">
                    {movies.map((movie, index) => (
                      <div key={movie.movieCode} className="movie-item">
                        <div className="rank">#{index + 1}</div>
                        <div className="movie-details">
                          <div className="movie-title">{movie.title}</div>
                          <div className="hero-name">{movie.heroName}</div>
                        </div>
                        <div className="collection">
                          ₹{movie.total.toFixed(2)}L
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TopMoviesByTown;
