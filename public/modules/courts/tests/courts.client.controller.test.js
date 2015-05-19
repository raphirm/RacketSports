'use strict';

(function() {
	// Courts Controller Spec
	describe('Courts Controller Tests', function() {
		// Initialize global variables
		var CourtsController,
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

			// Initialize the Courts controller.
			CourtsController = $controller('CourtsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Court object fetched from XHR', inject(function(Courts) {
			// Create sample Court using the Courts service
			var sampleCourt = new Courts({
				name: 'New Court'
			});

			// Create a sample Courts array that includes the new Court
			var sampleCourts = [sampleCourt];

			// Set GET response
			$httpBackend.expectGET('courts').respond(sampleCourts);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.courts).toEqualData(sampleCourts);
		}));

		it('$scope.findOne() should create an array with one Court object fetched from XHR using a courtId URL parameter', inject(function(Courts) {
			// Define a sample Court object
			var sampleCourt = new Courts({
				name: 'New Court'
			});

			// Set the URL parameter
			$stateParams.courtId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/courts\/([0-9a-fA-F]{24})$/).respond(sampleCourt);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.court).toEqualData(sampleCourt);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Courts) {
			// Create a sample Court object
			var sampleCourtPostData = new Courts({
				name: 'New Court'
			});

			// Create a sample Court response
			var sampleCourtResponse = new Courts({
				_id: '525cf20451979dea2c000001',
				name: 'New Court'
			});

			// Fixture mock form input values
			scope.name = 'New Court';

			// Set POST response
			$httpBackend.expectPOST('courts', sampleCourtPostData).respond(sampleCourtResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Court was created
			expect($location.path()).toBe('/courts/' + sampleCourtResponse._id);
		}));

		it('$scope.update() should update a valid Court', inject(function(Courts) {
			// Define a sample Court put data
			var sampleCourtPutData = new Courts({
				_id: '525cf20451979dea2c000001',
				name: 'New Court'
			});

			// Mock Court in scope
			scope.court = sampleCourtPutData;

			// Set PUT response
			$httpBackend.expectPUT(/courts\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/courts/' + sampleCourtPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid courtId and remove the Court from the scope', inject(function(Courts) {
			// Create new Court object
			var sampleCourt = new Courts({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Courts array and include the Court
			scope.courts = [sampleCourt];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/courts\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCourt);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.courts.length).toBe(0);
		}));
	});
}());