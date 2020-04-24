
var homeController = require('./home.js');
var problemController = require('./problem.js');
var categoryController = require('./category.js');

module.exports = function(newApp) {
    /* GET home page. */
    newApp.get('/', homeController.showHome);
    newApp.get('/login/', homeController.showLogIn);
    newApp.get('/signup/', homeController.showSignUp);

    newApp.get('/problem/add/', problemController.addProblemForm);
    newApp.post('/problem/submit/', problemController.problemSubmit);

    newApp.get('/category/add/', categoryController.addCategoryForm);
    newApp.post('/category/submit/', categoryController.categorySubmit);
}
