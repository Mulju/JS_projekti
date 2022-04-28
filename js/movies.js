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
    console.log(response);
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

// Funktio, joka hakee Finnkinon näytöspäivät.
// Muuten samat kommentoinnit kuin yllä, mutta syötteen muotoilun takia uusia kommentteja.
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
  
    // Luodaan tämän päivämäärän olio
    const today = new Date();
    // Huomisen päivämäärän olio
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dropDownMenuDates = document.getElementById("dates");
    dates.forEach(element => {
      const option = document.createElement("option");
      
      // Muotoillaan päivien tulostus nätimmän näköiseksi
      // Haetaan apin antamasta datasta päivämäärä
      const date = new Date(element.innerHTML.split("T")[0]);
      // Asetetaan päivämäärän tulostamiseen muotoilun asetukset
      const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
      // Splitataan luotu päivämäärä muotoilua varten
      const split = date.toLocaleDateString('fi', options).split(" ");
      let str = "";
      
      // If vaihtoehdot, jotta tiedetään onko kyseessä tämä päivä, huominen, tai jokin muu päivä
      // Jos on tämä päivä niin..
      if(today.toLocaleDateString("fi", options) == date.toLocaleDateString('fi', options)) {
        str = "Tänään, ";
        for(let i = 1; i < split.length; i++) {
          str = str + split[i] + " ";
        }
      // Jos on huominen niin..
      } else if(tomorrow.toLocaleDateString("fi", options) == date.toLocaleDateString("fi", options)) {
        str = "Huomenna, ";
        for(let i = 1; i < split.length; i++) {
          str = str + split[i] + " ";
        }
      // Jos joku muu päivä niin..
      } else {
        for(let i = 0; i < split.length; i++) {
          if(i == 0)
          {
            // Vaihdetaan viikon päivän ensimmäinen kirjain isoksi
            str = split[i].charAt(0).toUpperCase() + split[i].slice(1) + ", ";
          }
          else {
            str = str + split[i] + " ";
          }
        }
      }

      option.innerHTML = str;
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

getMovieTheaters();
getMovieDates();
getMovies();