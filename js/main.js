const apiKey = '1028726326a14f8da0fa5cc346d9ff5b';
const newsSelector = document.querySelector('#newsSelector');
const sourceSelector = document.querySelector('#sourceSelector');
let defaultSource = 'abc-news';

const validateResponse = (response) => {
  if(!response.ok) {
    throw Error (response.statusText);
  }
  return response;
}

const convertResponseToJSON = (response) => {
  return response.json();
}

const formatSource = (source) => {
  let option = document.createElement('option');
  option.value = source.id
  option.textContent = source.name;
  sourceSelector.appendChild(option);
}

const loadSources = () => {
  fetch(`https://newsapi.org/v2/sources?apiKey=${apiKey}`)
    .then(validateResponse)
    .then(convertResponseToJSON)
    .then(result => {
      let sources = result.sources;
      sources.forEach(source => {
        formatSource(source);
      })
    })
    .catch(error => console.log(error));
}

const formatArticle = (article) => {
  if(article.urlToImage === 'null') {
    article.urlToImage = 'https://odinaka-joy.github.io/news-app/images/png-news.png';
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

const loadNews = async(source = defaultSource) => {
  try{
    const news = await fetch(`https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=${apiKey}`);
    const validateNews = await validateResponse(news);
    const toJSON = await convertResponseToJSON(validateNews);
    newsSelector.innerHTML = toJSON.articles.map(formatArticle).join('\n');
  } catch(error) {
    console.log(error);
  }
}

window.addEventListener('load', async (e) => {
  loadSources();
  await loadNews();
  sourceSelector.value = defaultSource;

  sourceSelector.addEventListener('change', async(e) => {
    await loadNews(e.target.value);
  });
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('https://odinaka-joy.github.io/news-app/service-worker.js')
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