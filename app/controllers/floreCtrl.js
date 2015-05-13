var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Flore = mongoose.model('Flore'),
  _ = require('underscore');

module.exports = function(app) {
  app.use('/api/flores', router);
};


router.route('/')
  .get(function(req, res, next) {
    Flore.find()
      .exec(function(err, zones) {
        if (err) return next(err);

        console.log(zones[0]);

        var flores = [];
        zones.forEach(function(zone) {

          var parse = {};
          parse.id = parseInt(zone.talus_id);
          parse.espece = zone.espece;
          parse.esepce_def = zone.espece_def;
          parse.NO_SISF_DEF = parseInt(zone.NO_SISF_DEF);
          flores.push(parse);

        });


        return res.status(200).send(flores)


      });

  })