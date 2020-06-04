'use strict'

var express = require('express');
var router = express.Router();

var training_server = require('./servers/training_services.js');
var contest_server = require('./servers/contest_services.js');
var jshelper = require('./servers/jshelper.js');
var user_server = require('./servers/user_services.js');


router.viewIndividualTraining = async function(req, res, next) {
    console.log('viewIndividualTraining called')
    var sess = req.session;
    var url = req.url
    console.log(req.url)
    console.log(url)
    var words = url.split("/");
    var user_name = words[words.length-3]
    var page_name = words[words.length-2]
    console.log(user_name)
    console.log(page_name)
    var param = {
        'username': user_name
    }
    var resp = await user_server.searchUser(res, req, param)
    var user_details = resp.user_list[0];
    var user_id = user_details.id

    var training_param = {}
    if(page_name == 'training-plan'){
        training_param['training_problems'] = true,
        training_param['training_categories'] = true
    }
    if(page_name == 'category-skill'){
        training_param['category_skill'] = true,
        training_param['root_category_skill'] = true
    }

    var training_data = await training_server.getIndividualTrainingModel(res, req, user_id, training_param)
    if(page_name == 'training-plan'){
        training_data['training-plan'] = true
    }
    if(page_name == 'category-skill'){
        training_data['category-skill'] = true
    }
    training_data['user_details'] = user_details
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
