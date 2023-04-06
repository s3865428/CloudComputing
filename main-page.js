// Get the email from the URL query parameters
const queryParams = new URLSearchParams(window.location.search);
const email = queryParams.get('email');

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
        <button class="remove-btn">Remove</button>
      `;
      subscriptionArea.appendChild(subscriptionItem);
    });
  })
  .catch(error => console.error(error));


// Get the container element for the subscriptions
const subscriptionArea = document.getElementById('subscription-area');

// Attach a click event listener to the subscription area
subscriptionArea.addEventListener('click', function(event) {
  // Check if the clicked element is a remove button
  if (event.target.classList.contains('remove-btn')) {
    // Get the subscription information from the HTML elements
    const title = event.target.parentNode.querySelector('.title').textContent.split(': ')[1];
    const artist = event.target.parentNode.querySelector('.artist').textContent.split(': ')[1];
    
    // Make a request to the API to remove the subscription
    const url = `https://dl3kc5nwm0.execute-api.us-east-1.amazonaws.com/default/removeSubscription?email=${email}&title=${title}&artist=${artist}`;
    
    fetch(url)
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
