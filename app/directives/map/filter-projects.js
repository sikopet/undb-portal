define(['text!./filter-projects.html', 'app', 'lodash'], function(template, app, _) {
  'use strict';

  app.directive('filterProjects', [function() {
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
            'projects': {
              'schema_s': ['lwProjects'],
            }
          };

          //=======================================================================
          //
          //=======================================================================
          $scope.loadRecords = function() {
            $scope.message="Projects are long term initiatives at the national level or beyond, and feature elements of capacity building.";
            undbMap.filterActive('projects');

            undbMap.addSubQuery(_.cloneDeep($scope.queries), 'projects');
            undbMap.search();
          }; // loadRecords

        } //link
    }; // return
  }]); //app.directive('sfilterNbsap
}); // define
