angular.module('custom.validation', [])
.directive('uniqueEmail', ["Users", function(Users) {
	return {
		require:'ngModel',
		//When we use require:'ngModel',
		//ngModelController will be provided in the link function
		link:function (scope, element, attrs, ngModelCtrl) {
			var original;
			ngModelCtrl.$formatters.unshift(function(modelValue) {
				original = modelValue;
				return modelValue;
			});
			ngModelCtrl.$parsers.push(function (viewValue) {
				if (viewValue && viewValue !== original) {
					Users.query({email:viewValue}, function (users) {
						if (users.length === 0) {
							ngModelCtrl.$setValidity('uniqueEmail', true);
						} else {
							ngModelCtrl.$setValidity('uniqueEmail', false);
						}
					});
					return viewValue;
				}
			});
		}
	};
}]);
