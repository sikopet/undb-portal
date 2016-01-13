define(['text!./undb-map.html',
  'app',
  'jquery',
  'lodash',
  './ammap3',

 "factories/km-utilities",
  //"./results-list",
//  "./filter-assessment",
  //"./filter-report",
  "./filter-parties",
//  "./filter-all",
  //"./filter-indicator",
  //"./filter-target",
  //"./filter-resource-mobilisation",
], function(template, app, $, _) {
  'use strict';

  app.directive('undbMap', ['$http', 'realm', '$q', '$timeout', '$location', '$filter', function($http, realm, $q, $timeout, $location, $filter) {
    return {
      restrict: 'E',
      template: template,
      replace: true,
      scope: {},
      require: 'undbMap',
      link: function($scope, $element, $attr, reportingDisplay) { // jshint ignore:line

        $scope.loaded = false;
        $scope.zoomToMap = [];
        $scope.showCountry = '';
        $scope.subQueries = {};
        $scope.queriesStrings = {};

        $http.get("/api/v2013/thesaurus/domains/countries/terms", {
          cache: true
        }).then(function(o) {
          $scope.countries = $filter('orderBy')(o.data, 'title|lstring');
          return;
        }).then(function() {
          reportingDisplay.search();
        });

        $element.find("#customHome").on('click', function(event) {
          $scope.$broadcast('customHome', 'show');
        });

        $scope.urlStrings = {
          'all': {
            'schema_s': [
              'nationalReport',
              'nationalAssessment',
              'resourceMobilisation',
              'nationalIndicator',
              'nationalTarget'
            ],
            '_latest_s': ['true'],
            '_state_s': ['public']
          }
        };


        //=======================================================================
        //
        //=======================================================================
        $scope.buildQuery = function() {
          // NOT version_s:* remove non-public records from resultset
          var q = 'NOT version_s:* AND realm_ss:' + realm.toLowerCase(); //+ ' AND schema_s:* '

          var subQueries = [];

          _.each($scope.subQueries, function(filter, filterName) {
            if(filterName=="partners")return 'partners';
            subQueries = _.compact([
              getFormatedSubQuery(filterName, 'schema_s'),
              getFormatedSubQuery(filterName, 'reportType_s'),
              getFormatedSubQuery(filterName, 'nationalTarget_EN_t'),
              getFormatedSubQuery(filterName, '_latest_s'),
              getFormatedSubQuery(filterName, '_state_s'),
            ]);
          });

          if (subQueries.length)
            q += " AND " + subQueries.join(" AND ");
          return q;
        }; //$scope.buildQuery

        //=======================================================================
        //
        //=======================================================================
        function getFormatedSubQuery(filter, name) {

          if (!filter) return '';
          var fil = $scope.subQueries[filter];

          if (!fil) return '';
          if (!fil[name]) return '';

          var subQ = '';
          subQ += name + ':' + fil[name].join(' OR ' + name + ":");
          subQ = '(' + subQ + ')';

          return subQ;
        } //function getFormatedSubQuery (name)

      }, //link

      //=======================================================================
      //
      //=======================================================================
      controller: ["$scope", function($scope) {
          var queryScheduled = null;
          var canceler = null;

          //=======================================================================
          //
          //=======================================================================
          function query($scope) {


            readQueryString();
            if (_.isEmpty($scope.subQueries)) return;
            var queryString=$scope.buildQuery();
            if(queryString == 'partners'){

              $scope.documents=$scope.countries;  

            }



            var queryParameters = {
              'q': $scope.buildQuery(),
              'sort': 'createdDate_dt desc, title_t asc',
              'fl': 'reportType_s,documentID,identifier_s,id,title_t,description_t,url_ss,schema_EN_t,date_dt,government_EN_t,schema_s,number_d,aichiTarget_ss,reference_s,sender_s,meeting_ss,recipient_ss,symbol_s,eventCity_EN_t,eventCountry_EN_t,startDate_s,endDate_s,body_s,code_s,meeting_s,group_s,function_t,department_t,organization_t,summary_EN_t,reportType_EN_t,completion_EN_t,jurisdiction_EN_t,development_EN_t,_latest_s,nationalTarget_EN_t,progress_EN_t,year_i,text_EN_txt,nationalTarget_EN_t,government_s',
              'wt': 'json',
              'start': 0,
              'rows': 1000000,
            };

            if (canceler) {
              canceler.resolve(true);
            }

            canceler = $q.defer();
            updateQueryString();

            $http.get('/api/v2013/index/select', {
              params: queryParameters,
              timeout: canceler.promise,
              cache: true
            }).success(function(data) {
              canceler = null;
              $scope.count = data.response.numFound;
              $scope.count = data.response.docs.length;
              $scope.documents = groupByCountry(data.response.docs);
            });
          } // query

          //=======================================================================
          //
          //=======================================================================
          function groupByCountry(list) {
            var docsByCountry = {};
            $scope.euData = {};
            if (!$scope.countries) return '';
            _.each(list, function(doc) {
              if (!docsByCountry[doc.government_s]) // if country object not created created
              {
                docsByCountry[doc.government_s] = [];
                docsByCountry[doc.government_s] = getCountryById(doc.government_s); //insert country data
                docsByCountry[doc.government_s].docs = {}; // initializes the countries docs
              }

              if (!docsByCountry[doc.government_s].docs[doc.schema_s]) //order docs by schema
                docsByCountry[doc.government_s].docs[doc.schema_s] = [];

              if (doc.reportType_s && doc.reportType_s == 'B0EBAE91-9581-4BB2-9C02-52FCF9D82721') {
                if (!docsByCountry[doc.government_s].docs.nbsaps)
                  docsByCountry[doc.government_s].docs.nbsaps = [];
                docsByCountry[doc.government_s].docs.nbsaps.push(doc);
              } else
                docsByCountry[doc.government_s].docs[doc.schema_s].push(doc); // insert doc

              docsByCountry[doc.government_s].expanded = false;
              docsByCountry[doc.government_s].hidden = false;

              if (docsByCountry[doc.government_s].docs[doc.schema_s].length > 1 && doc.schema_s === 'nationalAssessment')
                docsByCountry[doc.government_s].docs[doc.schema_s].sort(
                  function(a, b) {
                    if (b.date_dt && a.date_dt) return new Date(b.date_dt) - new Date(a.date_dt);
                  }); // sort by date

              if (docsByCountry[doc.government_s].docs[doc.schema_s].length > 1 && doc.schema_s === 'nationalAssessment')
                docsByCountry[doc.government_s].docs[doc.schema_s].sort(function(a, b) {
                  if (b.progress_EN_t && a.progress_EN_t)
                    return progressToNum(b.progress_EN_t) - progressToNum(a.progress_EN_t);
                }); // sort sort by progress
              docsByCountry[doc.government_s].isEUR = false;
            });

            if (docsByCountry.eur)
              docsByCountry.eur.isEUR = true;

            setNumDocumentsInCountry();
            return docsByCountry;
          } //readQueryString

          //=======================================================================
          //
          //=======================================================================
          function getCountryById(id) {

            var index = _.findIndex($scope.countries, function(country) {

              return country.identifier.toUpperCase() === id.toUpperCase();
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
          //
          //=======================================================================
          function readQueryString() {

            var filter = _([$location.search().filter]).flatten().compact().value()[0]; // takes query string into array

            if (!_.isEmpty(filter) && (_.isEmpty($scope.subQueries))) {
              $scope.subQueries = {};
              $scope.subQueries[filter] = _.cloneDeep($scope.urlStrings[filter]);
              $scope.selectedSchema = filter;
            }

          } //readQueryString

          //=======================================================================
          //
          //=======================================================================
          function updateQueryString() {

            _.each($scope.subQueries, function(filter, filterName) {
              _.each(filter, function(itemIdArr, schemaKey) {

                $location.replace();
                $location.search('filter', filterName);
                $scope.selectedSchema = filterName;
                //$scope.queriesStrings[filterName]=_.cloneDeep($scope.subQueries[filterName]);

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
          function deleteAllSubQuery(name) {

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
