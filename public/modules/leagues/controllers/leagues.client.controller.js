'use strict';

// Leagues controller
angular.module('leagues').controller('LeaguesController', ['$http', '$scope', '$stateParams', '$location', 'Authentication', 'Leagues',
	function($http, $scope, $stateParams, $location, Authentication, Leagues) {
		$scope.authentication = Authentication
		// Create new League
		$scope.create = function() {
			// Create new League object
			var league = new Leagues ({
				name: this.name,
				sport: this.sport
			});

			// Redirect after save
			league.$save(function(response) {
				$location.path('leagues/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.sport = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing League
		$scope.remove = function(league) {
			if ( league ) { 
				league.$remove();

				for (var i in $scope.leagues) {
					if ($scope.leagues [i] === league) {
						$scope.leagues.splice(i, 1);
					}
				}
			} else {
				$scope.league.$remove(function() {
					$location.path('leagues');
				});
			}
		};

		$scope.joinLeague = function(league) {
			var league = $scope.league;
			$http.get("/leagues/"+league._id+"/join");
			location.reload();
		};
		$scope.leaveLeague = function(league) {
			var league = $scope.league;
			$http.get("/leagues/"+league._id+"/leave");
			location.reload();
		};
		$scope.joinStatus = function(league) {
			var league = $scope.league;
			var existing = false;
			league.users.forEach(function(user){
				if($scope.authentication.user._id == user.user._id){
					existing = true;
				}
			});
			return existing;
		};

		// Update existing League
		$scope.update = function() {
			var league = $scope.league;

			league.$update(function() {
				$location.path('leagues/' + league._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Leagues
		$scope.find = function() {
			$scope.leagues = Leagues.query();
		};

		// Find existing League
		$scope.findOne = function() {

			$scope.league = Leagues.get({ 
				leagueId: $stateParams.leagueId
			});
		};
	}
]);
