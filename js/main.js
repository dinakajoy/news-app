const apiKey = '1028726326a14f8da0fa5cc346d9ff5b';
const main = document.querySelector('#main');
const sourceSelector = document.querySelector('#sourceSelector');

const validateResponse = (response) => {
  if(!response.ok) {
    throw Error (response.statusText);
  }
  return response;
}

const convertResponseToJSON = (response) => {
  return response.json();
}

const createSource = (source) => {
  let option = document.createElement('option');
  option.value = source.id
  option.textContent = source.name;
  sourceSelector.appendChild(option);
}

const createNews = (news) => {
  return `
    <article>
      <small class="left"><strong>Published On: </strong>${news.publishedAt}</small>
      <img src="${news.urlToImage}" alt="${news.title}">
      <h2>${news.title}</h2>
      <p>${news.description}</p>
      <small class="right"><strong>Author: </strong>${news.author}</small>
    </article>
  `;

  // const article = document.createElement('article');

  // let img = document.createElement('img');
  // img.src = news.urlToImage;

  // let h2 = document.createElement('h2');
  // h2.textContent=news.title;

  // let p = document.createElement('p');
  // p.textContent=news.description;

  // let div1 = document.createElement('div');
  // let strong1 = document.createElement('strong');
  // strong1.textContent = 'Author: ';
  // let small1 = document.createElement('small');
  // small1.textContent = news.author;
  // div1.appendChild(strong1);
  // div1.appendChild(small1);

  // let div2 = document.createElement('div');
  // let strong2 = document.createElement('strong');
  // strong2.textContent = 'Published On: ';
  // let small2 = document.createElement('small');
  // small2.textContent = news.publishedAt;
  // div2.appendChild(strong2);
  // div2.appendChild(small2);

  // article.appendChild(img);
  // article.appendChild(h2);
  // article.appendChild(p);
  // article.appendChild(div1);
  // article.appendChild(div2);
  // main.appendChild(article);
}

const loadSources = () => {
  fetch(`https://newsapi.org/v2/sources?apiKey=${apiKey}`)
    .then(validateResponse)
    .then(convertResponseToJSON)
    .then(result => {
      let sources = result.sources;
      sources.forEach(source => {
        createSource(source);
      })
    })
    .catch(error => console.log(error));
}

const loadNews = (source = 'abc-news') => {
  fetch(`https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=${apiKey}`)
    .then(validateResponse)
    .then(convertResponseToJSON)
    .then(result => {
      let articles = result.articles;
      articles.map(news => {
        // let newsSource = createNews(news);
        main.innerHTML = createNews(news);

      })
      // main.innerHTML = newsSource;
    })
    .catch(error => console.log(error));
}

window.addEventListener('load', (e) => {
  loadSources();
  loadNews();
});
sourceSelector.addEventListener('change', async(e) => {
  console.log(e.target.value);
  await loadNews(e.target.value);
});