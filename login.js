// Function to extract the Xbox gamertag from the JWT token
function extractUsernameFromToken(token) {
  try {
    // Check if the token is null or undefined
    if (!token) {
      console.error('Token is null or undefined');
      return null;
    }

    // Decode the JWT
    const decodedToken = JSON.parse(atob(token.split('.')[1]));

    // Extract the Xbox gamertag from the 'name' field
    const xboxGamertag = decodedToken.name;

    return xboxGamertag;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

// Function to set the token in a cookie
function setTokenInCookie(token) {
  document.cookie = `token=${token}; path=/;`;
}

// Function to get the token from the cookie
function getTokenFromCookie() {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith('token=')) {
      return cookie.substring('token='.length, cookie.length);
    }
  }
  return null;
}

// Function to get the token from the URL parameter
function getTokenFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  return token;
}

// Function to set the token in a cookie
function setTokenInCookie(token) {
  document.cookie = `token=${token}; path=/;`;
}

// Function to handle the logout
function handleLogout() {
  // Clear the token cookie
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

  // Redirect to the main page
  window.location.href = '/';
}

// Check if the token exists in the URL parameter
const token = getTokenFromURL();

// Check if the token is present in the URL parameter
if (token) {
  // Set the token in the cookie for future use
  setTokenInCookie(token);

  // Remove the token from the URL to avoid exposing it
  window.history.replaceState({}, document.title, '/login.html');

  // Redirect to the main page
  window.location.href = "/";
} else {
  // Get the token from the cookie
  const tokenFromCookie = getTokenFromCookie();

  // Check if the token exists in the cookie
  if (tokenFromCookie) {
    // Update the profile information
    updateProfileInfo();
  }
}

// Update the profile information
function updateProfileInfo() {
  // Get the token from the cookie
  const token = getTokenFromCookie();

  // Extract the Xbox gamertag from the token
  const xboxGamertag = extractUsernameFromToken(token);

  if (xboxGamertag) {
    // Make a request to retrieve the profile information
    fetch(`https://gamertag-info-search.tres3mincraft.repl.co/?username=${xboxGamertag}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error fetching profile');
          
        }
      })
      .then((data) => {
        // Extract the required data from the response
        const gamerscore = data.gamerscore;
        const gamesPlayed = data.gamesPlayed;
        const profilePictureUrl = data.profilePictureUrl;

        // Update the username in the popup
        const popupUsernameElement = document.getElementById('popup-username');
        if (popupUsernameElement) {
          popupUsernameElement.textContent = xboxGamertag;
        }

        // Update the profile picture
        const profilePictureElement = document.getElementById('profile-picture');
        if (profilePictureElement) {
          profilePictureElement.src = profilePictureUrl;
        }

        // Update other elements with the retrieved data
        const gamerscoreElement = document.getElementById('gamerscore');
        if (gamerscoreElement) {
          gamerscoreElement.textContent = gamerscore;
        }

         // Update other elements with the retrieved data
        const mprofilepictureElement = document.getElementById('main-profile-picture');
        if (mprofilepictureElement) {
          mprofilepictureElement.src = profilePictureUrl;
        }

        // Update other elements with the retrieved data
        const profileusername = document.getElementById('main-profile-user');
        if (profileusername) {
          profileusername.textContent = xboxGamertag;
        }

        const gamesPlayedElement = document.getElementById('games-played');
        if (gamesPlayedElement) {
          gamesPlayedElement.textContent = gamesPlayed;
        }

        // Display other user data as needed
        // ...
      })
      .catch((error) => {
        console.error('Error fetching profile:', error);
      });
  } else {
    console.error('Invalid token');
  }
}

// Check if the token exists in the cookie
const tokenFromCookie = getTokenFromCookie();

if (tokenFromCookie) {
  // Extract the username from the token
  const username = extractUsernameFromToken(tokenFromCookie);

  // Update the profile information
  updateProfileInfo();
}

document.addEventListener("DOMContentLoaded", function() {
  if (window.location.pathname === "/profile") {
    const token = getTokenFromCookie();
    const xboxGamertag = extractUsernameFromToken(token);
    const galleryGrid = document.querySelector(".gallery-grid");

    fetch('/player_info.json')
      .then(response => response.json())
      .then(data => {
        const playerScreenshots = data;

        // Check if the user is signed in
        if (!xboxGamertag) {
          const notSignedInMessage = document.createElement("p");
          notSignedInMessage.textContent = "You are not signed in...";
          notSignedInMessage.classList.add("not-signed-in");

          galleryGrid.appendChild(notSignedInMessage);
        } else {
          const filteredScreenshots = playerScreenshots.screenshots.filter(
            (screenshot) => screenshot.playerName === xboxGamertag
          );

          galleryGrid.innerHTML = '';

          if (filteredScreenshots.length === 0) {
            const noScreenshotsMessage = document.createElement("p");
            noScreenshotsMessage.textContent = "You don't have any screenshots...";
            noScreenshotsMessage.classList.add("no-screenshots");

            galleryGrid.appendChild(noScreenshotsMessage);
          } else {
filteredScreenshots.forEach((screenshot) => {
  const screenshotDiv = document.createElement("div");
  const screenshotName = screenshot.imageUrl.match(/\/([^/]+)\.png$/)[1];
  screenshotDiv.setAttribute("class", "SS");
  screenshotDiv.setAttribute("style", `border-radius: 12px; background-image: url('${screenshot.imageUrl}'); size: cover; width: 47%; height: 300px; background-position: center center;`);

  const creditParagraph = document.createElement("p");
  creditParagraph.classList.add("credit");
  creditParagraph.textContent = screenshot.playerName;

  screenshotDiv.appendChild(creditParagraph);
  galleryGrid.appendChild(screenshotDiv);
});
          }
        }
      })
      .catch(error => {
        console.error('Error:', error);
        // Handle any errors that occurred during the fetch
      });
  }
});

document.addEventListener('DOMContentLoaded', function() {
  // Get all elements with the class "credit"
  const creditElements = document.querySelectorAll('.credit');

  // Iterate over each credit element
  creditElements.forEach(function(creditElement) {
    // Add the click event listener to each element
    creditElement.addEventListener('click', function() {
      // Get the gamertag from the credit element's text content
      const gamertag = this.textContent;

      // Construct the URL with the gamertag parameter
      const url = `https://atomicsmp.pages.dev/user?name=${gamertag}`;

      // Open the URL in a new window or tab
      window.open(url, '_blank');
    });
  });
});

// Function to position the loading icon in the center
function positionLoadingIcon() {
  var loadingElement = document.getElementById('Loading');
  var windowHeight = window.innerHeight;
  var loadingElementHeight = loadingElement.offsetHeight;
  var scrollY = window.scrollY || window.pageYOffset;
  var visibleHeight = windowHeight - loadingElementHeight; // Subtract the loading element height from the window height
  var desiredPosition = visibleHeight / 2 + scrollY;

  // Check if the desired position exceeds the maximum or minimum position
  var maxPosition = windowHeight - loadingElementHeight;
  var minPosition = 0;
  if (desiredPosition > maxPosition) {
    desiredPosition = maxPosition;
  } else if (desiredPosition < minPosition) {
    desiredPosition = minPosition;
  }

  loadingElement.style.top = desiredPosition + 'px';
}

// Function to show the loading animation
function showLoadingAnimation() {
  var loadingElement = document.getElementById('Loading');
  loadingElement.style.display = 'flex';
  positionLoadingIcon(); // Center the loading icon
}

// Function to hide the loading animation
function hideLoadingAnimation() {
  var loadingElement = document.getElementById('Loading');
  loadingElement.style.display = 'none';
}

// Function to check if the URL is fetchable
function isURLFetchable(url) {
  return fetch(url)
    .then(function(response) {
      return response.ok;
    })
    .catch(function(error) {
      console.error('Error fetching URL:', error);
      return false;
    });
}

// Function to reload the page with a delay
function reloadPageWithDelay(delay) {
  setTimeout(function() {
    window.location.reload();
  }, delay);
}

// Check if the player has a token on page load
window.addEventListener('load', function() {
  var token = getTokenFromCookie(); // Assuming you have the function to retrieve the token from the cookie
  var url = 'https://gamertag-info-search.tres3mincraft.repl.co/?username=Test';

  if (token) {
    showLoadingAnimation(); // Show the loading animation immediately
    isURLFetchable(url)
      .then(function(fetchable) {
        if (!fetchable) {
          console.log('Error: URL is not fetchable');
        } else {
          hideLoadingAnimation(); // Hide the loading animation
          console.log('Success: URL is fetchable');
        }
      })
      .then(function() {
        // Periodically check fetchability after the first instant check
        setInterval(function() {
          isURLFetchable(url)
            .then(function(fetchable) {
              if (!fetchable) {
                console.log('Error: URL is not fetchable');
              } else {
                hideLoadingAnimation(); // Hide the loading animation
                console.log('Success: URL is fetchable');
              }
            });
        }, 5000); // Check every 5 seconds (adjust the time as needed)
      });
  } else {
    hideLoadingAnimation(); // Hide the loading animation if the player is not signed in
  }
  
  // Immediately position the loading icon
  positionLoadingIcon();
});

document.addEventListener('DOMContentLoaded', function() {
  let overlay = null;

  // Get all elements with the class "SS"
  const screenshotDivs = document.querySelectorAll('.SS');

  // Iterate over each screenshotDiv element
  screenshotDivs.forEach(function(screenshotDiv) {
    // Add the hover event listener
    screenshotDiv.addEventListener('mouseenter', function() {
      this.style.cursor = 'zoom-in';
    });

    // Add the click event listener to each element
    screenshotDiv.addEventListener('click', function() {
      if (!overlay) {
        // Get the URL of the background image
        const imageUrl = getBackgroundImageUrl(this);

        // Create a full view overlay element
        overlay = document.createElement('div');
        overlay.classList.add('imageoverlay');

        // Create an image element for full view
        const fullImageView = document.createElement('img');
        fullImageView.src = imageUrl;
        fullImageView.classList.add('full-view');

        // Append the image element to the overlay
        overlay.appendChild(fullImageView);

        // Append the overlay to the document body
        document.body.appendChild(overlay);

        // Add a click event listener to the overlay to close it
        overlay.addEventListener('click', function() {
          // Remove the overlay from the document body
          document.body.removeChild(overlay);
          overlay = null;
        });

        // Add the cursor style change for zooming out
        fullImageView.addEventListener('mouseenter', function() {
          this.style.cursor = 'zoom-out';
        });

        // Reset cursor style when leaving the full view image
        fullImageView.addEventListener('mouseleave', function() {
          this.style.cursor = 'default';
        });
      }
    });
  });

  // Helper function to get the URL of the background image
  function getBackgroundImageUrl(element) {
    const backgroundImage = window.getComputedStyle(element).backgroundImage;
    const imageUrl = backgroundImage.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
    return imageUrl;
  }
});

// Position the loading icon initially
positionLoadingIcon();




