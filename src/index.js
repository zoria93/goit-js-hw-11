import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css"



const searchForm = document.querySelector(".search-form");
const photoGalleri = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");


const baseUrl = 'https://pixabay.com/api/';
const KEY_API = '33301172-db6a954cc7cf3c460999838e3';

let searchImages = "";
let pageNumber = 1;
const perPage = 40;


searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', loadButtonClick)

loadMoreBtn.style.display = 'none';


function onSearch(event) {
  event.preventDefault();
  clearContainer()
  loadMoreBtn.style.display = 'none';
  resetPage();
  searchImages = event.currentTarget.elements.searchQuery.value.trim();
      if (searchImages === "") {
        return
  };
  getPhotos()
    .then((posts) => {
      if (posts.data.hits.length === 0) {
      return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      };
      renderPosts(posts.data.hits);
      refreshSimpleLightBox()
      loadMoreBtn.style.display = 'inline-block';
      Notiflix.Notify.success(`Hooray! We found ${posts.data.totalHits} images.`);
      
    })
    .catch((error) => console.log(error));
  searchForm.reset();
};


function loadButtonClick(event) {
  event.preventDefault();
  incrementPage();
  loadMoreBtn.style.display = 'none';
  getPhotos()
        .then((posts) => {
          loadMoreBtn.style.display = 'inline-block';
          const count = Math.round(posts.data.totalHits / perPage);
           if (pageNumber > count) {
             onCollectionEnd()
             loadMoreBtn.style.display = 'none';
          };
          renderPosts(posts.data.hits); 
          refreshSimpleLightBox()
          onScroll();
        })
        .catch((error) => {
          console.log(error); 
        });
   
};


async function getPhotos() {
    const response =  axios.get(`${baseUrl}?key=${KEY_API}&q=${searchImages}&image_type=photo&orientation=horizontal&safesearch=true&page=${pageNumber}&per_page=${perPage}`);
  const posts = await response;
  return posts;
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

};


function incrementPage() {
  pageNumber += 1;
};

function resetPage() {
  pageNumber = 1;
};

function clearContainer() {
   photoGalleri.innerHTML = '';
};



function refreshSimpleLightBox() {
  new SimpleLightbox('.gallery a', {
    captions: true,
  captionsData: 'alt',
    captionDelay: 250,
    scrollZoom: false,
  }).refresh();
};


function onCollectionEnd() {
  Notiflix.Notify.info("We're sorry, but you've reached the end of search results.", {
    showOnlyTheLastOne: true,
    cssAnimationDuration: 1000,
  });
};

function onScroll() {
  const { height: cardHeight} = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 3.3,
    behavior: 'smooth',
  });
};