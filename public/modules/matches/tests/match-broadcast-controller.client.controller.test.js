'use strict';

(function() {
	// Match broadcast controller Controller Spec
	describe('Match broadcast controller Controller Tests', function() {
		// Initialize global variables
		var MatchBroadcastControllerController,
			scope,
			$httpBackend,
			$stateParams,
			$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Match broadcast controller controller.
			MatchBroadcastControllerController = $controller('MatchBroadcastController', {
				$scope: scope
			});
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Matches) {
			// Create a sample Match object
			var sampleMatchPostData = new Matches({
			"spieler":[{}],"court":"Vitis","sport":"Squash","state":"new"
			});

			// Create a sample Match response
			var sampleMatchResponse = new Matches({
				_id: '525cf20451979dea2c000001',
			});

			// Fixture mock form input values
			scope.match = new Matches()

			scope.match.court =  "Vitis";
			scope.match.sport = "Squash";

			// Set POST response
			$httpBackend.expectGET('/users/me').respond();
			$httpBackend.expectGET('/courts').respond();
			$httpBackend.expectPOST('matches', sampleMatchPostData).respond(sampleMatchResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

		}));
	});
}());
