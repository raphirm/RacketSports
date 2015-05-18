'use strict';

// Configuring the Articles module
angular.module('leagues').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Leagues', 'leagues', 'dropdown', '/leagues(/create)?');
		Menus.addSubMenuItem('topbar', 'leagues', 'List Leagues', 'leagues');
		Menus.addSubMenuItem('topbar', 'leagues', 'New League', 'leagues/create');

	}
]);
