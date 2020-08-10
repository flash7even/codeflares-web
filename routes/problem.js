'use strict'

var express = require('express');
var config = require('../config');
var router = express.Router();
require('log-timestamp');

var problem_server = require('./servers/problem_services.js');
var category_server = require('./servers/category_services.js');
var jshelper = require('./servers/jshelper.js');
var system_server = require('./servers/system_services.js');


router.addProblemForm = async function(req, res, next) {
  console.log('addProblemForm called')
  await system_server.verifyAccessRole(req, res, 'moderator')
  let category_list = await category_server.getCategoryList(res, req, {});
  let oj_list = await problem_server.getOJList(res, req);
  category_list['oj_list'] = oj_list.oj_list
  res.render('add_problem', category_list);
}

router.updateProblemForm = async function(req, res, next) {
  console.log('updateProblemForm called')
  var url = req.url
  var words = url.split("/");
  var problem_id = words[words.length-2]

  await system_server.verifyAccessRole(req, res, 'moderator')
  var problem_details = await problem_server.getProblemDetails(res, req, problem_id)
  let category_list = await category_server.getCategoryList(res, req, {});
  problem_details['category_list'] = category_list.category_list
  let oj_list = await problem_server.getOJList(res, req);
  problem_details['oj_list'] = oj_list.oj_list
  res.render('update_problem', problem_details);
}

router.updateProblemFormSubmit = async function(req, res, next) {
  console.log('updateProblemFormSubmit called')
  var url = req.url
  var words = url.split("/");
  var problem_id = words[words.length-2]

  await system_server.verifyAccessRole(req, res, 'moderator')
  var problem_data = update_problem_data(req.body)
  console.log('problem_data: ')
  console.log(problem_data)
  await problem_server.updateProblemData(res, req, problem_id, problem_data)
  jshelper.sleep(1000);
  res.redirect('/problem/view/' + problem_id + '/');
}

router.addProblemResourceForm = async function(req, res, next) {
  console.log('addProblemResourceForm called')
  await system_server.verifyAccessRole(req, res, 'moderator')
  var url = req.url
  var words = url.split("/");
  var problem_id = words[words.length-2]
  var problem_details = await problem_server.getProblemDetails(res, req, problem_id)
  res.render('add_problem_resource', problem_details);
}

router.addProblemResourceFormSubmit = async function(req, res, next) {
  console.log('addProblemResourceFormSubmit called')
  await system_server.verifyAccessRole(req, res, 'moderator')
  var url = req.url
  var words = url.split("/");
  var problem_id = words[words.length-2]

  var sess = req.session;
  var res_body = req.body
  res_body['resource_writer'] = sess.user_id
  res_body['resource_ref_id'] = problem_id
  //res_body['resource_body'] = res_body['resource_body'].replace("\r\n", "\\r\\n")
  await problem_server.postProblemResource(res, req, res_body)
  jshelper.sleep(1000)
  res.redirect('back');
}

function update_problem_data(problem){
  console.log('update_problem_data called')
  var data = {}
  var problem_category = "problem_category"
  var dependency_factor = "dependency_factor"
  var category_dependency_list = []
  for (var key in problem) {
    if(key.startsWith(problem_category)){
        var res = key.split('@')
        if (res.length == 2){
          var id = res[1];
          var dependecy_val = dependency_factor + "@" + id;
          var edge = {
            "category_name": problem[key],
            "factor": parseFloat(problem[dependecy_val]),
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
  console.log('addProblemFormSubmit called')
  await system_server.verifyAccessRole(req, res, 'moderator')
  var problem = req.body
  problem = update_problem_data(problem)
  problem['active_status'] = 'pending'
  if (problem.problem_significance.length == 0){
    problem.problem_significance = 1
  }
  if (problem.problem_description.length == 0){
    problem.problem_description = 'NA'
  }
  var problem_id = await problem_server.postProblem(res, req, problem)
  jshelper.sleep(1000);
  res.redirect('/problem/view/' + problem_id + '/');
}

router.viewProblemList = async function(req, res, next) {
  console.log('viewProblemList called')
  var url = req.url
  var words = url.split("/");
  var category_name = words[words.length-2]
  var sess = req.session;
  var param = {}
  if(category_name != 'all'){
    param['category_name'] = category_name
  }
  if (sess.user_id){
    param["user_id"] = sess.user_id
  }

  let problem_list = {}
  if(category_name != 'all'){
    problem_list['params'] = {'category_name': category_name}
  }
  let category_list = await category_server.getCategoryList(res, req, {});
  problem_list['category_list'] = category_list['category_list']
  let root_category_list = await category_server.getCategoryList(res, req, {"category_root": "root"});
  problem_list['root_category_list'] = root_category_list['category_list']
  res.render('view_problem_list_server', problem_list);
}

router.viewPendingProblemList = async function(req, res, next) {
  console.log('viewPendingProblemList called')
  await system_server.verifyAccessRole(req, res, 'moderator')
  var url = req.url
  var words = url.split("/");
  var category_name = words[words.length-2]
  var sess = req.session;
  var param = {}
  if(category_name != 'all'){
    param['category_name'] = category_name
  }
  if (sess.user_id){
    param["user_id"] = sess.user_id
  }

  let problem_list = {}
  if(category_name != 'all'){
    problem_list['params'] = {'category_name': category_name}
  }
  let category_list = await category_server.getCategoryList(res, req, {});
  problem_list['category_list'] = category_list['category_list']
  let root_category_list = await category_server.getCategoryList(res, req, {"category_root": "root"});
  problem_list['root_category_list'] = root_category_list['category_list']
  res.render('view_pending_problem_list', problem_list);
}

router.viewProblemListFromServer = async function(req, res, next) {
  console.log('viewProblemListFromServer called')
  var params = req.body
  res.redirect('back')
}

router.viewSingleProblem = async function(req, res, next) {
  console.log('viewSingleProblem called')
  var url = req.url
  var words = url.split("/");
  var problem_id = words[words.length-2]
  var sess = req.session;
  let problem_data = {}
  if (sess.user_id){
    problem_data = await problem_server.getProblemDetails(res, req, problem_id, sess.user_id);
    if(problem_data.user_status == 'SOLVED'){
      problem_data['SOLVED'] = true
    }
  }else{
    problem_data = await problem_server.getProblemDetails(res, req, problem_id);
  }
  problem_data['problem-page'] = true
  res.render('view_single_problem', problem_data);
}

router.getResourceHistory = async function(req, res, next) {
  console.log('getResourceHistory called')
  var url = req.url
  var words = url.split("/");
  var problem_id = words[words.length-2]
  let problem_data = await problem_server.getProblemDetails(res, req, problem_id);
  problem_data['resource-page'] = true
  res.render('view_single_problem', problem_data);
}

router.getSubmissionHistory = async function(req, res, next) {
  console.log('getSubmissionHistory called')
  var url = req.url
  var words = url.split("/");
  var problem_id = words[words.length-2]
  let problem_data = await problem_server.getProblemDetails(res, req, problem_id);
  problem_data['problem_id'] = problem_id
  problem_data['id'] = problem_id
  problem_data['submission-page'] = true
  res.render('view_single_problem', problem_data);
}

router.viewProblemListAfterFormSubmit = async function(req, res, next) {
  console.log('viewProblemListAfterFormSubmit called')
  var search_body = req.body
  var sess = req.session;
  if (sess.user_id){
    search_body["user_id"] = sess.user_id
  }

  let problem_list = {}
  let category_list = await category_server.getCategoryList(res, req, {});
  problem_list['category_list'] = category_list['category_list']
  let root_category_list = await category_server.getCategoryList(res, req, {"category_root": "root"});
  problem_list['root_category_list'] = root_category_list['category_list']
  problem_list['params'] = req.body
  jshelper.sleep(1000);
  res.render('view_problem_list_server', problem_list);
}

router.setProblemStatusFlag = async function(req, res, next) {
  console.log('setProblemStatusFlag called')
  await system_server.verifyAccessRole(req, res, 'moderator')
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
  console.log('setProblemStatusRemove called')
  await system_server.verifyAccessRole(req, res, 'moderator')
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
  await system_server.verifyAccessRole(req, res, 'moderator')
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
  await problem_server.addUserProblemStatus(res, req, post_data)
  jshelper.sleep(1000);
  res.redirect('back')
}

router.showFlaggedProblemList = async function(req, res, next) {
  console.log('showFlaggedProblemList called')
  await system_server.verifyAccessRole(req, res, 'contestant')
  var sess = req.session;
  var user_id = sess.user_id
  var param ={
    "status_list": ['SOLVE_LATER', 'FLAGGED']
  }
  var problem_list = await problem_server.viewFlaggedProblems(res, req, param, user_id)
  res.render('view_user_problem_task_list', problem_list);
}

router.approveProblem = async function(req, res, next) {
  console.log('approveProblem called')
  await system_server.verifyAccessRole(req, res, 'moderator')
  var url = req.url
  var words = url.split("/");
  var problem_id = words[words.length-2]
  var problem_data = {
    'active_status': 'approved'
  }
  await problem_server.updateProblemData(res, req, problem_id, problem_data);
  res.redirect('back')
}

router.disapproveProblem = async function(req, res, next) {
  console.log('disapproveProblem called')
  await system_server.verifyAccessRole(req, res, 'moderator')
  var url = req.url
  var words = url.split("/");
  var problem_id = words[words.length-2]
  var problem_data = {
    'active_status': 'disapproved'
  }
  await problem_server.updateProblemData(res, req, problem_id, problem_data);
  res.redirect('back')
}

router.deleteResource = async function(req, res, next) {
  console.log('deleteResource called')
  await system_server.verifyAccessRole(req, res, 'admin')
  var url = req.url
  var words = url.split("/");
  var resource_id = words[words.length-2]
  await problem_server.deleteResourceDetails(res, req, resource_id)
  jshelper.sleep(1000)
  res.redirect('back');
}

router.updateResource = async function(req, res, next) {
  console.log('updateResource called')
  await system_server.verifyAccessRole(req, res, 'moderator')
  var url = req.url
  var words = url.split("/");
  var resource_id = words[words.length-2]
  var resource_details = await problem_server.getResourceDetails(res, req, resource_id)
  console.log('resource_details:')
  console.log(resource_details)
  res.render('update_resource', resource_details);
}

router.updateResourceSubmit = async function(req, res, next) {
  console.log('updateResourceSubmit called')
  await system_server.verifyAccessRole(req, res, 'moderator')
  var url = req.url
  var words = url.split("/");
  var resource_id = words[words.length-2]
  await problem_server.updateResourceDetails(res, req, req.body, resource_id)
  res.redirect('back');
}

module.exports = router;
