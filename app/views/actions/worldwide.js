
define(['app', 'authentication', '../../directives/map/undb-map'], function() { 'use strict';

	return ['$scope', '$location',
    function ($scope, $location) {

		$scope.actionRegister = function () {
			$location.url('/actions/submit');
		};

    }];
});
