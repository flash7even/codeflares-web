'use strict'

var express = require('express');
var config = require('../config');
var router = express.Router();
const axios = require('axios');
var individual_training_url = config.server_host + 'training/individual'
var team_training_url = config.server_host + 'training/team/'
var user_details_url = config.server_host + 'user/'





//----------------- Call to the server -------------------//

async function getUserDetails(res, req, user_id) {
  console.log('getUserDetails called');
  var url = user_details_url + user_id
  console.log("url: " + url)
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  let response = await axios.get(url, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })

  if(response.status != 200 && response.status != 201){
      res.render('error_page', {});
  }
  console.log('getUserDetails done');
  return response.data
}

async function getIndividualTrainingModel(res, req, user_id) {
    console.log('getIndividualTrainingModel called');
    var url = individual_training_url + '/' + user_id
    var sess = req.session;
    var access_token = sess.access_token
    const auth_config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    let response = await axios.get(url, auth_config)
    .catch(error => {
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    console.log('getIndividualTrainingModel done');
    return response.data
}

async function getTeamTrainingModel(res, req, team_id) {
    var url = team_training_url + team_id
    var sess = req.session;
    var access_token = sess.access_token
    const auth_config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    let response = await axios.get(url, auth_config)
    .catch(error => {
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    console.log('getTeamTrainingModel done');
    return response.data
}











//----------------- Routes -------------------//



router.viewIndividualTraining = async function(req, res, next) {
    var sess = req.session;
    var training_data = await getIndividualTrainingModel(res, req, sess.user_id)

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
    var user_details = await getUserDetails(res, req, sess.user_id)
    var team_id = user_details.settings.current_team_id

    var training_data = await getTeamTrainingModel(res, req, team_id)

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
