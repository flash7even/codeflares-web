'use strict'

var express = require('express');
var config = require('../config');
var router = express.Router();

var vote_server = require('./servers/vote_services.js');
var jshelper = require('./servers/jshelper.js');


router.addVote = async function(req, res, next) {
  console.log('addReplyForBlogPost called')
  var sess = req.session;
  var url = req.url
  console.log('URL: ' + url)
  var words = url.split("/");
  var vote_type = words[words.length-3]
  var vote_ref_id = words[words.length-2]
  var sess = req.session;
  var vote = {
    "vote_ref_id": vote_ref_id,
    "voter_id": sess.user_id,
    "vote_type": 'LIKE'
  }
  if (vote_type == 'dislike'){
    vote['vote_type'] = 'DISLIKE'
  }
  await vote_server.postVote(res, req, vote)
  jshelper.sleep(1000);
  res.redirect('back')
}

module.exports = router;
