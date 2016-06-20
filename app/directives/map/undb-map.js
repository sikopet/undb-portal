define(['text!./undb-map.html',
  'app',
  'jquery',
  'lodash',
  './champs',
  './ammap3',
  "factories/km-utilities",
  "./filter-parties",
  "./filter-actors",
  "./filter-actions",
  "./filter-bio-champs",
], function(template, app, $, _, champs) {
  'use strict';

  app.directive('undbMap', ['$http', 'realm', '$q', '$timeout', '$location', '$filter', function($http, realm, $q, $timeout, $location, $filter) {
    return {
      restrict: 'E',
      template: template,
      replace: true,
      scope: {},
      require: 'undbMap',
      link: function($scope, $element, $attr, reportingDisplay) { // jshint ignore:line
        $scope.activeFilter = 'actors';
        $scope.loaded = false;
        $scope.zoomToMap = [];
        $scope.showCountry = '';
        $scope.subQueries = {};
        $scope.queriesStrings = {};
        $scope.message = '';
        $scope.toggleCaption = 1;

        $http.get("https://api.cbd.int/api/v2015/countries", {
          cache: true
        }).then(function(o) {
          $scope.countries = $filter('orderBy')(o.data, 'title|lstring');
          return;
        });


        $element.find("#customHome").on('click', function() {
          $scope.$broadcast('customHome', 'show');
        });

        $scope.message = "The UNDB Network comprises all Actors contributing to the implementation of the 2011-2020 Strategic Plan for Biodiversity.";
        $scope.toggleCaption = 1;


        $http.get("https://api.cbd.int/api/v2013/index", {
            params: {
                'q': 'schema_s:undbAction',
                'sort': 'createdDate_dt desc, title_t asc',
                'wt': 'json',
                'start': 0,
                'rows': 1000000,
            }
        }).then(function(o) {
            $scope.actions = o.data.response.docs;
            return;
        });

        $http.get("https://api.cbd.int/api/v2013/index", {
            params: {
                'q': 'schema_s:undbPartner',
                'sort': 'createdDate_dt desc, title_t asc',
                'wt': 'json',
                'start': 0,
                'rows': 1000000,
            }
        }).then(function(o) {
            $scope.actors = o.data.response.docs;
            reportingDisplay.filterActive('actors');
            reportingDisplay.addSubQuery({
              'actors': {
                'schema_s': ['undbPartner'],
                '_state_s':['public']
              }
            }, 'actors');
            reportingDisplay.search();
            return;
        });

        $scope.champs=champs;

        $scope.urlStrings = {
          'parties': {
            'schema_s': [
              'parties'
            ]
          },
          'projects': {
            'schema_s': [
              'lwProject'
            ],
            "expired_b": ['false'],
          },
          'actors': {
            'schema_s': ['undbPartner'],
            '_state_s': ['public']
          },
          'caseStudies': {
            'schema_s': [
              'caseStudy'
            ]
          },
          'actions': {
            'schema_s': ['undbAction'],
            '_state_s': ['public']
          },
          'bioChmaps': {
            'schema_s': [
              'bioChamps'
            ],
          },
        };

      }, //link

      //=======================================================================
      //
      //=======================================================================
      controller: ["$scope", function($scope) {
          var queryScheduled = null;
          $scope.filters = {
            'parties': {
              active: false
            },
            'actors': {
              active: true
            },
            'caseStudies': {
              active: false
            },
            'bioChamps': {
              active: false
            },
            'projects': {
              active: false
            },
            'actions': {
              active: false
            },
          };

          //=======================================================================
          //
          //=======================================================================
          $scope.goTo = function(path) {
                $location.path(path);
          }; // goTo

          //=======================================================================
          //
          //=======================================================================
          function query($scope) {

            readQueryString();

            if (_.isEmpty($scope.subQueries)) return;

            if ($scope.selectedSchema === 'parties') {
              //$scope.selectedSchema = 'parties';
              filterActive('parties');
              $scope.documents = groupByCountry($scope.countries, 1);
              updateQueryString();
              return;
            }
            if ($scope.selectedSchema === 'bioChamps') {
              filterActive('bioChamps');
              $scope.documents = _.clone($scope.champs);
              addSubQuery(_.cloneDeep($scope.urlStrings.actors), 'bioChamps');
              return;
            }
            if ($scope.selectedSchema === 'actors') {
              filterActive('actors');
              $scope.documents = _.clone($scope.actors);
              addSubQuery(_.cloneDeep($scope.urlStrings.actors), 'actors');
              return;
            }
            if ($scope.selectedSchema === 'actions') {
              filterActive('actions');
              $scope.documents = _.clone($scope.actions);
              addSubQuery(_.cloneDeep($scope.urlStrings.actors), 'actions');
              return;
            }
          } // query

          //=======================================================================
          //
          //=======================================================================
          function groupByCountry(list, countries) {
            var docsByCountry = {};
            $scope.euData = {};
            if (!$scope.countries) return '';
            if (countries) {
              _.each($scope.countries, function(doc) {
                if (!docsByCountry[doc.code]) // if country object not created created
                {
                  docsByCountry[doc.code] = [];
                  docsByCountry[doc.code] = getCountryById(doc.code); //insert country data
                  docsByCountry[doc.code].docs = {}; // initializes the countries docs
                }
              });
            } //if not list

            if (docsByCountry.EU)
              docsByCountry.EU.isEUR = true;

            setNumDocumentsInCountry();
            return docsByCountry;
          } //readQueryString

          //=======================================================================
          //
          //=======================================================================
          function getCountryById(id) {

            var index = _.findIndex($scope.countries, function(country) {

              return country.code.toUpperCase() === id.toUpperCase();
            });
            return $scope.countries[index];
          } //getCountryById

          //=======================================================================
          //
          //=======================================================================
          function setNumDocumentsInCountry() {
            var totalDocs = 0;
            _.each($scope.countries, function(country) {
              _.each(country.docs, function(schema) {
                totalDocs += schema.length;
              });
              country.numDocs = totalDocs;
              totalDocs = 0;
            });
          } //setNumDocumentsInCountry()

          //=======================================================================
          //getter/setter
          //=======================================================================
          function filterActive(activeFilter) {
            $scope.toggleCaption = true;
            _.each($scope.filters, function(filter) {
              filter.active = false;
            });
            if (activeFilter)
              $scope.filters[activeFilter].active = true;
            $(document).find(".mapPopup").show();
          }

          //=======================================================================
          //
          //=======================================================================
          function readQueryString() {

            var filter = _([$location.search().filter]).flatten().compact().value()[0]; // takes query string into array

            if (!_.isEmpty(filter) && (_.isEmpty($scope.subQueries))) {
              $scope.subQueries = {};
              $scope.subQueries[filter[1]] = _.cloneDeep($scope.urlStrings[filter[1]]);
              $scope.selectedSchema = filter[1];
            }

          } //readQueryString

          //=======================================================================
          //
          //=======================================================================
          function updateQueryString() {

            _.each($scope.subQueries, function(filter, filterName) {
              _.each(filter, function() {
                $location.replace();
                $location.search('filter', filterName);
                $scope.selectedSchema = filterName;
              });
            });
          } //updateQueryString

          //=======================================================================
          //
          //=======================================================================
          function search() {

            if (queryScheduled)
              $timeout.cancel($scope.queryScheduled);
            queryScheduled = $timeout(function() {
              query($scope);
            }, 100);
          } //search

          //=======================================================================
          //
          //=======================================================================
          function addSubQuery(filter, name, query, singleTon) {

            $scope.subQueries = {};
            $scope.selectedSchema = '';
            $location.replace();
            $location.search('filter', null);
            if (filter && name && !query && !singleTon) {
              $scope.subQueries = _.cloneDeep(filter);
              $scope.selectedSchema = name;
            }
          } //addSubQuery

          //=======================================================================
          //
          //=======================================================================
          function deleteSubQuery(name, scope) {
            var item = null;

            if (scope.item === undefined)
              item = scope;
            else {
              item = scope.item;
              item.selected = !item.selected;
            }
            var i = $scope.subQueries[name].indexOf(item.identifier);
            if (i !== -1)
              $scope.subQueries[name].splice(i, 1);
          } //deleteSubQuery

          //=======================================================================
          //
          //=======================================================================
          function deleteAllSubQuery() {

            $scope.subQueries = [];
            $scope.items = [];
          } //deleteSubQuery

          //=======================================================================
          //
          //=======================================================================
          function zoomToCountry(id) {
            $scope.zoomToMap = [];
            $scope.zoomToMap.push(id);
          } //buildQuery

          //=======================================================================
          //
          //=======================================================================
          function showCountryResultList(id) {
            $scope.showCountry = id;
          } //showCountryResultList


          this.filterActive = filterActive;
          this.showCountryResultList = showCountryResultList;
          this.zoomToCountry = zoomToCountry;
          this.deleteAllSubQuery = deleteAllSubQuery;
          this.deleteSubQuery = deleteSubQuery;
          this.search = search;
          this.addSubQuery = addSubQuery;
        }] //controlerr
    }; //return
  }]); //directive
}); //define