var myApp = angular.module('myApp', []);



myApp.controller("WelcomeController",['$scope', '$http', function($scope, $http){
   $scope.note = {};
   $scope.nameArray = [];

   //POST
   $scope.clickButton = function(kitty){
      $http.post('/data', kitty).then(function(response){
         $scope.getMessage();
         console.log(response);
      });
   };

   //GET
   $scope.getMessage = function(){
      $http.get('/data').then(function(response){
         $scope.nameArray = response.data;
      });
   };

   $scope.getMessage();
}]);

