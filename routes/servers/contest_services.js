var config = require('../../config.js');
const axios = require('axios');

var contest_search_url = config.server_host + 'contest/search/'
var contest_submit_url = config.server_host + 'contest/'


module.exports.getContestList = async function(res, req, search_param) {
  console.log('getContestList called');
  var page = 0
  var contest_list = []
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  while(1){
    var post_url = contest_search_url + page.toString()
    console.log("post_url: " + post_url)
    let response = await axios.post(post_url, search_param, auth_config)
    .catch(error => {
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    contest_list = response.data
    page++
    break;
  }
  console.log('getContestList done');
  return contest_list
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
