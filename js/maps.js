'use strict'

let map, infoWindow;
//kartan keskusta ja zoom level määritetty 
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 60.1726 , lng: 24.9400 },
    zoom: 13,
  });
  
  infoWindow = new google.maps.InfoWindow();
            map: map
        ;
  //Markerit finnkinojen kohdalle
    const markers = [
      { lat: 60.1713 , lng: 24.9461, info: "Kinopalatsi" },
      { lat: 60.1696 , lng: 24.9301, info: "Tennispalatsi" },
      { lat: 60.1685 , lng: 24.9475, info: "Maxim" },
      { lat: 60.2159 , lng: 25.1023, info: "Itis" },
      { lat: 60.2963 , lng: 24.9890, info: "Flamingo" },
      { lat: 60.2214 , lng: 24.8428, info: "Sello" },
      { lat: 60.1671 , lng: 24.7865, info: "Omena" },
      { lat: 60.4554 , lng: 22.2775, info: "Kinopalatsi Turku" },
      { lat: 61.4875 , lng: 21.7963, info: "Promenadi Pori" },
      { lat: 61.5019 , lng: 23.7592, info: "Plevna" },
      { lat: 61.4958 , lng: 23.7685, info: "Cine Atlas" },
      { lat: 60.9847 , lng: 25.6598, info: "Kuvapalatsi" },
      { lat: 61.0572 , lng: 28.1949, info: "Strand" },
      { lat: 62.2475 , lng: 25.7604, info: "Fantasia" },
      { lat: 62.8907 , lng: 27.6763, info: "Scala" },
      { lat: 65.0112 , lng: 25.4657, info: "Plaza" },
  ]
  
  markers.forEach(m => {
    const marker = new google.maps.Marker({
    position: { lat: m.lat, lng: m.lng},
    draggable: false,
    });
 
    const popupContent = new google.maps.InfoWindow()
    //Listener markereihin jotta niiden nimi tulee esiin klikattaessa
    google.maps.event.addListener(marker, 'click', (function (marker) {
      return function () {
        popupContent.setContent(m.info)
        popupContent.open(map, marker)
      }
    })(marker)
    )
    marker.setMap(map);
 
  })


  //Oma sijainti-nappi kartalla
  const locationButton = document.createElement("button");

  locationButton.textContent = "Oma Sijainti";
  locationButton.classList.add("positionButton");
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(locationButton);
  locationButton.addEventListener("click", () => {
    //Jos saa lokaation kartta keskittyy siihen, jos ei saa lokaatiota siirtyy kartan keskustaan
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent("Olet tässä");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
     
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });

//jos ei saa sijaintia antaa errorin
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}
  
  new AutocompleteDirectionsHandler(map);
  }
  //tekee autocomplete classin 
  class AutocompleteDirectionsHandler {
    map;
    originPlaceId;
    destinationPlaceId;
    travelMode;
    directionsService;
    directionsRenderer;
    constructor(map) {
      this.map = map;
      this.originPlaceId = "";
      this.destinationPlaceId = "";
      this.travelMode = google.maps.TravelMode.WALKING;
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer();
      this.directionsRenderer.setMap(map);
      //hakee lähtöpaikan, päämäärän ja modeselectorin paikan
      const originInput = document.getElementById("originInput");
      const destinationInput = document.getElementById("destinationInput");
      const modeSelector = document.getElementById("modeSelector");
      const originAutocomplete = new google.maps.places.Autocomplete(originInput);
  
      
      originAutocomplete.setFields(["place_id"]);
  
      const destinationAutocomplete = new google.maps.places.Autocomplete(
        destinationInput
      );
  
      // Asettaa listenerin radiobuttoniin jotta liikkumismuoto vaihtuu
      destinationAutocomplete.setFields(["place_id"]);
      this.setupClickListener(
        "changemode-walking",
        google.maps.TravelMode.WALKING
      );
      this.setupClickListener(
        "changemode-transit",
        google.maps.TravelMode.TRANSIT
      );
      this.setupClickListener(
        "changemode-driving",
        google.maps.TravelMode.DRIVING
      );
      this.setupPlaceChangedListener(originAutocomplete, "ORIG");
      this.setupPlaceChangedListener(destinationAutocomplete, "DEST");
      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(
        destinationInput
      );
      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
    }
  
    // autocomplete kun radiobutton vaihtuu
    setupClickListener(id, mode) {
      const radioButton = document.getElementById(id);
  
      radioButton.addEventListener("click", () => {
        this.travelMode = mode;
        this.route();
      });
    }
    setupPlaceChangedListener(autocomplete, mode) {
      autocomplete.bindTo("bounds", this.map);
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
  
        if (!place.place_id) {
          window.alert("Valitse listasta");
          return;
        }
  
        if (mode === "ORIG") {
          this.originPlaceId = place.place_id;
        } else {
          this.destinationPlaceId = place.place_id;
        }
  
        this.route();
      });
    }
    route() {
      if (!this.originPlaceId || !this.destinationPlaceId) {
        return;
      }
  
      const me = this;
      
      this.directionsService.route(
        {
          origin: { placeId: this.originPlaceId },
          destination: { placeId: this.destinationPlaceId },
          travelMode: this.travelMode,
        },
        (response, status) => {
          if (status === "OK") {
            me.directionsRenderer.setDirections(response);
          } else {
            window.alert("Directions request failed due to " + status);
          }
        }
      );
    }
  }

window.initMap = initMap;