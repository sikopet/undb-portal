define(['app', 'angular', 'authentication'], function() { 'use strict';

	return ['$scope', '$http','user', function ($scope, $http, user) {

        var qsParams =
        {
            "q"  : 'schema_s:undbPartner AND _state_s:public',
            "fl" : "identifier_s, title_t, description_t,website_s,logo_s",
            "sort"  : "updatedDate_dt desc",
            "start" : 0,
            "row"   : 1000,
        };

        $http.get('https://api.cbd.int/api/v2013/index', { params : qsParams }).then(function(res) {
            $scope.partners = res.data.response.docs;
        });


        if(user.isAuthenticated) {
            //TODO CHECK USER ALREADY A PARTNER and disbale subscribe button
        }
    }];
});
