'use strict'



function tausta(s) {
  
  console.log(s)
  
  const main = document.querySelector('main')
  
  const article = document.createElement('article')
  article.className = 'article'
  main.appendChild(article)

  if (s.url) {
    const image = document.createElement('img')
    image.src = s.url;
    image.alt = s.explanation;
    article.appendChild(image)
  } else {
    const image = document.createElement('img')
    image.src = 'defaultkuva.jpg'
    image.alt = 'error'
    article.appendChild(image)
  }
}
fetch('https://api.nasa.gov/planetary/apod?api_key=1RZqOOQSWmVECbPyRb3x7NRkO6JiEKqfbkSf5wGg')            
.then(function(vastaus){       
  return vastaus.json()       
}).then(function(s){       
  tausta(s)
  console.log(s)           
}).catch(function(error){      
  console.log(error)        
})               