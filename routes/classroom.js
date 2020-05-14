'use strict'

var express = require('express');
var config = require('../config');
var router = express.Router();
const axios = require('axios');
var classroom_search_url = config.server_host + 'team/search/user/'
var user_search_url = config.server_host + 'user/search/'
var classroom_submit_url = config.server_host + 'team/'
var classroom_member_delete_url = config.server_host + 'team/member/'
var classroom_training_url = config.server_host + 'training/classroom/'
var classroom_add_task_submit_url = config.server_host + 'classroom/task/'
var classroom_task_list_view_all = config.server_host + 'classroom/task/search'
var classroom_add_class_submit_url = config.server_host + 'classroom/class/'
var classroom_class_list_view_all = config.server_host + 'classroom/class/search'



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

async function postClassroomTask(res, req, classroom_task_data) {
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
}

async function getClassroomTaskDetails(res, req, task_id) {
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
}

async function getClassroomClassDetails(res, req, class_id) {
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
}

async function postClassroomClass(res, req, classroom_class_data) {
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

async function deleteClassroomMember(res, req, classroom_id, user_handle) {
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
}

async function updtateClassroomTask(res, req, task_data, task_id) {
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
}

async function updtateClassroomClass(res, req, class_data, class_id) {
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
  console.log('trainingClassroom called')
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

router.deleteClassroomMember = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var user_handle = words[words.length-2]
  var classroom_id = words[words.length-3]
  console.log('user_handle: ' + user_handle)
  console.log('classroom_id: ' + classroom_id)
  await deleteClassroomMember(res, req, classroom_id, user_handle)
  res.redirect('back');
}





//---------- Classroom Task Controllers -----------//
router.addClassroomTaskForm = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var classroom_id = words[words.length-2]
  var classroom_details = await classroomDetails(res, req, classroom_id)
  console.log(classroom_details)
  res.render('add_classroom_task', classroom_details);
}

router.addClassroomTaskFormSubmit = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var classroom_id = words[words.length-2]
  var classroom_task_data = req.body
  var sess = req.session;
  classroom_task_data["task_added_by"] = sess.user_id
  classroom_task_data["classroom_id"] = classroom_id
  console.log(classroom_task_data)
  await postClassroomTask(res, req, classroom_task_data)
  res.redirect('/classroom/training/' + classroom_id + '/');
}

router.deleteClassroomTask = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var classroom_task_id = words[words.length-2]
  var sess = req.session;
  var delete_url = classroom_add_task_submit_url + classroom_task_id
  console.log('delete url: ' + delete_url)
  const auth_config = { headers: { Authorization: `Bearer ${sess.access_token}` }};
  let response = await axios.delete(delete_url, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })
  res.redirect('back');
}

router.updateClassroomTask = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var task_id = words[words.length-2]
  var task_details = await getClassroomTaskDetails(res, req, task_id)
  console.log('task_details found')
  console.log(task_details)
  res.render('update_classroom_task', task_details);
}

router.updateClassroomTaskSubmit = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var task_id = words[words.length-2]
  updtateClassroomTask(res, req, req.body, task_id)
  res.redirect('/');
}

router.viewClassroomTaskList = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var classroom_id = words[words.length-2]
  var classroom_details = await classroomDetails(res, req, classroom_id)
  var sess = req.session;
  const auth_config = { headers: { Authorization: `Bearer ${sess.access_token}` } };
  var tasklist_url = classroom_task_list_view_all
  let response = await axios.post(tasklist_url, { 'classroom_id': classroom_id }, auth_config)
  .catch(error => {
      console.log(error)
      res.render('error_page', {});
  })
  var response_data = response.data
  classroom_details['task_list'] = response_data['task_list']
  console.log(classroom_details)
  res.render('view_classroom_task_list', classroom_details);
}





//---------- Classroom Class Controllers -----------//
router.addClassroomClassForm = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var classroom_id = words[words.length-2]
  var classroom_details = await classroomDetails(res, req, classroom_id)
  console.log(classroom_details)
  res.render('add_classroom_class', classroom_details);
}

router.addClassroomClassFormSubmit = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var classroom_id = words[words.length-2]
  var classroom_class_data = req.body
  var sess = req.session;
  classroom_class_data["class_moderator_id"] = sess.user_id
  classroom_class_data["classroom_id"] = classroom_id
  console.log(classroom_class_data)
  await postClassroomClass(res, req, classroom_class_data)
  res.redirect('/classroom/training/' + classroom_id + '/');
}

router.deleteClassroomClass = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var classroom_class_id = words[words.length-2]
  var sess = req.session;
  var delete_url = classroom_add_class_submit_url + classroom_class_id
  console.log('delete url: ' + delete_url)
  const auth_config = { headers: { Authorization: `Bearer ${sess.access_token}` }};
  let response = await axios.delete(delete_url, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })
  res.redirect('back');
}

router.viewClassroomClassList = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var classroom_id = words[words.length-2]
  var classroom_details = await classroomDetails(res, req, classroom_id)
  var sess = req.session;
  const auth_config = { headers: { Authorization: `Bearer ${sess.access_token}` } };
  var classlist_url = classroom_class_list_view_all
  let response = await axios.post(classlist_url, { 'classroom_id': classroom_id }, auth_config)
  .catch(error => {
      console.log(error)
      res.render('error_page', {});
  })
  var response_data = response.data
  classroom_details['class_list'] = response_data['class_list']
  console.log(classroom_details)
  res.render('view_classroom_class_list', classroom_details);
}

router.updateClassroomClass = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var class_id = words[words.length-2]
  var class_details = await getClassroomClassDetails(res, req, class_id)
  console.log('class_details found')
  console.log(class_details)
  res.render('update_classroom_class', class_details);
}

router.updateClassroomClassSubmit = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var class_id = words[words.length-2]
  updtateClassroomClass(res, req, req.body, class_id)
  res.redirect('/');
}

module.exports = router;
