'use strict';

// Tämä funktio hakee 4 uusinta uutista
// Vastaavien funktioiden kommentointia löytyy movies.js tiedostosta. En toista tässä niissä käytyä kommentointia.
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

    /* For loopin indeksit näyttävät varmasti kummalliselta.
     * Siihen ei ole muuta selitystä kuin se, että finnkinon uutisapia hostaa varmasti joku kesähessu joka ei osaa hommaansa.
     * Uutisapiin ilmestyy vähän väliä linkkejä jotka eivät ole finnkinon uutisia, vaan jotain muuta.
     * Näillä indeksöinneillä valitsimme neljä uusinta uutista jotka toimivat.
     */
    const newsArticles = [];
    for(let i = 7; i < 13; i++) {
      if(i == 8 || i == 9) {
        continue;
      }
      // Tallennetaan uutisen kuvan URL sekä linkki artikkeliin
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
//Sijoittaa linkin kuvaan
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
  } 
}
      
getNews();




//Katsoo siirtymien määrän
let counter = 1;
setInterval(function(){
  document.getElementById('r' + counter).checked = true;
  counter++;
  if(counter > 4){
    counter = 1;
  }
  
}, 5000); //Siirtymien aikaväli millisekunneissa 