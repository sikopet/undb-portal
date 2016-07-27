define(['app'], function() { 'use strict';

	return ['$scope','$location', function ($scope,$location) {
		var panels = {"firstCollapse": false};

        $scope.toggleCss = function (elementID, targetElementID) {
            $('#accordion .panel-heading').removeClass('bg-tall');
            $('#accordion .panel-heading').addClass('bg-short');

            panels = {};

            if(!$('#'+elementID).hasClass('in')){
                $('#'+targetElementID).removeClass('bg-short');
                $('#'+targetElementID).addClass('bg-tall');
            }
        };

        $scope.isOpen = function (elementID) {
            return panels[elementID] || false;
        };

				$scope.goTo = function (uri) {
						$location.url(uri);
				};

    }];
});
