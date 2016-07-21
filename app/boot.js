
require.config({
    waitSeconds: 120,
    baseUrl : 'app/',
    paths: {
        'angular'               : 'libs/angular-flex/angular-flex',
        'angular-route'         : 'libs/angular-route/angular-route',
        'authentication'        : 'factories/authentication',
        'bootstrap'             : 'libs/bootstrap/dist/js/bootstrap',
        'bootstrap-datepicker'  : 'libs/bootstrap-datepicker/dist/js/bootstrap-datepicker.min',
        'css'                   : 'libs/require-css/css.min',
        'lodash'                : 'libs/lodash/lodash',
        'linqjs'                : 'libs/linqjs/linq.min',
        'jquery'                : 'libs/jquery/dist/jquery',
        'guid'                  : 'libs/ui-guid-generator/dist/ui-guid-generator.min',
        'moment'                : 'libs/moment/moment',
        'ngSmoothScroll'        : 'libs/ngSmoothScroll/lib/angular-smooth-scroll',
        'shim'                  : 'libs/require-shim/src/shim',
        'text'                  : 'libs/requirejs-text/text',
        'rangy-core'            :'libs/rangy/rangy-core',
        'rangy-saveselection'   :'libs/rangy/rangy-selectionsaverestore',
        'text-angular-rangy'    : 'libs/textAngular/dist/textAngular-rangy.min',
        'text-angular-setup'    : 'libs/textAngular/dist/textAngularSetup',
        'text-angular'          : 'libs/textAngular/dist/textAngular',
        'text-angular-sanitize' : 'libs/textAngular/dist/textAngular-sanitize',
        'toastr'                : 'libs/angular-toastr/dist/angular-toastr.tpls.min',
        'URIjs'                 : 'libs/uri.js/src',
        'ng-ckeditor'              :'libs/ng-ckeditor/ng-ckeditor',
        'ckeditor':'libs/ng-ckeditor/libs/ckeditor/ckeditor'
    },
    shim: {
        'libs/angular/angular'     : { deps: ['jquery'] },
        'angular'                  : { deps: ['libs/angular/angular'] },
        'angular-route'            : { deps: ['angular'] },
        'bootstrap'                : { deps: ['jquery'] },
        'bootstrap-datepicker'     : { deps: ['css!libs/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css'] },
        'ngSmoothScroll'           : { deps:[ 'angular']},
        'guid'                     : { exports: 'ui_guid_generator' },
        'rangy-core'               : { deps: ['jquery']},
        'text-angular-rangy'       : { deps: ['angular']},
        'text-angular-setup'       : { deps: ['angular','text-angular-rangy' ]},
        'text-angular-sanitize'    : { deps: ['angular']},
        'text-angular'             : { deps: ['angular','css!libs/textAngular/dist/textAngular.css','rangy-core','rangy-saveselection','text-angular-rangy','text-angular-setup','text-angular-sanitize'] },
        'toastr'                   : { deps: ['angular']},
        'ng-ckeditor'                   : { deps: ['angular','ckeditor']}
    },
    packages: [
        { name: 'ammap', main: 'ammap', location : 'libs/ammap3/ammap' }
    ]
});

// BOOT

require(['angular', 'app', 'bootstrap', 'authentication', 'routes', 'template'], function(ng, app) {

    ng.element(document).ready(function () {
         ng.bootstrap(document, [app.name]);
    });
});

// Fix IE Console
(function(a){a.console||(a.console={});for(var c="log info warn error debug trace dir group groupCollapsed groupEnd time timeEnd profile profileEnd dirxml assert count markTimeline timeStamp clear".split(" "),d=function(){},b=0;b<c.length;b++)a.console[c[b]]||(a.console[c[b]]=d)})(window); //jshint ignore:line
