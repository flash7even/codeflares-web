'use strict'

var express = require('express');
var config = require('../config');
var router = express.Router();

var problem_server = require('./servers/problem_services.js');
var jshelper = require('./servers/jshelper.js');


router.addProblemForm = function(req, res, next) {
  res.render('add_problem', {});
}

function update_problem_data(problem){
  var data = {}
  var problem_category = "problem_category"
  var dependency_factor = "dependency_factor"
  var category_dependency_list = []
  for (var key in problem) {
    console.log(key + " -> " + problem[key]);
    if(key.startsWith(problem_category)){
        var res = key.split('@')
        if (res.length == 2){
          var id = res[1];
          var dependecy_val = dependency_factor + "@" + id;
          var edge = {
            "category_name": problem[key],
            "factor": problem[dependecy_val],
          }
          category_dependency_list.push(edge);
      }
    }else if(key.startsWith(dependency_factor)){
      continue;
    }else{
      data[key] = problem[key]
    }
  }
  data['category_dependency_list'] = category_dependency_list
  return data
}

router.addProblemFormSubmit = async function(req, res, next) {
  var problem = req.body
  problem = update_problem_data(problem)
  await problem_server.postProblem(res, req, problem)
  jshelper.sleep(1000);
  res.redirect('/problem/list/')
}

router.viewProblemList = async function(req, res, next) {
  let problem_list = await problem_server.getProblemList(res, req, {});
  console.log(problem_list)
  res.render('view_problem_list', problem_list);
}

router.viewProblemListAfterFormSubmit = async function(req, res, next) {
  let problem_list = await problem_server.getProblemList(res, req, req.body);
  jshelper.sleep(1000);
  res.render('view_problem_list', problem_list);
}

router.setProblemStatusFlag = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var problem_id = words[words.length-2]
  var sess = req.session;
  var user_id = sess.user_id
  var post_data = {
    "problem_id": problem_id,
    "user_id": user_id,
    "status": "SOLVE_LATER",

  }
  await problem_server.addUserProblemStatus(res, req, post_data)
  jshelper.sleep(1000);
  res.redirect('back')
}

router.setProblemStatusRemove = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var problem_id = words[words.length-2]
  var sess = req.session;
  var user_id = sess.user_id
  var post_data = {
    "problem_id": problem_id,
    "user_id": user_id,
    "status": "FLAGGED",

  }
  await problem_server.addUserProblemStatus(res, req, post_data)
  jshelper.sleep(1000);
  res.redirect('back')
}

router.setProblemStatusClear = async function(req, res, next) {
  console.log('setProblemStatusClear called')
  var url = req.url
  var words = url.split("/");
  var problem_id = words[words.length-2]
  var sess = req.session;
  var user_id = sess.user_id
  var post_data = {
    "problem_id": problem_id,
    "user_id": user_id,
    "status": "UNSOLVED",
  }
  console.log('update post data with: ')
  console.log(post_data)
  await problem_server.addUserProblemStatus(res, req, post_data)
  jshelper.sleep(1000);
  res.redirect('back')
}

router.showFlaggedProblemList = async function(req, res, next) {
  var sess = req.session;
  var user_id = sess.user_id
  var param ={
    "status_list": ['SOLVE_LATER', 'FLAGGED']
  }
  var problem_list = await problem_server.viewFlaggedProblems(res, req, param, user_id)
  res.render('view_user_problem_task_list', problem_list);
}

module.exports = router;
