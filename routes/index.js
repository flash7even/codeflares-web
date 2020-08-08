'use strict'

var homeController = require('./home.js');
var problemController = require('./problem.js');
var categoryController = require('./category.js');
var trainingController = require('./training.js');
var teamController = require('./team.js');
var classroomController = require('./classroom.js');
var notificationController = require('./notification.js');
var contestController = require('./contest.js');
var blogController = require('./blog.js');
var commentController = require('./comment.js');
var voteController = require('./vote.js');
var followerController = require('./follower.js');
var apiController = require('./api.js');
var cpanelController = require('./cpanel.js');

module.exports = function(newApp) {
    newApp.get('/', homeController.showHome);
    newApp.get('/login/', homeController.showLogIn);
    newApp.get('/change/password/', homeController.changePassword);
    newApp.post('/change/password/', homeController.changePasswordSubmit);
    newApp.get('/forgot/password/', homeController.showForgotPassword);
    newApp.post('/forgot/password/', homeController.showForgotPasswordSubmit);
    newApp.get('/user/confirm/password/*', homeController.ForgotPasswordClicked);
    newApp.post('/confirm/forgot/password/*', homeController.ForgotPasswordConfirm);
    newApp.post('/login/', homeController.logInSubmit);
    newApp.get('/logout/', homeController.logOutSubmit);
    newApp.get('/signup/', homeController.showSignUp);
    newApp.get('/request/error/', homeController.showErrorPage);



    newApp.get('/user/activate/*', homeController.ActivateUserAccountClicked);
    newApp.post('/signup/', homeController.signUpSubmit);
    newApp.get('/profile/*', homeController.showUserProfile);
    newApp.get('/user/leaderboard/*', homeController.leaderboard);
    newApp.get('/user/contributors/*', homeController.contributorsList);
    newApp.get('/user/topsolvers/*', homeController.topSolverList);
    newApp.get('/update/profile/', homeController.updateUserProfile);
    newApp.post('/update/profile/', homeController.updateUserProfileSubmit);
    newApp.get('/settings/update/', homeController.updateUserSettings);
    newApp.post('/settings/update/', homeController.updateUserSettingsSubmit);
    newApp.get('/user/submissions/*', homeController.showUserSubmissionHistory);


    newApp.get('/contact/us/', homeController.contactUs);
    newApp.get('/about/us/', homeController.aboutUs);
    newApp.post('/contact/us/', homeController.contactUsSubmit);


    newApp.get('/user/sync/*', homeController.syncUserData);
    newApp.get('/team/sync/*', teamController.syncTeamData);

    newApp.get('/follow/*', followerController.followUser);
    newApp.get('/unfollow/*', followerController.unfollowUser);
    newApp.get('/user/followers/*', followerController.showUserFollowerList);
    newApp.get('/user/followings/*', followerController.showUserFollowingList);

    
    newApp.get('/blog/post/add/*', blogController.addBlogForm);
    newApp.post('/blog/post/add/*', blogController.addBlogFormSubmit);
    newApp.get('/blog/list/*', blogController.viewBlogList);
    newApp.get('/blog/own/list/', blogController.viewOwnBlogList);
    newApp.get('/blog/post/view/*', blogController.viewBlogPost);
    newApp.get('/blog/delete/*', blogController.deleteBlogPost);
    newApp.get('/blog/update/*', blogController.updateBlogPost);
    newApp.post('/blog/update/*', blogController.updateBlogPostSubmit);
    newApp.get('/blog/mark/*', blogController.markBlogPost);
    newApp.get('/blog/unmark/*', blogController.unmarkBlogPost);


    newApp.post('/blog/post/comment/*', commentController.addCommentForBlogPost);
    newApp.post('/blog/post/reply/*', commentController.addReplyForBlogPost);
    newApp.post('/problem/comment/*', commentController.addCommentForProblem);
    newApp.post('/problem/reply/*', commentController.addReplyForProblem);
    newApp.post('/category/comment/*', commentController.addCommentForCategory);
    newApp.post('/category/reply/*', commentController.addReplyForCategory);


    newApp.get('/vote/*', voteController.addVote);


    newApp.get('/problem/add/', problemController.addProblemForm);
    newApp.get('/problem/view/*', problemController.viewSingleProblem);
    newApp.post('/problem/add/', problemController.addProblemFormSubmit);
    newApp.get('/problem/list/*', problemController.viewProblemList);
    newApp.get('/problem/pending/list/*', problemController.viewPendingProblemList);
    newApp.post('/problem/list/', problemController.viewProblemListAfterFormSubmit);
    newApp.get('/problem/user/status/flag/*', problemController.setProblemStatusFlag);
    newApp.get('/problem/user/status/remove/*', problemController.setProblemStatusRemove);
    newApp.get('/problem/user/status/clear/*', problemController.setProblemStatusClear);
    newApp.get('/problem/submission/history/*', problemController.getSubmissionHistory);
    newApp.get('/problem/resource/history/*', problemController.getResourceHistory);
    newApp.get('/flagged/problem/list/', problemController.showFlaggedProblemList);
    newApp.get('/problem/active-status/approve/*', problemController.approveProblem);
    newApp.get('/problem/active-status/disapprove/*', problemController.disapproveProblem);


    newApp.get('/problem/resource/add/*', problemController.addProblemResourceForm);
    newApp.post('/problem/resource/add/*', problemController.addProblemResourceFormSubmit);
    newApp.get('/category/resource/add/*', categoryController.addCategoryResourceForm);
    newApp.post('/category/resource/add/*', categoryController.addCategoryResourceFormSubmit);


    newApp.get('/category/add/', categoryController.addCategoryForm);
    newApp.get('/category/view/*', categoryController.viewSingleCategory);
    newApp.post('/category/add/', categoryController.addCategoryFormSubmit);
    newApp.get('/category/list/', categoryController.viewCategoryList);
    newApp.get('/category/list/root/*', categoryController.viewCategoryListByRoot);
    newApp.post('/category/list/', categoryController.viewCategoryListAfterFormSubmit);
    newApp.get('/category/resource/history/*', categoryController.viewCategoryResourceHistory);
    newApp.get('/category/toppers/*', categoryController.viewCategoryToppers);

    newApp.get('/training/individual/*', trainingController.viewIndividualTraining);
    newApp.get('/training/team/*', trainingController.viewTeamTraining);


    newApp.get('/team/add/', teamController.addTeamForm);
    newApp.post('/team/add/', teamController.addTeamFormSubmit);
    newApp.get('/team/update/*', teamController.updateTeamForm);
    newApp.post('/team/update/*', teamController.updateTeamFormSubmit);
    newApp.get('/team/list/*', teamController.viewTeamList);
    newApp.get('/team/view/*', teamController.viewTeam);
    newApp.get('/team/confirm/*', teamController.confirmTeam);
    newApp.get('/team/reject/*', teamController.rejectTeam);
    newApp.get('/team/delete/*', teamController.deleteTeam);
    newApp.get('/team/followers/*', followerController.showTeamFollowerList);
    

    newApp.get('/classroom/add/', classroomController.addClassroomForm);
    newApp.post('/classroom/add/', classroomController.addClassroomFormSubmit);
    newApp.get('/classroom/update/*', classroomController.updateClassroomForm);
    newApp.post('/classroom/update/*', classroomController.updateClassroomFormSubmit);
    newApp.get('/classroom/list/', classroomController.viewClassroomList);
    newApp.get('/classroom/training/*', classroomController.trainingClassroom);
    
    newApp.get('/classroom/confirm/*', classroomController.confirmClassroom);
    newApp.get('/classroom/reject/*', classroomController.rejectClassroom);
    newApp.get('/classroom/delete/*', classroomController.deleteClassroom);
    newApp.get('/classroom/member/delete/*', classroomController.deleteClassroomMember);

    newApp.get('/classroom/task/add/*', classroomController.addClassroomTaskForm);
    newApp.post('/classroom/task/add/*', classroomController.addClassroomTaskFormSubmit);
    newApp.get('/classroom/task/update/*', classroomController.updateClassroomTask);
    newApp.post('/classroom/task/update/*', classroomController.updateClassroomTaskSubmit);
    newApp.get('/classroom/task/delete/*', classroomController.deleteClassroomTask);
    newApp.get('/classroom/task/view/*', classroomController.viewClassroomTaskList);

    newApp.get('/classroom/class/add/*', classroomController.addClassroomClassForm);
    newApp.post('/classroom/class/add/*', classroomController.addClassroomClassFormSubmit);
    newApp.get('/classroom/class/update/*', classroomController.updateClassroomClass);
    newApp.post('/classroom/class/update/*', classroomController.updateClassroomClassSubmit);
    newApp.get('/classroom/class/delete/*', classroomController.deleteClassroomClass);
    newApp.get('/classroom/class/view/*', classroomController.viewClassroomClassList);

    newApp.get('/notification/list/', notificationController.viewNotificationPage);
    newApp.get('/notification/read/all/', notificationController.readAllNotification);
    newApp.get('/notification/read/single/*', notificationController.readSingleNotification);


    newApp.get('/contest/add/', contestController.addContestForm);
    newApp.get('/contest/standings/*', contestController.viewContestStandings);
    newApp.post('/update/contest/standings/*', contestController.viewContestStandingsAfterUpdate);
    newApp.post('/contest/add/', contestController.addContestFormSubmit);
    newApp.get('/contest/view/*', contestController.viewContest);
    newApp.get('/contest/list/', contestController.viewAllContest);
    newApp.post('/contest/confirm/*', contestController.confirmContestFormSubmit);
    newApp.get('/contest/announcements/*', contestController.viewContestAnnouncements);
    newApp.post('/contest/entry/announcement/*', contestController.addContestAnnouncementSubmit);


    newApp.get('/control/panel/user/', cpanelController.showUserControl);
    newApp.get('/control/user/update/*', cpanelController.updateUserControl);
    newApp.post('/control/user/update/*', cpanelController.updateUserControlSubmit);

    newApp.post('/api/database/problem/', apiController.getProblems);
    newApp.post('/api/leaderboard/', apiController.getLeaderboard);
    newApp.post('/api/user/submission/*', apiController.getUserSubmission);
    newApp.post('/api/problem/submission/*', apiController.getProblemSubmission);

}
