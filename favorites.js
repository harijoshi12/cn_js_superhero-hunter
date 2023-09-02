// favoritesHeroes.js
import { showToast, toggleLoader } from './common.js';

// Initialize favoriteHeroes array from localStorage
let favoriteHeroes = JSON.parse(localStorage.getItem('favorites')) || [];

// Fetch favorite superheroes from localStorage
const fetchSuperheroesFromLocal = async () => {
  try {
    toggleLoader(true);
    favoriteHeroes =
      (await JSON.parse(localStorage.getItem('favorites'))) || [];
    console.log('fav heroes = ', favoriteHeroes);
    toggleLoader(false);
  } catch (err) {
    toggleLoader(false);
    console.log('Error fetching local items: ', err);
  }
};

// Display favorite superheroes on the page
const displaySuperheroes = () => {
  const favoritesList = document.getElementById('favoritesList');
  favoritesList.innerHTML = favoriteHeroes.length
    ? ''
    : '<h1 class="noResult">No Heroes Added to Favorites. Search and Add Your Heroes to Favorites.</h1>';

  // Loop through each favorite hero and create a card
  favoriteHeroes?.forEach((hero) => {
    const card = document.createElement('div');
    card.innerHTML = `
    <a href="./superhero.html?id=${hero.id}" class="card">
      <div class="heroImage">
      <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" alt="${hero.name}"  />
      </div>
        <div class="about">
          <p class="heroName">${hero.name}</p>
          <button class="remove-favorite-button">Remove From Favorites</button>
        </div>
    </a>
    `;
    favoritesList.appendChild(card);
    const favoriteButton = card.querySelector('.remove-favorite-button');
    favoriteButton.addEventListener('click', (event) => {
      event.stopPropagation();
      event.preventDefault();
      console.log('remove btn hero = ', hero);
      favoriteButton.classList.add('fav-active');
      removeFromFavorites(event, hero);
    });
  });
};

// Remove hero from favorites
const removeFromFavorites = (event, hero) => {
  // Filter out the hero to be removed
  favoriteHeroes = favoriteHeroes.filter((el) => el.id !== hero.id);
  // Update localStorage
  console.log('remove hero id =', hero.id);
  localStorage.setItem('favorites', JSON.stringify(favoriteHeroes));
  showToast(`Removed ${hero.name} From Favorites`);
  // Refresh the displayed list
  displaySuperheroes();
};

// Execute when the document is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  fetchSuperheroesFromLocal();
  displaySuperheroes();
});
