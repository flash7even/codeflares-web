var config = require('../../config.js');
const axios = require('axios');

var blog_search_url = config.server_host + 'blog/search/'
var blog_submit_url = config.server_host + 'blog/'


module.exports.getBlogList = async function(res, req, search_param) {
  console.log('getBlogList called');
  var page = 0
  var blog_list = []
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  while(1){
    var post_url = blog_search_url + page.toString()
    console.log("post_url: " + post_url)
    let response = await axios.post(post_url, search_param, auth_config)
    .catch(error => {
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    blog_list = response.data
    page++
    break;
  }
  console.log('getBlogList done');
  return blog_list
};

module.exports.postBlog = async function(res, req, blog_data) {
  var post_url = blog_submit_url
  console.log("post_url: " + post_url)
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  let response = await axios.post(post_url, blog_data, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })

  if(response.status != 200 && response.status != 201){
      res.render('error_page', {});
  }
  return response.data
};
