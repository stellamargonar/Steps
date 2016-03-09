// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $compileProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.goals', {
    url: '/goals',
    views: {
      'menuContent': {
        templateUrl: 'templates/goals.html',
        controller: 'GoalsCtrl',
        resolve : {
          goals : function(Goal) {
            return Goal.list();
          }
        }
      }
    }
  })
  .state('app.single', {
    url: '/goals/:goalId',
    views: {
      'menuContent': {
        templateUrl: 'templates/goal.html',
        controller: 'GoalCtrl'
      }
    }
  })
  .state('app.newgoal', {
    url: '/new',
    views: {
      'menuContent': {
        templateUrl: 'templates/newgoal.html',
        controller: 'GoalCtrl'
      }
    }
  })
  .state('app.logs', {
    url: '/logs',
    views: {
      'menuContent': {
        templateUrl: 'templates/logs.html',
        controller: 'LogsCtrl'
      }
    }
  })
    .state('app.tips', {
    url: '/tips',
    views: {
      'menuContent': {
        templateUrl: 'templates/tips.html',
        controller: 'TipCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/goals');
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile|content):|data:image\//);
});
