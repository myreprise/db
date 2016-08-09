// Creates the gservice factory. This is the primary means by which to interact with the google maps api
angular.module('gservice', [])
	.factory('gservice', function($http){


	// Initialize the variables
	// ----------------------------------------------
	// Service our factory will return
	var googleMapService = {};

	// Array of locations obtained from API call
	var locations = [];

	// Selected location (initializes to center of China)
	var selectedLat = 30.5931;
	var selectedLong = 114.3054;

	// Functions
	// -----------------------------------------------
	// Refresh the map with new data. Function will accept a new latitude and longitude
	googleMapService.refresh = function(latitude, longitude){

		// Clears the holding array of location
		locations = [];

		// Set the selected lat and long equal to the parameters
		selectedLat = latitude;
		selectedLong = longitude;

		// Perform an AJAX call to get all records in the database query.
		$http.get('/projects')
			.success(function(response){

				//Convert the results into a Google Maps format
				locations = convertToMapPoints(response);

				//Initialize the new map
				initialize(latitude, longitude);
			}).error(function(){});
	};

	//Private Inner Functions
	//----------------------------------------------
	// Convert a JSON of projects into map markers
	var convertToMapPoints = function(response){

		//Clear the locations holder
		var locations = [];

		//Loop through all of the JSON entries provided in the response
		for(var i = 0; i < response.length; i++){
			var project = response[i];

			//Create a popup window for each record
			var contentString = '<p>' + project.name + '<br>' + project.city + '<br>';

			//Convert each of the JSON records into Google Maps location format
			locations.push({
				latlon: new google.maps.LatLng(project.location[1], project.location[0]),
				message: new google.maps.InfoWindow({
					content: contentString,
					maxWidth: 320
				}),
				name: project.name,
				city: project.city
			});
		}

		//location is now an array populated with records in Google Maps format
		return locations;
	};

	//Initializes the map
	var initialize = function(latitude, longitude){

		//Use the selected latitude and longitude as starting points
		var myLatLng = {lat: selectedLat, lng: selectedLong};

		//If map has not been created...
		if (!map){

			var styles1 = [{"featureType":"landscape","stylers":[{"hue":"#FFBB00"},{"saturation":43.400000000000006},{"lightness":37.599999999999994},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":2.4000000000000057},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}];
			var styles3 = [{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"water","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#C6E2FF"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#C5E3BF"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#D1D1B8"}]}];

			var mapOptions = {
				zoom: 5,
				center: myLatLng,
				scrollwheel: false,
				styles: styles3,
				mapTypeId: 'satellite'
			}

			//Create a new map and place in the index.html page
			var map = new google.maps.Map(document.getElementById('map'), mapOptions);
		}

		//Loop through each location in the array and place a marker
		locations.forEach(function(n, i){
			var marker = new google.maps.Marker({
				position: n.latlon,
				map: map,
				title: "TAM Map",
	            icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
			});

			//For each marker created, add a listener that checks for clicks
			google.maps.event.addListener(marker, 'click', function(e){

				//When clicked, open the selected marker's message
				currentSelectedMarker = n;
				n.message.open(map, marker);

                // Update Broadcasted Variable (lets the panels know to change their lat, long values)
                googleMapService.clickLat = marker.getPosition().lat();
                googleMapService.clickLong = marker.getPosition().lng();
                $rootScope.$broadcast("clicked");

			});
		});

	};

//Refresh the page upon window load. Use the initial latitude and longitude
google.maps.event.addDomListener(window, 'load', googleMapService.refresh(selectedLat, selectedLong));
return googleMapService;

});