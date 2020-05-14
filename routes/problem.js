'use strict'

var express = require('express');
var config = require('../config');
var router = express.Router();
const axios = require('axios');
var problem_search_url = config.server_host + 'problem/search/'
var problem_submit_url = config.server_host + 'problem/'
var user_problem_status_submit_url = config.server_host + 'problem/status/'





//----------------- Call to the server -------------------//


async function getProblemList(res, req, search_param) {
  console.log('getProblemList called');
  var page = 0
  var problem_list = []
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  while(1){
    var post_url = problem_search_url + page.toString()
    console.log("post_url: " + post_url)
    let response = await axios.post(post_url, search_param, auth_config)
    .catch(error => {
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    problem_list = response.data
    page++
    break;
  }
  console.log('getProblemList done');
  return problem_list
}

async function postProblem(res, req, problem_data) {
  var post_url = problem_submit_url
  console.log("post_url: " + post_url)
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  let response = await axios.post(post_url, problem_data, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })

  if(response.status != 200 && response.status != 201){
      res.render('error_page', {});
  }
  return response.data
}

async function addUserProblemStatus(res, req, data) {
  var post_url = user_problem_status_submit_url
  console.log("post_url: " + post_url)
  var sess = req.session;
  const auth_config = {
      headers: { Authorization: `Bearer ${sess.access_token}` }
  };
  let response = await axios.post(post_url, data, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })

  if(response.status != 200 && response.status != 201){
      res.render('error_page', {});
  }
  return response.data
}

async function viewFlaggedProblems(res, req, param, user_id) {
  var url = user_problem_status_submit_url + 'search/' + user_id
  var sess = req.session;
  const auth_config = {
      headers: { Authorization: `Bearer ${sess.access_token}` }
  };
  let response = await axios.post(url, param, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })

  if(response.status != 200 && response.status != 201){
      res.render('error_page', {});
  }
  return response.data
}








//----------------- Routes -------------------//

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
  await postProblem(res, req, problem)
  res.redirect('/problem/list/')
}

router.viewProblemList = async function(req, res, next) {
  let problem_list = await getProblemList(res, req, {});
  console.log(problem_list)
  res.render('view_problem_list', problem_list);
}

router.viewProblemListAfterFormSubmit = async function(req, res, next) {
  let problem_list = await getProblemList(res, req, req.body);
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
  await addUserProblemStatus(res, req, post_data)
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
  await addUserProblemStatus(res, req, post_data)
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
  await addUserProblemStatus(res, req, post_data)
  res.redirect('back')
}

router.showFlaggedProblemList = async function(req, res, next) {
  var sess = req.session;
  var user_id = sess.user_id
  var param ={
    "status_list": ['SOLVE_LATER', 'FLAGGED']
  }
  var problem_list = await viewFlaggedProblems(res, req, param, user_id)
  res.render('view_user_problem_task_list', problem_list);
}

module.exports = router;

