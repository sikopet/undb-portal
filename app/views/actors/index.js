define(['app', 'angular'], function() {
    'use strict';
    return ['$scope', '$location', function($scope, $location) {
        $scope.goTo = function(url) {
            $location.url(url);
        };
    }];
});