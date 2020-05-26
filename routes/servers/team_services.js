var config = require('../../config.js');
const axios = require('axios');

var team_search_url = config.server_host + 'team/search/user/'
var user_search_url = config.server_host + 'user/search/'
var team_submit_url = config.server_host + 'team/'
var team_cf_history_url = config.server_host + 'team/rating-history/'


module.exports.getTeamList = async function(res, req, username, search_param) {
  console.log('getTeamList called');
  var post_url = team_search_url + username
  console.log("post_url: " + post_url)
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  let response = await axios.post(post_url, search_param, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })

  if(response.status != 200 && response.status != 201){
      res.render('error_page', {});
  }
  console.log('getTeamList done');
  return response.data
};

module.exports.getUserList = async function(res, req, search_param) {
  console.log('getUserList called');
  var page = 0
  var user_list = []
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  while(1){
    var post_url = user_search_url + page.toString()
    console.log("post_url: " + post_url)
    let response = await axios.post(post_url, search_param, auth_config)
    .catch(error => {
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    user_list = response.data
    page++
    break;
  }
  console.log('getUserList done');
  return user_list
};

module.exports.postTeam = async function(res, req, team_data) {
  var post_url = team_submit_url
  console.log("post_url: " + post_url)
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  let response = await axios.post(post_url, team_data, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })

  if(response.status != 200 && response.status != 201){
      res.render('error_page', {});
  }
  return response.data
};

module.exports.deleteTeam = async function(res, req, team_id) {
  var url = team_submit_url + team_id
  console.log("url: " + url)
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  let response = await axios.delete(url, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })

  if(response.status != 200 && response.status != 201){
      res.render('error_page', {});
  }
  return response.data
};

module.exports.updtateTeam = async function(res, req, team_data) {
  var url = team_submit_url + 'member' + '/'
  console.log("post_url: " + url)
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  let response = await axios.put(url, team_data, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })

  if(response.status != 200 && response.status != 201){
      res.render('error_page', {});
  }
  return response.data
};

module.exports.teamDetails = async function(res, req, team_id) {
  console.log('teamDetails called')
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  var url = team_submit_url + team_id
  console.log("url: " + url)
  let response = await axios.get(url, {}, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })

  if(response.status != 200 && response.status != 201){
      res.render('error_page', {});
  }
  console.log('teamDetails done')
  return response.data
};

module.exports.updateTeam = async function(res, req, team_id, team_data) {
    var post_url = team_submit_url + team_id
    console.log("post_url: " + post_url)
    var sess = req.session;
    var access_token = sess.access_token
    const auth_config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    let response = await axios.put(post_url, team_data, auth_config)
    .catch(error => {
        res.render('error_page', {});
    })
  
    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    return response.data
  };

module.exports.teamCodeforcesHistory = async function(res, req, team_id) {
  console.log('teamDetails called')
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  var url = team_cf_history_url + team_id + '/codeforces'
  console.log("url: " + url)
  let response = await axios.get(url, {}, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })

  if(response.status != 200 && response.status != 201){
      res.render('error_page', {});
  }
  console.log('teamDetails done')
  return response.data
};

module.exports.syncTeam = async function(res, req, team_id) {
    var url = team_submit_url + 'sync' + '/' + team_id
    console.log("url: " + url)
    console.log("team_id: " + team_id)
    var sess = req.session;
    const auth_config = {
        headers: { Authorization: `Bearer ${sess.access_token}` }
    };
    let response = await axios.put(url, {}, auth_config)
    .catch(error => {
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    return response.data
};