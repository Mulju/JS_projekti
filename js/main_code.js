'use strict'



/*function tausta(background) {
  
  const body = document.querySelector('body');
 
  let image;
  if (background.url) {
    image = document.createElement('img');
    image.src = background.url;
    image.alt = background.explanation;
    body.appendChild(image);
  } else {
    image = document.createElement('img');
    image.src = 'defaultkuva.jpg';
    image.alt = 'error';
    body.appendChild(image);
  }

  //image.setAttribute("position", "fixed");
  //html.setAttribute("background-image", "url(\"" + s.url + "\")");

}
fetch('https://api.nasa.gov/planetary/apod?api_key=1RZqOOQSWmVECbPyRb3x7NRkO6JiEKqfbkSf5wGg')            
.then(function(vastaus){       
  return vastaus.json();       
}).then(function(background){       
  tausta(background);          
}).catch(function(error){      
  console.log(error);        
}) 
*/



function kuva(slide) {
  
  const main = document.querySelector('main');
  console.log(slide);
   
    const article = document.createElement('article')
    article.className = 'article'
    main.appendChild(article)

  let img;
  if (slide.photos) {
    const random = Math.floor(Math.random()*slide.photos.length);
    img = document.createElement('img');
    img.src = slide.photos[random].img_src;
    article.appendChild(img);
    img.setAttribute("width", "30%");
    console.log(random);
  } else {
    img = document.createElement('img');
    img.src = 'defaultkuva.jpg';
    img.alt = 'error';
    article.appendChild(img);
  }

  

}

fetch('https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=1RZqOOQSWmVECbPyRb3x7NRkO6JiEKqfbkSf5wGg')            
.then(function(vastaus){       
  return vastaus.json();       
}).then(function(slide){       
  kuva(slide);          
}).catch(function(error){      
  console.log(error);        
}) 

fetch("https://api.nasa.gov/insight_weather/?api_key=DEMO_KEY&feedtype=json&ver=1.0").then(function(vastaus) {
  return vastaus.json();
}).then(function(jotain){
  console.log("onnas");
  console.log(jotain);
}).catch(function(error) {
  console.log(error);
})