'use strict'

var express = require('express');
var config = require('../config');
var router = express.Router();

var blog_server = require('./servers/blog_services.js');
var jshelper = require('./servers/jshelper.js');


router.addBlogForm = function(req, res, next) {
  res.render('add_blog_post', {});
}

router.addBlogFormSubmit = async function(req, res, next) {
  var blog = req.body
  blog = update_blog_data(blog)
  await blog_server.postBlog(res, req, blog)
  jshelper.sleep(1000);
  res.redirect('/blog/list/')
}

router.viewBlogList = async function(req, res, next) {
  var sess = req.session;
  var param = {}
  if (sess.user_id){
    param["user_id"] = sess.user_id
  }
  let blog_list = await blog_server.getBlogList(res, req, param);
  res.render('view_blog_list', blog_list);
}

router.viewBlogListAfterFormSubmit = async function(req, res, next) {
  var search_body = req.body
  var sess = req.session;
  if (sess.user_id){
    search_body["user_id"] = sess.user_id
  }
  let blog_list = await blog_server.getBlogList(res, req, search_body);
  jshelper.sleep(1000);
  res.render('view_blog_list', blog_list);
}

module.exports = router;
