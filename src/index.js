import './scss/styles.scss';
import Notiflix from 'notiflix';

const refs = {
  searchForm: document.querySelector(`.search-form`),
  searchBox: document.querySelector(`[type="text"]`),
  gallery: document.querySelector(`.gallery`),
  lodeMoreBtn: document.querySelector(`.load-more`),
};

refs.searchForm.addEventListener(`submit`, onFormSubmit);
refs.lodeMoreBtn.addEventListener(`click`, onLodeMoreBtnClick);

let markup = ``;
let counterValue = 1;

disableBtn();

async function fetchImagesByName(name) {
  try {
    const response = await fetch(
      `https://pixabay.com/api/?key=29476807-778104ca63f185ac7ce275560&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${counterValue}&per_page=40`
    );
    const images = await response.json();

    return images;
  } catch (error) {
    console.log(error);
  }
}

async function onLodeMoreBtnClick(e) {
  counterValue += 1;
  const searchValue = refs.searchBox.value;
  const images = await fetchImagesByName(`${searchValue}`);
  const hits = await images.hits;
  createGalleryMarkup(hits);
  refs.gallery.insertAdjacentHTML(`beforeend`, markup);
  const totalHits = await images.totalHits;
  if (refs.gallery.children.length >= totalHits) {
    Notiflix.Notify.failure(
      `We're sorry, but you've reached the end of search results.`
    );
    disableBtn();
  }
}

async function onFormSubmit(e) {
  disableBtn();
  e.preventDefault();
  counterValue = 1;
  const searchValue = refs.searchBox.value;
  const images = await fetchImagesByName(`${searchValue}`);
  const totalHits = await images.totalHits;
  if (totalHits > 0) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  } else {
    Notiflix.Notify.failure(`Sorry we didnt found any images.`);
  }
  const hits = await images.hits;
  createGalleryMarkup(hits);
  refs.gallery.innerHTML = markup;
  if (totalHits > hits.length) {
    enableBtn();
  }
}

function createGalleryMarkup(hits) {
  markup = hits
    .map(image => {
      return `<div class="photo-card">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes: ${image.likes}</b>
        </p>
        <p class="info-item">
          <b>Views: ${image.views}</b>
        </p>
        <p class="info-item">
          <b>Comments: ${image.comments}</b>
        </p>
        <p class="info-item">
          <b>Downloads: ${image.downloads}</b>
        </p>
      </div>
    </div>`;
    })
    .join(``);
}

function disableBtn() {
  refs.lodeMoreBtn.style.visibility = `hidden`;
}

function enableBtn() {
  refs.lodeMoreBtn.style.visibility = `visible`;
}
