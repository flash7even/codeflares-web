var config = require('../../config.js');
const axios = require('axios');

var category_search_url = config.server_host + 'category/search/'
var category_submit_url = config.server_host + 'category/'



module.exports.getCategoryList = async function(res, req, search_param) {
  console.log('getCategoryList called');
  var page = 0
  var category_list = []
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  while(1){
    var post_url = category_search_url + page.toString()
    console.log("post_url: " + post_url)
    let response = await axios.post(post_url, search_param, auth_config)
    .catch(error => {
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    category_list = response.data
    page++
    break;
  }
  console.log('getCategoryList done');
  return category_list
};

module.exports.postCategory = async function(res, req, category_data) {
  var post_url = category_submit_url
  console.log("post_url: " + post_url)
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  let response = await axios.post(post_url, category_data, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })

  if(response.status != 200 && response.status != 201){
      res.render('error_page', {});
  }
  return response.data
};