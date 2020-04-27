'use strict'

var express = require('express');
var config = require('../config');
var router = express.Router();
const axios = require('axios');
var problem_search_url = config.server_host + 'problem/search/'
var problem_submit_url = config.server_host + 'problem/'

async function getProblemList(search_param) {
  console.log('getProblemList called');
  var page = 0
  var problem_list = []
  while(1){
    var post_url = problem_search_url + page.toString()
    console.log("post_url: " + post_url)
    let res = await axios.post(post_url, search_param);
    problem_list = res.data
    page++
    break;
  }
  console.log('getProblemList done');
  return problem_list
}

async function postProblem(problem_data) {
  var post_url = problem_submit_url
  console.log("post_url: " + post_url)
  let res = await axios.post(post_url, problem_data);
}

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
  await postProblem(problem)
  let problem_list = await getProblemList({});
  res.render('view_problem_list', problem_list);
}

router.viewProblemList = async function(req, res, next) {
  let problem_list = await getProblemList({});
  res.render('view_problem_list', problem_list);
}

router.viewProblemListAfterFormSubmit = async function(req, res, next) {
  let problem_list = await getProblemList(req.body);
  res.render('view_problem_list', problem_list);
}

module.exports = router;
