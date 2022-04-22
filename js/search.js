'use strict'













const haku = document.querySelector('form')

haku.addEventListener('submit', function (evt) {
    evt.preventDefault()
    const hakusana = document.querySelector('input[name=text]').value

  fetch('https://api.tvmaze.com/search/shows?q=' + hakusana)            
  .then(function(vastaus){       
    return vastaus.json()       
  }).then(function(s){       
    sarjat(s)
    console.log(s)           
  }).catch(function(error){      
    console.log(error)        
  })               
})

function sarjat(s) {

  console.log(s)

  const main = document.querySelector('main')

  while (main.firstChild) {
    main.removeChild(main.firstChild)
}

  for (let i = 0; i < s.length; i++) {
    console.log(s[i].show.name)
   
    const article = document.createElement('article')
    article.className = 'article'
    main.appendChild(article)

    const nimi = document.createElement('h2')
    nimi.className = 'nimi'
    nimi.textContent = s[i].show.name;

    if (s[i].show.image != null) {
      const image = document.createElement('img')
      image.src = s[i].show.image.medium;
      image.alt = s[i].show.name
      article.appendChild(image)
  } else {
      const image = document.createElement('img')
      image.src = '../eikuvaa.jpg'
      image.alt = 'error'
      article.appendChild(image)
  }

      const genre = document.createElement('p')
      genre.className = 'genre'
      genre.textContent = s[i].show.genres.join(', ')
      article.appendChild(genre);

      const link = document.createElement('a')
      link.className = 'Link'
      link.href = s[i].show.url
      link.textContent = 'Link'
      article.appendChild(link)

      const summary = document.createElement('div')
      summary.className = 'summary'
      summary.innerHTML = s[i].show.summary;
      article.appendChild(summary)
  }

}