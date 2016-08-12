define(['app','directives/actors-list'], function() {
    'use strict';
    return ['$scope', '$location', function($scope, $location) {
        $scope.goTo = function(url) {
            $location.url(url);
        };
    }];
});