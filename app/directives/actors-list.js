define(['text!./actors-list.html', 'app','moment-timezone','filters/trunc','filters/hack','factories/km-utilities','directives/actor' ], function(template, app,moment) {
    'use strict';

    app.directive('actorsList', ['$http','$location','locale',  function($http,$location,locale) {
        return {
            restrict: 'E',
            template: template,
            replace: false,
            require:'actorsList',
            scope: {
              country:'=?'
            },

            //=======================================================================
            //
            //=======================================================================
            link: function($scope, $element, $attr,ctrl) {
                  $scope.loadingC=true;


                  $scope.$watch('country', function(newValue, oldValue) {

                    if(newValue!==oldValue || (newValue && newValue.length === 2))
                      ctrl.search();
                  });

                  $http.get('/api/v2015/countries', { cache:true, params: { f : { code : 1, name : 1 } } }).then(function(res) {

                      res.data.forEach(function(c) {
                          c.code = c.code.toLowerCase();
                          c.name = c.name[locale];
                      });
                      $scope.countries = res.data;
                      $scope.loadingC=false;
                  });

                  if ($attr.hideSearch)
                    $scope.hideSearch = true;
                  else {
                    $scope.hideSearch = false;
                  }

                  $scope.currentPage = 0;

                  if ($attr.partnersOnly)
                      $scope.partnersOnly = true;

                  if ($attr.blgOnly)
                      $scope.blgOnly = true;

                  if ($attr.jlgOnly)
                      $scope.jlgOnly = true;

                  if ($attr.abttfOnly)
                      $scope.abttfOnly = true;

                  if ($attr.coalitionsOnly)
                      $scope.coalitionsOnly = true;

                  if ($attr.hidePagenation)
                      $scope.hidePagenation = true;

                  // if($attr.country)
                  //   $scope.country=$attr.country;
                  if ($attr.itemsPerPage)
                      $scope.itemsPerPage = $attr.itemsPerPage;

                  if (!$attr.startEmpty || typeof possiblyUndefinedVariable === "undefined"){
                    $scope.startEmpty=false;
                    ctrl.search();

                  }else
                      $scope.startEmpty=true;

            }, //link


            //=======================================================================
            //
            //=======================================================================
            controller: ['$scope','$timeout', function($scope,$timeout) {

              $scope.search='';
              $timeout(function(){

                $scope.$watch('search', function(newValue, oldValue) {
                  if(newValue!==oldValue)
                    search();
                });
                $scope.$watch('currentPage', function(newValue, oldValue) {
                    if(newValue!==oldValue)
                      search();
                });
              },1000);


              //=======================================================================
          		//
          		//=======================================================================
              $scope.getNumberPages = function() {

                  if($scope.count && $scope.itemsPerPage && ($scope.count > $scope.itemsPerPage))
                      return new Array(Math.floor($scope.count/$scope.itemsPerPage)+1);
                  else
                      return new Array(1);

              };


              //=======================================================================
          		//
          		//=======================================================================
              $scope.changePage = function(index) {
                  $scope.prevDate=false;
                  $scope.currentPage=index;

              };


              //=======================================================================
          		//
          		//=======================================================================
              $scope.isActive = function(index) {
                  return ($scope.currentPage===(index));

              };


              //=======================================================================
          		//
          		//=======================================================================
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


              //=======================================================================
          		//
          		//=======================================================================
              $scope.sectionTitle = function(date) {

                  return moment(date,moment.ISO_8601).format('MMMM YYYY');
              };


              //=======================================================================
          		//
          		//=======================================================================
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
              function search() {

                var q = 'schema_s:undbActor AND _state_s:public';
                $scope.loading=true;
                //
                // if($scope.coalitionsOnly)
                //     q= q+' AND description_t:(coalitionscoalitions*)';
                //
                if($scope.blgOnly)
                    q= q+' AND thematicArea_ss:CBD-SUBJECT-LIAISON-GROUP';
                //
                if($scope.jlgOnly)
                    q= q+' AND thematicArea_ss:CBD-SUBJECT-JLG';
                //
                if($scope.abttfOnly)
                    q= q+' AND thematicArea_ss:CBD-SUBJECT-AICHI-TF';
                //
                // if($scope.partnersOnly)
                //   q= q+' AND NOT description_t:(blgblg*) AND NOT description_t:(ABTTF*) AND NOT description_t:(jlgjlg*)';
                if($scope.search)
                    q= q+' AND (title_t:"' + $scope.search + '*" OR description_t:"' + $scope.search + '*")';
                if($scope.country)
                  q= q+' AND country_s:'+$scope.country;//+$scope.country;


                var queryParameters = {
                  'q': q,
                  'wt': 'json',
                  'fl': 'id,identifier_s,logo*,description*, nativeDescription*,title*,thematicArea_ss,references_ss,references_C_ss',
                  'sort': 'title_s asc',
                  'start': $scope.currentPage * $scope.itemsPerPage,
  								'rows': $scope.itemsPerPage,
                };

                  $http.get('/api/v2013/index/select', {
                    params: queryParameters,
                    cache: true
                  }).then(function(res) {
                    if (!res.data) throw 'Error: no data';
                    $scope.count = res.data.response.numFound;
                    $scope.partners = res.data.response.docs;

                    $scope.loading = false;
                  });
              }
              this.search = search;


          		//=======================================================================
          		//
          		//=======================================================================
          		$scope.clearSearch = function() {
          				$scope.search='';
          				$scope.searchYear='';
          				$scope.searchMonth='';
          				$scope.searchCountry='';
          		};
            }],
        }; // return
    }]); //app.directive('searchFilterCountries

}); // define
