define(['angular','text-angular-setup','text-angular','text-angular-sanitize'], function(angular) { 'use strict';

    var deps = ['ngRoute','smoothScroll','textAngularSetup','ngSanitize','textAngular','toastr','ngCkeditor'];

    angular.defineModules(deps);

    var app = angular.module('app', deps);

    app.value('realm', 'CHM');

    app.config(['$httpProvider', function($httpProvider){

        $httpProvider.useApplyAsync(true);
        $httpProvider.interceptors.push('authenticationHttpIntercepter');
        $httpProvider.interceptors.push('realmHttpIntercepter');
    }]);
    app.config(['$provide', function($provide){
  	         // this demonstrates how to register a new tool and add it to the default toolbar
  	         $provide.decorator('taOptions', ['$delegate', function(taOptions){
  	             // $delegate is the taOptions we are decorating
  	             // here we override the default toolbars and classes specified in taOptions.
  	             taOptions.forceTextAngularSanitize = true; // set false to allow the textAngular-sanitize provider to be replaced
  	             taOptions.keyMappings = []; // allow customizable keyMappings for specialized key boards or languages
  	             taOptions.toolbar = [
  	                 ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
  	                 ['bold', 'italics', 'underline', 'ul', 'ol', 'redo', 'undo', 'clear'],
  	                 ['justifyLeft','justifyCenter','justifyRight', 'justifyFull'],
  	                 ['html', 'insertImage', 'insertLink', 'wordcount', 'charcount']
  	             ];
  	             taOptions.classes = {
  	                 focussed: 'focussed',
  	                 toolbar: 'btn-toolbar',
  	                 toolbarGroup: 'btn-group',
  	                 toolbarButton: 'btn btn-default',
  	                 toolbarButtonActive: 'active',
  	                 disabled: 'disabled',
  	                 textEditor: 'form-control',
  	                 htmlEditor: 'form-control'
  	             };
  	             return taOptions; // whatever you return will be the taOptions
  	         }]);
  }]);

  app.config(['toastrConfig',function(toastrConfig) {
    angular.extend(toastrConfig, {
      autoDismiss: true,
      containerId: 'toast-container',
      newestOnTop: true,
      closeButton: true,
      positionClass: 'toast-top-right',
      iconClasses: {
        error: 'toast-error',
        info: 'toast-info',
        success: 'toast-success',
        warning: 'toast-warning'
      },
      target: 'body',
      timeOut: 5000,
      progressBar: true,
    });

  }]);

    app.factory('realmHttpIntercepter', ["realm", function(realm) {

		return {
			request: function(config) {
				var trusted = /^http:\/\/localhost\//i .test(config.url)||
                              /^https:\/\/api.cbd.int\//i .test(config.url) ||
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
