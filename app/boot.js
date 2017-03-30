
require.config({
    waitSeconds: 120,
    baseUrl : 'app/',
    paths: {
        'angular'               : 'libs/angular-flex/angular-flex',
        'angular-route'         : 'libs/angular-route/angular-route',
        'angular-sanitize'      : 'libs/angular-sanitize/angular-sanitize.min',
        'authentication'        : 'factories/authentication',
        'bootstrap'             : 'libs/bootstrap/dist/js/bootstrap',
        'bootstrap-datepicker'  : 'libs/bootstrap-datepicker/dist/js/bootstrap-datepicker.min',
        'css'                   : 'libs/require-css/css.min',
        'lodash'                : 'libs/lodash/lodash',
        'linqjs'                : 'libs/linqjs/linq.min',
        'jquery'                : 'libs/jquery/dist/jquery',
        'guid'                  : 'libs/ui-guid-generator/dist/ui-guid-generator.min',
        'moment'                : 'libs/moment/min/moment.min',
        'moment-timezone'       : 'libs/moment-timezone/builds/moment-timezone-with-data-2010-2020.min',
        'ngCookies'             : 'libs/angular-cookies/angular-cookies.min',
        'ngSmoothScroll'        : 'libs/ngSmoothScroll/lib/angular-smooth-scroll',
        'shim'                  : 'libs/require-shim/src/shim',
        'text'                  : 'libs/requirejs-text/text',
        'toastr'                : 'libs/angular-toastr/dist/angular-toastr.tpls.min',
        'URIjs'                 : 'libs/uri.js/src',
        'ng-ckeditor'           : 'libs/ng-ckeditor/ng-ckeditor',
        'ckeditor'              : 'libs/ng-ckeditor/libs/ckeditor/ckeditor',
        'ngDialog'              : 'libs/ng-dialog/js/ngDialog.min',
        'ngInfiniteScroll'      : 'libs/ngInfiniteScroll/build/ng-infinite-scroll'
    },
    shim: {
        'libs/angular/angular'     : { deps: ['jquery'] },
        'angular'                  : { deps: ['libs/angular/angular'] },
        'angular-route'            : { deps: ['angular'] },
        'ngCookies'                : { deps : ['angular'] },
        'bootstrap'                : { deps: ['jquery'] },
        'bootstrap-datepicker'     : { deps: ['css!libs/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css'] },
        'ngSmoothScroll'           : { deps:[ 'angular']},
        'guid'                     : { exports: 'ui_guid_generator' },
        'toastr'                   : { deps: ['angular']},
        'angular-sanitize'         : { deps: ['angular'] },
        'ng-ckeditor'              : { deps: ['angular','ckeditor']},
        'ngDialog'                 : { deps : ['angular' ]},
    },
    packages: [
        { name: 'ammap', main: 'ammap', location : 'libs/ammap3/ammap' }
    ]
});

// BOOT
if (!require.defined('_slaask'))
    define("_slaask", window._slaask);
    
require(['angular', 'app', 'bootstrap', 'authentication', 'routes', 'template'], function(ng, app) {

    ng.element(document).ready(function () {
         ng.bootstrap(document, [app.name]);
    });
});

// Fix IE Console
(function(a){a.console||(a.console={});for(var c="log info warn error debug trace dir group groupCollapsed groupEnd time timeEnd profile profileEnd dirxml assert count markTimeline timeStamp clear".split(" "),d=function(){},b=0;b<c.length;b++)a.console[c[b]]||(a.console[c[b]]=d)})(window); //jshint ignore:line
