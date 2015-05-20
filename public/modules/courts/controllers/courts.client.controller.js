'use strict';
var placeSearch, autocomplete;
function initialize() {
	// Create the autocomplete object, restricting the search
	// to geographical location types.
	autocomplete = new google.maps.places.Autocomplete(
		/** @type {HTMLInputElement} */(document.getElementById('address')));
	// When the user selects an address from the dropdown,
	// populate the address fields in the form.
	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		fillInAddress();
	});
}

// [START region_fillform]
function fillInAddress() {
	// Get the place details from the autocomplete object.
	var place = autocomplete.getPlace();


}
// [END region_fillform]

// [START region_geolocation]
// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
	initialize()

}
// [END region_geolocation]
// Courts controller
angular.module('courts').controller('CourtsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Courts',
	function($scope, $stateParams, $location, Authentication, Courts) {
		$scope.authentication = Authentication;

		// Create new Court
		$scope.create = function() {
			// Create new Court object
			var court = new Courts ({
				name: this.name
			});

			// Redirect after save
			court.$save(function(response) {
				$location.path('courts/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Court
		$scope.remove = function(court) {
			if ( court ) { 
				court.$remove();

				for (var i in $scope.courts) {
					if ($scope.courts [i] === court) {
						$scope.courts.splice(i, 1);
					}
				}
			} else {
				$scope.court.$remove(function() {
					$location.path('courts');
				});
			}
		};

		// Update existing Court
		$scope.update = function() {
			var court = $scope.court;

			court.$update(function() {
				$location.path('courts/' + court._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Courts
		$scope.find = function() {
			$scope.courts = Courts.query();
		};

		// Find existing Court
		$scope.findOne = function() {
			$scope.court = Courts.get({ 
				courtId: $stateParams.courtId
			});
		};
	}
]);
