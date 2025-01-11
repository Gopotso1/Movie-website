// this part handles sign-up
document.getElementById("signupForm")?.addEventListener("submit", function(event) {
    event.preventDefault();
    
    // user input
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify({ name, email, password }));

    window.location.href = "movieDetails.html";
});

// this part handles login
document.getElementById("loginForm")?.addEventListener("submit", function(event) {
    event.preventDefault();
    
//user input
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    const user = JSON.parse(localStorage.getItem('user'));

// Check if user exists in localStorage
    if (user && user.email === email && user.password === password) {

        window.location.href = "movieDetails.html";
    } else {
        alert("Invalid credentials. Please try again.");
    }
});