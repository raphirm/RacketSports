'use strict';

// [END region_geolocation]
// Courts controller
angular.module('courts').controller('CourtsController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'Courts',
	function($scope, $stateParams,$http, $location, Authentication, Courts) {
		$scope.authentication = Authentication;
		var placeSearch, autocomplete;
		if(document.getElementById('address')) {
			autocomplete = new google.maps.places.Autocomplete(
				/** @type {HTMLInputElement} */(document.getElementById('address')));
			// When the user selects an address from the dropdown,
			// populate the address fields in the form.

			google.maps.event.addListener(autocomplete, 'place_changed', function () {
				$scope.updateAddress();
			});
		}
		// Create new Court
		$scope.create = function() {
			// Create new Court object
			var court = new Courts ({
				name: this.name,
				address: this.address,
				contact: this.contact,
				sports: this.sports,
				lat: this.lat,
				lng: this.lng
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
		$scope.go = function(court){
			$location.path('/courts/'+ court._id);
		};
		$scope.joinStatus = function(court) {

			var existing = false;
			if(court.players) {
				court.players.forEach(function (user) {
					if ($scope.authentication.user._id === user._id) {
						existing = true;
					}
				});
			}
			return existing;
		};
		$scope.joinCourt = function(court) {
			//court = $scope.court;
			$http.get('/courts/'+court._id+'/join');
			location.reload();
		};
		$scope.leaveCourt = function(court) {
			//court = $scope.court;
			$http.get('/courts/'+court._id+'/leave');
			location.reload();
		};
		$scope.updateAddress =function() {
			var place = autocomplete.getPlace();
			document.getElementById('address').value = place.formatted_address;
			document.getElementById('lat').value = place.geometry.location.A;
			document.getElementById('lng').value = place.geometry.location.F;
			if ($scope.court) {
				$scope.court.address = place.formatted_address;
				$scope.court.lat = place.geometry.location.A;
				$scope.court.lng = place.geometry.location.F;
			}else{
				this.address = place.formatted_address;
				this.lat = place.geometry.location.A;
				this.lng = place.geometry.location.F;
			}
		};
	}
]);
