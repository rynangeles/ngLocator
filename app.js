var app = angular.module('app', ['locator']);

app.controller('AppCtrl', function($scope) {
  $scope.locations = [];
  
  this.addLocation = function(location){
    $scope.locations.push(angular.copy(location));
    location.name = '';
    location.detail.address = "";
    console.log($scope.locations);
  };
});
