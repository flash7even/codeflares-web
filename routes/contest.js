'use strict'

var express = require('express');
var config = require('../config');
var router = express.Router();
require('log-timestamp');

var jshelper = require('./servers/jshelper.js');
var team_server = require('./servers/team_services.js');
var classroom_server = require('./servers/classroom_services.js');
var contest_server = require('./servers/contest_services.js');
var system_server = require('./servers/system_services.js');


router.addContestForm = async function(req, res, next) {
  console.log('addContestForm called')
  await system_server.verifyAccessRole(req, res, 'contestant')
  var sess = req.session;
  var team_data = await team_server.getTeamList(res, req, sess.username, {"team_type": "team"})
  var classroom_data = await classroom_server.getClassroomList(res, req, sess.username, {"team_type": "classroom"})
  var user_data = {
    'team_list': team_data['team_list'],
    'classroom_list': classroom_data['team_list'],
  }
  res.render('add_contest', user_data);
}

function update_contest_data(contest){
  console.log('update_contest_data called')
  var data = {}
  var category_name = "category_name"
  var param_list = []
  for (var key in contest) {
    if(key.startsWith(category_name)){
        var res = key.split('@')
        if (res.length == 2){
          var id = res[1];
          var cat_param = {
            "category_name": contest[key],
            "minimum_difficulty": parseFloat(contest['minimum_difficulty' + "@" + id]),
            "maximum_difficulty": parseFloat(contest['maximum_difficulty' + "@" + id]),
            "minimum_problem": parseInt(contest['minimum_problem' + "@" + id]),
            "maximum_problem": parseInt(contest['maximum_problem' + "@" + id])
          }
          param_list.push(cat_param);
      }
    }
  }
  data['contest_name'] = contest['contest_name']
  data['contest_access'] = contest['contest_access']
  data['contest_type'] = contest['contest_type']
  data['start_date'] = contest['start_date']
  data['end_date'] = contest['end_date']
  data['contest_ref_id'] = contest['contest_ref_id']
  data['description'] = contest['description']
  data['setter_id'] = contest['setter_id']
  data['contest_level'] = parseInt(contest['contest_level'])
  data['problem_count'] = parseInt(contest['problem_count'])
  data['param_list'] = param_list
  return data
}

function update_confirmed_problem_set(contest_data){
  console.log('update_confirmed_problem_set called')
  var problem_name = "problem_name"
  var problem_list = []
  for (var key in contest_data) {
    if(key.startsWith(problem_name)){
        var res = key.split('@')
        if (res.length == 2){
          var id = res[1];
          var pdata = {
            "problem_name": contest_data[key],
            "oj_name": contest_data['oj_name' + "@" + id],
            "problem_id": contest_data['problem_id' + "@" + id]
          }
          problem_list.push(pdata);
      }
    }
  }
  var data = {
    "problem_list": problem_list
  }
  return data
}

router.addContestFormSubmit = async function(req, res, next) {
  console.log('addContestFormSubmit called')
  await system_server.verifyAccessRole(req, res, 'contestant')
  var sess = req.session;
  var contest_data = req.body;
  contest_data['setter_id'] = sess.user_id
  contest_data = update_contest_data(contest_data)
  var contest_id = await contest_server.postContest(res, req, contest_data)
  jshelper.sleep(2000)
  var contest_details = await contest_server.getContestDetails(res, req, contest_id);
  res.render('view_contest_confirmation', contest_details);
}

router.confirmContestFormSubmit = async function(req, res, next) {
  console.log('confirmContestFormSubmit called')
  await system_server.verifyAccessRole(req, res, 'contestant')
  var url = req.url
  var words = url.split("/");
  var contest_id = words[words.length-2]
  var sess = req.session;
  var contest_data = req.body;
  contest_data = update_confirmed_problem_set(contest_data)
  contest_data['status'] = 'confirmed'
  await contest_server.updateContest(res, req, contest_id, contest_data)
  system_server.add_toast(req, 'Contest created successfully')
  res.redirect('/contest/view/' + contest_id + '/')
}

router.viewContest = async function(req, res, next) {
  console.log('viewContest called')
  var url = req.url
  var words = url.split("/");
  var contest_id = words[words.length-2]
  var contest_details = await contest_server.getContestDetails(res, req, contest_id);
  contest_details = system_server.toast_update(req, contest_details)
  contest_details['problem-set-page'] = true
  res.render('view_single_contest', contest_details);
}

router.viewContestStandings = async function(req, res, next) {
  console.log('viewContestStandings called')
  var url = req.url
  var words = url.split("/");
  var contest_id = words[words.length-2]
  var contest_details = await contest_server.getContestDetails(res, req, contest_id);
  var contest_standings = await contest_server.getContestStandings(res, req, contest_id);
  contest_details['standings'] = contest_standings['standings']
  contest_details = system_server.toast_update(req, contest_details)
  contest_details['standings-page'] = true
  res.render('view_single_contest', contest_details);
}

router.viewContestStandingsAfterUpdate = async function(req, res, next) {
  console.log('viewContestStandingsAfterUpdate called')
  var url = req.url
  var words = url.split("/");
  var contest_id = words[words.length-2]
  var sess = req.session;
  var user_id = sess.user_id
  var include_friends = req.body.include_friends
  var contest_details = await contest_server.getContestDetails(res, req, contest_id);
  var contest_standings;

  if(include_friends == "checked"){
    contest_standings = await contest_server.getContestStandingsForUser(res, req, contest_id, user_id);
    contest_details['include_friends_checked'] = true
  }else{
    contest_standings = await contest_server.getContestStandings(res, req, contest_id);
  }
  contest_details['standings'] = contest_standings['standings']
  contest_details = system_server.toast_update(req, contest_details)
  contest_details['standings-page'] = true
  res.render('view_single_contest', contest_details);
}

router.viewContestAnnouncements = async function(req, res, next) {
  console.log('viewContestAnnouncements called')
  var url = req.url
  var words = url.split("/");
  var contest_id = words[words.length-2]
  var contest_details = await contest_server.getContestDetails(res, req, contest_id);
  var announcement_data = await contest_server.getAnnouncements(res, req, contest_id);
  contest_details['announcement_list'] = announcement_data.announcement_list
  contest_details = system_server.toast_update(req, contest_details)
  contest_details['announcement-page'] = true
  res.render('view_single_contest', contest_details);
}

router.addContestAnnouncementSubmit = async function(req, res, next) {
  console.log('addContestAnnouncementSubmit called')
  await system_server.verifyAccessRole(req, res, 'contestant')
  var url = req.url
  var words = url.split("/");
  var contest_id = words[words.length-2]
  var data = req.body;
  data['contest_id'] = contest_id
  await contest_server.postAnnouncement(res, req, data);
  system_server.add_toast(req, 'Announcement created')
  jshelper.sleep(1000)
  res.redirect('back');
}

router.viewAllContest = async function(req, res, next) {
  console.log('viewAllContest called')
  var contest_list = await contest_server.getContestList(res, req, {});
  contest_list = system_server.toast_update(req, contest_list)
  res.render('view_contest_list', contest_list);
}

module.exports = router;
