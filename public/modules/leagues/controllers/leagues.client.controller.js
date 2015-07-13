'use strict';

// Leagues controller
angular.module('leagues').controller('LeaguesController', ['$http', '$scope', '$stateParams', '$location', 'Authentication', 'Leagues',
	function($http, $scope, $stateParams, $location, Authentication, Leagues) {
		$scope.authentication = Authentication;
		var placeSearch, autocomplete;
		if (document.getElementById('address')) {
			autocomplete = new google.maps.places.Autocomplete(
				/** @type {HTMLInputElement} */(document.getElementById('address')));
			// When the user selects an address from the dropdown,
			// populate the address fields in the form.

			google.maps.event.addListener(autocomplete, 'place_changed', function () {
				$scope.updateAddress();
			});
		}
		;
		$scope.updateAddress = function () {
			var place = autocomplete.getPlace();
			document.getElementById('address').value = place.formatted_address;

			if ($scope.league) {
				$scope.league.ort = place.formatted_address;
				$scope.league.lat = place.geometry.location.A;
				$scope.league.lng = place.geometry.location.F;
			} else {
				this.address = place.formatted_address;
				this.lat = place.geometry.location.A;
				this.lng = place.geometry.location.F;
			}
		};
		// Create new League
		$scope.create = function () {
			// Create new League object
			var league = new Leagues($scope.league);

			// Redirect after save
			league.$save(function (response) {
				$location.path('leagues/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.sport = '';
			}, function (errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing League
		$scope.remove = function (league) {
			if (league) {
				league.$remove();

				for (var i in $scope.leagues) {
					if ($scope.leagues [i] === league) {
						$scope.leagues.splice(i, 1);
					}
				}
			} else {
				$scope.league.$remove(function () {
					$location.path('leagues');
				});
			}
		};

		$scope.joinLeague = function (league) {
			league = $scope.league;
			$http.get('/leagues/' + league._id + '/join');
			location.reload();
		};
		$scope.leaveLeague = function (league) {
			var league = $scope.league;
			$http.get("/leagues/" + league._id + "/leave");
			location.reload();
		};
		$scope.joinStatus = function (leagueid) {

			var existing = false;
			if (leagueid.users) {
				leagueid.users.forEach(function (user) {
					if ($scope.authentication.user._id == user.user._id) {
						existing = true;
					}
				});
			}
			return existing;
		};

		// Update existing League
		$scope.update = function () {
			var league = $scope.league;

			league.$update(function () {
				$location.path('leagues/' + league._id);
			}, function (errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Leagues
		$scope.find = function () {
			$scope.leagues = Leagues.query();
		};

		// Find existing League
		$scope.findOne = function () {

			$scope.league = Leagues.get({
				leagueId: $stateParams.leagueId
			});
		};
		$scope.requestSheduleFormated = function () {
			if ($scope.league.requestShedule) {

			if ($scope.league.requestShedule == 'weeklyAll') {
				return 'Eine zufällige Herausforderung pro Woche';
			}
			else if ($scope.league.requestShedule == 'biweeklyAll') {
				return 'Eine zufällige Herausforderung jede zweite Woche';
			}
		}
		else if ($scope.league.requestShedule == 'weeklyTowTop') {
			return 'Eine Herausforderung gegen einen Mitspieler maximal 2 Plätze besser/schlechter pro Woche';

		}
		else if ($scope.league.requestShedule == 'byweeklyTowTop') {
			return ' Eine Herausforderung gegen einen Mitspieler maximal 2 Plätze besser/schlechter jede zweite Woche';
		}
			else{
				return 'keine'
			}
	}
	}
]);
