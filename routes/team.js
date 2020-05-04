'use strict'

var express = require('express');
var config = require('../config');
var router = express.Router();
const axios = require('axios');
var team_search_url = config.server_host + 'team/search/user/'
var user_search_url = config.server_host + 'user/search/'
var team_submit_url = config.server_host + 'team/'
var team_cf_history_url = config.server_host + 'team/rating-history/'




//----------------- Call to the server -------------------//

async function getTeamList(res, req, username, search_param) {
  console.log('getTeamList called');
  var post_url = team_search_url + username
  console.log("post_url: " + post_url)
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  let response = await axios.post(post_url, search_param, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })

  if(response.status != 200 && response.status != 201){
      res.render('error_page', {});
  }
  console.log('getTeamList done');
  return response.data
}

async function getUserList(res, req, search_param) {
  console.log('getUserList called');
  var page = 0
  var user_list = []
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  while(1){
    var post_url = user_search_url + page.toString()
    console.log("post_url: " + post_url)
    let response = await axios.post(post_url, search_param, auth_config)
    .catch(error => {
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    user_list = response.data
    page++
    break;
  }
  console.log('getUserList done');
  return user_list
}

async function postTeam(res, req, team_data) {
  var post_url = team_submit_url
  console.log("post_url: " + post_url)
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  let response = await axios.post(post_url, team_data, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })

  if(response.status != 200 && response.status != 201){
      res.render('error_page', {});
  }
  return response.data
}

async function deleteTeam(res, req, team_id) {
  var url = team_submit_url + team_id
  console.log("url: " + url)
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  let response = await axios.delete(url, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })

  if(response.status != 200 && response.status != 201){
      res.render('error_page', {});
  }
  return response.data
}

async function updtateTeam(res, req, team_data) {
  var url = team_submit_url + 'member' + '/'
  console.log("post_url: " + url)
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  let response = await axios.put(url, team_data, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })

  if(response.status != 200 && response.status != 201){
      res.render('error_page', {});
  }
  return response.data
}

async function teamDetails(res, req, team_id) {
  console.log('teamDetails called')
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  var url = team_submit_url + team_id
  console.log("url: " + url)
  let response = await axios.get(url, {}, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })

  if(response.status != 200 && response.status != 201){
      res.render('error_page', {});
  }
  console.log('teamDetails done')
  return response.data
}

async function teamCodeforcesHistory(res, req, team_id) {
  console.log('teamDetails called')
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  var url = team_cf_history_url + team_id + '/codeforces'
  console.log("url: " + url)
  let response = await axios.get(url, {}, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })

  if(response.status != 200 && response.status != 201){
      res.render('error_page', {});
  }
  console.log('teamDetails done')
  return response.data
}











//----------------- Routes -------------------//


router.addTeamForm = async function(req, res, next) {
  let user_list = await getUserList(res, req, {});
  console.log(user_list)
  res.render('add_team', user_list);
}

function update_team_data(team){
  var data = {}
  var user_handle = "user_handle"
  var remarks = "remarks"
  var member_list = []
  for (var key in team) {
    console.log(key + " -> " + team[key]);
    if(key.startsWith(user_handle)){
        var res = key.split('@')
        if (res.length == 2){
          var id = res[1];
          var dependecy_val = remarks + "@" + id;
          var edge = {
            "user_handle": team[key],
            "remarks": team[dependecy_val],
          }
          member_list.push(edge);
      }
    }else if(key.startsWith(remarks)){
      continue;
    }else{
      data[key] = team[key]
    }
  }
  data['member_list'] = member_list
  return data
}

router.addTeamFormSubmit = async function(req, res, next) {
  console.log('addTeamFormSubmit called')
  var team = req.body
  team['team_type'] = 'team';
  console.log(team)
  team = update_team_data(team)
  await postTeam(res, req, team)
  res.redirect('/team/list/');
}

router.viewTeamList = async function(req, res, next) {
  var sess = req.session;
  let team_list = await getTeamList(res, req, sess.username, {});
  team_list['logged_in_user_id'] = sess.user_id
  console.log(team_list)
  res.render('view_team_list', team_list);
}

router.viewTeam = async function(req, res, next) {
  var url = req.url
  console.log(req.url)
  console.log(url)
  var words = url.split("/");
  var team_id = words[words.length-2]
  console.log(team_id)

  var team_details = await teamDetails(res, req, team_id)
  console.log(team_details)

  var team_cf_history = await teamCodeforcesHistory(res, req, team_id)
  console.log(team_cf_history)

  team_details['codeforces_history'] = team_cf_history

  res.render('team_profile', team_details);
}

router.confirmTeam = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var team_id = words[words.length-2]
  var sess = req.session;
  var data = {
    "team_id": team_id,
    "user_handle": sess.username,
    "status": "confirmed"
  }
  await updtateTeam(res, req, data)
  res.redirect('/team/list/');
}

router.rejectTeam = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var team_id = words[words.length-2]
  var sess = req.session;
  var data = {
    "team_id": team_id,
    "user_handle": sess.username,
    "status": "rejected"
  }
  await updtateTeam(res, req, data)
  res.redirect('/team/list/');
}

router.deleteTeam = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var team_id = words[words.length-2]
  await deleteTeam(res, req, team_id)
  res.redirect('/team/list/');
}

module.exports = router;
