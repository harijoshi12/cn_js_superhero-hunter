// superhero.js
import { showToast, toggleLoader } from './common.js';

// Import MD5 hashing function from crypto-js library
import MD5 from 'crypto-js/md5';

// Import environment variables
const pulicKey = import.meta.env.VITE_PUBLIC_API_KEY;
const privateKey = import.meta.env.VITE_PRIVATE_API_KEY;
const baseUrl = import.meta.env.VITE_BASE_URL;

// Get superhero ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

// Fetch and display superhero details
const fetchSuperheroDetails = async () => {
  // Generate timestamp and hash for API request
  const ts = new Date().getTime();
  const hash = MD5(ts + privateKey + pulicKey).toString();
  // Construct API URL
  const apiUrl = `${baseUrl}/${id}?ts=${ts}&apikey=${pulicKey}&hash=${hash}`;
  try {
    toggleLoader(true);
    // Fetch superhero details from API
    const response = await fetch(apiUrl);
    const { data } = await response.json();
    console.log('single data = ', data);
    // Display fetched superhero details
    displaySuperHero(data?.results[0]);
    toggleLoader(false);
  } catch (err) {
    toggleLoader(false);
    console.log(err);
  }
};

// Call the function to fetch and display superhero details
fetchSuperheroDetails();

// Function to display superhero details on the page
const displaySuperHero = (hero) => {
  // Get the wrapper element to insert superhero details
  let wrapper = document.getElementById('superhero-details');

  // Construct and insert HTML for superhero details
  wrapper.innerHTML = `
  <h1>${hero.name}</h1>
  <div class="content">
  <img class="bgImg" src="${hero.thumbnail.path}.${
    hero.thumbnail.extension
  }" alt="${hero.name}"  />
  <div class="about">
  <h2>Desc:</h2>
  <P>${hero.description}</P>
  <h2>comics:</h2>
  <p>available: ${hero.comics.available}</p>
  <ul>
    ${hero.comics.items
      .slice(0, 5)
      .map((item) => `<li>${item.name}</li>`)
      .join('')}
  </ul>
  <h2>events:</h2>
  <p>available: ${hero.events.available}</p>
  <ul>
    ${hero.events.items
      .slice(0, 5)
      .map((item) => `<li>${item.name}</li>`)
      .join('')}
  </ul>
  <h2>series:</h2>
  <p>available: ${hero.series.available}</p>
  <ul>
  ${hero.series.items
    .slice(0, 5)
    .map((item) => `<li>${item.name}</li>`)
    .join('')}
</ul>
  <h2>stories</h2>
  <p>available: ${hero.stories.available}</p>
  <ul>
  ${hero.stories.items
    .slice(0, 5)
    .map((item) => `<li>${item.name}</li>`)
    .join('')}
</ul>
  <h2>urls:</h2>
  ${hero.urls
    .map((url) => `<p>${url.type}: <a href="${url.url}">${url.url}</a></p>`)
    .join('')}
  </div>
  </div>
  `;
};
