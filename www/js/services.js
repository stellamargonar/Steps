angular.module('starter.services', ['ngStorage'])

.factory('Goal', function($localStorage) {
	var factoryInstance = {};

	factoryInstance.list = function() {
		return $localStorage.goals.filter(function(goal) {
			return goal != undefined;
		});
	};
	factoryInstance.deleteAll = function() {
		$localStorage.goals = [];
	};

	factoryInstance.get = function(goalId) {
		return $localStorage.goals[goalId];
	};
	factoryInstance.create = function(goal) {
		var goals = $localStorage.goals || [];
		goal.id = goals.length;
		goal.saved = 0;
		goals.push(goal);
		$localStorage.goals = goals;
		return goal;
	};
	factoryInstance.update = function(goal) {
		var goals = $localStorage.goals || [];
		if (!goal.id || goals.length < goal.id) {
			return 'Invalid ID';
		}
		goals[goal.id] = goal;
		$localStorage.goals = goals;
		return null;
	};
	factoryInstance.delete = function(goalId) {
		var goals = $localStorage.goals || [];
		if (goalId == undefined || goals.length < goalId) {
			console.log('Invalid ID ' + goalId);
			return 'Invalid ID';
		}
		goals[goalId] = undefined;
		$localStorage.goals = goals;
		return null;
	};

	

	return factoryInstance;
})
.factory('Log', function($localStorage, Goal) {
	var factoryInstance = {};

	var updateSaved = function(goal) {
		// sum all log savings
		goal.saved = (goal.logs || []).reduce(function(previousValue, log) {
			if (log == undefined)
				return previousValue;
			return previousValue + log.amount;
		},0);
		goal.saved  = Math.ceil(goal.saved * 100)/100;
		return goal;
	};

	var orderByDate = function(logs) {
		function compare(a,b) {
		  if (a.date > b.date)
		    return -1;
		  else if (a.date < b.date)
		    return 1;
		  else 
		    return 0;
		}
		logs.sort(compare);
		return logs;
	};

	factoryInstance.allLogs = function() {
		var logs = [];
		Goal.list().forEach(function(goal) {
			logs = logs.concat(goal.logs);
		});
		return orderByDate(logs.filter(function(log) {
			return log;
		}));
	};
	factoryInstance.getGoalLogs = function(goalId) {
		var goal = Goal.get(goalId);
		if (!goal) return;
		var logs = goal.logs;
		logs = logs.filter(function(log) {
			return log != null && log != undefined;
		});
		return orderByDate(logs);
	};
	factoryInstance.create = function(log, goalId) {
		console.log('Create log ' + goalId);
		console.log(log);
		var goal = Goal.get(goalId);
		var logs = goal.logs || [];

		log.id = goalId + '_' + (logs.length);
		log.goal = goalId;
		logs.push(log);
		goal.logs = logs;

		updateSaved(goal);

		Goal.update(goal);
	};
	factoryInstance.delete = function(logId) {
		console.log('Delete ' + logId);
		var goalId = logId.split('_')[0];
		var logIndex = logId.split('_')[1];

		var goal = Goal.get(goalId);
		goal.logs[logIndex] = undefined;

		updateSaved(goal);
		Goal.update(goal);
	};

	factoryInstance.graphData = function(goal) {
		if (!goal) return {labels:[], data:[]};
		// get logs ordered by date
		var logs = this.getGoalLogs(goal.id).reverse();

		// define grouping size
		var minDate = new Date(logs[0].date);
		minDate.setHours(0,0,0,0);
		minDate = minDate.getTime();

		var maxDate = new Date(logs[logs.length-1].date);
		maxDate.setHours(0,0,0,0);
		maxDate = maxDate.getTime();

		var chartData = {};


		var rangeSize = 86400 * 1000;
		var previousDate = minDate - rangeSize;
		var currentDate = minDate;
		var partialTotal = 0;
		var logIndex = 0;

		while((currentDate <= maxDate + rangeSize)&& logIndex < logs.length ){
			var logDate = new Date(logs[logIndex].date).getTime();
			if (previousDate <= logDate && logDate < (previousDate + rangeSize)) {
				// add to current date
				var current = chartData[previousDate] || partialTotal;
				current += logs[logIndex].amount;
				chartData[previousDate] = current;
				partialTotal = chartData[previousDate];
				logIndex++;
			}
			else {
				// step to next
				previousDate = currentDate;
				currentDate += rangeSize;
			}
		}		
		// generate labels and data
		var labels = [];
		var data = [];
		var fixedLine = [goal.amount];

		var orderedKeys = Object.keys(chartData).map(function(key) {return parseInt(key);}).sort();
		for (var i=orderedKeys[0]; i < new Date().getTime() ; i += rangeSize) {
			var date = new Date(i);
			var label = date.getDate() + '/' + (date.getMonth()+1);
			// labels.push(label);
			labels.push('');

			if (chartData[i]) {
				data.push( chartData[i]);
			}
			else data.push(null);

			if (i>orderedKeys[0])
				fixedLine.push(null);
		}
		fixedLine.pop();
		fixedLine.push(goal.amount);
		return {labels: labels, data: [data, fixedLine]};
	};
	return factoryInstance;
});