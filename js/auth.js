// auth.js

// Handle sign-up logic
document.getElementById("signupForm")?.addEventListener("submit", function(event) {
    event.preventDefault();
    
    // Get user input
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Store user data in localStorage (just for demo purposes)
    localStorage.setItem('user', JSON.stringify({ name, email, password }));
    
    // Redirect to MovieDB page after successful sign-up
    window.location.href = "movieDetails.html";
});

// Handle login logic
document.getElementById("loginForm")?.addEventListener("submit", function(event) {
    event.preventDefault();
    
    // Get user input
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    const user = JSON.parse(localStorage.getItem('user'));

    // Check if user exists in localStorage
    if (user && user.email === email && user.password === password) {
        // Successful login
        window.location.href = "movieDetails.html";
    } else {
        alert("Invalid credentials. Please try again.");
    }
});
