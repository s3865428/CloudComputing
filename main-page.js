// Get the email from the URL query parameters
const queryParams = new URLSearchParams(window.location.search);
const email = queryParams.get('email');

// Assuming the logout button has an id of "logout-button"
const logoutButton = document.getElementById("logout-link");

logoutButton.addEventListener("click", function() {
  // Set the URL to the home screen URL
  window.location.href = "index.html";
});


fetch(`https://dl3kc5nwm0.execute-api.us-east-1.amazonaws.com/default/getUserInfoByEmail?email=${email}`)
    .then(response => response.json())
    .then(data => {
        const username = data.username;
        const musicList = data.subscriptions;
        // Update username tag with retrieved username
        const usernameTag = document.getElementById('username');
        usernameTag.textContent = username;

        // Update subscription area
        const subscriptionArea = document.getElementById('subscription-area');
        musicList.forEach(music => {
            const subscriptionItem = document.createElement('div');
            subscriptionItem.classList.add('subscription-item');
            subscriptionItem.innerHTML = `
        <img src="${music.image_url}" alt="${music.artist} Image">
        <p class="title">Title: ${music.title}</p>
        <p class="artist">Artist: ${music.artist}</p>
        <p>Year: ${music.year}</p>
        <button class="remove-button">Remove</button>
      `;
            subscriptionArea.appendChild(subscriptionItem);
        });
    })
    .catch(error => console.error(error));


// Get the container element for the subscriptions
const subscriptionArea = document.getElementById('subscription-area');

// Attach a click event listener to the subscription area
subscriptionArea.addEventListener('click', function (event) {
    // Check if the clicked element is a remove button
    if (event.target.classList.contains('remove-btn')) {
        // Get the subscription information from the HTML elements
        const title = event.target.parentNode.querySelector('.title').textContent.split(': ')[1];
        const artist = event.target.parentNode.querySelector('.artist').textContent.split(': ')[1];

        // Make a request to the API to remove the subscription
        const url = `https://dl3kc5nwm0.execute-api.us-east-1.amazonaws.com/default/subscription?email=${email}&title=${title}&artist=${artist}`;

        fetch(url, {
            method: 'DELETE', headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                if (response.ok) {
                    // Remove the subscription from the HTML
                    event.target.parentNode.remove();
                } else {
                    throw new Error('Failed to remove subscription');
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
});

function queryMusic() {
    const apiUrl = 'https://dl3kc5nwm0.execute-api.us-east-1.amazonaws.com/default/getMusic';

    const artistInput = document.getElementById('artist-input');
    const titleInput = document.getElementById('title-input');
    const yearInput = document.getElementById('year-input');

    let url = apiUrl + '?';
    if (artistInput.value) {
        url += 'artist=' + encodeURIComponent(artistInput.value) + '&';
    }
    if (titleInput.value) {
        url += 'title=' + encodeURIComponent(titleInput.value) + '&';
    }
    if (yearInput.value) {
        url += 'year=' + encodeURIComponent(yearInput.value) + '&';
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const musicList = document.getElementById("query-music-list");
            musicList.innerHTML = ""; // clear previous results

            // Update subscription area
            data.forEach(music => {
                const musicItem = document.createElement('div');
                musicItem.classList.add('music-item');
                musicItem.innerHTML = `
        <img class="image" src="${music.image_url}" alt="${music.artist} Image">
        <p class="title">Title: ${music.title}</p>
        <p class="artist">Artist: ${music.artist}</p>
        <p class="year">Year: ${music.year}</p>
        <button class="subscribe-button" onclick=subscribe(event)>Subscribe</button>
      `;
                musicList.appendChild(musicItem);
            });
        })
        .catch(error => console.error(error));
}

function subscribe(event) {
    const title = event.target.parentNode.querySelector('.title').textContent.split(': ')[1]; // Get the title from the music item
    const artist = event.target.parentNode.querySelector('.artist').textContent.split(': ')[1]; // Get the artist from the music item
    const image_url = event.target.parentNode.querySelector('.image').getAttribute('src') // Get the image URL from the music item
    const year = event.target.parentNode.querySelector('.year').textContent.split(': ')[1]; // Get the year from the music item


    fetch('https://dl3kc5nwm0.execute-api.us-east-1.amazonaws.com/default/subscription', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            title: title,
            artist: artist
        })
    }).then((response) => {
        if (response.status === 200) {
            // Append the music item to the subscriptions list
            const subscriptionItem = document.createElement('div');
            subscriptionItem.classList.add('subscription-item');
            subscriptionItem.innerHTML = `
        <img src="${image_url}" alt="${artist} Image">
        <p class="title">Title: ${title}</p>
        <p class="artist">Artist: ${artist}</p>
        <p>Year: ${year}</p>
        <button class="remove-btn">Remove</button>
      `;
            subscriptionArea.appendChild(subscriptionItem);

            // Remove the subscribe button from the music item
            btn.parentNode.removeChild(btn);
        } else {
            console.error('Error subscribing to music.');
        }
    }).catch((err) => {
        console.error(err);
    });

}