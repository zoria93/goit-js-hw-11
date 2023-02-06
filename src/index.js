import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { debounce } from "lodash";

// import InfiniteScroll from 'infinite-scroll';



// const InfiniteScroll = require('infinite-scroll');
// const imagesLoaded = require('imagesloaded');
const baseUrl = 'https://pixabay.com/api/';
const KEY_API = '33301172-db6a954cc7cf3c460999838e3';



const searchForm = document.querySelector(".search-form");
const photoGalleri = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");
// const scrollBoby = document.querySelector(".body")

let searchImages = "";
let pageNumber = 1;
const perPage = 40;


searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onScroll)
// window.addEventListener('scroll', debounce((onScroll), 300,  {
//       leading: false,
//       trailing: true,
//     }))
loadMoreBtn.style.display = 'none';


function onSearch(event) {
  event.preventDefault();
  clearContainer()
  loadMoreBtn.style.display = 'none';
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
      loadMoreBtn.style.display = 'inline-block';
      Notiflix.Notify.success(`Hooray! We found ${posts.totalHits} images.`);
      
    })
    .catch((error) => console.log(error));
  searchForm.reset();
};


function onScroll(event) {
  event.preventDefault();
  pageNumber += 1;
    loadMoreBtn.style.display = 'none';
      getPhotos()
        .then((posts) => {
          loadMoreBtn.style.display = 'inline-block';
          const count = Math.round(posts.totalHits / perPage);
          console.log(count)
           if (pageNumber > count) {
             Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
             loadMoreBtn.style.display = 'none';
            console.log(pageNumber > count);
          }
           renderPosts(posts.hits); 
        })
        .catch((error) => {
          console.log(error); 
        } );
   
};


async function getPhotos() {
    const response = await fetch(`${baseUrl}?key=${KEY_API}&q=${searchImages}&image_type=photo&orientation=horizontal&safesearch=true&page=${pageNumber}&per_page=${perPage}`);
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
//   Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.", {
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