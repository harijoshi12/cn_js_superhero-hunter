import MD5 from 'crypto-js/md5';

let favoriteSuperheroes = JSON.parse(localStorage.getItem('favourites')) || [];

let timeout;

const fetchSuperHeroes = async (query) => {
  const ts = new Date().getTime();
  const pulicKey = import.meta.env.VITE_PUBLIC_API_KEY;
  const privateKey = import.meta.env.VITE_PRIVATE_API_KEY;
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const hash = MD5(ts + privateKey + pulicKey).toString();
  const apiUrl = `${baseUrl}?nameStartsWith=${query}&ts=${ts}&apikey=${pulicKey}&hash=${hash}`;
  try {
    const response = await fetch(apiUrl);
    const { data } = await response.json();
    console.log('superhreos = ', data?.results);
    displaySuperHeros(data?.results);
  } catch (err) {
    console.log(err);
  }
};

const displaySuperHeros = (superHeros) => {
  const listItems = document.getElementById('listItems');
  listItems.innerHTML = '';
  superHeros?.slice(0, 20)?.map((hero) => {
    const card = document.createElement('div');
    card.innerHTML = `
    <a href="./superhero.html?id=${hero.id}" class="card">
    <div class="heroImage">
    <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" alt="${
      hero.name
    }"  />
    </div>
      <div class="about">
        <p class="heroName">${hero.name}</p>
        <p class="heroDesc">${hero.description.substring(0, 200)}...</p>
        <button onclick="addToFavorites(event, '${hero}')">Add to Favorites</button>
      </div>
      </a>
    `;
    listItems.appendChild(card);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.search input');
  searchInput.addEventListener('input', (e) => {
    if (e.target.value) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        fetchSuperHeroes(e.target.value);
      }, 300);
    } else {
      displaySuperHeros([]);
    }
  });
});

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
// Fetch and display superhero details
const fetchSuperheroDetails = async () => {
  const ts = new Date().getTime();
  const pulicKey = import.meta.env.VITE_PUBLIC_API_KEY;
  const privateKey = import.meta.env.VITE_PRIVATE_API_KEY;
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const hash = MD5(ts + privateKey + pulicKey).toString();
  const apiUrl = `${baseUrl}/${id}?ts=${ts}&apikey=${pulicKey}&hash=${hash}`;
  try {
    const response = await fetch(apiUrl);
    const { data } = await response.json();
    console.log('superhreo = ', data?.results[0]);
    displaySuperHero(data?.results[0]);
  } catch (err) {
    console.log(err);
  }
};
fetchSuperheroDetails();

const displaySuperHero = (hero) => {
  let wrapper = document.getElementById('superhero-details');
  wrapper.innerHTML = `
  <h1>${hero.name}</h1>
  <div class="content">
  <img class="bgImg" src="${hero.thumbnail.path}.${hero.thumbnail.extension}" alt="${hero.name}"  />
  <P>${hero.description}</P>
  </div>
  `;
};

// Add to favorites
window.addToFavorites = (event, hero) => {
  event.preventDefault();
  event.stopPropagation();
  favoriteSuperheroes.push(hero);
  console.log('original fav list = ', hero.name);
  localStorage.setItem('favorites', JSON.stringify(favoriteSuperheroes));
};

document.addEventListener('DOMContentLoaded', () => {
  const favouritesList = document.getElementById('favouritesList');
  const favouriteHeroes = JSON.parse(localStorage.getItem('favorites')) || [];
  console.log('fav hros = ', favouriteHeroes[0]);
  favouriteHeroes.forEach((hero) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
    <div class="heroImage">
    <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" alt="${
      hero.name
    }"  />
    </div>
      <div class="about">
        <p class="heroName">${hero.name}</p>
        <p class="heroDesc">${hero.description.substring(0, 200)}...</p>
        <button onclick="removeFromFavorites('${hero}')">Remove from Favorites</button>
      </div>
    `;
    favouritesList.appendChild(card);
  });
});

const removeFromFavorites = (hero) => {
  const favouriteHeroes = JSON.parse(localStorage.getItem('favorites')) || [];
  const updatedList = favouriteHeroes.filter((el) => el.id !== hero.id);
  localStorage.setItem('favorites', JSON.stringify(updatedList));
  // Refresh the page or remove the card element
};
