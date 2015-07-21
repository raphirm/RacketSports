'use strict';

angular.module('matches').directive('ngModelCust', [
	function() {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, element, attrs, ngModel) {

			}

		};
	}
]);
