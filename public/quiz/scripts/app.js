'use strict';

/**
 * @ngdoc overview
 * @name testApp
 * @description
 * # testApp
 *
 * Main module of the application.
 */
angular
  .module('testApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/questionPaper', {
        templateUrl: 'views/questionpaper.json',
        controller: 'QuestionpaperCtrl',
        controllerAs: 'questionPaper'
      })
      /*.when('/question/:qno', {
        templateUrl: 'views/main.html',
        resolve: {
          function() {
            alert('Hi');
          }
        }
      })*/
      .otherwise({
        redirectTo: '/'
      });
  });
