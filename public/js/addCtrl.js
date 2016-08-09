//Create the addCtrl Module and Controller. It will depend on 'geolocation' module and service
var addCtrl = angular.module('addCtrl', ['geolocation', 'gservice']);

addCtrl.controller('addCtrl', function($scope, $http, geolocation, gservice){

	// Initialize Variables
	//---------------------------------------------------------------------------
	$scope.formData = {};
	var coords = {};
	var lat = 0;
	var long = 0;

	// Set initial coordinates to the center of China
	$scope.formData.latitude = 30.5931;
	$scope.formData.longitude = 114.3054;

	//Functions
	//----------------------------------------------------------------------------
	//Create a new project based on the form field submissions
	$scope.createProject = function(){

		// Grab all the text box fields
		//-------------THIS NEEDS FURTHER UPDATE---------------
		var projectData = {
			name: $scope.formData.name,
			city: $scope.formData.city,
			location: [$scope.formData.longitude, $scope.formData.latitude],
		};

		// Saves the project data to the database
		$http.post('/projects', projectData)
			.success(function(data){

				// Once save is complete, clear the form
				$scope.formData.name = "";
				$scope.formData.city = "";
				$scope.formData.longitude = "";
				$scope.formData.latitude = "";

			})
			.error(function(data){
				console.log("Error" + data);
			});

		//Refresh the data with a new map
		gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
			
	};
});