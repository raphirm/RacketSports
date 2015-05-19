'use strict';

// Configuring the Articles module
angular.module('courts').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Courts', 'courts', 'dropdown', '/courts(/create)?');
		Menus.addSubMenuItem('topbar', 'courts', 'List Courts', 'courts');
		Menus.addSubMenuItem('topbar', 'courts', 'New Court', 'courts/create');
	}
]);