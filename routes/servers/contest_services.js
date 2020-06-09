var config = require('../../config.js');
const axios = require('axios');

var contest_search_url = config.server_host + 'contest/search'
var contest_search_public_url = config.server_host + 'contest/public/search'
var contest_submit_url = config.server_host + 'contest/'


module.exports.getContestList = async function(res, req, search_param) {
    console.log('getContestList called');
    console.log(search_param)
    var sess = req.session;
    var url = contest_search_public_url
    if(sess.user_id){
        url = contest_search_url
    }
    var access_token = sess.access_token
    const auth_config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    console.log("url: " + url)
    let response = await axios.post(url, search_param, auth_config)
    .catch(error => {
        res.render('error_page', {});
    })
    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    console.log('getContestList done');
    console.log(response.data)
    return response.data
};

module.exports.getContestDetails = async function(res, req, contest_id) {
    console.log('getContestDetails called');
    var sess = req.session;
    const auth_config = {
        headers: { Authorization: `Bearer ${sess.access_token}` }
    };
    var url = contest_submit_url + contest_id
    let response = await axios.get(url, auth_config)
    .catch(error => {
        res.render('error_page', {});
    })
    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    console.log('getContestDetails done');
    return response.data
};

module.exports.getContestStandings = async function(res, req, contest_id) {
    console.log('getContestStandings called');
    var sess = req.session;
    const auth_config = {
        headers: { Authorization: `Bearer ${sess.access_token}` }
    };
    var url = contest_submit_url + 'standings/' + contest_id
    let response = await axios.get(url, auth_config)
    .catch(error => {
        res.render('error_page', {});
    })
    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    console.log('getContestStandings done');
    return response.data
};

module.exports.getContestStandingsForUser = async function(res, req, contest_id, user_id) {
    console.log('getContestStandingsForUser called');
    var sess = req.session;
    const auth_config = {
        headers: { Authorization: `Bearer ${sess.access_token}` }
    };
    var url = contest_submit_url + 'standings/' + contest_id + '/' + user_id
    let response = await axios.get(url, auth_config)
    .catch(error => {
        res.render('error_page', {});
    })
    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    console.log('getContestStandingsForUser done');
    return response.data
};

module.exports.postContest = async function(res, req, contest_data) {
  var post_url = contest_submit_url
  console.log("post_url: " + post_url)
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  let response = await axios.post(post_url, contest_data, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })

  if(response.status != 200 && response.status != 201){
      res.render('error_page', {});
  }
  return response.data
};

module.exports.updateContest = async function(res, req, contest_id, contest_data) {
    var post_url = contest_submit_url + contest_id
    console.log("post_url: " + post_url)
    var sess = req.session;
    var access_token = sess.access_token
    const auth_config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    let response = await axios.put(post_url, contest_data, auth_config)
    .catch(error => {
        res.render('error_page', {});
    })
  
    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    return response.data
  };
