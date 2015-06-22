define(['app', 'angular', 'authentication'], function() { 'use strict';

	return ['$scope', '$rootScope', '$route', '$browser', '$location', '$window', 'user', 'authentication', function ($scope, $rootScope, $route, $browser, $location, $window, user, authentication) {

        $rootScope.homePage = true;
        $rootScope.userGovernment = user.government;
        $rootScope.navigation = [];
        $rootScope.navigationTree = [];

        $scope.email = $rootScope.lastLoginEmail || "";

    
	
	
	
	
	
    }];
});
