'use strict'

var express = require('express');
var config = require('../config');
var router = express.Router();

var blog_server = require('./servers/blog_services.js');
var jshelper = require('./servers/jshelper.js');


router.addBlogForm = function(req, res, next) {
  res.render('add_blog_post', {});
}

router.viewBlogPost = function(req, res, next) {
  res.render('add_blog_post', {});
}

router.addBlogFormSubmit = async function(req, res, next) {
  console.log('addBlogFormSubmit called')
  var sess = req.session;
  var blog = req.body
  blog['blog_writer'] = sess.user_id
  await blog_server.postBlog(res, req, blog)
  jshelper.sleep(1000);
  res.redirect('/blog/list/')
}

router.viewBlogList = async function(req, res, next) {
  let blog_list = await blog_server.getBlogList(res, req, {});
  console.log('blog_list: ')
  console.log(blog_list)
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


router.viewBlogPost = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var blog_id = words[words.length-2]
  let blog_details = await blog_server.blogDetails(res, req, blog_id);
  res.render('view_blog_post', blog_details);
}

module.exports = router;
