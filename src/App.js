import React, { useState } from 'react';
import './App.css';
import ComparisonForm from './components/ComparisonForm';
import ComparisonTable from './components/ComparisonTable';
import TopMoviesByTown from './components/TopMoviesByTown';
import { compareMovies } from './services/api';

function App() {
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('compare'); // 'compare' or 'top10'

  const handleCompare = async (comparisonRequest) => {
    try {
      setLoading(true);
      setError(null);
      const result = await compareMovies(comparisonRequest);
      setComparisonData(result);
      
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    } catch (err) {
      setError('Failed to fetch comparison data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>🎬 Movie Box Office Analytics</h1>
          <p>Compare collections and view town-wise rankings</p>
        </div>
        
        <nav className="app-nav">
          <button 
            className={activeTab === 'compare' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveTab('compare')}
          >
            📊 Compare Movies
          </button>
          <button 
            className={activeTab === 'top10' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveTab('top10')}
          >
            🏆 Top 10 by Town
          </button>
        </nav>
      </header>

      <main className="app-main">
        {error && activeTab === 'compare' && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {activeTab === 'compare' ? (
          <>
            <ComparisonForm onCompare={handleCompare} loading={loading} />
            {comparisonData && !loading && (
              <div id="results">
                <ComparisonTable data={comparisonData} />
              </div>
            )}
          </>
        ) : (
          <TopMoviesByTown />
        )}
      </main>

      <footer className="app-footer">
        <p>© 2026 Movie Data Analytics | Built with React & Spring Boot</p>
        <p>Dm @shyamvarun2004, If any data is missing or wrong </p>

        
      </footer>
    </div>
  );
}

export default App;
