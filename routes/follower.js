'use strict'

var express = require('express');
var config = require('../config.js');
var router = express.Router();

var follower_server = require('./servers/follower_services.js');
var user_server = require('./servers/user_services.js');
var team_server = require('./servers/team_services.js');
var jshelper = require('./servers/jshelper.js');


router.followUser = async function(req, res, next) {
    console.log('followUser in controller called')
    var url = req.url
    var words = url.split("/");
    var user_id = words[words.length-2]
    var resp = await follower_server.followUser(res, req, user_id)
    console.log(resp)
    jshelper.sleep(1000);
    res.redirect('back');
}

router.unfollowUser = async function(req, res, next) {
    var url = req.url
    var words = url.split("/");
    var user_id = words[words.length-2]
    var resp = await follower_server.unfollowUser(res, req, user_id)
    console.log(resp)
    jshelper.sleep(1000);
    res.redirect('back');
}

router.showUserFollowerList = async function(req, res, next) {
    console.log('showUserFollowerList called')
    var url = req.url
    var words = url.split("/");
    var user_handle = words[words.length-2]
    console.log(user_details)
    var param = {
        'username': user_handle
    }
    var resp = await user_server.searchUser(res, req, param)
    var user_details = resp.user_list[0];
    var user_id = user_details.id
    
    var follower_list = await follower_server.userFollowerList(res, req, user_id)
    console.log('follower_list')
    console.log(follower_list)
    follower_list['user_handle'] = user_handle
    follower_list['user_skill_color'] = user_details['skill_color']
    follower_list['skill_color'] = follower_list.user_skill_color
    follower_list['username'] = follower_list.user_handle
    follower_list['follower-page'] = true
    res.render('user_profile', follower_list);
}

router.showUserFollowingList = async function(req, res, next) {
    var url = req.url
    var words = url.split("/");
    var user_handle = words[words.length-2]
    var param = {
        'username': user_handle
    }
    var resp = await user_server.searchUser(res, req, param)
    var user_details = resp.user_list[0];
    var user_id = user_details.id
    
    var follower_list = await follower_server.userFollowingList(res, req, user_id)
    follower_list['user_handle'] = user_handle
    follower_list['user_skill_color'] = user_details['skill_color']
    follower_list['skill_color'] = follower_list.user_skill_color
    follower_list['username'] = follower_list.user_handle
    follower_list['following-page'] = true
    res.render('user_profile', follower_list);
}

router.showTeamFollowerList = async function(req, res, next) {
    console.log('showUserFollowerList called')
    var url = req.url
    var words = url.split("/");
    var team_id = words[words.length-2]
    var team_details = await team_server.teamDetails(res, req, team_id)
    console.log(team_details)
    var follower_list = await follower_server.userFollowerList(res, req, team_id)
    console.log('follower_list')
    console.log(follower_list)
    team_details['follower-page'] = true
    team_details['follower_list'] = follower_list.follower_list
    res.render('team_profile', team_details);
}

module.exports = router;
