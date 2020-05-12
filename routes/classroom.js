'use strict'

var express = require('express');
var config = require('../config');
var router = express.Router();
const axios = require('axios');
var classroom_search_url = config.server_host + 'team/search/user/'
var user_search_url = config.server_host + 'user/search/'
var classroom_submit_url = config.server_host + 'team/'
var classroom_training_url = config.server_host + 'team/'




//----------------- Call to the server -------------------//

async function getClassroomList(res, req, username, search_param) {
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
}

async function getUserList(res, req, search_param) {
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
}

async function postClassroom(res, req, classroom_data) {
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
}

async function deleteClassroom(res, req, classroom_id) {
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
}

async function updtateClassroom(res, req, classroom_data) {
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
}

async function classroomDetails(res, req, classroom_id) {
  console.log('classroomDetails called')
  var sess = req.session;
  var access_token = sess.access_token
  const auth_config = {
      headers: { Authorization: `Bearer ${access_token}` }
  };
  var url = classroom_training_url + classroom_id
  console.log("url: " + url)
  let response = await axios.get(url, {}, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })

  if(response.status != 200 && response.status != 201){
      res.render('error_page', {});
  }
  console.log('classroomDetails done')
  return response.data
}










//----------------- Routes -------------------//


router.addClassroomForm = async function(req, res, next) {
  let user_list = await getUserList(res, req, {});
  console.log(user_list)
  res.render('add_classroom', user_list);
}

function update_classroom_data(classroom){
  var data = {}
  var user_handle = "user_handle"
  var remarks = "remarks"
  var member_list = []
  for (var key in classroom) {
    console.log(key + " -> " + classroom[key]);
    if(key.startsWith(user_handle)){
        var res = key.split('@')
        if (res.length == 2){
          var id = res[1];
          var dependecy_val = remarks + "@" + id;
          var edge = {
            "user_handle": classroom[key],
            "remarks": classroom[dependecy_val],
          }
          member_list.push(edge);
      }
    }else if(key.startsWith(remarks)){
      continue;
    }else{
      data[key] = classroom[key]
    }
  }
  data['member_list'] = member_list
  return data
}

router.addClassroomFormSubmit = async function(req, res, next) {
  console.log('addClassroomFormSubmit called')
  var classroom = req.body
  classroom['team_type'] = 'classroom';
  console.log(classroom)
  classroom = update_classroom_data(classroom)
  await postClassroom(res, req, classroom)
  res.redirect('/classroom/list/');
}

router.viewClassroomList = async function(req, res, next) {
  var sess = req.session;
  let classroom_list = await getClassroomList(res, req, sess.username, {"team_type": "classroom"});
  classroom_list['logged_in_user_id'] = sess.user_id
  console.log(classroom_list)
  res.render('view_classroom_list', classroom_list);
}

router.trainingClassroom = async function(req, res, next) {
  var url = req.url
  console.log(req.url)
  console.log(url)
  var words = url.split("/");
  var classroom_id = words[words.length-2]
  console.log(classroom_id)

  var classroom_details = await classroomDetails(res, req, classroom_id)
  console.log(classroom_details)
  res.render('classroom_training', classroom_details);
}

router.confirmClassroom = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var classroom_id = words[words.length-2]
  var sess = req.session;
  var data = {
    "team_id": classroom_id,
    "user_handle": sess.username,
    "status": "confirmed"
  }
  await updtateClassroom(res, req, data)
  res.redirect('/classroom/list/');
}

router.rejectClassroom = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var classroom_id = words[words.length-2]
  var sess = req.session;
  var data = {
    "team_id": classroom_id,
    "user_handle": sess.username,
    "status": "rejected"
  }
  await updtateClassroom(res, req, data)
  res.redirect('/classroom/list/');
}

router.deleteClassroom = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var classroom_id = words[words.length-2]
  await deleteClassroom(res, req, classroom_id)
  res.redirect('/classroom/list/');
}

module.exports = router;
