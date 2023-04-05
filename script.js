const loginButton = document.getElementById('login-button');

loginButton.addEventListener('click', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Send a POST request to the login API with the email and password
    fetch('https://objnyy6c0a.execute-api.us-east-1.amazonaws.com/default/loginAPI', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        // Check if the response is true or false
        if (data === true) {
            // Redirect to main page
            window.location.href = 'main-page.html';
        } else {
            // Display error message
            const errorMessage = document.getElementById('error-message');
            errorMessage.textContent = 'Email or password is invalid.';
        }
    })
    .catch(error => console.error(error));
});
