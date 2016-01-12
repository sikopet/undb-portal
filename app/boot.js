
require.config({
    waitSeconds: 120,
    baseUrl : 'app/',
    paths: {
        'authentication'   : 'services/authentication',
        'angular'          : 'libs/angular-flex/angular-flex',
        'angular-route'    : 'libs/angular-route/angular-route',
        'text'             : 'libs/requirejs-text/text',
        'bootstrap'        : 'libs/bootstrap/dist/js/bootstrap',
        'lodash'           : 'libs/lodash/lodash',
        'jquery'           : 'libs/jquery/dist/jquery',
        'ammap3WorldHigh'     : 'directives/map/worldEUHigh',
        'ammap3'              : 'libs/ammap3/ammap/ammap',
        'ammap-theme'         : 'libs/ammap3/ammap/themes/light',
        'ammap-resp'          : 'libs/ammap3/ammap/plugins/responsive/responsive',
        'ammap-export'        : 'libs/ammap3/ammap/plugins/export/export.min',
        'ammap-ex-fabric'     : 'libs/ammap3/ammap/plugins/export/libs/fabric.js/fabric.min',
        'ammap-ex-filesaver'  : 'libs/ammap3/ammap/plugins/export/libs/FileSaver.js/FileSaver.min',
        'ammap-ex-pdfmake'    : 'libs/ammap3/ammap/plugins/export/libs/pdfmake/pdfmake.min',
        'ammap-ex-vfs-fonts'  : 'libs/ammap3/ammap/plugins/export/libs/pdfmake/vfs_fonts',
        'ammap-ex-jszip'      : 'libs/ammap3/ammap/plugins/export/libs/jszip/jszip.min',
        'ammap-ex-xlsx'       : 'libs/ammap3/ammap/plugins/export/libs/xlsx/xlsx.min',
    },
    shim: {
        'libs/angular/angular'     : { deps: ['jquery'] },
        'angular'                  : { deps: ['libs/angular/angular'] },
        'angular-route'            : { deps: ['angular'] },
        'bootstrap'                : { deps: ['jquery'] }
    },
});

// BOOT

require(['angular', 'app', 'bootstrap', 'authentication', 'routes', 'template'], function(ng, app) {

    ng.element(document).ready(function () {
         ng.bootstrap(document, [app.name]);
    });
});

// Fix IE Console
(function(a){a.console||(a.console={});for(var c="log info warn error debug trace dir group groupCollapsed groupEnd time timeEnd profile profileEnd dirxml assert count markTimeline timeStamp clear".split(" "),d=function(){},b=0;b<c.length;b++)a.console[c[b]]||(a.console[c[b]]=d)})(window); //jshint ignore:line
