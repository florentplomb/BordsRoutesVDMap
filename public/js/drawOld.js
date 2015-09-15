'use strict';

var drawApp = angular.module('draw', ['leaflet-directive', 'angucomplete-alt', 'ngDialog']);

var apiUrl = "http://localhost:3000/api";
//var apiUrl = "http://florentplomb.ch/api";
//var apiUrl = "http://fleurs-vd.herokuapp.com/api";

var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});
drawApp.controller('DrawCtrl', function($scope, $filter, leafletData, ngDialog, tags, FloreService, DrawService, ZonesService) {
  var yverdon = {
    lat: 46.841759385352,
    lng: 6.64475440979004,
    zoom: 10
  };

  var defaultStyle = {
    color: "#c5128a", // #02a6a6 //#ff7e61 //#d87c50 //#256aa6
    weight: 6,
    opacity: 0.8,

    fillColor: "blue"
  };
  var highlightStyle = {
    color: '#1072ac',
  };

  tags.data = [];

  $scope.layers = {};
  $scope.map = {};
  $scope.geojson = null;
  $scope.infoZone = {};
  $scope.events = {};
  $scope.communesName = [];
  $scope.especesName = [];
  $scope.map = {};
  $scope.map.markers = [];
  $scope.map.center = {};
  $scope.map.center = yverdon;
  $scope.controls = {};
  $scope.controls.draw = {

    polyline: {
      shapeOptions: {
        color: 'red',
        opacity: 1
      },
    }
  };
  $scope.selectespecesName = "";
  $scope.newZone = {};
  // url MapBox
  var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + "fplomb.685fc191";
  mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + "pk.eyJ1IjoiZnBsb21iIiwiYSI6ImJwRUF2ZlkifQ.OIuXY-qgnEBzcnYwXg8imw";


  leafletData.getMap().then(function(map) {

    $scope.layers = {
      baselayers: {
        osm: {
          name: 'OpenStreetMap',
          url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          type: 'xyz'
        }
      }
    }

  });

  $scope.test = function() {

    if (!$scope.geojson) {

      $scope.geojson = {};
      var cbZones = function(error, zones) {
        if (error) {
          $scope.error = error;
        }
        $scope.geojson.data = zones;

        leafletData.getMap().then(function(map) {

          $scope.layerzones = L.geoJson($scope.geojson.data, {
            style: function(feature) {
              return feature.properties.style;
            },
            onEachFeature: function(feature, layer) {

              layer.setStyle(defaultStyle);
              layer.on("mouseover", function(e) {

                // Change the style to the highlighted version
                layer.setStyle(highlightStyle);
                // Create a popup with a unique ID linked to this record
              });
              layer.on("mouseout", function(e) {
                // Change the style to the highlighted version
                layer.setStyle(defaultStyle);
                // Create a popup with a unique ID linked to this record
              });


            }
          }).addTo(map);


        });



      }

      ZonesService.get(cbZones);
    } else {

      leafletData.getMap().then(function(map) {

        map.removeLayer($scope.layerzones);
      });
      console.log("msm");
      $scope.geojson = null;
    }

  }



  FloreService.getEspece(function(error, especes) {
    if (error) {
      $scope.error = error;
    }
    // var tab = [];
    //     angular.forEach(especes, function(esp, key) {

    //       if (!_.contains(tab, esp.espece)) {
    //         tab.push(esp.espece);
    //         $scope.especesName.push(esp);
    //       }

    //     })

    var tab = [];
    angular.forEach(especes, function(esp, key) {
      if (!_.contains(tab, esp.espece)) {
        tab.push(esp.espece);
        $scope.especesName.push(esp);
      }
    })
  });
  leafletData.getMap().then(function(map) {
    var drawnItems = $scope.controls.edit.featureGroup;

    map.on('draw:created', function(e) {
      var layer = e.layer;
      drawnItems.addLayer(layer);

      $scope.newZone = layer.toGeoJSON();
      DrawService.postZone(function(error, communeName) {
        if (error) {
          $scope.error = error;
        }
        $scope.communeName = [];
        angular.forEach(communeName, function(name, key) {
          $scope.communeName.push(name);
        })
        ngDialog.open({
          template: 'pop.html',
          scope: $scope
        });
      }, layer.toGeoJSON());
    });
  });

  $scope.storeZone = function() {
    var newCom = [];
    angular.forEach($scope.communeName, function(com, key) {
      newCom.push(com._id);
    })
    var fleurs = [];
    angular.forEach(tags.data, function(fleur, key) {
      fleurs.push(fleur._id);
    })
    $scope.newZone.properties.communes = newCom;
    $scope.newZone.properties.flores = fleurs;

    var cb = function(err, zoneSaved) {
      //   console.log("Saved : "+zoneSaved);
      location.reload();



    }
    console.log($scope.newZone);
    ZonesService.post(cb, $scope.newZone);


  }
});


drawApp.controller('TagsController', function($scope, $rootScope, tags, $log) {

  $scope.tags = tags;

  $scope.deleteTag = function(index) {
    tags.data.splice(index, 1);
  }

  $scope.addTag = function(index) {

    tags.data.push(
      $scope.selectFlores.originalObject
    );
    $scope.selectFlores = "";
  }
});

drawApp.factory("tags", function() {
  var tags = {};
  tags.data = [];
  return tags;
});

drawApp.factory("ZonesService", function($http) {

  var config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return {
    post: function(callback, newZone) {
      $http.post(apiUrl + "/zones", {
        "zone": newZone,
      }, config).success(function(data) {
        var zone = data;
        callback(null, zone);
      }).error(function(error) {
        callback(error);
      });
    }
  };
});

drawApp.factory("FloreService", function($http) {

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


drawApp.factory("DrawService", function($http) {

  var config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  return {
    postZone: function(callback, zone) {
      $http.post("http://localhost:3000/draw/locZone", {
        "zone": zone
      }, config).success(function(data) {

        callback(null, data);
      }).error(function(error) {
        callback(error);
      });
    }
  };
});

drawApp.factory("ZonesService", function($http) {

  var config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return {
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