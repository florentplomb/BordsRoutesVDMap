'use strict';

var app = angular.module('app', ['leaflet-directive']);
var apiUrl = "http://localhost:3000/api";

app.controller('MapCtrl', function($scope, $http, leafletData, ZonesService) {

  var geojsonFeature = [];
  var yverdon = {
    lat: 46.841759385352,
    lng: 6.64475440979004,
    zoom: 14
  };

  $scope.map = {};
  $scope.geojson = {};
  $scope.geojson.data = [];

  $scope.map.markers = [];
  $scope.map.center = {};
  $scope.map.center = yverdon;

  var callback = function(error, zones) {
    if (error) {
      $scope.error = error;
    }
    geojsonFeature = zones;

    // $scope.geojson.data = { "type": "FeatureCollection",
    //            "features": zones};


    leafletData.getMap().then(function(map) {

      map.addLayer(L.geoJson(geojsonFeature, {
        style: function(feature) {
          return feature.properties.style;
        },
        onEachFeature: function(feature, layer) {
          layer.bindPopup(feature.properties.COMMUNE);
        }
      }));

    });
  }

ZonesService.get(callback);

  var mapboxTileLayer = 'http://api.tiles.mapbox.com/v4/' + 'cleliapanchaud.kajpf86n';
  mapboxTileLayer = mapboxTileLayer + '/{z}/{x}/{y}.png?access_token=' + 'pk.eyJ1IjoiY2xlbGlhcGFuY2hhdWQiLCJhIjoiM2hMOEVXYyJ9.olp7FrLzmzSadE07IY8OMQ';
  $scope.mapDefaults = {
    tileLayer: mapboxTileLayer
  };
});

app.factory("ZonesService", function($http) {

  var config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return {
    post: function(callback, newZone) {
      $http.post(apiUrl + "/zones", {
        "type": newZone.type,
        "proprietes": newZone.proprietes,
        "loc": newZone.geometry,
      }, config).success(function(data) {
        zone = data;
        callback(null, zone);
      }).error(function(error) {
        callback(error);
      });
    },
    get: function(callback) {
      $http.get(apiUrl + "/zones", config).success(function(data) {
        var zone = data;
        callback(null, zone);
      }).error(function(error) {
        callback(error);
      });
    }
  };
});



/////////////////////////////////////////
////////// Draw Control ////////////////
////////////////////////////////////////
//  $scope.controls = {};

//  $scope.controls.draw = {};

//  leafletData.getMap().then(function(map) {
//    var drawnItems = $scope.controls.edit.featureGroup;

//    L.geoJson(geojsonFeature).addTo(map);

//    map.on('draw:created', function(e) {
//      var layer = e.layer;

//      drawnItems.addLayer(layer);
// //


//      var newZone = layer.toGeoJSON();
//      newZone.properties.commune = "Les clees";
//      console.log(newZone);
//       console.log(newZone.type);
//      console.log(newZone.properties);

//     console.log(JSON.stringify(newZone));

//      // var callback = function(error, zoneSaved) {
//      //   if (error) {
//      //     $scope.error = error;
//      //   }
//      //   console.log(zoneSaved);
//      //       }
//   ZoneService.post(callback, newZone);
// };
//    });
//  });