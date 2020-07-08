'use strict'

var express = require('express');
var config = require('../config');
var router = express.Router();

var comment_server = require('./servers/comment_services.js');
var jshelper = require('./servers/jshelper.js');


router.addCommentForm = function(req, res, next) {
  res.render('add_comment_post', {});
}

router.viewCommentPost = function(req, res, next) {
  res.render('add_comment_post', {});
}

router.addCommentForBlogPost = async function(req, res, next) {
  console.log('addComment called')
  var url = req.url
  var words = url.split("/");
  var blog_id = words[words.length-2]
  var sess = req.session;
  var comment = req.body
  comment['comment_writer'] = sess.user_id
  comment['comment_ref_id'] = blog_id
  comment['comment_parent_id'] = blog_id
  comment['comment_type'] = 'blog_post_comment'
  comment['comment_text'] = comment['comment_text'].replace("\r\n", "\\r\\n")
  await comment_server.postComment(res, req, comment)
  jshelper.sleep(1000);
  res.redirect('back')
}

router.addCommentForProblem = async function(req, res, next) {
  console.log('addCommentForProblem called')
  var url = req.url
  var words = url.split("/");
  var problem_id = words[words.length-2]
  var sess = req.session;
  var comment = req.body
  comment['comment_writer'] = sess.user_id
  comment['comment_ref_id'] = problem_id
  comment['comment_parent_id'] = problem_id
  comment['comment_type'] = 'problem_comment'
  comment['comment_text'] = comment['comment_text'].replace("\r\n", "\\r\\n")
  await comment_server.postComment(res, req, comment)
  jshelper.sleep(1000);
  res.redirect('back')
}

router.addCommentForCategory = async function(req, res, next) {
  console.log('addCommentForCategory called')
  var url = req.url
  console.log('url: ');
  console.log(url)
  var words = url.split("/");
  var category_id = words[words.length-2]
  var sess = req.session;
  var comment = req.body
  comment['comment_writer'] = sess.user_id
  comment['comment_ref_id'] = category_id
  comment['comment_parent_id'] = category_id
  comment['comment_type'] = 'category_comment'
  comment['comment_text'] = comment['comment_text'].replace("\r\n", "\\r\\n")
  await comment_server.postComment(res, req, comment)
  jshelper.sleep(1000);
  res.redirect('back')
}

router.addReplyForBlogPost = async function(req, res, next) {
  console.log('addReplyForBlogPost called')
  var url = req.url
  console.log('URL: ' + url)
  var words = url.split("/");
  var blog_id = words[words.length-3]
  var parent_id = words[words.length-2]
  var sess = req.session;
  var comment = req.body
  comment['comment_writer'] = sess.user_id
  comment['comment_ref_id'] = blog_id
  comment['comment_parent_id'] = parent_id
  comment['comment_type'] = 'blog_post_reply'
  comment['comment_text'] = comment['comment_text'].replace("\r\n", "\\r\\n")
  console.log('comment to post: ')
  console.log(comment)
  await comment_server.postComment(res, req, comment)
  jshelper.sleep(1000);
  res.redirect('back')
}

router.addReplyForProblem = async function(req, res, next) {
  console.log('addReplyForProblem called')
  var url = req.url
  console.log('URL: ' + url)
  var words = url.split("/");
  var problem_id = words[words.length-3]
  var parent_id = words[words.length-2]
  var sess = req.session;
  var comment = req.body
  comment['comment_writer'] = sess.user_id
  comment['comment_ref_id'] = problem_id
  comment['comment_parent_id'] = parent_id
  comment['comment_type'] = 'problem_comment'
  comment['comment_text'] = comment['comment_text'].replace("\r\n", "\\r\\n")
  console.log('comment to post: ')
  console.log(comment)
  await comment_server.postComment(res, req, comment)
  jshelper.sleep(1000);
  res.redirect('back')
}

router.addReplyForCategory = async function(req, res, next) {
  console.log('addReplyForCategory called')
  var url = req.url
  console.log('URL: ' + url)
  var words = url.split("/");
  var category_id = words[words.length-3]
  var parent_id = words[words.length-2]
  var sess = req.session;
  var comment = req.body
  comment['comment_writer'] = sess.user_id
  comment['comment_ref_id'] = category_id
  comment['comment_parent_id'] = parent_id
  comment['comment_type'] = 'category_comment'
  comment['comment_text'] = comment['comment_text'].replace("\r\n", "\\r\\n")
  console.log('comment to post: ')
  console.log(comment)
  await comment_server.postComment(res, req, comment)
  jshelper.sleep(1000);
  res.redirect('back')
}

router.viewCommentList = async function(req, res, next) {
  let comment_list = await comment_server.getCommentList(res, req, {});
  console.log('comment_list: ')
  console.log(comment_list)
  res.render('view_comment_list', comment_list);
}

router.viewCommentListAfterFormSubmit = async function(req, res, next) {
  var search_body = req.body
  var sess = req.session;
  if (sess.user_id){
    search_body["user_id"] = sess.user_id
  }
  let comment_list = await comment_server.getCommentList(res, req, search_body);
  jshelper.sleep(1000);
  res.render('view_comment_list', comment_list);
}


router.viewCommentPost = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var comment_id = words[words.length-2]
  let comment_details = await comment_server.commentDetails(res, req, comment_id);
  console.log('comment_details: ')
  console.log(comment_details)
  res.render('view_comment_post', comment_details);
}

module.exports = router;
