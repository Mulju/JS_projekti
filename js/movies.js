'use strict';

// Globaalien muuttujien määrittelyjä
// Valikon hakeminen html dokumentista
const select = document.querySelectorAll("select");

// Oletus arvot millä tehdään ensimmäinen haku
// Muotoillan samalla päivämäärä parametrina haluttuun muotoon
let theaID = "1029";
let searchDate = formatDates(new Date(), 0);

// Globaalit listat joihin tallennetaan teatterit ja päivät
const theaters = [];
const dates = [];





// Asynkronisia funktioita
// Funktio, joka hakee Finnkinon auki olevat teatterit
async function getMovieTheaters() {  
  try {
    // Haetaan apilta paikkatiedot teattereille
    const response = await fetch("https://www.finnkino.fi/xml/TheatreAreas/");
    
    // Haun yhteydessä mikäli sattuu virhe, heitetään virhe ilmoitus
    if (!response.ok) {
      console.error("Tapahtui virhe.");
      return;
    }
    
    // Muutetaan haettu data teksti muotoon. Finnkinon antama api antaa xml muotoista dataa, joten json kääntö ei toimi.
    const rawXML = await response.text();
    // Käytetään DOMParser apia muuttamaan string tyyppinen xml data HTML dokumentiksi
    const rawHTML =  await new DOMParser().parseFromString(rawXML, "text/xml");
    
    // Käytetään document-rajapinnan metodeja datan käsittelyyn
    // Haetaan teatterien nimet ja id:t
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
    const today = formatDates(new Date(), 0);
    // Huomisen päivämäärän olio
    const tomorrow = formatDates(new Date(), 1);
    const dropDownMenuDates = document.getElementById("dates");
    
    // Loopataan kaikki päivämäärät läpi
    elements.forEach(element => {
      const option = document.createElement("option");
      
      // Muotoillaan päivien tulostus nätimmän näköiseksi
      // Haetaan apin antamasta datasta pelkkä päivämäärä
      const elementDate = formatDates(new Date(element.innerHTML.split("T")[0]), 0);
      let str = "";
      
      // If vaihtoehdot, jotta tiedetään onko kyseessä tämä päivä, huominen, tai jokin muu päivä
      // Jos on tämä päivä niin..
      if(today == elementDate) {
        // Kirjoitetaan vaihtoehdoksi Tänään + päivämäärä
        str = "Tänään, " + elementDate;
      
        // Jos on huominen niin..
      } else if(tomorrow == elementDate) {
        str = "Huomenna, " + elementDate;
      
        // Jos joku muu päivä niin..
        // Tässä asetetaan viikon päivän ensimmäinen kirjain isoksi (näyttää nätimmältä)
      } else {
        // Asetukset toLocaleDateString metodia varten
        const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
       
        // Stringin splittaus ison alkukirjaimen asettamista varten
        const split = new Date(element.innerHTML.split("T")[0]).toLocaleDateString("fi", options).split(" ");
       
        // Iso alkukirjain viikonpäivälle
        str = split[0].charAt(0).toUpperCase() + split[0].slice(1) + ", " + elementDate;
      }

      // Luodaan päivämäärä olio
      const date = {
        // Searchdatea käytetään apin kautta elokuvien hakemiseen
        searchDate: elementDate,
        // Optiondatea käytetään valikon näkymässä
        optionDate: str
      };

      // Pusketaan päivät globaaliin listaan
      dates.push(date);
      // Luodaan valinta dropdown menuun
      option.innerHTML = str;
      dropDownMenuDates.appendChild(option);
    })
  } catch(error) {
    console.error(error);
  }
}

// Funktio jolla haetaan elokuvat
// Funktiossa on paljon koodia myös elokuvien sijoittamiseen fiksuun olio-taulukko rakenteeseen
async function getMovies () {
  try{
    // Tässä haetaan haluttu data joko oletuksena käytetyillä arvoilla, tai käyttäjän valinnan perusteella.
    // Käyttäjän valinnan lukeminen tapahtuu eventlistenerissä tiedoston lopussa.
    const response = await fetch("https://www.finnkino.fi/xml/Schedule/?area=" + theaID + "&dt=" + searchDate);
    
    if (!response.ok) {
      console.error("Tapahtui virhe.");
      return;
    }
  
    const rawXML = await response.text();
    const data =  await new DOMParser().parseFromString(rawXML, "text/xml");
    const events = data.querySelector("Shows").querySelectorAll("Show");
  
    // Taulukko eri elokuvaolioille. Tätä käytetään myös tulostamiseen tarkoitetussa funktiossa
    const movieEvents = [];
  
    /* Loopataan kaikki elokuvanäytökset. Finnkinon api antaa eri kellon aikoina ja eri saleissa olevat näytökset erillisinä,
     * joten saman nimisiä elokuvia on listassa useita.
     * Seuraavassa loopissa loopataan valtava lista eri näytöksiä. Koodin lomassa on useita eri taulukoita,
     * joita käytetään pitämään lopputuloksena oleva tietorakenne selkeänä.
     */
    events.forEach(element => {
      // Sisältää esityksen kellonajan, sekä alla olevan taulukon 
      const presentationArray = [];
      // Sisältää elokuvateatterin nimen ja salin missä näytös on, sekä näytöksen tyypin (2D/3D)
      const auditoriumArray = [];

      // Luodaan päivä olio leffan aikaa varten
      // Haetaan näytösaika xml-datasta
      const date = new Date(element.querySelector("dttmShowStart").innerHTML);
      // Asetukset toLocaleDateString metodille syötteen muotoiluun
      const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: "numeric", minute: "numeric" };
      const time = date.toLocaleDateString('fi', options).split(" ");
      const timeHours = "klo " + time[time.length - 1];
      let show;
  
      // Leffa olio mihin talletetaan halutut tiedot. If lauseet sen takia että kaikissa elokuvissa ei ollut saatavilla kuvaa
      // Monessa elokuvassa oli useamman kokoinen kuva, mutta totesimme medium koon olevan riittävä.
      if(element.querySelector("Images")) {
        if(element.querySelector("Images").querySelector("EventMediumImagePortrait")) {
          show = {
            movieName: element.querySelector("Title").innerHTML,
            movieImage: element.querySelector("Images").querySelector("EventMediumImagePortrait").innerHTML,
            length: element.querySelector("LengthInMinutes").innerHTML,
            ageRating: element.querySelector("Rating").innerHTML,
            genres: element.querySelector("Genres").innerHTML,
            // Linkki elokuvaan finnkinon sivuilla
            eventURL: element.querySelector("EventURL").innerHTML,
            presentationInformation: presentationArray
          };
        }
      } else {
        // Sama kuin yllä, mutta kuva puuttuu
        show = {
          movieName: element.querySelector("Title").innerHTML,
          length: element.querySelector("LengthInMinutes").innerHTML,
          ageRating: element.querySelector("Rating").innerHTML,
          genres: element.querySelector("Genres").innerHTML,
          eventURL: element.querySelector("EventURL").innerHTML,
          presentationInformation: presentationArray
        };
      }
      
      // Totuusarvot, joilla testataan oliko saman niminen elokuva jo listassa, tai oliko elokuvan näytösaika jo listassa
      let movieNotInArray = true;
      let timeNotInArray = true;
      // Tallennetaan elokuvan indeksi taulukosta, missä oli sama elokuva kuin xml-datasta haetussa elokuvassa
      // movieEvents taulukko on siis valmis taulukko, jota käytetään elokuvien tulostamiseen.
      let index = 0;
      
      // Loopataan kaikki taulukkoon jo talletetut elokuvat
      for(let i = 0; i < movieEvents.length; i++) {
        // If lause joka tarkistaa ettei viitata NULL:iin
        if(movieEvents[i]) {
          // Onko elokuvan nimi jo listassa?
          if(movieEvents[i].movieName == element.querySelector("Title").innerHTML) {
            movieNotInArray = false;
            index = i;
          }
        }
      }
     
      /* Olio, johon talletetaan näytösaika, sekä taulukko teattereista ja saleista.
       * Tämä olio lisätään aikaisemmin esiteltiin presentationArray:hyn.
       * auditoriumArrayhyn lisätään alla olevat theaAuditObject:it, koska samaan aikaan saattaa olla useita saman
       * elokuvan näytöksiä.
       */
      const presentationElement = {
        time: timeHours,
        theaAuditPres: auditoriumArray
      }
      
      const theaAuditObject = {
        presentationMethod: element.querySelector("PresentationMethod").innerHTML,
        theatreName: element.querySelector("TheatreAndAuditorium").innerHTML
      }
  
      // Uloin if, koska välillä api palauttaa NULL:in
      if(show) {
        // Onko elokuvan nimi jo taulukossa?
        if(movieNotInArray) {
          // Lisätään näytös elokuvataulukkoon
          presentationElement.theaAuditPres.push(theaAuditObject);
          show.presentationInformation.push(presentationElement);
          movieEvents.push(show);
        }
        else {
          // Tässä kohtaa elokuva löytyi jo taulukosta. Nyt pitää vielä loopata oliko xml-datasta haetun näytöksen näytösaika jo olemassa.
          let jindex = 0;
          for(let j = 0; j < movieEvents[index].presentationInformation.length; j++) {
            // Jos xml-datasta haettu elokuva on jo listassa, onko myös näytösaika?
            if(movieEvents[index].presentationInformation[j].time == timeHours) {
              timeNotInArray = false;
              // Mikäli näytösaika oli jo listassa tämän elokuvan kohdalla, talletetaan sen indeksi.
              jindex = j;
            }
          }
          
          // Mikäli näytösaika ei ollut vielä listassa, lisätään näytösaika, teatteri/sali ja näytöstyyppi elokuvien listaan.
          if(timeNotInArray) {
            presentationElement.theaAuditPres.push(theaAuditObject);
            movieEvents[index].presentationInformation.push(presentationElement);
          }
          else {
            // Jos taas näytösaika oli jo listassa tämän elokuvan kohdalla, lisätään saman näytösajan alle vain teatterin ja näytöstyypin tiedot.
            movieEvents[index].presentationInformation[jindex].theaAuditPres.push(theaAuditObject);
          }
        }
      }
    })
  
    // Lyhyt nuoli funktio taulukon objektien aakkostamiseen elokuvan nimen perusteella.
    const sortedMovieEvents = movieEvents.sort((a, b) => {
      if(a.movieName > b.movieName) {
        return 1;
      } else {
        return -1;
      }
    });

    // Kutsutaan tulostamiseen käytettyä funktiota, jolle annetaan parametrina järjestetty elokuvataulukko.
    printMovies(sortedMovieEvents);

  } catch(error) {
    console.error(error);
  }
}



/* Synkronisia funktioita
 * Tällä funktiolla tulostetaan näytökset html-dokumenttiin, parametrina saadaan järjestetty elokuvataulukko.
 * Funktiossa luodaan useita div-elementtejä, jotta css:n kanssa muotoilu onnistuu halutulla tavalla.
 * En erikseen kommentoi jokaista div-elementtiä, sillä niiden ainoa funktio on tuottaa haluttu näkymä flexboxin käytön kanssa.
 */
function printMovies(movieEvents) {
  const main = document.querySelector("main");

  // Loopataan koko taulukko läpi
  for(let i = 0; i < movieEvents.length; i++) {
    // Luodaan elementtejä
    const contentContainer = document.createElement("div");
    contentContainer.setAttribute("class", "content");
    const article = document.createElement("article");
    
    // Mikäli elokuvalla on kuva olemassa, luodaan sitä varten kuva-elementti sekä linkki elokuvaan Finnkinon nettisivuille
    if(movieEvents[i].movieImage) {
      const a = document.createElement("a");
      const img = document.createElement("img");
      img.src = movieEvents[i].movieImage;
      a.setAttribute("href", movieEvents[i].eventURL);
      a.setAttribute("class", "imageAnchor");
      a.appendChild(img);
      article.appendChild(a);
    }
    
    article.appendChild(contentContainer);
    
    const movieInfoContainer = document.createElement("div");
    movieInfoContainer.setAttribute("class", "movieInfoContainer");
    contentContainer.appendChild(movieInfoContainer);

    // Elokuvan nimi joka laitetaan otsikoksi
    const h2 = document.createElement("h2");
    h2.textContent = movieEvents[i].movieName;
    movieInfoContainer.appendChild(h2);

    // Elokuvasta lyhyesti kerrottavia tietoja. Apin kautta emme valitettavasti saaneet synopsista.
    const p1 = document.createElement("p");
    p1.textContent = "Ikäraja: " + movieEvents[i].ageRating;
    const p2 = document.createElement("p");
    p2.textContent = "Genret: " + movieEvents[i].genres;
    const p3 = document.createElement("p");
    p3.textContent = "Elokuvan kesto: " + movieEvents[i].length + " minuuttia"
    movieInfoContainer.appendChild(p1);
    movieInfoContainer.appendChild(p2);
    movieInfoContainer.appendChild(p3);
    
    // Hieno viiva erottamaan osioita html dokumentissa
    const line = document.createElement("div");
    line.setAttribute("class", "line");

    // Lisää laatikoita, sekä otsikko näytösajoille
    const audTimeContainer = document.createElement("div");
    const timeH2 = document.createElement("h2");
    timeH2.textContent = "Näytösajat";
    audTimeContainer.setAttribute("class", "audTimeContainer");
    audTimeContainer.appendChild(timeH2);
    contentContainer.appendChild(audTimeContainer);

    // Tällä loopilla loopataan yhden elokuvan kaikki näytösajat.
    // Sisällä olevalla loopilla loopataan yhden elokuvan, yhteen näytösaikaan sijoittuvat teatterit/salit.
    for(let j = 0; j < movieEvents[i].presentationInformation.length; j++) {
      const timeH3 = document.createElement("h3");
      timeH3.textContent = movieEvents[i].presentationInformation[j].time;
      audTimeContainer.appendChild(timeH3);
      for(let k = 0; k < movieEvents[i].presentationInformation[j].theaAuditPres.length; k++) {
        // Tallensin muuttujaksi lyhyemmän syntaksin vuoksi.
        const forVariable = movieEvents[i].presentationInformation[j].theaAuditPres[k];
        const p = document.createElement("p");
        const auditContainer = document.createElement("div");
        // Erotetaan teatteri ja näytöstyyppi viivalla
        p.textContent = forVariable.presentationMethod + " | " + forVariable.theatreName;
        auditContainer.appendChild(p);
        auditContainer.setAttribute("class", "auditContainer");
        // Jos näytös on ainoa tällä kellonajalla, tai se on viimeinen listassa, ei tulosteta näytöksiä erottavaa viivaa
        if(movieEvents[i].presentationInformation.length != 1 && j != (movieEvents[i].presentationInformation.length - 1)) {
          // Tulostetaan viiva mikäli yllä oleva ehto täyttyy
          const line = document.createElement("div");
          line.setAttribute("class", "line");
          auditContainer.appendChild(line);
        }
        audTimeContainer.appendChild(auditContainer);
      }
    }

    main.appendChild(article);
    main.appendChild(line);
  }
}

// Tämä funktio lisää päivämäärän tai kuukauden alkuun 0 mikäli yksinumeroinen.
// Finnkinon api ei ymmärtänyt päivämääriä tai kuukausia yksinumeroisina.
function ddmmyyyy(num) {
  return num.toString().padStart(2, '0');
}

/* Funktio käyttää ylläolevaa funktiota formatoimaan päivä-olion hakua varten muotoon dd.mm.yyyy
 * Ensimmäisessä parametrissa funktio saa formatoitavaksi lähetetyn päivämäärän.
 * Toinen parametri on sitä varten, että saa huomisen päivämäärän tarvittaessa.
 */
function formatDates(date, num) {
  if(num) {
    const tempArray = [
      // Tässä +1 jotta saadaan huomisen päivämäärä
      ddmmyyyy(date.getDate() + 1),
      // Tässä +1 koska tammikuu on arvo 0
      ddmmyyyy(date.getMonth() + 1),
      date.getFullYear(),
      // Liitetään taulukon rivit yhteen pisteellä erotettuina.
    ].join('.');
    return tempArray;
  } else {
    const tempArray = [
      ddmmyyyy(date.getDate()),
      ddmmyyyy(date.getMonth() + 1),
      date.getFullYear(),
    ].join('.');
    return tempArray; 
  }
}

// Funktio joka tyhjentää dom-elementit html dokumentista.
function emptyElements() {
  const main = document.querySelector("main");
  while(main.firstElementChild) {
      main.firstElementChild.remove();
  }
}



// Eventlistenerejä
// Listener joka vaihtaa hakuun käytetyn teatterin
select[0].addEventListener("change", () => {
  // Loopataan dropdown-menun alkiot läpi
  for(let i = 0; i < theaters.length; i++) {
    // Mikäli käyttäjän valitsema arvo vastaa valikosta löytyvää arvoa, talletetaan kyseinen arvo globaaliin haku-muuttujaan
    // ja hypätään ulos loopista.
    if(select[0].value == theaters[i].name) {
      theaID = theaters[i].id;
      break;
    }
  }
  // Kutsutaan ensiksi html-dokumentin tyhjennys
  emptyElements();
  // Sitten elokuvien haku
  getMovies();
});

// Listener joka vaihtaa hakuun käytettyä päivämäärää
select[1].addEventListener("change", () => {
  for(let i = 0; i < dates.length; i++) {
    if(select[1].value == dates[i].optionDate) {
      searchDate = dates[i].searchDate;
      break;
    }
  }
  emptyElements();
  getMovies();
});