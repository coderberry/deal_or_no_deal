'use strict';

var Briefcase = function() {
  this.init.apply(this, arguments);
}
Briefcase.prototype = {
  init: function(id, amount) {
    this.id = id;
    this.amount = amount;
    this.state = 'available'; // available, unavailable, selected
  },
  class: function() {
    if (this.state == 'available') {
      return '';
    }
    else if (this.state == 'unavailable') {
      return 'disabled';
    }
    else {
      return 'chosen';
    }
  },
  select: function() {
    this.state = 'selected';
  },
  remove: function() {
    this.state = 'unavailable';
    this.amount.turnOff();
  }
}

var Amount = function() {
  this.init.apply(this, arguments);
}
Amount.prototype = {
  init: function(amount) {
    this.value = amount;
    this.state = 'on';
  },
  class: function() {
    return (this.state == 'on' ? '' : 'disabled');
  },
  turnOff: function() {
    this.state = 'off';
  }
}

var sampleAndRemove = function(values) {
  var index = Math.floor(Math.random() * values.length);
  return values.splice(index, 1)[0];
}

dealOrNoDealApp.controller('MainCtrl', function($scope) {

  window.scope = $scope;

  $scope.msg = "Select a briefcase";

  var amounts = [
    .01, 1, 5, 10, 25, 50, 75, 100, 200, 300, 400, 500, 750,
    1000, 5000, 10000, 25000, 50000, 75000, 100000, 200000, 
    300000, 400000, 500000, 750000, 1000000
  ];

  $scope.amounts = [];
  for (var i=0; i < amounts.length; i++) {
    $scope.amounts.push(new Amount(amounts[i]));
  }

  $scope.currentOffer = function() {
    var totalAmount = 0;
    var availableBriefcases = 0;
    for (var i=0; i<$scope.briefcases.length; i++) {
      if ($scope.briefcases[i].state != 'unavailable') {
        totalAmount += $scope.briefcases[i].amount.value;
        availableBriefcases += 1;
      }
    }
    return totalAmount / (availableBriefcases - 1);
  }

  $scope.briefcases = [];
  var availableValues = $scope.amounts.slice(0);
  for (var i=1; i <= 26; i++) {
    var amount = sampleAndRemove(availableValues);
    $scope.briefcases.push(new Briefcase(i, amount));
  }

  $scope.chooseBriefcase = function(briefcase) {
    if ($scope.chosenBriefcase) {
      briefcase.remove();
    }
    else {
      $scope.chosenBriefcase = briefcase;
      briefcase.select();
      $scope.msg = "You have chosen briefcase " + $scope.chosenBriefcase.id + ". Pick 6 briefcases";
    }
  }

  $scope.lowAmounts = function() {
    return $scope.amounts.slice(0, $scope.amounts.length/2);
  }

  $scope.highAmounts = function() {
    return $scope.amounts.slice($scope.amounts.length/2);
  }
});
