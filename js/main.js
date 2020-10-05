const apiKey = '1028726326a14f8da0fa5cc346d9ff5b';
const newsSelector = document.querySelector('#newsSelector');
const sourceSelector = document.querySelector('#sourceSelector');
const error = document.querySelector('#error');
let defaultSource = 'abc-news';

const formatSource = (source) => {
  let option = document.createElement('option');
  option.value = source.id;
  option.textContent = source.name;
  sourceSelector.appendChild(option);
}

const loadSources = async () => {
  try {
    const res = await fetch(`https://newsapi.org/v2/sources?apiKey=${apiKey}`);
    const result = await res.json();
    console.log(result);
    if(result.status === "ok") {
      let sources = result.sources;
      sources.forEach(source => {
        formatSource(source);
        error.style.display = 'none';
      })
    } else {
      error.textContent = "Sorry, there was an error loading news...";
      error.style.display = 'block';
    }
  } catch (error) {
    console.log(error);
  }
}

const formatArticle = (article) => {
  if (article.urlToImage === 'null') {
    article.urlToImage = 'https://dinakajoy.github.io/news-app/images/png-news.png';
  }
  return `
    <article>
      <a href="${article.url}" target="_BLANK">
        <img src="${article.urlToImage}" alt="${article.title}">
        <div class="details">
          <h2>${article.title}</h2>
          <p>${article.description.slice(0, 100)}...</p>
          <br />
          <small><strong>Published On: </strong>${article.publishedAt}</small>
          <small><strong>Author: </strong>${article.author}</small>
        </div>
      </a>
    </article>
  `
}

const loadNews = async (source = defaultSource) => {
  try {
    const news = await fetch(`https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=${apiKey}`);
    const result = await news.json();
    console.log(result);
    if(result.status === "ok") {
      newsSelector.innerHTML = result.articles.map(formatArticle).join('\n');
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
  loadSources();
  await loadNews();
  sourceSelector.value = defaultSource;

  sourceSelector.addEventListener('change', async (e) => {
    await loadNews(e.target.value);
  });
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