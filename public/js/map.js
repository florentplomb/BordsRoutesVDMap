'use strict';

var app = angular.module('demoapp', ['leaflet-directive']);
var apiUrl = "http://localhost:3000/";
// app.config(function($routeProvider) {
//   $routeProvider
//     .when('/main', {
//       templateUrl: 'views/main.html'

//     })
//     .otherwise({
//       redirectTo: '/'
//     });

// });


app.controller('DemoController', function($scope, leafletData) {


  var minLat = 46.8256705653105;
  var maxLat = 46.8669985529976;
  var minLng = 6.59591674804687;
  var maxLng = 6.68003082275391;

  // var geojsonFeature = [{
  //   "type": "Feature",
  //   "properties": {
  //     "name": "Coors Field",
  //     "amenity": "Baseball Stadium",
  //     "popupContent": "This is where the Rockies play!"
  //   },
  //   "geometry": {
  //     "type": "LineString",
  //     "coordinates": [
  //       [6.4070892333984375, 46.74127228017599],
  //       [6.555747985839844, 46.70832343808085]
  //     ]
  //   },
  //   "type": "Feature",
  //   "properties": {
  //     "name": "Coors Field",
  //     "amenity": "Baseball Stadium",
  //     "popupContent": "This is where the Rockies play!"
  //   },
  //   "geometry": {
  //     "type": "LineString",
  //     "coordinates": [
  //       [6.580724716186523, 46.845868895404266],
  //       [6.656942367553711, 46.85578913117971]
  //     ]

  //   }
  // }];

  var geojsonFeature = [{
    "type": "Feature",
    "properties": {
      "name": "Coors Field",
      "amenity": "Baseball Stadium",
      "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [6.580724716186523, 46.845868895404266],
        [6.656942367553711, 46.85578913117971]
      ]
    }
  },{
    "type": "Feature",
    "properties": {
      "name": "Coors Field",
      "amenity": "Baseball Stadium",
      "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [6.599693298339844, 46.812279116429416],
        [6.676168441772461, 46.80663961382989],
        [6.656341552734374, 46.801998329639225]
      ]

    },

  }];

  // Draw Control
  $scope.controls = {};

  $scope.controls.draw = {};

  leafletData.getMap().then(function(map) {
    var drawnItems = $scope.controls.edit.featureGroup;

    L.geoJson(geojsonFeature).addTo(map);

    map.on('draw:created', function(e) {
      var layer = e.layer;

      drawnItems.addLayer(layer);
      var newZone = {};
      newZone.proprietes = {};
      newZone.proprietes.test = {};


      var newZone = JSON.stringify(layer.toGeoJSON());
      var json = JSON.parse(newZone);
      console.log(json.type);






      // var callback = function(error, zoneSaved) {
      //   if (error) {
      //     $scope.error = error;
      //   }
      //   console.log(zoneSaved);

      //   ZoneService.post(callback, newZone);
      // };


    });
  });


  var yverdon = {
    lat: 46.841759385352,
    lng: 6.64475440979004,
    zoom: 14
  };

  $scope.map = {};
  $scope.map.markers = [];
  $scope.map.center = {};
  $scope.map.center = yverdon;


  $scope.paths = {
    example: {
      type: "polyline",
      latlngs: [{
        lng: 6.59591674804687,
        lat: 46.8256705653105
      }, {
        lng: 6.79591674804687,
        lat: 46.83,
      }, {
        lng: 6.59591674804687,
        lat: 46.9256705653105,
      }]
    }
  }


  //var flowers = [flower, flower1, flower2, flower3, flower4];

  var mapboxTileLayer = 'http://api.tiles.mapbox.com/v4/' + 'cleliapanchaud.kajpf86n';

  mapboxTileLayer = mapboxTileLayer + '/{z}/{x}/{y}.png?access_token=' + 'pk.eyJ1IjoiY2xlbGlhcGFuY2hhdWQiLCJhIjoiM2hMOEVXYyJ9.olp7FrLzmzSadE07IY8OMQ';
  $scope.mapDefaults = {
    tileLayer: mapboxTileLayer
  };


});



// app.factory("ZoneService", function($http, apiUrl) {
//     return {
//       post: function(callback, newZone) {
//         $http.post(apiUrl + "/zones", {
//           "type": newZone.type,
//           "proprietes": newZone.proprietes,
//           "loc": newZone.geometry,
//         }).success(function(data) {
//           zone = data;
//           callback(null, zone);
//         }).error(function(error) {
//           callback(error);
//         });
//       }

//     });