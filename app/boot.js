window.name = 'NG_DEFER_BOOTSTRAP!';

require.config({
    waitSeconds: 120,
    baseUrl : 'app/',
    paths: {
        'authentication'   : 'services/authentication',
        'angular'          : 'libs/angular-flex/angular-flex',
        'angular-route'    : 'libs/angular-route/angular-route',
        'domReady'         : 'libs/requirejs-domready/domReady',
        'text'             : 'libs/requirejs-text/text',
        'bootstrap'        : 'libs/bootstrap/dist/js/bootstrap',
        'lodash'           : 'libs/lodash/lodash',
        'jquery'           : 'libs/jquery/dist/jquery'
    },
    shim: {
        'libs/angular/angular'     : { deps: ['jquery'] },
        'angular'                  : { deps: ['libs/angular/angular'] },
        'angular-route'            : { deps: ['angular'] },
        'bootstrap'                : { deps: ['jquery'] }
    },
});

// BOOT

require(['angular', 'domReady!', 'bootstrap', 'app', 'routes', 'template'], function(ng, doc) {

    ng.bootstrap(doc, ['app']);
    ng.resumeBootstrap();
});
