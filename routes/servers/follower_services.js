var config = require('../../config.js');
const axios = require('axios');
require('log-timestamp');


var follow_url = config.server_host + 'follower/follow/'
var unfollow_url = config.server_host + 'follower/unfollow/'
var follow_status_url = config.server_host + 'follower/status/'


module.exports.followUser = async function(res, req, user_id) {
    console.log('followUser called');
    var url = follow_url + user_id
    var sess = req.session;
    const auth_config = {
        headers: { Authorization: `Bearer ${sess.access_token}` }
    };
    let response = await axios.put(url, {}, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    console.log('followUser done');
    return response.data
};

module.exports.unfollowUser = async function(res, req, user_id) {
    console.log('followUser called');
    var url = unfollow_url + user_id
    var sess = req.session;
    const auth_config = {
        headers: { Authorization: `Bearer ${sess.access_token}` }
    };
    let response = await axios.put(url, {}, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })
  
    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    console.log('followUser done');
    return response.data
};


module.exports.followStatus = async function(res, req, user_id) {
    console.log('followStatus called');
    var url = follow_status_url + user_id
    var sess = req.session;
    const auth_config = {
        headers: { Authorization: `Bearer ${sess.access_token}` }
    };
    let response = await axios.get(url, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    console.log('followStatus done');
    return response.data
};


module.exports.userFollowerList = async function(res, req, user_id) {
    console.log('followStatus called');
    var url = config.server_host + 'follower/search/follower/' + user_id
    var sess = req.session;
    const auth_config = {
        headers: { Authorization: `Bearer ${sess.access_token}` }
    };
    let response = await axios.get(url, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })
    
    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    console.log('followStatus done');
    return response.data
};

module.exports.userFollowingList = async function(res, req, user_id) {
    console.log('followStatus called');
    var url = config.server_host + 'follower/search/following/' + user_id
    var sess = req.session;
    const auth_config = {
        headers: { Authorization: `Bearer ${sess.access_token}` }
    };
    let response = await axios.get(url, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })
    
    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    console.log('followStatus done');
    return response.data
};