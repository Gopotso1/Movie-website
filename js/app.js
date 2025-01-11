// Fetch movies when the page loads
import { fetchMovies, fetchMovieDetails } from './api.js';

window.onload = async () => {
    // Theme
    const theme = 'dark';
    setTheme(theme);

    // Fetch and show trending movies
    const trendingMovies = await fetchTrendingMovies();
    if (trendingMovies && trendingMovies.length > 0) {
        displayMovies(trendingMovies);
    } else {
        displayError("Failed to fetch trending movies.");
    }
};

// Fetch trending movies
async function fetchTrendingMovies() {
    const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=5fd589720828248610586f3887584d90`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("Trending Movies:", data);
        if (data.results) {
            return data.results;
        } else {
            throw new Error("No results found");
        }
    } catch (error) {
        console.error("Error fetching trending movies:", error);
        return [];
    }
}

// Display movies in container
function displayMovies(movies) {
    const moviesContainer = document.getElementById("movies-container");
    moviesContainer.innerHTML = ""; // Clear previous movies

    if (movies.length === 0) {
        moviesContainer.innerHTML = "<p class='text-white'>No movies found.</p>";
        return;
    }

    // Container to use a grid with 5 columns for movies
    moviesContainer.classList.add("grid", "grid-cols-1", "sm:grid-cols-2", "md:grid-cols-3", "lg:grid-cols-5", "gap-4");

    movies.forEach((movie) => {
        const movieElement = document.createElement("div");
        movieElement.classList.add("p-2", "cursor-pointer");

        movieElement.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="w-full rounded">
            <h3 class="text-center mt-2">${movie.title}</h3>
            <p class="text-center">${movie.release_date}</p>
        `;
        movieElement.addEventListener("click", async () => {
            const movieDetails = await fetchMovieDetails(movie.id);
            displayMovieDetails(movieDetails, movieElement); 
        });

        moviesContainer.appendChild(movieElement);
    });
}

// Show movie details
function displayMovieDetails(movie, movieElement) {
    const movieDetailsContainer = document.getElementById("movie-details-container");
    const trailerKey = movie.videos.results[0]?.key; // Get the trailer

    // Clear the page content first
    movieDetailsContainer.innerHTML = "";

    // Check if trailer does exist
    if (trailerKey) {
        movieDetailsContainer.innerHTML = `
            <h3 class="text-xl font-bold">${movie.title}</h3>
            <p>${movie.overview}</p>
            <h4 class="font-semibold mt-4">Trailer:</h4>
            <iframe id="movie-trailer" src="https://www.youtube.com/embed/${trailerKey}?autoplay=1" 
                frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
    } else {
        movieDetailsContainer.innerHTML = `
            <h3 class="text-xl font-bold">${movie.title}</h3>
            <p>${movie.overview}</p>
            <p class="text-red-500 mt-4">No trailer available for this movie.</p>
        `;
    }

    // Get the position of the movie clicked
    const rect = movieElement.getBoundingClientRect();
    const modal = document.getElementById("movie-details-modal");

    // Set the modal position based on the clicked movie element
    modal.style.top = `${rect.top + window.scrollY}px`; 
    modal.style.left = `${rect.left}px`; // Position trailer page where the movie was clicked

    // Show the page with movie details and trailer
    modal.classList.remove("hidden");

    // Prevent page scrolling when trailer is open
    document.body.style.overflow = "hidden";
}

// Close the movie details and stops trailer
document.getElementById("close-modal").addEventListener("click", () => {
    const modal = document.getElementById("movie-details-modal");
    const iframe = document.getElementById("movie-trailer");

    // Stop the trailer 
    iframe.src = "";

    modal.classList.add("hidden");

    document.body.style.overflow = "auto";
});

// Search functionality
document.getElementById("search").addEventListener("input", async (event) => {
    const query = event.target.value.trim();
    if (query.length >= 3) { 
        const movies = await fetchMovies(query);
        displayMovies(movies);
    } else {
        // Display trending movies if search is empty
        const trendingMovies = await fetchTrendingMovies();
        displayMovies(trendingMovies);
    }
});

// Function to handle errors and display a message
function displayError(message) {
    const moviesContainer = document.getElementById("movies-container");
    moviesContainer.innerHTML = `<p class='text-white'>${message}</p>`;
}

// Logout button
document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem('user');
    localStorage.removeItem('theme'); 
    window.location.href = "index.html"; 
});

// Set the theme (dark by default)
function setTheme(theme) {
    const body = document.body;
    if (theme === 'dark') {
        body.classList.add('bg-black', 'text-white');
        body.classList.remove('bg-white', 'text-black');
    } else {
        body.classList.add('bg-white', 'text-black');
        body.classList.remove('bg-black', 'text-white');
    }
}
