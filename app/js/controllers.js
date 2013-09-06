'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('MyCtrl1', ['$scope', '$resource', '$location', 'SessionService', function($scope, $resource, $location, SessionService) {
    $scope.loginMessage = "Not logged in";
    $scope.login = function(username,password){
      var outer = this;
      console.log("Button clicked", outer.username, outer.password);
      
      var serverAuth = $resource('api/v1/session/login', {}, 
        { login: {method:'POST', params:{username:outer.username,password:outer.password}} });
      serverAuth.login(function(response){
        //console.log("Login successful: ", response);
        SessionService.setUserAuthenticated(true);
        //console.log("User authenticated ", SessionService.getUserAuthenticated());
        $location.path( "/view2" );
      }, 
      function(err){
        //console.log("Login", JSON.stringify(err));
        $scope.loginMessage = "Login Failed "+err.data.message;
      });
    }
  }])
  .controller('MyCtrl2', ['$scope', '$resource', '$location', 'SessionService', function($scope, $resource, $location, SessionService) {

    $scope.logout = function(){
      console.log("LogOut");
      SessionService.setUserAuthenticated(false);
      var serverAuth = $resource('api/v1/session/logout', {}, 
        { logout: {method:'GET'}});
      serverAuth.logout();
      $location.path( "/view1" );
    };
    
    var Subscriptions = $resource('reader/subscriptions',{}, {
      get: {method:'GET', isArray: true, headers: [{'Content-Type': 'application/json'}, {'Accept': 'application/json'}]}
      });
    $scope.subscriptions = Subscriptions.get();

    $scope.addFeedMessage = "Enter a rss feed";
    $scope.add = function(feed){
      var postSub = $resource('reader/subscriptions/xmlUrl',{}, {
        add: {method:'POST', headers: [{'Content-Type': 'application/json'}, {'Accept': 'application/json'}]}
      });
      postSub.add({},{url:feed}, function(response){
        console.log(response);
        $scope.addFeedMessage = "Feed added successfully: "+JSON.stringify(response.name);
        $scope.subscriptions = Subscriptions.get();
        $scope.feedUrl = null;
      },
      function(err){
        console.log(err.data);
        console.log(JSON.stringify(err));
        $scope.addFeedMessage = "Error in adding feed:"+JSON.stringify(err.data);
      });
    }

    $scope.getArticle = function(subscriptionId){
      console.log(subscriptionId);
      var Articles = $resource('reader/articles/:id',{}, {
        get: {method:'GET', isArray: true, headers: [{'Accept': 'application/json'}]}
      });
      $scope.articles = Articles.get({id:subscriptionId});
    }
    
    /* $scope.subscriptions = [
      {
        id: 909090909,
        name: 'IBN Live',
        type:'rss',
        subscriptionUrl:'https://',
        siteUrl:'https://',
        categories:['news','sports']
      }
    ];*/

 
  }]);
