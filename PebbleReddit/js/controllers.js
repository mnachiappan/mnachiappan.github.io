'use strict';

redditApp.factory('Reddit', ['$http', function($http){
	$http.defaults.useXDomain = false;
	return {
		getRecentHeadlines: function(query, callback) {
			console.log("getting recentHeadlines");
			/*
			$.ajax('http://www.reddit.com/r/' + query + '/new.json',
			{
				async: true,
				crossDomain: true,
				type: 'GET'
				
			});
*/
			/*
			$http({method: 'JSON',
					url: 'http://www.reddit.com/r/' + query + '/new.json'})
			.success(function (data, status){
					//console.log("in success");
					//console.log(data);
					callback(null, data);
				})
				.error(function (data, status){
					//console.log("in error");
					//console.log(e);
					callback(status);
				});
			*/
			$http.get('http://www.reddit.com/r/' + query + '/new.json')
				.success(function (data, status){
					//console.log("in success");
					//console.log(data);
					callback(null, data);
				})
				.error(function (data, status){
					//console.log("in error");
					//console.log(e);
					callback(status);
				});
		},
		getTopHeadlines: function (query, callback) {
			/*
			$http({method: 'JSON',
					url: 'http://www.reddit.com/r/' + query + '/new.json'})
			.success(function (data, status){
					//console.log("in success");
					//console.log(data);
					callback(null, data);
				})
				.error(function (data, status){
					//console.log("in error");
					//console.log(e);
					callback(status);
				});
			*/
			$http.get('http://www.reddit.com/r/' + query + '/top.json')
				.success(function (data, status){
					callback(null, data);
				})
				.error (function (data, status){
					callback(status);
				});
		}
	};
}]);

/* Controllers */

redditApp.controller('redditController', ['$scope', 'Reddit', 
  function($scope, Reddit){
  	var Reddit = Reddit;
  	$scope.query;
  	$scope.errorMessage;
  	$scope.executeSearch = function(){
  		$scope.errorMessage = null;
  		//console.log("executing search, query: " + $scope.query);
  		Reddit.getRecentHeadlines($scope.query, function (error, data){
  			if (!error && data){
  				$scope.recentHeadlines = data.data.children;
  				Reddit.getTopHeadlines($scope.query, function(error, data){
  					if (!error && data){
  						$scope.topHeadlines = data.data.children;
  						console.log($scope.topHeadlines);
  						$scope.errorMessage = null;
  					} else{
  						console.log("error finding this query: " + $scope.query);
  						$scope.errorMessage = "whoops no such subreddit";
  						console.log($scope.errorMessage);
  					}
  				});
  			} else{
  				console.log("error finding this query: " + $scope.query);
  				$scope.errorMessage = "whoops, no such subreddit";
  			}
  		})
  	}
   
    $scope.recentHeadlines;
    
    $scope.topHeadlines; 
  }]);

