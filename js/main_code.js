'use strict'

async function getMovieTheaters() {  
  // Haetaan Finnkinon auki olevat teatterit
  const response = await fetch("https://www.finnkino.fi/xml/TheatreAreas/");
  
  // Virheen sattuessa heitetään virhe ilmoitus
  if (!response.ok) {
    console.error("Tapahtui virhe.");
    return;
  }

  // Muutetaan haettu data teksti muotoon. Finnkinon antama api antaa xml muotoista dataa, joten json kääntö ei toimi.
  const areas = await response.text();
  // Käytetään DOMParser apia muuttamaan string tyyppinen xml data HTML dokumentiksi
  const data =  await new DOMParser().parseFromString(areas, "text/xml");
  // Käytetään document-rajapinnan metodeja datan käsittelyyn
  const theaters = data.querySelectorAll("Name");

  // Käydään kaikki teatterit läpi.
  // Tähän pitää vielä koodata dropdown menun luominen.
  theaters.forEach(element => {
    console.log(element.innerHTML);
  })
}

const data = getMovieTheaters();