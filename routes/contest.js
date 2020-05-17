'use strict'

var express = require('express');
var config = require('../config');
var router = express.Router();

var jshelper = require('./servers/jshelper.js');


router.addContestForm = function(req, res, next) {
  res.render('add_contest', {});
}

module.exports = router;