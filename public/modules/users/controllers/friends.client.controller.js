'use strict';
angular.module('users').controller('FriendsController', ['$scope', '$http', '$location', '$resource', 'Users', 'Authentication',
	function($scope, $http, $location, $resource,Users, Authentication ) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};
		$scope.find = function() {
			var Resource = $resource('/users/me');
			Resource.get(function(user){
				$scope.user = user;
			});

		};
		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeFriend = function(friend) {
			$scope.success = $scope.error = null;

			$http.delete('/users/friend', {
				params: {
					friend: friend
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
				$scope.find();
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.addFriend = function() {
			var $friend = $scope.user.friend.username
			$http.get('/users/friend', {
				params: {
					friend: $friend
				}

			}).success(function (response) {
				$scope.success = true;

				$scope.find();


			}).error(function (response) {
			});


		};
		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
