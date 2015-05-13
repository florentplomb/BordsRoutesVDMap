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
      .exec(function(err, flores) {
        if (err) return next(err);
        return res.status(200).send(flores)
      });

  })
router.route('/espece')
  .get(function(req, res, next) {
    Flore.find()
      .select('espece')
      .exec(function(err, flores) {
        if (err) return next(err);
        return res.status(200).send(flores)
      });

  })