'use strict'

var express = require('express');
var router = express.Router();


router.viewIndividualTraining = function(req, res, next) {
    res.render('individual_training', {});
}

module.exports = router;
