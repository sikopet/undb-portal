define(['app'], function() { 'use strict';

	return ['$scope', function ($scope) {
		var panels = {"firstCollapse": true};
        $scope.toggleCss = function (elementID, targetElementID) {

            $('#accordion .panel-heading').removeClass('bg-tall');
            $('#accordion .panel-heading').addClass('bg-short');

            panels = {};

            if(!$('#'+elementID).hasClass('in')){
                $('#'+targetElementID).removeClass('bg-short');
                $('#'+targetElementID).addClass('bg-tall');
                panels[elementID] = true;
            }
        };

        $scope.isOpen = function (elementID) {
            return panels[elementID] || false;
        };

    }];
});
