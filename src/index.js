
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { adCard, searchSvg } from './markUp';

const input = document.querySelector('input');
const submit = document.querySelector('button[type="submit"]');
const gallery = document.querySelector('.gallery');
const more = document.querySelector('.load-more');
submit.innerHTML = searchSvg;


let valueOfInput = '';
const axios = require('axios');

axios.defaults.baseURL = 'https://pixabay.com/api/';

input.addEventListener('input', takeValue);
submit.addEventListener('click', searchAndDrawMarkUp);
more.addEventListener('click', moreImagesPlz);


const option = {
    key: '28290487-08acef9b94dbac81dafc26654',
    q: valueOfInput,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page: 1,
}

function takeValue(e) {
    more.classList.add('visually-hidden');
    clearMarkUp();
    if (option.q !== e.target.value || option.q == '') {
        option.q = e.target.value;
    }
}

async function fetching(option) {
    const { key, image_type, orientation, safesearch, q, per_page, page } = option;
    const result = await axios(`?key=${key}&q=${q}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}&per_page=${per_page}&page=${page}`);
    return result.data;
}

async function searchAndDrawMarkUp(e) {
    e.preventDefault();
    await checkIfSubmit(e);
    try {
        const res = await fetching(option);
        console.log(res)
        await checkDataLength(res, option);
        const allMarkUp = res.hits.map(item => adCard(item)).join('');
        gallery.insertAdjacentHTML('beforeend', allMarkUp);
        scrollBy(e);
        const gal = new SimpleLightbox('.gallery a');
        gal.refresh();
        return gal;
    } catch { error => { console.error(error); Notiflix.Notify.warning('Try again'); } }
}

async function checkDataLength({ totalHits }, obj) {
    const lastPage = totalHits / obj.per_page < obj.page;
    btnToggle(lastPage);
    if (totalHits == 0) {
        Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.');
    }
    if (totalHits >= 1 && lastPage) {
        Notiflix.Notify.success(`Hooray we found ${totalHits} images`);
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
    if (totalHits >= 1 && !lastPage) {
        Notiflix.Notify.success(`Hooray we found ${totalHits} images`);
    }
}

function clearMarkUp() {
    gallery.innerHTML = '';
}

async function moreImagesPlz(e) {
    option.page += 1;
    await searchAndDrawMarkUp(e);
}

async function checkIfSubmit(e) {
    if (e.target == submit) {
        option.page = 1;
    }
}

function btnToggle(lastPage) {
    lastPage ? more.classList.add('visually-hidden') : more.classList.remove('visually-hidden');
}

function scrollBy(e) {
    if (e.target == more) {
        const { height: cardHeight } = document
            .querySelector(".gallery")
            .firstElementChild.getBoundingClientRect();

        window.scrollBy({
            top: cardHeight * 2,
            behavior: "smooth",
        });
    }
}