// Api_Key = 1028726326a14f8da0fa5cc346d9ff5b;
const select = document.querySelector('#source');
const main = document.querySelector('#main');
// select.value = 'nbc-news';
let source = select.value;

const validateFetchResponse = (response) => {
  if(!response.ok) {
    throw Error (response.statusText);
  }
  return response;
}

const convertResponseToJSON = (response) => {
  return response.json();
}

const createSource = (source = nbc-news) => {
  let option = document.createElement('option').textContent = source.id;
  select.appendChild(option);
}

const createNews = (news) => {
  const article = document.createElement('article');
  let h1 = document.createElement('h2').textContent=news.title;
  let p = document.createElement('p').textContent=news.content;
  let small = document.createElement('small').textContent=news.author;
  article.appendChild(h1);
  article.appendChild(p);
  article.appendChild(small);
  main.appendChild(article);
}

const loadSources = (e) => {
  fetch('https://newsapi.org/v2/sources?apiKey=1028726326a14f8da0fa5cc346d9ff5b')
    .then(validateFetchResponse)
    .then(convertResponseToJSON)
    .then(result => {
      let sources = result.sources;
      sources.forEach(source => {
        createNews(source);
      })
    })
    .catch(error => console.log(error));
}

const loadNews = (e) => {
  fetch(`https://newsapi.org/v2/top-headlines?sources=${select.value}&apiKey=1028726326a14f8da0fa5cc346d9ff5b`)
    .then(res => res.json())
    .then(result => {
      console.log(result);
      let article = result.articles;
      article.forEach(news => {
        createNews(news);
      })
    })
    .catch(error => console.log(error));
}


window.addEventListener('load', loadSources);
select.addEventListener('change', loadNews);