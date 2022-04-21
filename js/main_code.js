'use strict'



function tausta(s) {
  
  const body = document.querySelector('body');
 
  let image;
  if (s.url) {
    image = document.createElement('img');
    image.src = s.url;
    image.alt = s.explanation;
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
}).then(function(s){       
  tausta(s);          
}).catch(function(error){      
  console.log(error);        
})               