'use strict';

var app = angular.module('app', ['leaflet-directive', 'angucomplete', ]);
var apiUrl = "http://localhost:3000/api";
//var apiUrl = "http://127.0.0.1:27017/api";

var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});

app.controller('MapCtrl', function($scope, $filter, leafletData, ZonesService, CommunesService, FloreService) {

  var zonesTalus = [];
  $scope.zones = {};

  var yverdon = {
    lat: 46.841759385352,
    lng: 6.64475440979004,
    zoom: 14
  };



  $scope.layers = {};
  $scope.geojson = {};
  $scope.geojson.data = [];

  $scope.communesName = [];
  $scope.especesName = [];
  $scope.map = {};
  $scope.map.markers = [];
  $scope.map.center = {};
  $scope.map.center = yverdon;


  $scope.map.layers = {
    baselayers: {

      osm: {
        name: 'OpenStreetMap',
        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        type: 'xyz'
      },
      cloudmade: {
        name: 'Cloudmade Tourist',
        type: 'xyz',
        url: 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
        layerParams: {
          key: '007b9471b4c74da4a6ec7ff43552b16f',
          styleId: 7
        }
      }

    }
  }


  // Center map on commune selected
  $scope.$watch(function() {
    return $scope.selectcommunesName;
  }, function(newValue, oldValue) {
    if ($scope.selectcommunesName) {


      CommunesService.getCenter(function(error, infoCommunes) {
        if (error) {
          $scope.error = error;
        }

        $scope.infoCommunes = infoCommunes;
        $scope.map.center = {
          lng: infoCommunes.center.coordinates[0],
          lat: infoCommunes.center.coordinates[1],
          zoom: 14
        };

      }, $scope.selectcommunesName.title)

    };
  });

  $scope.$watch(function() {
    return $scope.selectespecesName;
  }, function(newValue, oldValue) {
    if ($scope.selectespecesName) {

      var selecFleur = $scope.selectespecesName.originalObject.espece
      var zonesFiltree = $filter('filter')($scope.zones, function(zones) {
      var tabFleure = zones.properties.flores;
      var validate = false;

        angular.forEach(tabFleure, function(item, key) {
          if (item.espece == selecFleur) {
            validate = true;
          };
        })

        return validate;
      });

      console.log(zonesFiltree);

      $scope.geojson.data = {
        "type": "FeatureCollection",
        "features": zonesFiltree
      };


    };
  });



  // Autocomplete communes

  CommunesService.getName(function(error, communesName) {
    if (error) {
      $scope.error = error;
    }

    angular.forEach(communesName, function(item, key) {

      $scope.communesName.push(item.properties);
    })


  });

  FloreService.getEspece(function(error, especes) {
    if (error) {
      $scope.error = error;
    }

    // $scope.especesName = especes;
    var tab = [];
    angular.forEach(especes, function(esp, key) {

      if (!_.contains(tab, esp.espece)) {
        tab.push(esp.espece);
        $scope.especesName.push(esp);
      }

    })



  });

  // Display commune

  var callback = function(error, zones) {
    if (error) {
      $scope.error = error;
    }
    $scope.zones = zones;
    zonesTalus = zones;

    // console.log(zonesFiltree);


    $scope.geojson.data = {
      "type": "FeatureCollection",
      "features": zones
    };

    // leafletData.getMap().then(function(map) {

    //   var layerZone = L.geoJson(zonesTalus, {
    //     style: function(feature) {
    //       return feature.properties.style;
    //     },
    //     onEachFeature: function(feature, layer) {
    //       layer.bindPopup(feature.properties.COMMUNE + " Id: " + feature.properties.ID_MAPINFO);
    //     }
    //   })

    //   map.addLayer(layerZone);

    // });
  }

  ZonesService.get(callback);

  // var mapboxTileLayer = 'http://api.tiles.mapbox.com/v4/' + 'cleliapanchaud.kajpf86n';
  // mapboxTileLayer = mapboxTileLayer + '/{z}/{x}/{y}.png?access_token=' + 'pk.eyJ1IjoiY2xlbGlhcGFuY2hhdWQiLCJhIjoiM2hMOEVXYyJ9.olp7FrLzmzSadE07IY8OMQ';
  // $scope.mapDefaults = {
  //   tileLayer: mapboxTileLayer
  // };


});

app.factory("FloreService", function($http) {

  var config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return {
    getEspece: function(callback) {
      $http.get(apiUrl + "/flores/espece", config).success(function(data) {
        var zone = data;
        callback(null, zone);
      }).error(function(error) {
        callback(error);
      });
    }
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

app.factory("CommunesService", function($http) {

  var config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return {
    getName: function(callback) {
      $http.get(apiUrl + "/communes/name", config).success(function(data) {
        var zone = data;
        callback(null, zone);
      }).error(function(error) {
        callback(error);
      });
    },
    getCenter: function(callback, name) {
      $http.get(apiUrl + "/communes/center?name=" + name, config).success(function(data) {
        var infoCommunes = data;
        callback(null, infoCommunes);
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

//    L.geoJson(zonesTalus).addTo(map);

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