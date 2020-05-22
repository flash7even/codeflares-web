var config = require('../../config.js');
const axios = require('axios');

var vote_submit_url = config.server_host + 'vote/'

module.exports.postVote = async function(res, req, vote_data) {
  console.log('postVote called')
  var post_url = vote_submit_url
  console.log("post_url: " + post_url)
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  let response = await axios.post(post_url, vote_data, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })

  if(response.status != 200 && response.status != 201){
      res.render('error_page', {});
  }
  return response.data
};
