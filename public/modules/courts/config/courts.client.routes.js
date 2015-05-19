'use strict';

//Setting up route
angular.module('courts').config(['$stateProvider',
	function($stateProvider) {
		// Courts state routing
		$stateProvider.
		state('listCourts', {
			url: '/courts',
			templateUrl: 'modules/courts/views/list-courts.client.view.html'
		}).
		state('createCourt', {
			url: '/courts/create',
			templateUrl: 'modules/courts/views/create-court.client.view.html'
		}).
		state('viewCourt', {
			url: '/courts/:courtId',
			templateUrl: 'modules/courts/views/view-court.client.view.html'
		}).
		state('editCourt', {
			url: '/courts/:courtId/edit',
			templateUrl: 'modules/courts/views/edit-court.client.view.html'
		});
	}
]);