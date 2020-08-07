var config = require('../../config.js');
const axios = require('axios');
require('log-timestamp');

var contact_us_search_url = config.server_host + 'contact/us/search/'
var contact_us_submit_url = config.server_host + 'contact/us/'


module.exports.getContactUsList = async function(res, req, search_param) {
    console.log('getContactUsList called');
    var page = 0
    var contact_us_list = []
    var sess = req.session;
    var access_token = sess.access_token
    const auth_config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    while(1){
      var post_url = contact_us_search_url + page.toString()
      let response = await axios.post(post_url, search_param, auth_config)
      .catch(error => {
          console.error(error)
          res.render('error_page', {});
      })

      if(response.status != 200 && response.status != 201){
          res.render('error_page', {});
      }
      contact_us_list = response.data
      page++
      break;
    }
    console.log('getContactUsList done');
    return contact_us_list
};

module.exports.postContactUs = async function(res, req, contact_us_data) {
    console.log('postContactUs called')
    var post_url = contact_us_submit_url
    let response = await axios.post(post_url, contact_us_data)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    return response.data
};

module.exports.contact_usDetails = async function(res, req, contact_us_id) {
    console.log('contact_usDetails called')
    var sess = req.session;
    const auth_config = {
        headers: { Authorization: `Bearer ${sess.access_token}` }
    };
    var url = contact_us_submit_url + contact_us_id
    let response = await axios.get(url, {}, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })
    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    console.log('contact_usDetails done')
  return response.data
};