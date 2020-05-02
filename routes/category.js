'use strict'

var express = require('express');
var router = express.Router();
var config = require('../config');
const axios = require('axios');
var category_search_url = config.server_host + 'category/search/'
var category_submit_url = config.server_host + 'category/'




//----------------- Call to the server -------------------//

async function getCategoryList(res, req, search_param) {
  console.log('getCategoryList called');
  var page = 0
  var category_list = []
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  while(1){
    var post_url = category_search_url + page.toString()
    console.log("post_url: " + post_url)
    let response = await axios.post(post_url, search_param, auth_config)
    .catch(error => {
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    category_list = response.data
    page++
    break;
  }
  console.log('getCategoryList done');
  return category_list
}

async function postCategory(res, req, category_data) {
  var post_url = category_submit_url
  console.log("post_url: " + post_url)
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  let response = await axios.post(post_url, category_data, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })

  if(response.status != 200 && response.status != 201){
      res.render('error_page', {});
  }
  return response.data
}











//----------------- Routes -------------------//

router.addCategoryForm = function(req, res, next) {
  res.render('add_category', {});
}

function update_category_data(category){
  var data = {}
  var dependency_category = "dependency_category"
  var dependency_factor = "dependency_factor"
  var category_dependency_list = []
  for (var key in category) {
    console.log(key + " -> " + category[key]);
    if(key.startsWith(dependency_category)){
        var res = key.split('@')
        if (res.length == 2){
          var id = res[1];
          var dependecy_val = dependency_factor + "@" + id;
          var edge = {
            "category_name": category[key],
            "factor": category[dependecy_val],
          }
          category_dependency_list.push(edge);
      }
    }else if(key.startsWith(dependency_factor)){
      continue;
    }else{
      data[key] = category[key]
    }
  }
  data['category_dependency_list'] = category_dependency_list
  return data
}


router.addCategoryForm = function(req, res, next) {
    res.render('add_category', {});
}

router.addCategoryFormSubmit = async function(req, res, next) {
  var category = req.body
  category = update_category_data(category)
  await postCategory(res, req, category)
  res.redirect('/category/list/')
}

router.viewCategoryList = async function(req, res, next) {
    let category_list = await getCategoryList(res, req, {});
    console.log(category_list)
    res.render('view_category_list', category_list);
}

router.viewCategoryListAfterFormSubmit = async function(req, res, next) {
    let category_list = await getCategoryList(res, req, req.body);
    res.render('view_category_list', category_list);
}

router.categorySubmit = function(req, res, next) {
    // Submit data to server (req.data)
    res.redirect('/');
}

module.exports = router;
