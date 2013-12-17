angular.module('mock.users', []).factory('Users', function() {
	var Users = {};
	Users.query = function(query, response) {
		Users.respondWith = function(emails) {
			response(emails);
			Users.respondWith = undefined;
		};
	};
	return Users;
});
