
define(['app', 'authentication', '../../directives/map/undb-map'], function() { 'use strict';

	return ['$scope', '$window',
    function ($scope, $window) {

		$scope.actionRegister = function () {
			$window.location.href = '/actions/submit';
		}

    }];
});