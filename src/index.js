import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const axios = require('axios').default;
const baseUrl = 'https://pixabay.com/api/';
const KEY_API = '33301172-db6a954cc7cf3c460999838e3';

const form = document.querySelector("#search-form");
const formBtn = document.querySelector("button");

let searchImages = "";
let pageNumber = 1;


formBtn.addEventListener('click', gog);
form.addEventListener('input', fox);


function gog(event) {

    event.preventDefault();
    getPhotos();
   
};


function fox(event) {
    searchImages = (event.target.value).trim()

     
};


async function getPhotos() {
    const response = await axios.get(`${baseUrl}?key=${KEY_API}&q=${searchImages}&image_type=photo&orientation=horizontal&safesearch=true&page=${pageNumber}&per_page=40`);
    console.log(response);
};

