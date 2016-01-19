define(['text!./filter-case-studies.html', 'app', 'lodash'], function(template, app, _) {
  'use strict';

  app.directive('filterCaseStudies', [function() {
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
      link: function($scope, $element, $attr,undbMap){
          $scope.queries = {
            'caseStudies': {
              'schema_s': ['caseStudy'],
            }
          };

          //=======================================================================
          //
          //=======================================================================
          $scope.loadRecords = function() {
            $scope.message="Case studies are narrative examples of great success stories. Find inspiration for your own Actions!";

            undbMap.filterActive('caseStudies');
            undbMap.addSubQuery(_.cloneDeep($scope.queries), 'caseStudies');
            undbMap.search();
          }; // loadRecords

        } //link
    }; // return
  }]); //app.directive('sfilterNbsap
}); // define
