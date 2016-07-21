define(['text!./activities-list.html', 'app','moment' ], function(template, app,moment) {
    'use strict';

    app.directive('activitiesList', ['$http','$location',  function($http,$location) {
        return {
            restrict: 'E',
            template: template,
            replace: false,
            scope: {
                country: '=?country',
                year: '=?year',
                month: '=?month',
                search: '=?search',
                count: '=?count'
            },


            link: function($scope, $element, $attr) {
                  $scope.currentPage =0;
                  if(!$attr.hidePagenation)
                      $scope.hidePagenation=false;
                  else
                      $scope.hidePagenation=$attr.hidePagenation;

                  if(!$attr.itemsPerPage)
                    $scope.itemsPerPage =5;
                  else
                    $scope.itemsPerPage =$attr.itemsPerPage;
                  $scope.prevDate = false;
            }, //link

            controller: ["$scope", function($scope) {
              $scope.$watch('year', function() {
                  search();
              });
              $scope.$watch('month', function() {
                  search();
              });
              $scope.$watch('country', function() {

                  search();
              });
              $scope.$watch('search', function() {
                  search();
              });
              $scope.$watch('currentPage', function() {
                  search();
              });

              $scope.getNumberPages = function() {
                  if($scope.count && $scope.itemsPerPage && ($scope.count > $scope.itemsPerPage))
                    return new Array(Math.floor($scope.count/$scope.itemsPerPage)+1);
                  else
                      return new Array(1);

              };

              $scope.changePage = function(index) {
                  $scope.prevDate=false;
                  $scope.currentPage=index;

              };
              $scope.isActive = function(index) {
                  return ($scope.currentPage===(index));

              };

              $scope.getCountryFlag = function(code) {
                  return 'https://www.cbd.int/images/flags/48/flag-'+code+'-48.png';

              };

              //=======================================================================
          		//
          		//=======================================================================
          		$scope.goTo= function (url,code){
                if(code)
          			   $location.url(url+code);
                else
                  $location.url(url);
          		};

              $scope.sectionTitle = function(date) {

                  return moment(date,moment.ISO_8601).format('MMMM YYYY');
              };
              $scope.showSection = function(date,index) {
                if(index===0)$scope.prevDate=false;

                  if(!$scope.prevDate || !(moment($scope.prevDate).isSame(date,'year') && moment($scope.prevDate).isSame(date,'month'))){
                    $scope.prevDate=date;
                    return true;
                  }else {
                    $scope.prevDate=date;
                    return false;
                  }


              };
              //=======================================================================
              //
              //=======================================================================
              function generateDateQuery() {
                var q,startD,endD,totalDaysInMonth = '';
                  $scope.prevDate=false;

                if(!$scope.year && $scope.month){
                  var year=2009;
                  q=' AND (';
                  for(var i=1; i<=12 ; i++){
                    year=year+1;
                    totalDaysInMonth= moment(year+'-'+$scope.month, "YYYY-MM").daysInMonth();
                    startD = moment('01-'+$scope.month+'-'+year,"DD-MM-YYYY").toISOString();
                    endD = moment(totalDaysInMonth+'-'+$scope.month+'-'+year, "DD-MM-YYYY").toISOString();
                    q+= ' startDate_dt:['+startD+' TO '+endD+']';
                    if(i!=12) q+=' OR';
                  }
                  q=q+')';
                } else

                if($scope.year && !$scope.month){
                  startD = moment('01-01-'+$scope.year,"DD-MM-YYYY").toISOString();
                  endD = moment('31-12-'+$scope.year, "DD-MM-YYYY").toISOString();
                   q= ' AND startDate_dt:['+startD+' TO '+endD+']';
                } else

                if($scope.year && $scope.month){
                  totalDaysInMonth= moment($scope.year+'-'+$scope.month, "YYYY-MM").daysInMonth();
                  startD = moment('01-'+$scope.month+'-'+$scope.year,"DD-MM-YYYY").toISOString();
                  endD = moment(totalDaysInMonth+'-'+$scope.month+'-'+$scope.year, "DD-MM-YYYY").toISOString();
                   q= ' AND startDate_dt:['+startD+' TO '+endD+']';
                }

                return q;
              }
              $scope.generateDateQuery = generateDateQuery;


              //=======================================================================
              //
              //=======================================================================
              function search() {
                var q = 'schema_s:undbAction';

                if($scope.search)
                    q= q+' AND (title_t:"' + $scope.search + '*" OR description_t:"' + $scope.search + '*")';
                if($scope.country)
                  q= q+' AND country_s:'+$scope.country;

                if($scope.year || $scope.month){
                  q = q+generateDateQuery();
                }

                var queryParameters = {
                  'q': q,
                  'wt': 'json',
                  'sort': 'startDate_dt desc, title_t asc',
                  'start': $scope.currentPage * $scope.itemsPerPage,
  								'rows': $scope.itemsPerPage,
                };
                  $http.get('https://api.cbd.int/api/v2013/index/select', {
                    params: queryParameters,
                    cache: true
                  }).success(function(data) {
                    $scope.count = data.response.numFound;
                    $scope.actions = data.response.docs;
                  });
              }
              $scope.trustSrc = search;

              $scope.extractId = function(id){                  ;
                  return parseInt(id.replace('52000000cbd08', ''), 16);
              }

            }],
        }; // return
    }]); //app.directive('searchFilterCountries

}); // define