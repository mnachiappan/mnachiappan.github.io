'use strict';

redditApp.factory('Reddit', ['$http', function($http){
	$http.defaults.useXDomain = false;
	return {
		getRecentHeadlines: function(query, callback) {
			$http.get('http://www.reddit.com/r/' + query + '/new.json')
				.success(function (data, status){
					callback(null, data);
				})
				.error(function (data, status){
					callback(status);
				});
		},
		getTopHeadlines: function (query, callback) {
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
  		Reddit.getRecentHeadlines($scope.query, function (error, data){
  			if (!error && data){
  				$scope.recentHeadlines = data.data.children;
  				Reddit.getTopHeadlines($scope.query, function(error, data){
  					if (!error && data){
  						$scope.topHeadlines = data.data.children;
  						$scope.errorMessage = null;
  					} else{
  						console.log("error finding this query: " + $scope.query);
  						$scope.errorMessage = "whoops no such subreddit";
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

