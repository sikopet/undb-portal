define(['angular'], function(angular) { 'use strict';

    var deps = ['ngRoute'];

    angular.defineModules(deps);

    var app = angular.module('app', deps);

    app.value('realm', 'UNDB');

    app.config(['$httpProvider', function($httpProvider){

        $httpProvider.useApplyAsync(true);
        $httpProvider.interceptors.push('authenticationHttpIntercepter');
        $httpProvider.interceptors.push('realmHttpIntercepter');
        $httpProvider.interceptors.push('apiHttpIntercepter');
    }]);

    app.factory('apiHttpIntercepter', [function() {

		return {
			request: function(config) {

                if(/^\/api\//i.test(config.url))
                    config.url = "https://api.cbd.int"+config.url;

                return config;
			}
		};
	}]);

    app.factory('realmHttpIntercepter', ["realm", function(realm) {

		return {
			request: function(config) {
				var trusted = /^https:\/\/api.cbd.int\//i .test(config.url) ||
							  /^\/api\//i                 .test(config.url);

                //exception if the APi call needs to be done for different realm
                if(trusted && realm && config.params && config.params.realm && config.params.realm != realm) {
                      config.headers = angular.extend(config.headers || {}, { realm : config.params.realm });
                }
                else if(trusted && realm ) {
                    config.headers = angular.extend(config.headers || {}, { realm : realm });
                }

                return config;
			}
		};
	}]);

    return app;
});
