'use strict'

var express = require('express');
var router = express.Router();
var config = require('../config');
const axios = require('axios');
var category_search_url = config.server_host + 'category/search/'

async function getCategoryList(search_param) {
  console.log('getCategoryList called');
  var page = 0
  var category_list = []
  while(1){
    var post_url = category_search_url + page.toString()
    console.log("post_url: " + post_url)
    let res = await axios.post(post_url, search_param);
    category_list = res.data
    page++
    break;
  }
  console.log('getCategoryList done');
  return category_list
}


router.addCategoryForm = function(req, res, next) {
    res.render('add_category', {});
}
router.viewCategoryList = async function(req, res, next) {
    let category_list = await getCategoryList({});
    console.log(category_list)
    res.render('view_category_list', category_list);
}
router.viewCategoryListAfterFormSubmit = async function(req, res, next) {
    let category_list = await getCategoryList(req.body);
    res.render('view_category_list', category_list);
}
router.categorySubmit = function(req, res, next) {
    // Submit data to server (req.data)
    res.redirect('/');
}

module.exports = router;
