angular.module('starter.controllers', ['starter.services','ngStorage','chart.js'])

.controller('AppCtrl', function(){})
.controller('GoalsCtrl', function($scope,  $ionicPopup, $localStorage, Goal, Log) {
  $scope.goals = Goal.list();

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
    $scope.goals = Goal.list();
  };

})

.controller('GoalCtrl', function($scope, $stateParams, $state, Goal, Log) {
  $scope.goal = {};
  if ($stateParams.goalId) {
    $scope.goal = Goal.get($stateParams.goalId); 
  }
  
  $scope.createGoal = function() {
    Goal.create($scope.goal);
    $state.go('app.goals');
  };

  $scope.editGoal = function() {
    Goal.update($scope.goal);
    $state.go('app.goals');
  }
  if ($scope.goal.logs) {
    $scope.getGoalLogs = Log.getGoalLogs;
    $scope.chartData = Log.graphData($scope.goal);
  }

})

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
});
