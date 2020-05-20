'use strict'

var express = require('express');
var router = express.Router();

var training_server = require('./servers/training_services.js');
var contest_server = require('./servers/contest_services.js');
var jshelper = require('./servers/jshelper.js');


router.viewIndividualTraining = async function(req, res, next) {
    var sess = req.session;
    var training_data = await training_server.getIndividualTrainingModel(res, req, sess.user_id)

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
    var sess = req.session;
    var user_details = await training_server.getUserDetails(res, req, sess.user_id)
    var team_id = user_details.settings.current_team_id

    var training_data = await training_server.getTeamTrainingModel(res, req, team_id)

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

    var contest_list = await contest_server.getContestList(res, req, {"contest_ref_id": team_id});
    training_data['contest_list'] = contest_list['contest_list']

    res.render('team_training', training_data);
}

module.exports = router;
