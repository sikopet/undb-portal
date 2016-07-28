define(['lodash'], function(_) {
    'use strict';
    return ['$scope', '$location','$anchorScroll','authentication', function($scope, $location,$anchorScroll,authentication) {

      //=======================================================================
      //
      //=======================================================================
      authentication.getUser().then(function(user) {
          $scope.user = user;
      });


      //==============================
      //
      //==============================
      function isAdmin () {
            if(!$scope.user) return false;
            return _.intersection($scope.user.roles, ['Administrator', 'undb-administrator']).length > 0;
      }
      $scope.isAdmin=isAdmin;

        //==============================
        //
        //==============================
        function scrollTo (id) {
           $location.hash(id);
           $anchorScroll();
        }
        $scope.scrollTo=scrollTo;

        //=======================================================================
        //
        //=======================================================================
        function goTo (url, code) {

            if (code)
                $location.url(url + code);
            else
                $location.url(url);
        }
        $scope.goTo=goTo;
    }];
});
