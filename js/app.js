import { fetchMovies, fetchMovieDetails } from './api.js';

// Fetch trending movies when the page loads
window.onload = async () => {
    // Get user info from local storage
    const user = localStorage.getItem('user');
    if (user) {
        document.getElementById('user-info').innerText = `Logged in as: ${user}`;
    }

    // Default theme is dark
    const theme = 'dark'; // Set default to dark theme
    setTheme(theme);

    // Fetch and display trending movies
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
        console.log("Trending Movies:", data);  // Debugging output
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

// Display movies in the container
function displayMovies(movies) {
    const moviesContainer = document.getElementById("movies-container");
    moviesContainer.innerHTML = ""; // Clear previous movies

    if (movies.length === 0) {
        moviesContainer.innerHTML = "<p class='text-white'>No movies found.</p>";
        return;
    }

    // Update the container to use a grid with 5 columns
    moviesContainer.classList.add("grid", "grid-cols-1", "sm:grid-cols-2", "md:grid-cols-3", "lg:grid-cols-5", "gap-4");

    // Loop through each movie and add to the grid
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
            displayMovieDetails(movieDetails);
        });

        moviesContainer.appendChild(movieElement);
    });
}

// Show movie details in the modal
function displayMovieDetails(movie) {
    const movieDetailsContainer = document.getElementById("movie-details-container");
    const trailerKey = movie.videos.results[0]?.key; // Get the trailer key

    movieDetailsContainer.innerHTML = `
        <h3 class="text-xl font-bold">${movie.title}</h3>
        <p>${movie.overview}</p>
        <h4 class="font-semibold mt-4">Trailer:</h4>
        <iframe id="movie-trailer" width="100%" height="315" 
            src="https://www.youtube.com/embed/${trailerKey}?autoplay=1" 
            frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
        </iframe>
    `;
    
    // Show the modal with the movie details and trailer
    document.getElementById("movie-details-modal").classList.remove("hidden");
}

// Close the movie details modal and stop the trailer
document.getElementById("close-modal").addEventListener("click", () => {
    const modal = document.getElementById("movie-details-modal");
    const iframe = document.getElementById("movie-trailer");
    
    // Stop the trailer by resetting the iframe src
    iframe.src = "";

    modal.classList.add("hidden");
});

// Handle the search functionality
document.getElementById("search").addEventListener("input", async (event) => {
    const query = event.target.value.trim();
    if (query.length >= 3) { // Trigger search when user types 3 or more characters
        const movies = await fetchMovies(query);
        displayMovies(movies);
    } else {
        // Display trending movies if search is empty or too short
        const trendingMovies = await fetchTrendingMovies();
        displayMovies(trendingMovies);
    }
});

// Function to handle errors and display a message
function displayError(message) {
    const moviesContainer = document.getElementById("movies-container");
    moviesContainer.innerHTML = `<p class='text-white'>${message}</p>`;
}

// Logout button functionality
document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem('user');
    localStorage.removeItem('theme'); // Optional: Clear the theme setting on logout
    window.location.href = "index.html"; // Redirect to index.html
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
