'use strict'

var express = require('express');
var config = require('../config');
var router = express.Router();
const axios = require('axios');

var team_server = require('./servers/team_services.js');
var follower_server = require('./servers/follower_services.js');
var jshelper = require('./servers/jshelper.js');


router.addTeamForm = async function(req, res, next) {
  let user_list = await team_server.getUserList(res, req, {});
  console.log(user_list)
  res.render('add_team', user_list);
}

router.updateTeamForm = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var team_id = words[words.length-2]
  let user_list = await team_server.getUserList(res, req, {});
  var team_details = await team_server.teamDetails(res, req, team_id)
  team_details['user_list'] = user_list['user_list']
  console.log(team_details)
  res.render('update_team', team_details);
}

router.updateTeamFormSubmit = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var team_id = words[words.length-2]
  var team = req.body
  team = update_team_data(team)
  await team_server.updateTeam(res, req, team_id, team)
  jshelper.sleep(1000);
  res.redirect('/training/team/');
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
  await team_server.postTeam(res, req, team)
  jshelper.sleep(1000);
  res.redirect('/team/list/');
}

router.viewTeamList = async function(req, res, next) {
  var sess = req.session;
  let team_list = await team_server.getTeamList(res, req, sess.username, {"team_type": "team"});
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
  var team_details = await team_server.teamDetails(res, req, team_id)
  var team_cf_history = await team_server.teamCodeforcesHistory(res, req, team_id)
  console.log(team_cf_history)
  team_details['codeforces_history'] = team_cf_history
  var sess = req.session;
  if(sess.user_id){
      var follow_status = await follower_server.followStatus(res, req, team_id)
      if(follow_status.status == 'following'){
        team_details['following'] = true;
      }else{
        team_details['unfollowing'] = true;
      }
  }
  if(sess.user_id == team_details.team_leader_id){
    team_details['own_profile'] = true;
  }
  console.log(team_details)
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
  await team_server.updtateTeam(res, req, data)
  jshelper.sleep(1000);
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
  await team_server.updtateTeam(res, req, data)
  jshelper.sleep(1000);
  res.redirect('/team/list/');
}

router.deleteTeam = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var team_id = words[words.length-2]
  await team_server.deleteTeam(res, req, team_id)
  jshelper.sleep(1000);
  res.redirect('/team/list/');
}


router.syncTeamData = async function(req, res, next) {
  console.log('syncUserData')
  var url = req.url
  console.log(url)
  var words = url.split("/");
  var team_id = words[words.length-2]
  var response = await team_server.syncTeam(res, req, team_id);
  var sess = req.session;
  res.redirect('back');
}

module.exports = router;

