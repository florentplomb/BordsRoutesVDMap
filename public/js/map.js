'use strict';

var app = angular.module('app', ['leaflet-directive', 'angucomplete']);
var apiUrl = "http://localhost:3000/api";

app.controller('MapCtrl', function($scope, $filter, leafletData, ZonesService, CommunesService,FloreService) {

  var zonesTalus = [];

  var yverdon = {
    lat: 46.841759385352,
    lng: 6.64475440979004,
    zoom: 14
  };



  $scope.layers = {};
  // $scope.geojson = {};
  // $scope.geojson.data = [];

  $scope.communesName = [];
  $scope.especesName = [];
  $scope.map = {};
  $scope.map.markers = [];
  $scope.map.center = {};
  $scope.map.center = yverdon;

  $scope.map.layers = {
    baselayers: {
      googleTerrain: {
        name: 'Google Terrain',
        layerType: 'TERRAIN',
        type: 'google'
      },
      googleHybrid: {
        name: 'Google Hybrid',
        layerType: 'HYBRID',
        type: 'google'
      },
      googleRoadmap: {
        name: 'Google Streets',
        layerType: 'ROADMAP',
        type: 'google'
      }
    }
  }


  // Center map on commune selected
  $scope.$watch(function() {
    return $scope.selectcommunesName;
  }, function(newValue, oldValue) {
    if ($scope.selectcommunesName) {
    //  console.log($scope.selectcommunesName.title);

      CommunesService.getCenter(function(error, infoCommunes) {
        if (error) {
          $scope.error = error;
        }
       // console.log(infoCommunes);
        $scope.infoCommunes = infoCommunes;
        $scope.map.center = {
          lng: infoCommunes.center.coordinates[0],
          lat: infoCommunes.center.coordinates[1],
          zoom: 14
        };

      }, $scope.selectcommunesName.title)

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

    angular.forEach(especes, function(item, key) {


      $scope.especesName.push(item);

    })


  });

  // Display commune

  var callback = function(error, zones) {
    if (error) {
      $scope.error = error;
    }
    zonesTalus = zones;

    var selecFleur = "Centaurea jacea";
    var zonesFiltree = $filter('filter')(zones, function(zones) {

      var tabFleure = zones.properties.flores;
      var validate = false;
      angular.forEach(tabFleure, function(item, key) {
        if (item.espece == selecFleur) {
          validate = true;
        };
      })
      return validate;
    });
   // console.log(zonesFiltree);


    // $scope.geojson.data = { "type": "FeatureCollection",
    //            "features": zones};

    leafletData.getMap().then(function(map) {
      map.addLayer(L.geoJson(zonesTalus, {
        style: function(feature) {
          return feature.properties.style;
        },
        onEachFeature: function(feature, layer) {
          layer.bindPopup(feature.properties.COMMUNE + " Id: " + feature.properties.ID_MAPINFO);
        }
      }));

    });
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