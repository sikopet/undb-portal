define(['app', 'angular', 'authentication'], function() { 'use strict';

	return ['$scope', '$rootScope', '$route', '$browser', '$location', '$window', 'authentication',
    function ($scope, $rootScope, $route, $browser, $location, $window, authentication) {

		$scope.actionRegister = function () {
			$window.location.href = '/actions/submit';
		}

    }];
});
