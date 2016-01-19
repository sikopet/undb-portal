define(['text!./filter-actors.html', 'app', 'lodash'], function(template, app, _) {
  'use strict';

  app.directive('filterActors', [function() {
    return {
      restrict: 'E',
      template: template,
      replace: true,
      require: '^undbMap',
      scope: {
        title: '@title',
        active: '=active',
        message: '=message'
      },
      link: function($scope, $element, $attr,undbMap) {
          $scope.queries = {
            'parnters': {
              'schema_s': ['partners'],
            }
          };
          $scope.queries = {
            'projects': {
              'schema_s': ['lwProject'],
              "expired_b":['false'],
            }
          };

          //=======================================================================
          //
          //=======================================================================
          $scope.loadRecords = function() {
            $scope.message="The UNDB Network comprises all Actors contributing to the implementation of the 2011-2020 Strategic Plan for Biodiversity.";
            undbMap.filterActive('actors');

          //  undbMap.addSubQuery(_.cloneDeep($scope.queries), 'partners');
          //  undbMap.search();
          undbMap.addSubQuery(_.cloneDeep($scope.queries), 'projects');

          undbMap.search();
          }; // loadRecords

        }
    }; // return
  }]); //app.directive('sfilterNbsap
}); // define
