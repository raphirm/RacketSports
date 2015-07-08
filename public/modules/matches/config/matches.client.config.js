'use strict';

// Configuring the Articles module
angular.module('matches').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Spiele', 'matches', 'dropdown', '/matches(/create)?');
		Menus.addSubMenuItem('topbar', 'matches', 'Spiele anzeigen', 'matches');
		Menus.addSubMenuItem('topbar', 'matches', 'Neues Spiel', 'matches/create');
		Menus.addSubMenuItem('topbar', 'matches', 'Personen in der Nähe herausfordern', 'matches/create/broadcast');

	}
]);
