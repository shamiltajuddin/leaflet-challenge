// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define streetmap and dark map layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 15,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 15,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Create array that will be used to hold circles
  var circleArray = new Array();

  // Create a for loop that will loop through earthquake data thru each iteration
  for (var i = 0; i < earthquakeData.length; i++) {
 
    // Create a variable for properties of earthquake data (magnitude)
    prop= earthquakeData[i].properties;

    var color = "#FFFF00";
    if (prop.mag < 1) {
        //mag over 1 and less than 2
      color = "#FFCC00";}
    else if (prop.mag < 2) {
        //mag over 2 and less than 3
      color = "#FF9900";}
    else if (prop.mag < 3) {
        //mag over 3 and less than 4
      color = "#FF6600";}
    else if (prop.mag < 4) {
        //mag over 4 and less than 5
      color = "#FF3300";}
    else if (prop.mag < 5) {
      color = "#FF0000";}
      //mag over 5

    // Create a variable indicating location of earthquakes 
    loc= [earthquakeData[i].geometry.coordinates[1],earthquakeData[i].geometry.coordinates[0]]
    // Add circles to map
    var mapCircle = L.circle(loc, {
      //stroke: false,
      fillOpacity: 0.50,
      color: color,
      fillColor: color,
      // Adjust radius
      radius: (prop.mag * 15000)
    }).bindPopup("<h1>" + prop.place + "</h1> <hr> <h3>Magnitude: " + prop.mag.toFixed(2) + "</h3>");

    circleArray.push(mapCircle);
  }

  //Create the layer for the circles
  var earthquakes = L.layerGroup(circleArray);

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap,earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps,overlayMaps, {
     collapsed: false
  }).addTo(myMap);

  // Create a legend located at top left corner of map
  var legend = L.control({position: 'topleft'});

  legend.onAdd = function (map) {
  	var div = L.DomUtil.create('div', 'info legend');
  	var size = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
    var color = ["#FFFF00","#FFCC00","#FF9900","#FF6600","#FF3300","#FF0000"];

  	// Use a for loop to iterate 
  	for (var i = 0; i < size.length; i++) {
  		div.innerHTML +=
  			'<p style="margin-left: 15px">' + '<i style="background:' + color[i] + ' "></i>' + '&nbsp;&nbsp;' + size[i]+ '<\p>';
  	}

  	return div;
  };
// Pass our map layers into our layer control
// Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}; 