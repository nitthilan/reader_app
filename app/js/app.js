'use strict';

window.routes =
{
  "/view1": {
    templateUrl: 'partials/partial1.html', 
    controller: 'MyCtrl1', 
    requireLogin: false
  },
  "/view2": {
    templateUrl: 'partials/partial2.html', 
    controller: 'MyCtrl2', 
    requireLogin: true
  }
};
// Declare app level module which depends on filters, and services
var MyApp = angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers', 'ngResource'])

MyApp
.config(['$routeProvider', function($routeProvider) {
  for(var path in window.routes){
    $routeProvider.when(path, window.routes[path]);
  }
  $routeProvider.otherwise({redirectTo: '/view1'});
}])
.run(function($rootScope, SessionService){
  $rootScope.$on("$locationChangeStart", function(event, next, current) {
    for(var i in window.routes) {
      if(next.indexOf(i) != -1) {
        if(window.routes[i].requireLogin && !SessionService.getUserAuthenticated()) {
          alert("You need to be authenticated to see this page!");
          event.preventDefault();
        }
      }
    }
  });
});
