'use strict';

//Courts service used to communicate Courts REST endpoints
angular.module('courts').factory('Courts', ['$resource',
	function($resource) {
		return $resource('courts/:courtId', { courtId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);