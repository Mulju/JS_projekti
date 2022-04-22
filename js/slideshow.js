'use strict'

// Tämä funktio hakee 4 uusinta uutista
async function getNews() {
  try {
    const response = await fetch("https://www.finnkino.fi/xml/News/");
    
    if (!response.ok) {
      console.error("Tapahtui virhe.");
      return;
    }

    const rawXML = await response.text();
    const data =  await new DOMParser().parseFromString(rawXML, "text/xml");
    const news = data.querySelectorAll("NewsArticle");
    
    // Tehdään taulukko missä on neljän uusimman uutisen kuvat.
    const newsImages = [];
    for(let i = 0; i < 4; i++) {
      newsImages.push(news[i].querySelector("ImageURL").innerHTML);
    }

    return newsImages;
  } catch(error) {
    console.error(error);
  }
}

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


/*
document.querySelector('p')
  .addEventListener('mouseover', () => {
  
  document.querySelector('p').style = 'visibility: hidden'
});

document.querySelector('img')
  .addEventListener('mouseover', () => {
  
  document.querySelector('p').style = 'visibility: visible'
});
document.querySelector('img')
  .addEventListener('mouseout', () => {
  
  document.querySelector('p').style = 'visibility: hidden'
});
*/