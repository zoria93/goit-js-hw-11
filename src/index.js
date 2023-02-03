import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const axios = require('axios').default;
const baseUrl = 'https://pixabay.com/api/';
const KEY_API = '33301172-db6a954cc7cf3c460999838e3';

const form = document.querySelector("#search-form");
const formBtn = document.querySelector("button");
const photoGalleri = document.querySelector(".gallery");

let searchImages = "";
let pageNumber = 1;


formBtn.addEventListener('click', onButtonClick);
form.addEventListener('input', onFormInput);


  function  onButtonClick(event) {
      event.preventDefault();
      if (searchImages === "") {
        return
    }
      getPhotos()
          .then((posts) => renderPosts(posts.hits))
         .catch((error) => console.log(error));
          
};


function onFormInput(event) {
    searchImages = (event.target.value).trim();
};


async function getPhotos() {
    const response = await fetch(`${baseUrl}?key=${KEY_API}&q=${searchImages}&image_type=photo&orientation=horizontal&safesearch=true&page=${pageNumber}&per_page=40`);
     const posts =  response.json() ;
    return posts
};



 function renderPosts(posts) {
    const createGallery = posts.map(({ webformatURL, previewURL, tags, likes, views, comments, downloads }) => {
        return `<a class="gallery__item" href="${webformatURL}">
  <img src="${previewURL}" alt="${tags}" loading="lazy" />
  </a>
    <p class="info-item">
      <b>likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>`
}).join('');

photoGalleri.insertAdjacentHTML("beforeend", createGallery);

new SimpleLightbox('.gallery a', { 
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,

});
};