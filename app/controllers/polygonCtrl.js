var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Polygon = mongoose.model('Polygon'),
  _ = require('underscore');

module.exports = function(app) {
  app.use('/api/polygon', router);

};

router.route("/")
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
  })
