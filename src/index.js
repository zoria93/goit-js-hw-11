import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { debounce } from "lodash";
import InfiniteScroll from 'infinite-scroll';



// const InfiniteScroll = require('infinite-scroll');
// const imagesLoaded = require('imagesloaded');
const axios = require('axios').default;
const baseUrl = 'https://pixabay.com/api/';
const KEY_API = '33301172-db6a954cc7cf3c460999838e3';



const searchForm = document.querySelector(".search-form");
const photoGalleri = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");
// const scrollBoby = document.querySelector(".body")

let searchImages = "";
let pageNumber = 1;


searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onScroll)
// window.addEventListener('scroll', debounce((onScroll), 500))
// loadMoreBtn.style.display = 'none';


function onSearch(event) {
  event.preventDefault();
  clearContainer()
  pageNumber = 1;
  searchImages = event.currentTarget.elements.searchQuery.value.trim();
      if (searchImages === "") {
        return
  };
  getPhotos()
    .then((posts) => {
      if (posts.hits.length === 0) {
      return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      };
        renderPosts(posts.hits);
        Notiflix.Notify.success(`Hooray! We found ${posts.totalHits} images.`);    
    })
        .catch((error) => console.log(error));
  searchForm.reset();
};


function onScroll(event) {
  event.preventDefault();
  pageNumber += 1;
      getPhotos()
        .then((posts) => {
          if (posts.hits.length !== 0) {
            renderPosts(posts.hits);  
          } if (posts.hits.length === 0) {
           Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            console.log(posts.hits.length === 0);
         
          }
          
        })
        .catch((error) => console.log(error));
   
};


async function getPhotos() {
    const response = await fetch(`${baseUrl}?key=${KEY_API}&q=${searchImages}&image_type=photo&orientation=horizontal&safesearch=true&page=${pageNumber}&per_page=40`);
     const posts =  response.json();
    return posts
};



 function renderPosts(posts) {
    const createGallery = posts.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `
      <a class="gallery__item" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="wrap">
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
    </p>
    </div>
     </a>`    
    }).join('');
   
   photoGalleri.insertAdjacentHTML("beforeend", createGallery);

new SimpleLightbox('.gallery a', { 
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,

});

};

function clearContainer() {
   photoGalleri.innerHTML = '';
};

// function onCollectionEnd() {
//   Notify.info("We're sorry, but you've reached the end of search results.", {
//     showOnlyTheLastOne: true,
//     cssAnimationDuration: 1000,
//   });
//   loadMoreBtn.style.display = 'none';
// }


// function onScroll() {
//   const { height: cardHeight} = document
//     .querySelector('.gallery')
//     .firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }