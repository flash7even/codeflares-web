'use strict'

var express = require('express');
var router = express.Router();

var category_server = require('./servers/category_services.js');
var jshelper = require('./servers/jshelper.js');


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
  await category_server.postCategory(res, req, category)
  res.redirect('/category/list/')
}

router.viewCategoryList = async function(req, res, next) {
    let category_list = await category_server.getCategoryList(res, req, {});
    console.log(category_list)
    res.render('view_category_list', category_list);
}

router.viewCategoryListAfterFormSubmit = async function(req, res, next) {
    let category_list = await category_server.getCategoryList(res, req, req.body);
    res.render('view_category_list', category_list);
}

router.categorySubmit = function(req, res, next) {
    // Submit data to server (req.data)
    res.redirect('/');
}

module.exports = router;
