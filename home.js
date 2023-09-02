// home.js
import { showToast, toggleLoader } from './common.js';

// Import MD5 hashing function from crypto-js library
import MD5 from 'crypto-js/md5';

// Import environment variables
const pulicKey = import.meta.env.VITE_PUBLIC_API_KEY;
const privateKey = import.meta.env.VITE_PRIVATE_API_KEY;
const baseUrl = import.meta.env.VITE_BASE_URL;

// Initialize timeout variable for search debounce
let timeout;

// Function to fetch superheroes based on query
const fetchSuperHeroes = async (query) => {
  const ts = new Date().getTime();
  const hash = MD5(ts + privateKey + pulicKey).toString();
  const apiUrl = `${baseUrl}?nameStartsWith=${query}&ts=${ts}&apikey=${pulicKey}&hash=${hash}`;
  try {
    // Show loader while fetching
    toggleLoader(true);
    const response = await fetch(apiUrl);
    const { data } = await response.json();
    console.log('superhreos = ', data?.results);
    displaySuperheroes(data?.results);
    // Hide loader after fetching
    toggleLoader(false);
  } catch (err) {
    // Hide loader if an error occurs
    toggleLoader(false);
    console.log(err);
  }
};

// Function to display fetched superheroes
const displaySuperheroes = (superheroes = []) => {
  const listItems = document.getElementById('listItems');
  listItems.innerHTML = '';
  // Display message if no superheroes found
  if (superheroes.length == 0) {
    listItems.innerHTML = `
    <h1 class="noResult">No Hero Found. Try Seaching Some Other heroes.</h1>
    `;
  }
  // Display superheroes
  superheroes?.slice(0, 20)?.map((hero) => {
    const card = document.createElement('div');
    const existingFavorites =
      JSON.parse(localStorage.getItem('favorites')) || [];

    const isAlreadyFavorite = existingFavorites.some(
      (existingHero) => existingHero.id === hero.id
    );
    card.innerHTML = `
    <a href="./superhero.html?id=${hero.id}" class="card">
      <div class="heroImage">
      <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" alt="${
      hero.name
    }"  />
      </div>
        <div class="about">
          <p class="heroName">${hero.name}</p>
          <button class="add-favorite-button ${
            isAlreadyFavorite ? 'fav-active' : ''
          }">Add to Favorites</button>
        
        </div>
    </a>
    `;
    listItems.appendChild(card);
    const favoriteButton = card.querySelector('.add-favorite-button');
    favoriteButton.addEventListener('click', (event) => {
      event.stopPropagation();
      event.preventDefault();
      favoriteButton.classList.add('fav-active');
      addToFavorites(event, hero);
    });
  });
};

// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  if (path.includes('superhero-hunter')) {
    // Run functions related to the home page
    const searchInput = document.querySelector('.search input');
    searchInput.innerText = '';
    searchInput.addEventListener('input', (e) => {
      if (e.target.value) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          fetchSuperHeroes(e.target.value);
        }, 500);
      } else {
        displaySuperheroes([]);
      }
    });
  }
});

// Function to add superhero to favorites
const addToFavorites = (event, hero) => {
  // Fetch existing favorites from local storage
  const existingFavorites = JSON.parse(localStorage.getItem('favorites')) || [];

  // Check if hero is already in favorites
  const isAlreadyFavorite = existingFavorites.some(
    (existingHero) => existingHero.id === hero.id
  );

  if (isAlreadyFavorite) {
    showToast(`${hero.name} already added to Favorites`);
  } else {
    existingFavorites.push(hero);
    localStorage.setItem('favorites', JSON.stringify(existingFavorites));
    showToast(`Added ${hero.name} to Favorites`);
  }
};
