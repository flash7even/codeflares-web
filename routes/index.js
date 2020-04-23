
var homeController = require('./home.js');
var problemController = require('./problem.js');

module.exports = function(newApp) {
    /* GET home page. */
    newApp.get('/', homeController.showHome);
    newApp.get('/login/', homeController.showLogIn);
    newApp.get('/signup/', homeController.showSignUp);
    newApp.get('/problem/add/', problemController.addProblemForm);
}
