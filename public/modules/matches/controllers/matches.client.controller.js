'use strict';

// Matches controller
angular.module('matches').controller('MatchesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Matches',
	function($scope, $stateParams, $location, Authentication, Matches) {
		$scope.authentication = Authentication;

		// Create new Match
		$scope.create = function() {
			// Create new Match object
			var match = new Matches ({
				name: this.name
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
	}
]);