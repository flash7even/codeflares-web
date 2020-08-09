'use strict'

var express = require('express');
var router = express.Router();
require('log-timestamp');

var category_server = require('./servers/category_services.js');
var jshelper = require('./servers/jshelper.js');
var system_server = require('./servers/system_services.js');


router.addCategoryForm = async function(req, res, next) {
    console.log('addCategoryForm called')
    await system_server.verifyAccessRole(req, res, 'moderator')
    res.render('add_category', {});
}

function update_category_data(category){
    console.log('update_category_data called')
    var data = {}
    var dependency_category = "dependency_category"
    var dependency_factor = "dependency_factor"
    var category_dependency_list = []
    for (var key in category) {
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


router.addCategoryForm = async function(req, res, next) {
    console.log('addCategoryForm called')
    await system_server.verifyAccessRole(req, res, 'moderator')
    res.render('add_category', {});
}

router.viewSingleCategory = async function(req, res, next) {
    console.log('viewSingleCategory called')
    var url = req.url
    var words = url.split("/");
    var category_id = words[words.length-2]
    var sess = req.session;
    var category_data = {}
    if (sess.user_id){
      category_data = await category_server.getCategoryDetails(res, req, category_id, sess.user_id);
    }else{
      category_data = await category_server.getCategoryDetails(res, req, category_id);
    }
    category_data['category-page'] = true
    res.render('view_single_category', category_data);
}

router.viewCategoryResourceHistory = async function(req, res, next) {
    console.log('viewCategoryResourceHistory called')
    var url = req.url
    var words = url.split("/");
    var category_id = words[words.length-2]
    var sess = req.session;
    var category_data = {}
    if (sess.user_id){
      category_data = await category_server.getCategoryDetails(res, req, category_id, sess.user_id);
    }else{
      category_data = await category_server.getCategoryDetails(res, req, category_id);
    }
    category_data['resource-page'] = true
    res.render('view_single_category', category_data);
}

router.viewCategoryToppers = async function(req, res, next) {
    console.log('viewCategoryToppers called')
    var url = req.url
    var words = url.split("/");
    var category_id = words[words.length-2]
    var category_data = await category_server.getCategoryToppers(res, req, category_id);
    category_data['category_id'] = category_id
    category_data['toppers-page'] = true
    res.render('view_single_category', category_data);
}

router.addCategoryFormSubmit = async function(req, res, next) {
    console.log('addCategoryFormSubmit called')
    await system_server.verifyAccessRole(req, res, 'moderator')
    var category = req.body
    category = update_category_data(category)
    await category_server.postCategory(res, req, category)
    res.redirect('/category/list/')
}

router.viewCategoryList = async function(req, res, next) {
    console.log('viewCategoryList called')
    var sess = req.session;
    var param = {
      "category_root": "root"
    }
    if (sess.user_id){
      param["user_id"] = sess.user_id
    }
    let category_list = await category_server.getCategoryList(res, req, param);
    res.render('view_category_list', category_list);
}

router.viewCategoryListByRoot = async function(req, res, next) {
    console.log('viewCategoryListByRoot called')
    var url = req.url
    var words = url.split("/");
    var category_root = words[words.length-2]
    var sess = req.session;
    var param = {
      "category_root": category_root
    }
    if (sess.user_id){
      param["user_id"] = sess.user_id
    }
    let category_list = await category_server.getCategoryList(res, req, param);
    res.render('view_category_list', category_list);
}

router.viewCategoryListAfterFormSubmit = async function(req, res, next) {
    console.log('viewCategoryListAfterFormSubmit called')
    let category_list = await category_server.getCategoryList(res, req, req.body);
    res.render('view_category_list', category_list);
}

router.categorySubmit = function(req, res, next) {
    console.log('categorySubmit called')
    res.redirect('/');
}

router.addCategoryResourceForm = async function(req, res, next) {
    console.log('addCategoryResourceForm called')
    await system_server.verifyAccessRole(req, res, 'moderator')
    var url = req.url
    var words = url.split("/");
    var category_id = words[words.length-2]
    var category_details = await category_server.getCategoryDetails(res, req, category_id)
    res.render('add_category_resource', category_details);
}

router.addCategoryResourceFormSubmit = async function(req, res, next) {
  console.log('addCategoryResourceFormSubmit called')
  await system_server.verifyAccessRole(req, res, 'moderator')
  var url = req.url
  var words = url.split("/");
  var category_id = words[words.length-2]

  var sess = req.session;
  var res_body = req.body
  res_body['resource_writer'] = sess.user_id
  res_body['resource_ref_id'] = category_id
  await category_server.postCategoryResource(res, req, res_body)
  jshelper.sleep(1000)
  res.redirect('back');
}

module.exports = router;
