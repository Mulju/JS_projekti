'use strict'

function kuva(slide) {
  let imgfirst;
  let imgsecond;
  let imgthird;
  let imgfourth;
  console.log(slide)
  if (slide.photos) {
    let random = Math.floor(Math.random()*slide.photos.length);
    const slide_elem = document.getElementsByClassName("slide");
    imgfirst = document.createElement('img');
    imgfirst.src = slide.photos[random].img_src;
      
    slide_elem[0].appendChild(imgfirst);

    random = Math.floor(Math.random()*slide.photos.length);
    imgsecond = document.createElement('img');
    imgsecond.src = slide.photos[random].img_src;
     
    slide_elem[1].appendChild(imgsecond);

    random = Math.floor(Math.random()*slide.photos.length);
    imgthird = document.createElement('img');
    imgthird.src = slide.photos[random].img_src;
     
    slide_elem[2].appendChild(imgthird);

    random = Math.floor(Math.random()*slide.photos.length);
    imgfourth = document.createElement('img');
    imgfourth.src = slide.photos[random].img_src;
      
    slide_elem[3].appendChild(imgfourth);

  } else {
    const slide_elem = document.getElementsByClassName("slide");
    imgfirst = document.createElement('img');
    imgfirst.src = 'defaultkuva.jpg';
    imgfirst.alt = 'error';
    slide_elem[0].appendChild(imgfirst);
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

let counter = 1;
setInterval(function(){
  document.getElementById('radio' + counter).checked = true;
  counter++;
  if(counter > 4){
    counter = 1;
  }
}, 5000);