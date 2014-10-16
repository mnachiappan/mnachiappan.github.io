'use strict';

redditApp.factory('Reddit', ['$http', function($http){
	return {
		getRecentHeadlines: function(query, callback) {
			$http.get('http://www.reddit.com/r/' + query + '/new.json')
				.success(function (data){
					callback(null, data);
				})
				.error(function (e){
					callback(e);
				});
		},
		getTopHeadlines: function (query, callback) {
			$http.get('http://www.reddit.com/r/' + query + '/top.json')
				.success(function (data){
					callback(null, data);
				})
				.error (function (e){
					callback(e);
				});
		}
	};
}]);

/* Controllers */

redditApp.controller('redditController', ['$scope', 'Reddit', 
  function($scope, Reddit){
  	var Reddit = Reddit;
  	$scope.query;

  	$scope.executeSearch = function(){
  		console.log("executing search, query: " + $scope.query);
  		Reddit.getRecentHeadlines($scope.query, function (error, data){
  			if (!error){
  				$scope.recentHeadlines = data.data.children;
  				Reddit.getTopHeadlines($scope.query, function(error, data){
  					if (!error){
  						$scope.topHeadlines = data.data.children;
  					} else{
  						console.log("error finding this query: " + $scope.query);
  					}
  				});
  			} else{
  				console.log("error finding this query: " + $scope.query);
  			}
  		})
  	}
   
    $scope.recentHeadlines;
    
    $scope.topHeadlines; 
  }]);
