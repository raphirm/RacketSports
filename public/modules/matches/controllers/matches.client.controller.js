'use strict';

// Matches controller
angular.module('matches').controller('MatchesController', ['$scope', '$stateParams', '$location', "$http" , "$resource", 'Authentication', 'Matches', 'Users',
	function($scope, $stateParams, $location, $http, $resource,  Authentication, Matches, Users) {
		$scope.authentication = Authentication;
		$scope.user = Authentication.user;
		$scope.suser = "";
		$scope.find = function() {
			var Resource = $resource('/users/me');
			Resource.get(function(user){
				$scope.user = user;
			});
			Resource = $resource("/courts" );
			Resource.query(function(courts){
				$scope.courts = courts;
			})

		};
		$scope.find();
		// Create new Match
		$scope.create = function() {
			// Create new Match object
			var match = new Matches ({
				spieler:  [
					{user: $scope.user },
					{user: {
						username: this.match.user.username
					}}
				],
				court: this.match.court,
				sport: this.match.sport
			});

			// Redirect after save
			match.$save(function(response) {
				$location.path('matches/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Match
		$scope.remove = function(match) {
			if ( match ) { 
				match.$remove();

				for (var i in $scope.matches) {
					if ($scope.matches [i] === match) {
						$scope.matches.splice(i, 1);
					}
				}
			} else {
				$scope.match.$remove(function() {
					$location.path('matches');
				});
			}
		};

		// Update existing Match
		$scope.update = function() {
			var match = $scope.match;

			match.$update(function() {
				$location.path('matches/' + match._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Matches
		$scope.find = function() {
			$scope.matches = Matches.query();
		};

		// Find existing Match
		$scope.findOne = function() {
			$scope.match = Matches.get({ 
				matchId: $stateParams.matchId
			});
		};
		$scope.findUser= function() {
			var Resource = $resource('/users/find', {user: $scope.suser});
			Resource.get(
				function(user){
					$scope.player2 = user;
					$scope.user.friends.push(user);
					$scope.match = {user: ''};
					$scope.match.user=user;

			}, function(response) {

					$scope.error = response.data.message;

			});
		}
	}
]);
