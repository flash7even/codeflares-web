'use strict'

var express = require('express');
var config = require('../config');
var router = express.Router();
const axios = require('axios');
var individual_training_url = config.server_host + 'training/individual'

async function getIndividualTrainingModel() {
    console.log('getIndividualTrainingModel called');
    console.log("post_url: " + individual_training_url)
    let res = await axios.get(individual_training_url);
    console.log('getIndividualTrainingModel done');
    return res.data
}


router.viewIndividualTraining = async function(req, res, next) {
    var training_data = await getIndividualTrainingModel()
    console.log(training_data)
    res.render('individual_training', training_data);
}

module.exports = router;
