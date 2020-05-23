'use strict'

var express = require('express');
var config = require('../config');
var router = express.Router();

var blog_server = require('./servers/blog_services.js');
var jshelper = require('./servers/jshelper.js');
var classroom_server = require('./servers/classroom_services.js');


router.addBlogForm = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var blog_ref_id = words[words.length-2]
  var blog_type = words[words.length-3]
  var target_audience = "Public"
  if(blog_type == 'classroom'){
    var classroom_details = await classroom_server.classroomDetails(res, req, blog_ref_id)
    target_audience = classroom_details.team_name
  }
  var param = {
    'blog_ref_id': blog_ref_id,
    'blog_type': blog_type,
    'target_audience': target_audience
  }

  res.render('add_blog_post', param);
}

router.addBlogFormSubmit = async function(req, res, next) {
  console.log('addBlogFormSubmit called')
  var url = req.url
  var words = url.split("/");
  var blog_ref_id = words[words.length-2]
  var blog_type = words[words.length-3]

  var sess = req.session;
  var blog = req.body
  blog['blog_writer'] = sess.user_id
  blog['blog_ref_id'] = blog_ref_id
  blog['blog_type'] = blog_type
  await blog_server.postBlog(res, req, blog)
  jshelper.sleep(1000);
  if(blog_type == 'classroom'){
    res.redirect('/classroom/training/' + blog_ref_id + '/')
  }else{
    res.redirect('/blog/list/global/all/')
  }
}


router.viewBlogList = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var blog_ref_id = words[words.length-2]
  var blog_type = words[words.length-3]
  var param = {
    'blog_type': blog_type
  }
  if (blog_ref_id != 'all'){
    param['blog_ref_id'] = blog_ref_id
  }
  let blog_list = await blog_server.getBlogList(res, req, param);
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
  blog_details['target_audience'] =  "Public"
  if(blog_details.blog_type == 'classroom'){
    var classroom_details = await classroom_server.classroomDetails(res, req, blog_details.blog_ref_id)
    blog_details['target_audience'] =  classroom_details.team_name
  }
  res.render('view_blog_post', blog_details);
}

module.exports = router;
