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

  });
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

router.route('/populateFleures')
  .post(function(req, res, next) {
    var cpt = 0;
    Zone.find()
      .exec(function(err, zones) {
        if (err) return next(err);
        Flore.find()
          .exec(function(err, flores) {
            if (err) return next(err);;
            zones.forEach(function(zone) {
              flores.forEach(function(flore) {
                if (parseInt(zone.properties.ID_MAPINFO) === parseInt(flore.talus_id)) {
                  if (!_.contains(zone.properties.flores, flore.id)) {
                    zone.properties.flores.push(flore.id);
                    zone.save(function(err, zoneSaved) {
                      cpt++
                      if (err) return next(err)
                    });
                  }
                }
              })
            })
            return res.status(200).send("Fleur ajouté au talus ok" + cpt + "Enregistrements");

          })
      })
  });


router.route('/unPopulateFleures')
  .post(function(req, res, next) {
    var cpt = 0;
    Zone.find()
      .exec(function(err, zones) {
        zones.forEach(function(zone) {
          if (zone.properties.flores) {
            //             function unique(arr) {
            //     return _.uniq(arr, JSON.stringify).length === arr.length;
            // }

            var arr2 = _.uniq(zone.properties.flores, function(item) {
              return JSON.stringify(item);
            });

            zone.properties.flores = arr2;
            zone.save(function(err, zoneSaved) {
              if (err) return next(err)
            });

          };
        })
        return res.status(200).send("UnpopulateOK");



      })
  });


router.route('/populateCommunes')
  .post(function(req, res, next) {
    var cpt = 0;
    Zone.find()
      .exec(function(err, zones) {
        if (err) return next(err);
        zones.forEach(function(zone) {
          Commune.find({
              geometry: {
                $geoIntersects: {
                  $geometry: zone.geometry
                }
              }
            })
            .exec(function(err, communes) {
              console.log(communes);
              if (err) return next(err);
              communes.forEach(function(commune) {
                //  if (_.contains(zone.properties.communes, commune.id)) {
                zone.properties.communes.push(commune.id);
                zone.save(function(err, zoneSaved) {
                  cpt++
                  if (err) return next(err)
                });
                //  }
              });

            });


        });
        return res.status(200).send("commune ajouté au talus ok -" + cpt + "Enregistrements");
      });

  });