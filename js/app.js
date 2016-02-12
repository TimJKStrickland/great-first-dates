var map;
var pins = [];
var infoWindows = [];
// calling the center outside the function
var startCenter = {lat: 37.7764823, lng: -122.42};

/** MODEL **/
var locations = [
  // here are the 8 hard-coded locations for the requirements:
  {
    name: "Ryoko's",
    latlong: { lat: 37.7882006, lng:-122.4142544 },
    fsID: "433c8000f964a52043281fe3"
  },
  {
    name: "Chamber Eat + Drink",
    latlong: { lat: 37.7830672, lng:-122.4203229 },
    fsID: "50e63342b0ed7e4688ddb834"
  },
  {
    name: "Starbelly",
    latlong: { lat: 37.7640966, lng:-122.4347866 },
    fsID: "4a789bbbf964a52004e61fe3"
  },
  {
    name: "Devil's Acre",
    latlong: { lat: 37.7976738, lng:-122.4083549 },
    fsID: "5487a2cb498ea3c43c7cd3f4"
  },
  {
    name: "Elephant Sushi",
    latlong: { lat: 37.7986734, lng:-122.4209331 },
    fsID: "55b42ca5498e4c7fcfdc6d3c"
  },
  {
    name: "Benjamin Cooper",
    latlong: { lat: 37.7873384, lng:-122.4118848 },
    fsID: "54f132e7498e5d065370a6b1"
  },
  {
    name: "Exploratorium",
    latlong: { lat: 37.8008602, lng: -122.4008237 },
    fsID: "4585a93ef964a520ac3f1fe3"
  },
  {
    name: "Foreign Cinema",
    latlong: { lat: 37.7564817, lng: -122.4213619 },
    fsID: "3fd66200f964a520a0ec1ee3"
  },
  {
    name: "Chubby Noodle",
    latlong: { lat: 37.7994414, lng: -122.4400868 },
    fsID: "5127a9e2183f56cf2d7bfe9a"
  },
  {
    name: "Gracias Madre",
    latlong: { lat: 37.7615745, lng: -122.4212534 },
    fsID: "4b4955ccf964a520b86d26e3"
  },
  {
    name: "Cliff House",
    latlong: { lat: 37.7784894, lng: -122.516152 },
    fsID: "4bf0588dd5bc0f470f366921"
  },
  {
    name: "Green's Restaurant",
    latlong: { lat: 37.8068007, lng: -122.4343576 },
    fsID: "4a1c397bf964a520257b1fe3"
  },
  {
    name: "Trick Dog",
    latlong: { lat: 37.7593538, lng: -122.4133968 },
    fsID: "5095da318302abffba3c23fd"
  },
  {
    name: "Central Kitchen",
    latlong: { lat: 37.7592602, lng: -122.4132552 },
    fsID: "4faaba890cd6e74f6f96bab1"
  },
  {
    name: "Cocotte",
    latlong: { lat: 37.7948162, lng: -122.4206194 },
    fsID: "5078e44ee4b0da2384e74824"
  },
  {
    name: "Palmer's Tavern",
    latlong: { lat: 37.7906335, lng: -122.4361915 },
    fsID: "521ec12f11d2224d014b63f4"
  },
  {
    name: "State Bird Provisions",
    latlong: { lat: 37.7836666, lng: -122.4352882 },
    fsID: "4ef52a378231b0d6238dd471"
  },
  {
    name: "Nopa",
    latlong: { lat:37.7748978, lng: -122.4396831  },
    fsID: "44646408f964a52026331fe3"
  },
  {
    name: "Tomasso's",
    latlong: { lat: 37.7978025, lng: -122.4074324 },
    fsID: "49e05c38f964a52052611fe3"
  },
  {
    name: "The Ice Cream Bar Soda Foundation",
    latlong: { lat:37.7664591, lng: -122.4524319  },
    fsID: "4eac41a5dab40d132703fc44"
  },{
    name: "Biergarten",
    latlong: { lat: 37.7760198, lng: -122.4261769 },
    fsID: "4dd7e48fd22d38ef42f35bd8"
  }
];

// Made so that locations remains after it is cleared
var locations2 = [];
var popLocations2 = function(){
  forEach(x in locations){
    if(locations2 !==undefined){
      locations2.push(locations[x]);
    }
  }
};
popLocations2();

/**  VIEW **/
// init's Google Maps API
function initMap(){
  map = new google.maps.Map(document.getElementById('map'), {
    center: startCenter,
    zoom: 13,
    scrollwheel: false
  });
  map.getBounds();

   // Close infoWindow when map clicked
  google.maps.event.addListener(map, 'click', function(e) {
    closeInfoWindows();
    toggleBounceOffAll();
  });
  
  google.maps.event.addListener(infoWindow, 'closeclick', function() {
      // stop marker from bouncing here
      toggleBounceOffAll();
  });

  // putting all pins on the map and create the infowindow for each marker:

  for(var i = 0; i < locations.length; i++){
      if(locations !== undefined){
        var marker = new google.maps.Marker({
        position: locations[i].latlong,
        map: map,
        title: locations[i].name,
        animation: google.maps.Animation.DROP,
        icon: 'assets/heart_icon.svg'
        });
      
  

    // adding the Infowindow to populate and creating the error message if the
    // net breaks. contentString is the error message for Ajax

    var errorAjax = "Whoops. Better luck finding your date an Uber. Can't find any data";

    var infoWindow = new google.maps.InfoWindow({
      content: errorAjax
    });

    // IIFE to solve closure issue
    marker.addListener('click', (function(pinCopy, infoWindowCopy){
        return function(){
          closeInfoWindows();
          infoWindowCopy.open(map, pinCopy);
          toggleBounceOffAll();
          toggleBounceOn(pinCopy);
        };
      })(marker, infoWindow));

      // push each marker into marker's array to make them observable
      pins.push(marker);

      // push infoWindow to the infoWindow's array to make them observable
      infoWindows.push(infoWindow);
    }
}
}
var toggleOff = function(marker) {
    marker.setMap(null);
};
var toggleOn = function(marker) {
    marker.setMap(map);
};
var toggleOffAll = function() {
    for (var x in pins) {
      if(pins !== undefined){
        pins[x].setMap(null);
      }
    }
};

// function to close all info windows
var closeInfoWindows = function() {
    for (var x in infoWindows) {
      if(infoWindows !==undefined){
        infoWindows[x].close();
      }
    }
};

// functions to toggle pin's BOUNCE animation
var toggleBounceOffAll = function() {
    for (var x in pins) {
      if(pins !== undefined){
        pins[x].setAnimation(null);
      }
    }
};

var toggleBounceOn = function(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
};

/** VIEWMODEL **/

var viewModel = {
  // Google Maps API stuff
  pins: ko.observableArray(locations2),
  searchValue: ko.observable(''),

  // ops
  search: function(value){
    viewModel.pins.removeAll();
    toggleOffAll();

    for (var x in locations){
      if(locations[x].name.toLowerCase().indexOf(value.toLowerCase()) >= 0 ){
      viewModel.pins.push(locations[x]);
      toggleOn(pins[x]);
      }
    }
  },
  listClick: function(value){
    // closes all info windows, toggles off all Bounce
    closeInfoWindows();
    toggleBounceOffAll();

    for(var x in locations){
      if(locations[x].name.toLowerCase().indexOf(value.name.toLowerCase()) >= 0 ){
        // open the clicked marker's infoWindow and trigger animation
        infoWindows[x].open(map, pins[x]);
        toggleBounceOn(pins[x]);
      }
    }
  }
};
ko.applyBindings(viewModel);
viewModel.searchValue.subscribe(viewModel.search);
for( var x in locations){
  if(locations !== undefined){
    var url = "https://api.foursquare.com/v2/venues/" +
      locations[x].fsID +
      "?client_id=QGVCFTGB1GBUX5KJII1OMKU14YO3JTD34OHVNUZ4NFATZKWJ" +
      "&client_secret=XVFP3G1ZTANLVEZFMVDXUC3502R2C3YXQXKH0XD0N354NKZA&v=20150321";

      $.getJSON(url, (function(fsData){ // IIFE
          return function(data) {
              // use returned JSON here
              locations[fsData].foursquareData = data;
              var venue = data.response.venue;

              // create contentString
              var contentString0 = '<div><h4>' + venue.name + '</h4><h5>';
              var contentString3;
              if (venue.rating !== undefined) {
                contentString3 = '</h5><div><span>' + venue.location.formattedAddress[0] + '</span>, <span>' +
                    venue.location.formattedAddress[1] + '</span></div><br><div>Rating: <span>' + venue.rating +
                    '</span>/10 Based on <span>' + venue.ratingSignals + '</span> votes</div></div>';
              } else {
                contentString3 = '</h5><div><span>' + venue.location.formattedAddress[0] + '</span>, <span>' +
                venue.location.formattedAddress[1] + '</span></div><br><div>Rating not available</div></div>';
              }
              var contentString2 = '';
              var categories = venue.categories;
              var formattedPhone = venue.contact.formattedPhone;
              var phone = venue.contact.phone;
              var contentString1 = '';
              if(phone || formattedPhone !== undefined){
                contentString1 += '<a class="tel" href="tel:' + phone + '">' + formattedPhone +'</a>';
              } else {
                contentString1 += "<span>This place is so hip they don't even have a phone.</span>";
              }  
            for (var i=0; i < categories.length; i++) {
                contentString1 += '<p>' + categories[i].name + ' </p>';
              }
              // delete last two positions of contentString2. Only category wanted per hit
              contentString2 = contentString2.slice(0, -1);
              var contentString = contentString0 + contentString1 + contentString2 + contentString3;

              // change info windows' content
              infoWindows[fsData].content = contentString;

          };
    })(x)).fail(function(){ // error handling
        if (alertCount === true) {
        alert("Shoot. We can't find anything. Please try later.");
        alertCount = false; // make sure it only alert once
        }
    });
  }
}
var googleError = function() {
    alert("Snap, something busted on Google Maps. Quick! Say something funny.");
    alertCount = false;
};

var alertCount = true;
