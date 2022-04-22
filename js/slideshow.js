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

    await kuva(newsImages);
  } catch(error) {
    console.error(error);
  }
}

async function kuva(slide) {
  let imgfirst;
  let imgsecond;
  let imgthird;
  let imgfourth;
  console.log(slide);
  if (slide) {
    const slide_elem = document.getElementsByClassName("slide");
    imgfirst = document.createElement('img');
    imgfirst.src = slide[0];
      
    slide_elem[0].appendChild(imgfirst);

    imgsecond = document.createElement('img');
    imgsecond.src = slide[1];
     
    slide_elem[1].appendChild(imgsecond);

    imgthird = document.createElement('img');
    imgthird.src = slide[2];
     
    slide_elem[2].appendChild(imgthird);

    imgfourth = document.createElement('img');
    imgfourth.src = slide[3];
      
    slide_elem[3].appendChild(imgfourth);

  } else {
    const slide_elem = document.getElementsByClassName("slide");
    imgfirst = document.createElement('img');
    imgfirst.src = 'defaultkuva.jpg';
    imgfirst.alt = 'error';
    slide_elem[0].appendChild(imgfirst);
  }
}
      
getNews();

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