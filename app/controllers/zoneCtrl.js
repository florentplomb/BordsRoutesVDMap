var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Zone = mongoose.model('Zone'),
  Flore = mongoose.model('Flore'),
  Commune = mongoose.model('Commune'),
  _ = require('underscore');

module.exports = function(app) {
  app.use('/api/zones', router);
};

router.route('/')
  .get(function(req, res, next) {
    Zone.find()
      .populate("properties.flores")
      .populate({
        path: 'properties.communes',
        select: 'properties.NAME -_id',
      })
      .exec(function(err, zones) {
        if (err) return next(err);

        return res.status(200).json(zones)
      });

  })
  .post(function(req, res, next) {
    if (!req.body.zone) return res.status(400).json({
      message: 'bad request'
    }).end();

    var id = 0;
    Zone.findOne().sort('-properties.ID_MAPINFO').exec(function(err, item) {
      console.log(item.properties.ID_MAPINFO);
      id = item.properties.ID_MAPINFO + 1;

      if (id <= 0) {
        return res.status(400).json({
          message: 'error id <= 0'
        }).end();
      }
      var geom = {};
      var coordinates = [];
      coordinates.push(req.body.zone.geometry.coordinates);
       geom.type ="MultiLineString";
       geom.coordinates = coordinates;

      console.log(coordinates);

      var newZone = new Zone();

      newZone.properties = req.body.zone.properties;
      newZone.properties.ID_MAPINFO = id;
      newZone.geometry = geom;

      newZone.type = "Feature";

      console.log(newZone.geometry);

      newZone.save(function(err, zoneSaved) {
        if (err) return validationError(res, err);


        return res.status(400).json(zoneSaved).end();


      });
    });
  })

router.route('/:id')
  .get(function(req, res, next) {
    Zone.findById(req.params.id)
      .select("properties.communes.properties")
      .populate("properties.flores properties.communes")
      .exec(function(err, zones) {
        if (err) return next(err);
        return res.status(200).json(zones)
      });

  });

router.route('/info')
  .get(function(req, res, next) {
    Zone.find()
      .select("properties")
      .populate("properties.flores")
      .exec(function(err, zones) {
        if (err) return next(err);
        return res.status(200).json(zones)
      });

  });


///// Script d'ajout de fleurs pour chaque zone ///////////

// router.route('/populateFleures')
//   .post(function(req, res, next) {
//     var cpt = 0;
//     Zone.find()
//       .exec(function(err, zones) {
//         if (err) return next(err);
//         Flore.find()
//           .exec(function(err, flores) {
//             if (err) return next(err);;
//             zones.forEach(function(zone) {
//               flores.forEach(function(flore) {
//                 if (parseInt(zone.properties.ID_MAPINFO) === parseInt(flore.talus_id)) {
//                   if (!_.contains(zone.properties.flores, flore.id)) {
//                     zone.properties.flores.push(flore.id);
//                     zone.save(function(err, zoneSaved) {
//                       cpt++
//                       if (err) return next(err)
//                     });
//                   }
//                 }
//               })
//             })
//             return res.status(200).send("Fleur ajouté au talus ok" + cpt + "Enregistrements");

//           })
//       })
//   });


// router.route('/unPopulateFleures')
//   .post(function(req, res, next) {
//     var cpt = 0;
//     Zone.find()
//       .exec(function(err, zones) {
//         zones.forEach(function(zone) {
//           if (zone.properties.flores) {
//             //             function unique(arr) {
//             //     return _.uniq(arr, JSON.stringify).length === arr.length;
//             // }

//             var arr2 = _.uniq(zone.properties.flores, function(item) {
//               return JSON.stringify(item);
//             });

//             zone.properties.flores = arr2;
//             zone.save(function(err, zoneSaved) {
//               if (err) return next(err)
//             });

//           };
//         })
//         return res.status(200).send("UnpopulateOK");



//       })
//   });

///// Script d'ajout de commune pour chaque zone ///////////
// router.route('/populateCommunes')
//   .post(function(req, res, next) {
//     var cpt = 0;
//     Zone.find()
//       .exec(function(err, zones) {
//         if (err) return next(err);
//         zones.forEach(function(zone) {
//           Commune.find({
//               geometry: {
//                 $geoIntersects: {
//                   $geometry: zone.geometry
//                 }
//               }
//             })
//             .exec(function(err, communes) {
//               console.log(communes);
//               if (err) return next(err);
//               communes.forEach(function(commune) {
//                 //  if (_.contains(zone.properties.communes, commune.id)) {
//                 zone.properties.communes.push(commune.id);
//                 zone.save(function(err, zoneSaved) {
//                   cpt++
//                   if (err) return next(err)
//                 });
//                 //  }
//               });

//             });
//         });
//         return res.status(200).send("commune ajouté au talus ok -" + cpt + "Enregistrements");
//       });

//   });