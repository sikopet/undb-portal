define(['text!./filter-bio-champs.html', 'app','lodash'], function(template, app, _) {
  'use strict';

  app.directive('filterBioChamps', [function() {
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
            'bioChamps': {
              'schema_s': ['bioChamps'],
            }
          };


          //=======================================================================
          //
          //=======================================================================
          $scope.loadRecords = function() {
            $scope.message="The Biodiversity Champions are truly inventive, creative and exceptional examples of support to the Strategic Plan for Biodiversity 2011-2020.";
            undbMap.filterActive('bioChamps');

          //  undbMap.addSubQuery(_.cloneDeep($scope.queries), 'partners');
          //  undbMap.search();

          undbMap.addSubQuery(_.cloneDeep($scope.queries), 'bioChamps');

          undbMap.search();
          }; // loadRecords

        } //link
    }; // return
  }]); //app.directive('sfilterNbsap
}); // define
