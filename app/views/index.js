define(['app', 'angular', 'authentication'], function() { 'use strict';

	return ['$scope', '$rootScope', '$route', '$browser', '$location', '$window', 'authentication', function ($scope, $rootScope, $route, $browser, $location, $window, authentication) {

		$('[data-ride="carousel"]').each(function () {
			var $carousel = $(this);
			$.fn.carousel.call($carousel, $carousel.data())
		});

        $rootScope.homePage = true;
        $rootScope.navigation = [];
        $rootScope.navigationTree = [];
    }];
});
