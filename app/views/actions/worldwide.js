
define(['app',  'directives/activities-list','../../directives/map/undb-map'], function() { 'use strict';

	return ['$scope','$location',function ($scope,$location) {
		 $scope.countryCode='ALL';
		 $scope.count=0;
		 //=======================================================================
		 //
		 //=======================================================================
		 $scope.goTo = function(url, code) {

				 if (code)
						 $location.url(url + code);
				 else
						 $location.url(url);
		 };
    }];
});
