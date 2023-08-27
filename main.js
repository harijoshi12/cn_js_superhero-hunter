import MD5 from 'crypto-js/md5';
// document.getElementsByTagName('body').s;
// console.log(MD5('text to hash').toString());
// console.log('env = ', import.meta.env.VITE_PUBLIC_API_KEY);

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
    console.log('superhreos = ', data);
    displaySuperHeros(data?.results);
  } catch (err) {
    console.log(err);
  }
};

const displaySuperHeros = (superHeros) => {
  const listItems = document.getElementById('listItems');
  listItems.innerHTML = '';
  superHeros.forEach((hero) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
    <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" alt="${hero.name}" class="heroImage" />
      <div class="about">
        <p>${hero.name}</p>
      </div>
    `;
    listItems.appendChild(card);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.search input');

  searchInput.addEventListener('input', (e) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fetchSuperHeroes(e.target.value);
    }, 300);
  });
});
