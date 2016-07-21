define(['app', 'angular', 'authentication'], function() { 'use strict';

	return ['$scope', '$http','user', '$location', function ($scope, $http, user, $location) {

        var qsParams =
        {
            "q"  : 'schema_s:undbPartner AND _state_s:public',
            "fl" : "id,identifier_s, title_t, description_t,website_s,logo_s",
            "sort"  : "updatedDate_dt desc",
            "start" : 0,
            "row"   : 1000,
        };

        $http.get('https://api.cbd.int/api/v2013/index', { params : qsParams }).then(function(res) {
            $scope.partners = res.data.response.docs;
        });

		$scope.goTo= function (url,code){
			if(code)
				$location.url(url + parseInt(code.replace('52000000cbd08', ''), 16));
		};

        if(user.isAuthenticated) {
            //TODO CHECK USER ALREADY A PARTNER and disbale subscribe button
        }
    }];
});
