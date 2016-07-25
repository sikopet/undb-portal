define(['app'], function(app) {
  'use strict';

  app.directive('timeHelper',['$timeout', function($timeout) {
  return {
   restrict: 'A',
   scope:{binding:'=timeHelper'},
   link: function($scope, $element) {

        var lastKey=false;
        $element.keyup(function(v){lastKey=v.key;changeVal();});
        //=======================================================================
        //
        //=======================================================================
        function changeVal() {

            if ($scope.binding && $scope.binding.length===2 && lastKey !=='Backspace') {
                $timeout(function() {
                  $scope.binding=$scope.binding+':';
                });
                moveCursorToEnd($element);
            }
            if ($scope.binding && $scope.binding.length===4 && $scope.binding[$scope.binding.length-1]===':' ){
                $timeout(function() {$scope.binding=$scope.binding.substring(0, $scope.binding.length - 1);});
                moveCursorToEnd($element) ;
            }

        }

        //=======================================================================
        //
        //=======================================================================
        function moveCursorToEnd(el) {
            $timeout(function() {
                if (typeof el.selectionStart == "number") {
                    el.selectionStart = el.selectionEnd = el.value.length;
                } else if (typeof el.createTextRange != "undefined") {
                    el.focus();
                    var range = el.createTextRange();
                    range.collapse(false);
                    range.select();
                }
            }, 200);
        }
     }
    };
  }]);
}); // define
