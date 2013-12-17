describe('async user validation directive', function() {
	var $scope, testInput, modelValue;
	beforeEach(module('mock.users'));
	beforeEach(module('custom.validation'));
	beforeEach(inject(function($compile, $rootScope, _Users_) {
		$scope = $rootScope;
		$scope.model = {};
		$compile('<form name="testForm">\
					<input name="testInput" ng-model="model.testValue" unique-email />\
				  </form>')($scope);
		//ngModelController will be exposed on the scope as $scope.testForm.testInput
		testInput = $scope.testForm.testInput;
		Users = _Users_;
		spyOn(Users, 'query').andCallThrough();
	}));

	it('should call Users.query when the view changes', function() {
		testInput.$setViewValue('different');
		$scope.$digest();
		expect(Users.query).toHaveBeenCalled();
	});

	it('should set model to invalid if the Users.query response contains users', 
		function() {
			testInput.$setViewValue('different');
			Users.respondWith(['someUsers']);
			expect(testInput.$valid).toBe(false);
		}
	);

	it('should set model to valid if the Users.query response contains no user', 
		function() {
			testInput.$setViewValue('different');
			Users.respondWith([]);
			expect(testInput.$valid).toBe(true);
		}
	);

	it('should not call Users.query if the view changes to be the same as the original model', 
		function() {
			$scope.model.testValue = 'admin@abc.com';
			$scope.$digest();
			testInput.$setViewValue('admin@abc.com');
			expect(Users.query).not.toHaveBeenCalled();
			testInput.$setViewValue('other@abc.com');
			expect(Users.query).toHaveBeenCalled();
			
			Users.query.reset();
			testInput.$setViewValue('admin@abc.com');
			expect(Users.query).not.toHaveBeenCalled();
			$scope.model.testValue = 'other@abc.com';
			$scope.$digest();
			testInput.$setViewValue('admin@abc.com');
			expect(Users.query).toHaveBeenCalled();
		}
	);
	
});