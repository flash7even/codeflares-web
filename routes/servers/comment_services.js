var config = require('../../config.js');
const axios = require('axios');

var comment_search_url = config.server_host + 'comment/search/'
var comment_submit_url = config.server_host + 'comment/'


module.exports.getCommentList = async function(res, req, search_param) {
  console.log('getCommentList called');
  var page = 0
  var comment_list = []
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  while(1){
    var post_url = comment_search_url + page.toString()
    console.log("post_url: " + post_url)
    let response = await axios.post(post_url, search_param, auth_config)
    .catch(error => {
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    comment_list = response.data
    page++
    break;
  }
  console.log('getCommentList done');
  return comment_list
};

module.exports.postComment = async function(res, req, comment_data) {
  console.log('postComment called')
  var post_url = comment_submit_url
  console.log("post_url: " + post_url)
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  let response = await axios.post(post_url, comment_data, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })

  if(response.status != 200 && response.status != 201){
      res.render('error_page', {});
  }
  console.log('postComment done')
  console.log('response.data: ')
  console.log(response.data)
  return response.data
};


module.exports.commentDetails = async function(res, req, comment_id) {
  console.log('commentDetails called')
  var sess = req.session;
  const auth_config = {
      headers: { Authorization: `Bearer ${sess.access_token}` }
  };
  var url = comment_submit_url + comment_id
  console.log("url: " + url)
  let response = await axios.get(url, {}, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })
  if(response.status != 200 && response.status != 201){
      res.render('error_page', {});
  }
  console.log('commentDetails done')
  return response.data
};