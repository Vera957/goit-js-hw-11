
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const input = document.querySelector('input');
const form = document.querySelector('form')
const submit = document.querySelector('button[type="submit"]');
const gallery = document.querySelector('.gallery')
let valueOfInput = '';
const axios = require('axios');

axios.defaults.baseURL = 'https://pixabay.com/api/';

input.addEventListener('input', takeValue);
submit.addEventListener('click', searchAndDrawMarkUp);

const option = {
    url: 'https://pixabay.com/api/',
    key: '28290487-08acef9b94dbac81dafc26654',
    q: valueOfInput,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
}

function takeValue(e) {
    option.q = e.target.value;
}

async function fetching(option) {
    const { key, image_type, orientation, safesearch, q } = option;
    const result = await axios(`?key=${key}&q=${q}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}`);
    console.log('fetching')
    console.log(result.data.hits);
    return result.data.hits;
}

function adCard({ webformatURL, tags, likes, views, comments, downloads, largeImageURL }) {
    return `
    <div class="photo-card">
    <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes: </b><span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views: </b><span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments: </b><span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads: </b><span>${downloads}</span>
    </p>
  </div>
</div>
    `
}

//прокрутка страниці
/*const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
});*/

async function searchAndDrawMarkUp(e) {
    console.log('searchAndDrawMarkUp')
    e.preventDefault();
    const res = await fetching(option);
    const allMarkUp = res.map(item => adCard(item)).join('');
    return gallery.insertAdjacentHTML('afterbegin', allMarkUp);
    //form.reset();
}

let gallery1 = new SimpleLightbox('.gallery a', { close: true, closeText: 'X', overlayOpacity: 0.9 });
