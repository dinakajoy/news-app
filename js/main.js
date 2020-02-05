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
    article.urlToImage = '../img/png-news.png';
  }
  return `
    <article>
      <img src="${article.urlToImage}" alt="${article.title}">
      <h2>${article.title}</h2>
      <p>${article.description}</p>
      <br />
      <div>
        <small class="left"><strong>Published On: </strong>${article.publishedAt}</small>
        <small class="right"><strong>Author: </strong>${article.author}</small>
      </div>
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