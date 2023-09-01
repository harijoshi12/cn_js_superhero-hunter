import MD5 from 'crypto-js/md5';

const pulicKey = import.meta.env.VITE_PUBLIC_API_KEY;
const privateKey = import.meta.env.VITE_PRIVATE_API_KEY;
const baseUrl = import.meta.env.VITE_BASE_URL;

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
// Fetch and display superhero details
const fetchSuperheroDetails = async () => {
  const ts = new Date().getTime();
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
