'use strict';

// Configuring the Articles module
angular.module('courts').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Racketzentren', 'courts', 'dropdown', '/courts(/create)?');
		Menus.addSubMenuItem('topbar', 'courts', 'Racketzentren', 'courts');
		Menus.addSubMenuItem('topbar', 'courts', 'Racketzentrum erfassen', 'courts/create');
	}
]);
