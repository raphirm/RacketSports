'use strict';

angular.module('matches').controller('MatchBroadcastController', ['$scope', '$stateParams', '$location', '$http', '$resource', 'Authentication', 'Matches', 'Users',
	function ($scope, $stateParams, $location, $http, $resource, Authentication, Matches, Users) {
		$scope.authentication = Authentication;
		$scope.user = Authentication.user;
		$scope.courts = ""
		$scope.find = function () {
			var Resource = $resource('/users/me');
			Resource.get(function (user) {
				$scope.user = user;
			});
			Resource = $resource('/courts');
			Resource.query(function (courts) {
				$scope.courts = courts;
			});


		};
		$scope.find();
		$scope.create = function () {
			// Create new Match object


			var match = new Matches({
				spieler: [
					{user: $scope.user}

				],
				court: this.match.court,
				sport: this.match.sport,
				state: 'new',
				time: $scope.match.time
			});

			// Redirect after save
			match.$save(function (response) {
				$location.path('matches/');

				// Clear form fields
				$scope.name = '';
			}, function (errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
	}
]);
