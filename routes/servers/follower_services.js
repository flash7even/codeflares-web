var config = require('../../config.js');
const axios = require('axios');
var follow_url = config.server_host + 'follower/follow/'
var unfollow_url = config.server_host + 'follower/unfollow/'


module.exports.followUser = async function(res, req, user_id) {
  console.log('followUser called');
  var url = follow_url + user_id
  console.log("url: " + url)
  var sess = req.session;
  const auth_config = {
      headers: { Authorization: `Bearer ${sess.access_token}` }
  };
  let response = await axios.put(url, auth_config)
  .catch(error => {
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
    console.log("url: " + url)
    var sess = req.session;
    const auth_config = {
        headers: { Authorization: `Bearer ${sess.access_token}` }
    };
    let response = await axios.put(url, auth_config)
    .catch(error => {
        res.render('error_page', {});
    })
  
    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    console.log('followUser done');
    return response.data
  };