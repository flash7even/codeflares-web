'use strict'

var express = require('express');
var config = require('../config');
var router = express.Router();
const axios = require('axios');
var team_search_url = config.server_host + 'team/search/'
var user_search_url = config.server_host + 'user/search/'
var team_submit_url = config.server_host + 'team/'


async function getTeamList(search_param) {
  console.log('getTeamList called');
  var page = 0
  var team_list = []
  while(1){
    var post_url = team_search_url + page.toString()
    console.log("post_url: " + post_url)
    let res = await axios.post(post_url, search_param);
    team_list = res.data
    page++
    break;
  }
  console.log('getTeamList done');
  return team_list
}


async function getUserList(search_param) {
  console.log('getUserList called');
  var page = 0
  var user_list = []
  while(1){
    var post_url = user_search_url + page.toString()
    console.log("post_url: " + post_url)
    let res = await axios.post(post_url, search_param);
    user_list = res.data
    page++
    break;
  }
  console.log('getUserList done');
  return user_list
}

async function postTeam(team_data) {
  var post_url = team_submit_url
  console.log("post_url: " + post_url)
  let res = await axios.post(post_url, team_data);
}

async function teamDetails(team_id, req) {
  console.log('teamDetails called')
  var sess = req.session;
  var access_token = sess.access_token
  const config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  var url = team_submit_url + team_id
  console.log("url: " + url)
  let res = await axios.get(url, {}, config);
  console.log('teamDetails done')
  return res.data
}

router.addTeamForm = async function(req, res, next) {
  let user_list = await getUserList({});
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
  await postTeam(team)
  let team_list = await getTeamList({});
  res.render('view_team_list', team_list);
}

router.viewTeamList = async function(req, res, next) {
  let team_list = await getTeamList({});
  console.log(team_list)
  res.render('view_team_list', team_list);
}

router.viewTeam = async function(req, res, next) {
  var url = req.url
  console.log(req.url)
  console.log(url)
  var words = url.split("/");
  var team_id = words[words.length-1]
  console.log(team_id)

  var team_details = await teamDetails(team_id, req)
  console.log(team_details)
  res.render('team_profile', team_details);
}

module.exports = router;

