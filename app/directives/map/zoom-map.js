define(['text!./zoom-map.html', 'app', 'lodash',
    'ammap',
    'shim!./worldEUHigh[ammap]',
    'shim!ammap/themes/light[ammap]',
], function(template, app, _) {
  'use strict';

  app.directive('zoomTo', [ function() {
    return {
      restrict: 'EAC',
      template: template,
      replace: true,
      require:  '^zoomTo',
      scope: {
        zoomTo: '=zoomTo',
      },
      link: function($scope, $element, $attr, zoomTo) {



        $scope.$watch('zoomTo', function() {
          zoomTo();
        }); //

        initMap();
        zoomTo.writeMap();


        //=======================================================================
        //
        //=======================================================================
        function zoomTo() {
          if ($scope.zoomTo[0])
            $scope.map.clickMapObject(zoomTo.getMapObject($scope.zoomTo));
        } //$scope.legendHide



        $scope.images = [{
          "label": "EU",
          "latitude": -5.02,
          "longitude": -167.66
        }];
        //=======================================================================
        //
        //=======================================================================
        function initMap() {
          $scope.mapData = {
            "type": "map",
            "theme": "light",
            "responsive": {
              "enabled": true
            },

            "dataProvider": {
              "map": "worldEUHigh",
              "getAreasFromMap": true,

            },

            "areasSettings": {
              "autoZoom": true,
              "selectedColor": "#000000",
              "rollOverColor": "#423f3f",
              "selectable": true,
              "color": "#428bca",
            },
            "smallMap": {

              "rectangleColor": '#069554',
              "backgroundAlpha": 0.5,
              "mapColor": '#069554',

            },
            "zoomControl": {
              "left": 28,
            },
            "export": {
              "libs": {
                "autoLoad": false
              },
              "enabled": true,
              "position": "bottom-right"
            },


          }; //
          $scope.mapData.images = _.clone($scope.images);
        } //$scope.initMap
        //not working


      }, //link
      //////controller
      controller: ["$scope", function($scope) {


        //=======================================================================
        //
        //=======================================================================
        function generateMap(schema) {


          if (!schema) return;
          if (schema === 'parties')
            progressColorMap(partiesMap);
          else
            pinMap(defaultPinMap);
        } //$scope.legendHide


        //=======================================================================
        //
        //=======================================================================
        function writeMap(mapData) {

          if (!mapData) mapData = getMapData();
          $scope.map = AmCharts.makeChart("mapdiv", mapData); //jshint ignore:line
          $scope.map.write("mapdiv");

        } // writeMap

        //=======================================================================
        //
        //=======================================================================
        function progressColorMap(mapTypeFunction) {

          hideAreas();
          $scope.legendTitle = ""; // rest legend title
          buildProgressBaloonParties({
            'code': 'GL'
          });
          _.each($scope.items, function(country) {

            if (!_.isEmpty(country.docs))
              _.each(country.docs, function(schema) {
                if (mapTypeFunction) mapTypeFunction(country, schema, $scope.schema);
              });
            else mapTypeFunction(country);
          });
          $scope.map.validateData(); // updates map with color changes
        } //progressColorMap


        // //=======================================================================
        // //
        // //=======================================================================
        function changeAreaColor(id, color, area) {
          if (!area)
            area = getMapObject(id);
          area.colorReal = area.originalColor = color;

          if (id === 'DK') {
            var area2 = getMapObject('GL');
            area2.colorReal = area.colorReal;
            area2.originalColor = area.originalColor;
          }

        } //getMapObject



        //=======================================================================
        //
        //=======================================================================
        function getMapData() {

          return $scope.mapData;
        }

        // //=======================================================================
        // // changes color of all un colored areas
        // //=======================================================================
        function hideAreas(color) {
          // Walkthrough areas
          if (!color) color = '#dddddd';
          _.each($scope.map.dataProvider.areas, function(area) {
            if (area.id !== 'divider1') {
              area.colorReal = area.originalColor = color;
              area.mouseEnabled = true;
              area.balloonText = '[[title]]';
            }
          });
        } //hideAreas(color)

        // //=======================================================================
        // //
        // //=======================================================================
        function getMapObject(id) {

          var index = _.findIndex($scope.map.dataProvider.areas, function(area) {
            return area.id === id;
          });
          return $scope.map.dataProvider.areas[index];
        } //getMapObject


        this.getMapObject = getMapObject;
        this.getMapObject = getMapObject;
        this.writeMap = writeMap;
        this.getMapData = getMapData;
        this.generateMap = generateMap;
        this.progressColorMap = progressColorMap;
      }],
    }; // return
  }]); //app.directive('searchFilterCountries
}); // define
