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
    "./filter-coalitions",
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

                $scope.loaded = false;
                $scope.subQueries = {};
                $scope.message = '';
                $scope.link = '';
                $scope.toggleCaption = 1;

                $http.get("https://api.cbd.int/api/v2015/countries", {
                    cache: true
                }).then(function(o) {
                    $scope.countries = $filter('orderBy')(o.data, 'title|lstring');
                    return;
                });


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
                    if ($attr.schema === 'actions') {
                        activateFilter();
                        $scope.message = "actions";
                    }
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
                    if ($attr.schema === 'actors') {
                        activateFilter();
                        $scope.message = "actors";
                        $scope.link="/actors";        
                    }

                });

                $scope.champs = champs;

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

                //=======================================================================
                //
                //=======================================================================
                function activateFilter() {
                    if ($attr.schema) {
                        // $timeout(function() {
                        //   $scope.selectedSchema = 'parties';
                        //   reportingDisplay.search();
                        // }, 500);
                        $timeout(function() {
                            $scope.selectedSchema = $attr.schema;
                            reportingDisplay.search();
                        }, 1000);
                    }
                }

                //=======================================================================
                //
                //=======================================================================
                function goTo(link) {
                  console.log(link);
                    $location.url(link);
                }
                $scope.goTo=goTo;
            }, //link


            //=======================================================================
            //
            //=======================================================================
            controller: ["$scope", function($scope) {
                    var queryScheduled;
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
                        'coalitions': {
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
                    $scope.buildQuery = function() {
                        // NOT version_s:* remove non-public records from resultset
                        var q = 'NOT version_s:*';

                        var subQueries = [];

                        _.each($scope.subQueries, function(filter, filterName) {
                            subQueries = _.compact([
                                getFormatedSubQuery(filterName, 'schema_s'),
                                getFormatedSubQuery(filterName, 'startDate_dt'),
                                getFormatedSubQuery(filterName, 'state_s'),
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


                    //=======================================================================
                    //
                    //=======================================================================
                    function query($scope) {

                        if ($scope.selectedSchema === 'parties') {
                            if($scope.documents)
                              filterActive('parties');
                            $scope.documents = groupByCountry($scope.countries, 1);
                            return;
                        }
                        if ($scope.selectedSchema === 'bioChamps') {
                            filterActive('bioChamps');
                            $scope.documents = _.clone($scope.champs);
                            return;
                        }
                        if ($scope.selectedSchema === 'coalitions') {
                            filterActive('coalitions');
                            $scope.documents = [];
                            return;
                        }
                        if ($scope.selectedSchema === 'actors') {
                            filterActive('actors');
                            $scope.documents = _.clone($scope.actors);

                            return;
                        }

                        if ($scope.selectedSchema === 'actions') {
                            filterActive('actions');
                            if (_.isEmpty($scope.subQueries))
                                $scope.documents = _.clone($scope.actions);
                            sendQuery();
                            return;
                        }

                    } // query


                    //=======================================================================
                    //
                    //=======================================================================
                    function sendQuery() {


                        if (_.isEmpty($scope.subQueries)) return;
                        var queryParameters = {
                            'q': $scope.buildQuery(),
                            'sort': 'createdDate_dt desc, title_t asc',
                            'wt': 'json',
                            'start': 0,
                            'rows': 1000000,
                        };


                        $http.get('https://api.cbd.int/api/v2013/index', {
                            params: queryParameters,
                            cache: false
                        }).success(function(data) {

                            $scope.count = data.response.numFound;
                            $scope.documents = data.response.docs;
                        });
                    } // query

                    //=======================================================================
                    //
                    //=======================================================================
                    function groupByCountry(list, countries) {
                        var docsByCountry = {};
                        $scope.euData = {};
                        if (!$scope.countries) return '';
                        if (countries)
                            _.each($scope.countries, function(doc) {
                                if (!docsByCountry[doc.code]) // if country object not created created
                                {
                                    docsByCountry[doc.code] = [];
                                    docsByCountry[doc.code] = getCountryById(doc.code); //insert country data
                                    docsByCountry[doc.code].docs = {}; // initializes the countries docs
                                }
                            });


                        if (docsByCountry.EU)
                            docsByCountry.EU.isEUR = true;

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
                    function deleteSubQuery(name) {

                        if ($scope.subQueries)
                            delete($scope.subQueries[name]);
                    } //deleteSubQuery


                    this.filterActive = filterActive;
                    this.deleteSubQuery = deleteSubQuery;
                    this.search = search;
                    this.addSubQuery = addSubQuery;
                }] //controlerr
        }; //return
    }]); //directive
}); //define