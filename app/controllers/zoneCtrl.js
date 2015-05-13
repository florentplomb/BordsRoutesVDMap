var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Zone = mongoose.model('Zone'),
  Flore = mongoose.model('Flore'),
  _ = require('underscore');

module.exports = function(app) {
  app.use('/api/zones', router);
};

router.route('/')
  .get(function(req, res, next) {
    Zone.find()
      .populate("properties.flores")
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

router.route('/populate')
  .get(function(req, res, next) {
    Zone.find()
      .exec(function(err, zones) {
        if (err) return next(err);
        Flore.find()
          .exec(function(err, flores) {
            zones.forEach(function(zone) {
              flores.forEach(function(flore) {
                if (parseInt(zone.properties.ID_MAPINFO) === parseInt(flore.talus_id)) {
                  zone.properties.flores.push(flore.id);
                }
              })
              zone.save(function(err, zoneSaved) {});
            })
            return res.status(200).send("Fleur ajouté au talus ok");

          })
      })
  });