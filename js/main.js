const apiKey = '088fb523-ba2d-40c2-abe4-061545f5754e';

const newsSelector = document.querySelector('#newsSelector');
const error = document.querySelector('#error');

const formatArticle = (article) => {
  if (article.urlToImage === 'undefined') {
    article.urlToImage = 'https://dinakajoy.github.io/news-app/images/png-news.png';
  }
  return `
    <article>
      <a href="${article.webUrl}" target="_BLANK">
        <img src="${article.urlToImage}" alt="${article.title}">
        <div class="details">
          <p>${article.webTitle}</p>
          <br />
          <small><strong>Published On: </strong>${article.webPublicationDate}</small>
          <small><strong>Section Name: </strong>${article.sectionName}</small>
        </div>
      </a>
    </article>
  `
}

const loadNews = async () => {
  try {
    const res = await fetch(`https://content.guardianapis.com/search?api-key=${apiKey}`);
    const result = await res.json();
    if(result.response.status === "ok") {
      console.log(result.response.results);
      newsSelector.innerHTML = result.response.results.map(formatArticle).join('\n');
      error.style.display = 'none';
    } else {
      error.textContent = "Sorry, there was an error loading news...";
      error.style.display = 'block';
    }
  } catch (error) {
    console.log(error);
  }
}

window.addEventListener('load', async (e) => {
  await loadNews();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('https://dinakajoy.github.io/news-app/service-worker.js')
      .then(reg => console.log('Service worker was successfully registered'))
      .catch(error => console.log(`There was an error: ${error}`));
  })
} else {
  console.log('Service Worker is not supported in this browser');
}

let deferredPrompt;

// window.addEventListener('beforeinstallprompt', (e) => {
//   e.preventDefault();
//   deferredPrompt = e;
//   showInstallPromotion();
// });