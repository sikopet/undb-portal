define(['app'], function() { 'use strict';

	return ['$scope','$location', function ($scope,$location) {
		var panels = {"firstCollapse": false};



console.log('test');

				$scope.goTo = function (uri) {
						$location.url(uri);
				};

    }];
});
