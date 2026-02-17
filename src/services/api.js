import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch all heroes with their movies
export const getHeroesWithMovies = async () => {
  try {
    const response = await api.get('/heroes-with-movies');
    return response.data;
  } catch (error) {
    console.error('Error fetching heroes:', error);
    throw error;
  }
};

// Fetch all towns grouped by territory
export const getTownsByTerritory = async () => {
  try {
    const response = await api.get('/towns-by-territory');
    return response.data;
  } catch (error) {
    console.error('Error fetching towns:', error);
    throw error;
  }
};

// Compare movies
export const compareMovies = async (comparisonRequest) => {
  try {
    const response = await api.post('/compare', comparisonRequest);
    return response.data;
  } catch (error) {
    console.error('Error comparing movies:', error);
    throw error;
  }
};

// ✅ NEW: Get top movies by town
export const getTopMoviesByTown = async (dayCode = 'DAY1', limit = 10) => {
  try {
    const response = await api.get('/top-movies-by-town', {
      params: { dayCode, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching top movies:', error);
    throw error;
  }
};

export default api;
