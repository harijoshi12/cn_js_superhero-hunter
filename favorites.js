let favoriteHeroes = JSON.parse(localStorage.getItem('favorites')) || [];

// Function to show toast with dynamic message
const showToast = (message) => {
  const toast = document.getElementById('toast');
  toast.innerText = message;
  toast.style.visibility = 'visible';
  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.style.visibility = 'hidden';
  }, 3000);
};

const toggleLoader = (display) => {
  document.getElementById('loader').style.display = display ? 'block' : 'none';
};

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
const displaySuperheroes = () => {
  const favoritesList = document.getElementById('favoritesList');
  favoritesList.innerHTML = favoriteHeroes.length
    ? ''
    : '<h1 class="noResult">No Heroes Added to Favorites. Search and Add Your Heroes to Favorites.</h1>';

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

const removeFromFavorites = (event, hero) => {
  favoriteHeroes = favoriteHeroes.filter((el) => el.id !== hero.id);
  console.log('remove hero id =', hero.id);
  localStorage.setItem('favorites', JSON.stringify(favoriteHeroes));
  showToast(`Removed ${hero.name} From Favorites`);
  displaySuperheroes();
};

document.addEventListener('DOMContentLoaded', () => {
  fetchSuperheroesFromLocal();
  displaySuperheroes();
});
