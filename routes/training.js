'use strict'

var express = require('express');
var router = express.Router();
require('log-timestamp');

var team_server = require('./servers/team_services.js');
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
    var url = req.url
    var words = url.split("/");
    var team_id = words[words.length-3]
    var page_name = words[words.length-2]
    var training_param = {}
    var training_data = {}

    if(page_name == 'training-plan'){
        training_param['training_problems'] = true
        training_param['training_categories'] = true
        training_data = await training_server.getTeamTrainingModel(res, req, team_id, training_param)
        training_data['training-plan'] = true
    }
    if(page_name == 'category-skill'){
        training_param['category_skill'] = true,
        training_param['root_category_skill'] = true
        training_param['skill_comparison_info'] = true
        training_data = await training_server.getTeamTrainingModel(res, req, team_id, training_param)
        training_data['category-skill'] = true
    }
    if(page_name == 'contest'){
        
        training_data = await training_server.getTeamTrainingModel(res, req, team_id, training_param)

        var contest_list = await contest_server.getContestList(res, req, {"contest_ref_id": team_id});
        training_data['contest_list'] = contest_list['contest_list']

        training_data['contest'] = true
    }
    if(page_name == 'rating-comparison'){
        training_data = await training_server.getTeamTrainingModel(res, req, team_id, training_param)
        var team_cf_history = await team_server.teamRatingHistoryComparison(res, req, team_id, 'codeforces')
        training_data['codeforces_history'] = team_cf_history
        var team_cfs_history = await team_server.teamRatingHistoryComparison(res, req, team_id, 'codeflares')
        training_data['codeflares_history'] = team_cfs_history
        training_data['rating-comparison'] = true
    }

    console.log(training_data)
    console.log(req.session)
    res.render('team_training', training_data);
}

module.exports = router;
