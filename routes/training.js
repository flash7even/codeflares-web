'use strict'

var express = require('express');
var config = require('../config');
var router = express.Router();
const axios = require('axios');
var individual_training_url = config.server_host + 'training/individual'
var team_training_url = config.server_host + 'training/team/'

async function getIndividualTrainingModel() {
    console.log('getIndividualTrainingModel called');
    console.log("post_url: " + individual_training_url)
    let res = await axios.get(individual_training_url);
    console.log('getIndividualTrainingModel done');
    return res.data
}

async function getTeamTrainingModel(team_id) {
    var url = team_training_url + team_id
    let res = await axios.get(url);
    console.log('getTeamTrainingModel done');
    return res.data
}


router.viewIndividualTraining = async function(req, res, next) {
    var training_data = await getIndividualTrainingModel()

    var len, idx;

    len = training_data['problem_stat'].length
    for(idx = 1;idx<=len;idx++){
        training_data['problem_stat'][idx-1]['idx'] = idx;
    }

    len = training_data['category_stat'].length
    for(idx = 1;idx<=len;idx++){
        training_data['category_stat'][idx-1]['idx'] = idx;
    }

    len = training_data['category_skill_list'].length
    for(idx = 1;idx<=len;idx++){
        training_data['category_skill_list'][idx-1]['idx'] = idx;
    }

    res.render('individual_training', training_data);
}


router.viewTeamTraining = async function(req, res, next) {
    var team_id = "pxfAynEBDdZ5mbgHtL56"
    var training_data = await getTeamTrainingModel(team_id)

    console.log(training_data)

    var len, idx;

    len = training_data['problem_stat'].length
    for(idx = 1;idx<=len;idx++){
        training_data['problem_stat'][idx-1]['idx'] = idx;
    }

    len = training_data['category_stat'].length
    for(idx = 1;idx<=len;idx++){
        training_data['category_stat'][idx-1]['idx'] = idx;
    }

    len = training_data['category_skill_list'].length
    for(idx = 1;idx<=len;idx++){
        training_data['category_skill_list'][idx-1]['idx'] = idx;
    }

    res.render('team_training', training_data);
}

module.exports = router;
