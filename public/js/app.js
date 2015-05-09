'use strict';

var app = angular.module('demoapp', ['leaflet-directive']);

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

  function random(low, high) {
    return Math.random() * (high - low) + low;
  }

  function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
  }

  var minLat = 46.8256705653105;
  var maxLat = 46.8669985529976;
  var minLng = 6.59591674804687;
  var maxLng = 6.68003082275391;
  // Draw Control
  $scope.controls ={};

  $scope.controls.draw={};

  leafletData.getMap().then(function(map) {
    var drawnItems = $scope.controls.edit.featureGroup;
    map.on('draw:created', function(e) {
      var layer = e.layer;
      layer.feature.properties = { fleurs: "kikou"};
      drawnItems.addLayer(layer);
      console.log(JSON.stringify(layer.toGeoJSON()));
    });
  });


  var yverdon = {
    lat: 46.841759385352,
    lng: 6.64475440979004,
    zoom: 14
  };

  var flower = {



  };
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

  $scope.map = {};
  $scope.map.markers = [];
  $scope.map.center = {};
  $scope.map.center = yverdon;
  // <div ng-click='goDetail(issue.id)'><p>{{issue.description}}</p>

  // for (var i = 0; i < 80; i++) {

  //     $scope.map.markers.push({
  //     lng: random(minLng, maxLng),
  //     lat: random(minLat, maxLat),

  //     icon:flowers[randomInt(0, flowers.length)],
  //     draggable:true,
  //     message: '<div><p>Orchidaceae Neottia</p><img src="fleur8.jpg" width="100px"/></div>'

  //   });
  // }



});