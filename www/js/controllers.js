angular.module('starter.controllers', ['starter.services','ngStorage','chart.js'])

.controller('AppCtrl', function(){})
.controller('GoalsCtrl', function($scope,  $ionicPopup, $localStorage, Goal, Log) {
  $scope.init = function () {
    $scope.goals = Goal.list();
  }
  $scope.init();
  // LOG pop up
  $scope.showLog = function(goalId) {
    $scope.log = {date: new Date()};
    var logPopup = $ionicPopup.show({
      templateUrl: 'templates/newLog.html',
      title: 'Entry Savings',
      scope: $scope,
      style : 'height: 70%',
      buttons: [{ text: 'Cancel' },
      {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
          return $scope.addLog(goalId);
        }
      }]
    });
  };

  $scope.log = {date: new Date()};
  $scope.addLog = function(goalId) {
    // check mandatory attributes
    if (!$scope.log || !$scope.log.amount || !$scope.log.date) return;
    Log.create($scope.log, goalId);
  }

  $scope.deleteGoal = function(goalId) {
    Goal.delete(goalId);
    $scope.init();
  };

  $scope.reset = function() {
    Goal.deleteAll();
    $scope.init();
  };

})

.controller('GoalCtrl', ['$scope', '$stateParams', '$state', '$ionicPlatform', 'Goal', 'Log' , 'ImageService',
  function($scope, $stateParams, $state, $ionicPlatform, Goal, Log, ImageService) {
  $scope.goal = {};
  if ($stateParams.goalId) {
    $scope.goal = Goal.get($stateParams.goalId); 
    if ($scope.goal.logs) {
      $scope.getGoalLogs = Log.getGoalLogs;
      $scope.chartData = Log.graphData($scope.goal);
    }
  }
  
  $ionicPlatform.ready(function() {
    $scope.addImage = function(type) {
      ImageService.handleMediaDialog(type).then(function(data) {
        $scope.goal.img = data;
      });
    }
  });

  $scope.createGoal = function() {
    Goal.create($scope.goal);
    $state.transitionTo('app.goals', {}, { reload: true, inherit: true, notify: true });
    $scope.goal = {};
  };

  $scope.editGoal = function() {
    Goal.update($scope.goal);
    $state.go('app.goals', {}, {reload: true});
  }
}])

.controller('LogsCtrl', function($scope, Log, Goal) {
  $scope.logs = Log.allLogs();
  $scope.getGoalName = function(goalId) {
    var goal = Goal.get(goalId);
    if (!goal) return '';
    return goal.title;
  }

  $scope.deleteLog = function(logId) {
    Log.delete(logId);
    $scope.logs = Log.allLogs();
  };
})

.controller('TipCtrl', function($scope, $http) {
  $scope.tips = [];

  var init = function(){
    console.log('called init');
    // read tips from file
    $http.get("js/files/tips_thesimpledollar.json").success(function(fileContent) {
      $scope.tips = fileContent;
    }).error(function(error) {
      console.log(error);
      console.log('Something went wrong..');
    });
  }
  init();
  $scope.toggleTip = function(index) {
    $scope.tips[index].visible = !($scope.tips[index].visible || false);
  }
});