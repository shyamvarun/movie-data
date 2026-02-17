import React, { useState, useEffect } from 'react';
import { getHeroesWithMovies, getTownsByTerritory } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import './ComparisonForm.css';

const DAYS = ["DAY1","DAY2","DAY3","DAY4","WEEKEND","WEEK1","CLOSING"];

const ComparisonForm = ({ onCompare, loading }) => {
  const [heroes, setHeroes] = useState([]);
  const [territories, setTerritories] = useState({});
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [selectedTerritory, setSelectedTerritory] = useState('all');
  const [selectedTowns, setSelectedTowns] = useState([]);
  const [townSearch, setTownSearch] = useState('');
  const [expandedHero, setExpandedHero] = useState(null);
  const [dayCode, setDayCode] = useState('DAY1');
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setInitialLoading(true);
    const [heroesData, townsData] = await Promise.all([
      getHeroesWithMovies(),
      getTownsByTerritory()
    ]);
    setHeroes(heroesData);
    setTerritories(townsData);
    setInitialLoading(false);
  };

  const toggleHero = (code) => {
    setExpandedHero(prev => prev === code ? null : code);
  };

  const handleMovieToggle = (code) => {
    setSelectedMovies(prev =>
      prev.includes(code)
        ? prev.filter(m => m !== code)
        : [...prev, code]
    );
  };

  const handleSelectHeroMovies = (hero) => {
    const codes = hero.movies.map(m => m.movieCode);
    setSelectedMovies(prev => {
      const all = codes.every(c => prev.includes(c));
      return all ? prev.filter(c => !codes.includes(c))
                 : [...new Set([...prev, ...codes])];
    });
  };

  const getCurrentTowns = () => {
    if (selectedTerritory === 'all') return Object.values(territories).flat();
    return territories[selectedTerritory] || [];
  };

  const currentTowns = getCurrentTowns();

  const filteredTowns = currentTowns.filter(t =>
    t.toLowerCase().includes(townSearch.toLowerCase())
  );

  const handleSelectAllTowns = () => {
    const all = currentTowns.every(t => selectedTowns.includes(t));
    setSelectedTowns(all ? [] : currentTowns);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedMovies.length === 0) return alert("Select movies first");

    onCompare({
      movieCodes: selectedMovies,
      towns: selectedTowns.length ? selectedTowns : null,
      district: selectedTerritory !== 'all' ? selectedTerritory : null,
      dayCode
    });
  };

  if (initialLoading) return <LoadingSpinner message="Loading..." />;

  return (
    <div className="comparison-form-container">
      <form onSubmit={handleSubmit}>

        {/* HERO */}

        <div className="form-section">
          <h3>🎬 Select Movies</h3>

          <div className="hero-grid">
            {heroes.map(hero => (
              <div
                key={hero.heroCode}
                className="hero-card"
                onClick={() => toggleHero(hero.heroCode)}
              >
                <div className="hero-header">

                  <div className="hero-left">
                    <span>{hero.heroName}</span>
                    <button
                      type="button"
                      className="select-hero-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectHeroMovies(hero);
                      }}
                    >
                      Select All
                    </button>
                  </div>

                  <span>
                    {expandedHero === hero.heroCode ? '▲' : '▼'}
                  </span>
                </div>

                {expandedHero === hero.heroCode && (
                  <div className="movie-dropdown" onClick={e => e.stopPropagation()}>
                    {hero.movies.map(movie => (
                      <label key={movie.movieCode} className="movie-checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedMovies.includes(movie.movieCode)}
                          onChange={() => handleMovieToggle(movie.movieCode)}
                        />
                        {movie.title}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedMovies.length > 0 && (
            <div className="selected-count">
              ✓ {selectedMovies.length} movie(s) selected
            </div>
          )}
        </div>

        {/* TERRITORY */}

        <div className="form-section">
          <h3>📍 Territory</h3>

          <div className="territory-buttons">
            <button
              type="button"
              className={`territory-btn ${selectedTerritory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedTerritory('all')}
            >
              All
            </button>

            {Object.keys(territories).map(key => (
              <button
                key={key}
                type="button"
                className={`territory-btn ${selectedTerritory === key ? 'active' : ''}`}
                onClick={() => setSelectedTerritory(key)}
              >
                {key.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* TOWNS */}

        <div className="form-section">
          <h3>🏙 Towns</h3>

          <button
            type="button"
            className="select-all-towns-btn"
            onClick={handleSelectAllTowns}
          >
            Select All Towns
          </button>

          <input
            className="town-search"
            placeholder="Search town..."
            value={townSearch}
            onChange={e => setTownSearch(e.target.value)}
          />

          <div className="towns-container">
            <div className="checkbox-grid">
              {filteredTowns.map(town => (
                <label key={town} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedTowns.includes(town)}
                    onChange={() =>
                      setSelectedTowns(prev =>
                        prev.includes(town)
                          ? prev.filter(t => t !== town)
                          : [...prev, town]
                      )
                    }
                  />
                  {town}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* DAY */}

        <div className="form-section">
          <h3>📅 Day</h3>

          <div className="day-buttons">
            {DAYS.map(day => (
              <button
                key={day}
                type="button"
                className={`day-btn ${dayCode === day ? 'active' : ''}`}
                onClick={() => setDayCode(day)}
              >
                {day.replace("DAY", "Day ")}
              </button>
            ))}
          </div>
        </div>

        {/* COMPARE */}

        <div className="compare-container">
          <button
            type="submit"
            className="compare-btn-big"
            disabled={loading}
          >
            {loading ? "Comparing..." : "Compare Movies"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default ComparisonForm;
