'use strict'

var express = require('express');
var config = require('../config');
var router = express.Router();
const axios = require('axios');
var team_search_url = config.server_host + 'team/search/'
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

async function postTeam(team_data) {
  var post_url = team_submit_url
  console.log("post_url: " + post_url)
  let res = await axios.post(post_url, team_data);
}

router.addTeamForm = function(req, res, next) {
  res.render('add_team', {});
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
  var team = req.body
  team['team_type'] = 'team';
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

router.viewTeamListAfterFormSubmit = async function(req, res, next) {
  let team_list = await getTeamList(req.body);
  res.render('view_team_list', team_list);
}

module.exports = router;
