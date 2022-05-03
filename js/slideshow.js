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
    const newsArticles = [];
    for(let i = 0; i < 6; i++) {
      if(i == 1 || i == 2) {
        continue;
      }
      newsImages.push(news[i].querySelector("ImageURL").innerHTML);
      newsArticles.push(news[i].querySelector("ArticleURL").innerHTML);
    }

    // Kutsutaan slideshow funktiota, kun fetchaus on valmis
    await kuva(newsImages, newsArticles);
  } catch(error) {
    console.error(error);
  }
}
//Funktio tekee img elementit slide classiin
//Sijoittaa ylemmän taulukon kuvat img elementtiin
async function kuva(slide, articles) {
  let imgfirst;
  let imgsecond;
  let imgthird;
  let imgfourth;
  console.log(slide);
  if (slide) {
    const slide_elem = document.getElementsByClassName("slide");
    
    for(let i = 0; i < 4; i++) {
      slide_elem[i].setAttribute("href", articles[i]);
    }

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




//Siirtymien määrä eli 4 slideä ja aika milloin siirtymä tapahtuu
let counter = 1;
setInterval(function(){
  document.getElementById('r' + counter).checked = true;
  counter++;
  if(counter > 4){
    counter = 1;
  }
  
}, 5000); //Siirtymien aikaväli millisekunneissa 5 sekunnin välein