'use strict'

var express = require('express');
var config = require('../config');
var router = express.Router();
const axios = require('axios');
var problem_search_url = config.server_host + 'problem/search/'

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

router.addProblemForm = function(req, res, next) {
  res.render('add_problem', {});
}

router.viewProblemList = async function(req, res, next) {
  let problem_list = await getProblemList({});
  res.render('view_problem_list', problem_list);
}

router.viewProblemListAfterFormSubmit = async function(req, res, next) {
  let problem_list = await getProblemList(req.body);
  res.render('view_problem_list', problem_list);
}

router.problemSubmit = function(req, res, next) {
    // Submit data to server (req.data)
    res.redirect('/');
}

module.exports = router;
