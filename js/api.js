const API_KEY = '5fd589720828248610586f3887584d90';
const BASE_URL = 'https://api.themoviedb.org/3';

// Function to fetch movies by searching
async function fetchMovies(query) {
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("Search Results:", data);
        return data.results;
    } catch (error) {
        console.error("Error fetching movies:", error);
        return [];
    }
}

// Function to fetch detailed movie name
async function fetchMovieDetails(movieId) {
    const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("Movie Details:", data);  
        return data;
    } catch (error) {
        console.error("Error fetching movie details:", error);
        return null;
    }
}

export { fetchMovies, fetchMovieDetails };
