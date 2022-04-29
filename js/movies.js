'use strict';

// Muuttujien määrittelyjä
const button = document.querySelector("button");
const select = document.querySelectorAll("select");
// Asetetaan päivämäärän tulostamiseen muotoilun asetukset
let options = { year: 'numeric', month: 'numeric', day: 'numeric' };

// Oletus arvot millä tehdään ensimmäinen haku
let theaID = "1029";
// Muotoillan päivämäärä parametrina haluttuun muotoon
let searchDate = new Date().toLocaleDateString("fi", options);
let movName = "007 No Time to Die";

// Globaalit listat joihin tallennetaan teatterit ja päivät
const theaters = [];
const dates = [];



// Funktioita
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
    const rawHTML =  await new DOMParser().parseFromString(rawXML, "text/xml");
    // Käytetään document-rajapinnan metodeja datan käsittelyyn
    const data = rawHTML.querySelectorAll("TheatreArea");
    const dropDownMenuTheaters = document.getElementById("theaters");
    
    // Käydään kaikki teatterit läpi ja luodaan dropdown menu.
    data.forEach(element => {
      // Teatteri olio johon talletetaan teatterin nimi ja sen id fetchiä varten
      const theater = {
        id: element.querySelector("ID").innerHTML,
        name: element.querySelector("Name").innerHTML
      };
      // Talletetaan oliot globaaliin listaan
      theaters.push(theater);

      // Luodaan valinnat dropdown menuun
      const option = document.createElement("option");
      option.innerHTML = theater.name;
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
    const elements = data.querySelectorAll("dateTime");
  
    // Luodaan tämän päivämäärän olio
    const today = new Date();
    // Huomisen päivämäärän olio
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dropDownMenuDates = document.getElementById("dates");
    elements.forEach(element => {
      const option = document.createElement("option");
      
      // Muotoillaan päivien tulostus nätimmän näköiseksi
      // Haetaan apin antamasta datasta päivämäärä
      const elementDate = new Date(element.innerHTML.split("T")[0]);
      // Asetetaan päivämäärän tulostamiseen muotoilun asetukset
      options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
      // Splitataan luotu päivämäärä muotoilua varten
      const split = elementDate.toLocaleDateString('fi', options).split(" ");
      let str = "";
      
      // If vaihtoehdot, jotta tiedetään onko kyseessä tämä päivä, huominen, tai jokin muu päivä
      // Jos on tämä päivä niin..
      if(today.toLocaleDateString("fi", options) == elementDate.toLocaleDateString('fi', options)) {
        str = "Tänään, ";
        for(let i = 1; i < split.length; i++) {
          str = str + split[i] + " ";
        }
      // Jos on huominen niin..
      } else if(tomorrow.toLocaleDateString("fi", options) == elementDate.toLocaleDateString("fi", options)) {
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
            // Tämä if else jotta vikalla rivillä ei ole väliä
            if(i == (split.length - 1)) {
              str = str + split[i];
            } else {
              str = str + split[i] + " ";
            }
          }
        }
      }

      // Vaihetaan päivän formatointi hetkeksi, jotta saadaan hakua varten päivä oikeaan formaattiin
      options = { year: 'numeric', month: 'numeric', day: 'numeric' };
      // Luodaan päivämäärä olio
      const date = {
        searchDate: elementDate.toLocaleDateString("fi", options),
        optionDate: str
      };
      dates.push(date);

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

// Tällä funktiolla haetaan leffanimi valikosta valitun leffan nimellä kaikki näytökset
async function findMovieByName(movieName) {
  try {
    /*
    const testi = "?dt=02.05.2022"
    const response = await fetch("https://www.finnkino.fi/xml/Schedule/" + testi);
    */
    const response = await fetch("https://www.finnkino.fi/xml/Schedule/");
    
    if (!response.ok) {
      console.error("Tapahtui virhe.");
      return;
    }

    const rawXML = await response.text();
    const data =  await new DOMParser().parseFromString(rawXML, "text/xml");
    const events = data.querySelector("Shows").querySelectorAll("Show");
    // Tätä ei ehkä tarvita
    
    const movieEvents = [];
    
    events.forEach(element => {
      // Jos leffan nimi vastaa haettua elokuvan nimeä niin..
      if(element.querySelector("Title").innerHTML == movieName) {
        // Luodaan päivä olio leffan aikaa varten
        const date = new Date(element.querySelector("dttmShowStart").innerHTML);
        options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: "numeric", minute: "numeric" };
        let show = {
              movieName: movieName,
              movieImage: element.querySelector("Images").querySelector("EventMediumImagePortrait").innerHTML,
              theatreName: element.querySelector("TheatreAndAuditorium").innerHTML,
              time: date.toLocaleDateString('fi', options),
              length: element.querySelector("LengthInMinutes").innerHTML,
              ageRating: element.querySelector("Rating").innerHTML,
              genres: element.querySelector("Genres").innerHTML,
              presentation: element.querySelector("PresentationMethod").innerHTML
            };

        movieEvents.push(show);
      }
    })
    console.log(movieEvents);
  } catch(error) {
    console.error(error);
  }
}

// Toimiva haku funktio
async function getMovies2 () {
  const response = await fetch("https://www.finnkino.fi/xml/Schedule/?area=" + theaID + "&dt=" + searchDate);
  
  if (!response.ok) {
    console.error("Tapahtui virhe.");
    return;
  }

  const rawXML = await response.text();
  const data =  await new DOMParser().parseFromString(rawXML, "text/xml");
  const events = data.querySelector("Shows").querySelectorAll("Show");

  // Ei vältsii tarvita jos elementtien luominen suoritetaan alla olevassa for eachissä
  const movieEvents = [];
    
  events.forEach(element => {
    // Luodaan päivä olio leffan aikaa varten
    const date = new Date(element.querySelector("dttmShowStart").innerHTML);
    options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: "numeric", minute: "numeric" };
    let show;

    // Leffa olio mihin talletetaan halutut tiedot. If lauseet sen takia että kaikissa elokuvissa ei ollut saatavilla kuvaa
    if(element.querySelector("Images")) {
      if(element.querySelector("Images").querySelector("EventMediumImagePortrait")) {
        show = {
          movieName: element.querySelector("Title").innerHTML,
          movieImage: element.querySelector("Images").querySelector("EventMediumImagePortrait").innerHTML,
          theatreName: element.querySelector("TheatreAndAuditorium").innerHTML,
          time: date.toLocaleDateString('fi', options),
          length: element.querySelector("LengthInMinutes").innerHTML,
          ageRating: element.querySelector("Rating").innerHTML,
          genres: element.querySelector("Genres").innerHTML,
          presentation: element.querySelector("PresentationMethod").innerHTML
        };
      }
    } else {
      show = {
        movieName: element.querySelector("Title").innerHTML,
        //movieImage: element.querySelector("Images").querySelector("EventMediumImagePortrait").innerHTML,
        theatreName: element.querySelector("TheatreAndAuditorium").innerHTML,
        time: date.toLocaleDateString('fi', options),
        length: element.querySelector("LengthInMinutes").innerHTML,
        ageRating: element.querySelector("Rating").innerHTML,
        genres: element.querySelector("Genres").innerHTML,
        presentation: element.querySelector("PresentationMethod").innerHTML
    
      }
    }
    movieEvents.push(show);
  })
  //console.log(movieEvents);
}

getMovies2();

// Eventlistenerejä
// Listener joka vaihtaa hakuun käytetyn teatterin
select[0].addEventListener("change", () => {
  for(let i = 0; i < theaters.length; i++) {
    if(select[0].value == theaters[i].name) {
      theaID = theaters[i].id;
      break;
    }
  }
  console.log(theaID);
  // Tähän funktio kutsu joka suorittaa haun halutuilla parametreillä theaID ja date
  //getMovies2();
});

// Listener joka vaihtaa hakuun käytettyä päivämäärää
select[1].addEventListener("change", () => {
  for(let i = 0; i < dates.length; i++) {
    if(select[1].value == dates[i].optionDate) {
      searchDate = dates[i].searchDate;
      break;
    }
  }

  console.log(searchDate);
  // Tähän funkkari joka suorittaa haun
  //getMovies2();
});


// Tämän voi todennäköisesti poistaa
select[2].addEventListener("change", () => {
  movName = select[2].value;
  console.log(movName);
});

button.addEventListener("click", () => {
  findMovieByName(movName);
});