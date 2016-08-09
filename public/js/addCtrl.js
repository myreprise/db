//Create the addCtrl Module and Controller. It will depend on 'geolocation' module and service
var addCtrl = angular.module('addCtrl', ['geolocation', 'gservice']);

addCtrl.controller('addCtrl', function($scope, $http, $rootScope, geolocation, gservice){

	// Initialize Variables
	//---------------------------------------------------------------------------
	$scope.formData = {};
	var coords = {};
	var lat = 0;
	var long = 0;

	// Set initial coordinates to the center of China
	//$scope.formData.latitude = 30.5931;
	//$scope.formData.longitude = 114.3054;

	//Functions
	//----------------------------------------------------------------------------

    // Get coordinates based on mouse click. When a click event is detected....
    $rootScope.$on("clicked", function(){

        // Run the gservice functions associated with identifying coordinates
        $scope.$apply(function(){
            $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
            $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
            $scope.formData.htmlverified = "Nope (Thanks for spamming my map...)";
        });
    });

	//Create a new project based on the form field submissions
	$scope.createProject = function(){

		// Grab all the text box fields
		//-------------THIS NEEDS FURTHER UPDATE---------------
		var projectData = {
			name: $scope.formData.name,
			city: $scope.formData.city,
			location: [parseFloat($scope.formData.longitude).toFixed(3), parseFloat($scope.formData.latitude).toFixed(3)],
		};

		// Saves the project data to the database
		$http.post('/projects', projectData)
			.success(function(data){

				// Once save is complete, clear the form
				$scope.formData.name = "";
				$scope.formData.city = "";	

                // Refresh the map with new data
                gservice.refresh(parseFloat($scope.formData.latitude).toFixed(3), parseFloat($scope.formData.longitude).toFixed(3));

			})
			.error(function(data){
				console.log("Error: " + data);
			});


	};
});