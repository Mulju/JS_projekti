'use strict'

// Funktio, joka hakee Finnkinon auki olevat teatterit
async function getMovieTheaters() {  
  try {
    const response = await fetch("https://www.finnkino.fi/xml/TheatreAreas/");
    
    // Virheen sattuessa heitetään virhe ilmoitus
    if (!response.ok) {
      console.error("Tapahtui virhe.");
      return;
    }
  
    // Muutetaan haettu data teksti muotoon. Finnkinon antama api antaa xml muotoista dataa, joten json kääntö ei toimi.
    const rawXML = await response.text();
    // Käytetään DOMParser apia muuttamaan string tyyppinen xml data HTML dokumentiksi
    const data =  await new DOMParser().parseFromString(rawXML, "text/xml");
    // Käytetään document-rajapinnan metodeja datan käsittelyyn
    const theaters = data.querySelectorAll("Name");
  
    // Käydään kaikki teatterit läpi ja luodaan dropdown menu.
    const dropDownMenuTheaters = document.getElementById("theaters");
    theaters.forEach(element => {
      const option = document.createElement("option");
      option.innerHTML = element.innerHTML;
      dropDownMenuTheaters.appendChild(option);
    })
  } catch(error) {
    console.error(error);
  }
}

// Funktio, joka hakee Finnkinon näytöspäivät. Tarkempi kommentointi ylemmässä funktiossa.
// Syöte pitää vielä parsia nätimmän näköiseksi.
async function getMovieDates() {
  try {
    const response = await fetch("https://www.finnkino.fi/xml/ScheduleDates/");
    
    if (!response.ok) {
      console.error("Tapahtui virhe.");
      return;
    }

    const rawXML = await response.text();
    const data =  await new DOMParser().parseFromString(rawXML, "text/xml");
    const dates = data.querySelectorAll("dateTime");
  
    const dropDownMenuDates = document.getElementById("dates");
    dates.forEach(element => {
      const option = document.createElement("option");
      option.innerHTML = element.innerHTML;
      dropDownMenuDates.appendChild(option);
    })
  } catch(error) {
    console.error(error);
  }
}

// Tämä funktio hakee kaikki elokuvat jotka ovat tällä hetkellä katalogissa
async function getMovies() {
  try {
    const response = await fetch("https://www.finnkino.fi/xml/Events/");
    
    if (!response.ok) {
      console.error("Tapahtui virhe.");
      return;
    }

    const rawXML = await response.text();
    const data =  await new DOMParser().parseFromString(rawXML, "text/xml");
    const events = data.querySelectorAll("Event");

    const dropDownMenuEvents = document.getElementById("events");
    events.forEach(element => {
      const option = document.createElement("option");
      option.innerHTML = element.querySelector("Title").innerHTML;
      dropDownMenuEvents.appendChild(option);
    })
  } catch(error) {
    console.error(error);
  }
}

/*
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
getNews();
*/

getMovieTheaters();
getMovieDates();
getMovies();