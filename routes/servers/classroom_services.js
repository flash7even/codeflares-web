var config = require('../../config.js');
const axios = require('axios');

var classroom_search_url = config.server_host + 'team/search/user/'
var user_search_url = config.server_host + 'user/search/'
var classroom_submit_url = config.server_host + 'team/'
var classroom_member_delete_url = config.server_host + 'team/member/'
var classroom_training_url = config.server_host + 'training/classroom/'
var classroom_add_task_submit_url = config.server_host + 'classroom/task/'
var classroom_add_class_submit_url = config.server_host + 'classroom/class/'


module.exports.getClassroomList = async function(res, req, username, search_param) {
  console.log('getClassroomList called');
  var post_url = classroom_search_url + username
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
  console.log('getClassroomList done');
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

module.exports.postClassroom = async function(res, req, classroom_data) {
  var post_url = classroom_submit_url
  console.log("post_url: " + post_url)
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  let response = await axios.post(post_url, classroom_data, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })

  if(response.status != 200 && response.status != 201){
      res.render('error_page', {});
  }
  return response.data
};

module.exports.updateClassroom = async function(res, req, classroom_id, classroom_data) {
  var post_url = classroom_submit_url + classroom_id
  console.log("post_url: " + post_url)
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  let response = await axios.put(post_url, classroom_data, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })

  if(response.status != 200 && response.status != 201){
      res.render('error_page', {});
  }
  return response.data
};

module.exports.postClassroomTask = async function(res, req, classroom_task_data) {
  var post_url = classroom_add_task_submit_url
  console.log("post_url: " + post_url)
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  let response = await axios.post(post_url, classroom_task_data, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })

  if(response.status != 200 && response.status != 201){
      res.render('error_page', {});
  }
  return response.data
};

module.exports.getClassroomTaskDetails = async function(res, req, task_id) {
  var url = classroom_add_task_submit_url + task_id
  console.log("url: " + url)
  var sess = req.session;
  const auth_config = {
      headers: { Authorization: `Bearer ${sess.access_token}` }
  };
  let response = await axios.get(url, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })
  return response.data
};

module.exports.getClassroomClassDetails = async function(res, req, class_id) {
  var url = classroom_add_class_submit_url + class_id
  console.log("url: " + url)
  var sess = req.session;
  const auth_config = {
      headers: { Authorization: `Bearer ${sess.access_token}` }
  };
  let response = await axios.get(url, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })
  return response.data
};

module.exports.postClassroomClass = async function(res, req, classroom_class_data) {
  var post_url = classroom_add_class_submit_url
  console.log("post_url: " + post_url)
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  let response = await axios.post(post_url, classroom_class_data, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })

  if(response.status != 200 && response.status != 201){
      res.render('error_page', {});
  }
  return response.data
};

module.exports.deleteClassroom = async function(res, req, classroom_id) {
  var url = classroom_submit_url + classroom_id
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

module.exports.deleteClassroomMember = async function(res, req, classroom_id, user_handle) {
  var url = classroom_member_delete_url + classroom_id + '/' + user_handle
  console.log("delete member url: " + url)
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

module.exports.updtateClassroom = async function(res, req, classroom_data) {
  var url = classroom_submit_url + 'member' + '/'
  console.log("post_url: " + url)
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  let response = await axios.put(url, classroom_data, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })

  if(response.status != 200 && response.status != 201){
      res.render('error_page', {});
  }
  return response.data
};

module.exports.classroomDetails = async function(res, req, classroom_id) {
  console.log('classroomDetails called')
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  var url = classroom_training_url + classroom_id
  console.log("url: " + url)
  console.log("auth_config: ")
  console.log(auth_config)
  let response = await axios.get(url, auth_config)
  .catch(error => {
      console.log(error)
      res.render('error_page', {});
  })

  if(response.status != 200 && response.status != 201){
      res.render('error_page', {});
  }
  console.log('classroomDetails done')
  return response.data
};

module.exports.updtateClassroomTask = async function(res, req, task_data, task_id) {
  var url = classroom_add_task_submit_url + task_id
  console.log("url: " + url)
  var sess = req.session;
  const auth_config = { headers: { Authorization: `Bearer ${sess.access_token}` }};
  let response = await axios.put(url, task_data, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })

  if(response.status != 200 && response.status != 201){
      res.render('error_page', {});
  }
  return response.data
};

module.exports.updtateClassroomClass = async function(res, req, class_data, class_id) {
  var url = classroom_add_class_submit_url + class_id
  console.log("url: " + url)
  var sess = req.session;
  const auth_config = { headers: { Authorization: `Bearer ${sess.access_token}` }};
  let response = await axios.put(url, class_data, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })

  if(response.status != 200 && response.status != 201){
      res.render('error_page', {});
  }
  return response.data
};
