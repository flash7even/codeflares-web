'use strict'

var express = require('express');
var config = require('../config');
var router = express.Router();

var jshelper = require('./servers/jshelper.js');
var team_server = require('./servers/team_services.js');
var classroom_server = require('./servers/classroom_services.js');
var contest_server = require('./servers/contest_services.js');


router.addContestForm = async function(req, res, next) {
  console.log('addContestForm in route')
  var sess = req.session;
  var team_data = await team_server.getTeamList(res, req, sess.username, {"team_type": "team"})
  var classroom_data = await classroom_server.getClassroomList(res, req, sess.username, {"team_type": "classroom"})
  var user_data = {
    'team_list': team_data['team_list'],
    'classroom_list': classroom_data['team_list'],
  }
  console.log('user_data: ')
  console.log(user_data)
  res.render('add_contest', user_data);
}


function update_contest_data(contest){
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


router.addContestFormSubmit = async function(req, res, next) {
  console.log('addContestFormSubmit in route')
  var sess = req.session;
  var contest_data = req.body;
  console.log('Before update')
  console.log(contest_data)
  contest_data['setter_id'] = sess.user_id
  contest_data = update_contest_data(contest_data)
  await contest_server.postContest(res, req, contest_data)
  res.render('add_contest', contest_data);
}

module.exports = router;