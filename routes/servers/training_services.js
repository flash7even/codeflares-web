var config = require('../../config.js');
const axios = require('axios');
require('log-timestamp');

var individual_training_url = config.server_host + 'training/individual'
var team_training_url = config.server_host + 'training/team/'
var user_details_url = config.server_host + 'user/'



module.exports.getUserDetails = async function(res, req, user_id) {
  console.log('getUserDetails called');
  var url = user_details_url + user_id
  console.log("url: " + url)
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  let response = await axios.get(url, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })

  if(response.status != 200 && response.status != 201){
      res.render('error_page', {});
  }
  console.log('getUserDetails done');
  return response.data
};

module.exports.getIndividualTrainingModel = async function(res, req, user_id, training_param) {
    console.log('getIndividualTrainingModel called');
    var url = individual_training_url + '/' + user_id
    var sess = req.session;
    var access_token = sess.access_token
    const auth_config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    let response = await axios.post(url, training_param, auth_config)
    .catch(error => {
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    console.log('getIndividualTrainingModel done');
    return response.data
};

module.exports.getTeamTrainingModel = async function(res, req, team_id, training_param) {
    var url = team_training_url + team_id
    var sess = req.session;
    var access_token = sess.access_token
    const auth_config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    let response = await axios.post(url, training_param, auth_config)
    .catch(error => {
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    console.log('getTeamTrainingModel done');
    return response.data
};
