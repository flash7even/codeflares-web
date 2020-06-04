'use strict'

var express = require('express');
var config = require('../config');
var router = express.Router();

var blog_server = require('./servers/blog_services.js');
var jshelper = require('./servers/jshelper.js');
var classroom_server = require('./servers/classroom_services.js');
var system_server = require('./servers/system_services.js');
var user_server = require('./servers/user_services.js');


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
  system_server.add_toast(req, 'Blog created successfully')
  if(blog_type == 'classroom'){
    res.redirect('/classroom/training/' + blog_ref_id + '/home/')
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
  blog_list = system_server.toast_update(req, blog_list)
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
  blog_details = system_server.toast_update(req, blog_details)
  var sess = req.session;
  if (sess.user_id){
    if (sess.user_id == blog_details.blog_writer){
      blog_details["own_profile"] = true
    }
    var user_details = await user_server.getUserDetails(res, req, sess.user_id)
    if(user_details.user_role == 'admin'){
      blog_details["admin_view"] = true
      blog_details["own_profile"] = true
    }
  }
  if(blog_details.status == 'homepage'){
    blog_details['homepage_mark'] = true
  }
  console.log('blog_details: ')
  console.log(blog_details)
  res.render('view_blog_post', blog_details);
}

router.deleteBlogPost = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var blog_id = words[words.length-2]
  await blog_server.deleteBlog(res, req, blog_id);
  system_server.add_toast(req, 'Blog deleted!', 'warning')
  res.redirect('/')
}

router.updateBlogPost = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var blog_id = words[words.length-2]
  let blog_details = await blog_server.blogDetails(res, req, blog_id);
  res.render('update_blog_post', blog_details);
}

router.updateBlogPostSubmit = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var blog_id = words[words.length-2]
  var blog_data = req.body
  await blog_server.updateBlog(res, req, blog_data, blog_id);
  system_server.add_toast(req, 'Blog updated!')
  res.redirect('/blog/post/view/' + blog_id + '/');
}

router.markBlogPost = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var blog_id = words[words.length-2]
  var blog_data = {
    "status": "homepage"
  }
  await blog_server.updateBlog(res, req, blog_data, blog_id);
  system_server.add_toast(req, 'Blog updated!')
  res.redirect('back');
}

router.unmarkBlogPost = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var blog_id = words[words.length-2]
  var blog_data = {
    "status": "unmarked"
  }
  await blog_server.updateBlog(res, req, blog_data, blog_id);
  system_server.add_toast(req, 'Blog updated!')
  res.redirect('back');
}
module.exports = router;
