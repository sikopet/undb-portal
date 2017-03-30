define(['app'], function() { 'use strict';

	return ['$scope','$location', function ($scope,$location) {
		var panels = {"firstCollapse": false};

				$scope.goTo = function (uri) {
						$location.url(uri);
				};

    }];
});
