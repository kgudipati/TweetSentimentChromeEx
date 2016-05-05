'use strict';

angular.module('app').controller('tweetCtrl', function ($http, $scope, tweetStorage) {

    $scope.tweetStorage = tweetStorage;

    $scope.$watch('tweetStorage.data', function() {
        $scope.recList = $scope.tweetStorage.data;
    });

    $scope.tweetStorage.findAll(function(data){
        $scope.recList = data;
        $scope.$apply();
    });

    $scope.add = function() {
        // https://twitter.com/i/tweet/create
        var tweetText = $scope.newTweet;
        console.log(tweetText);
        
        // get the current page url, only allow API call from twitter page
        chrome.tabs.query({'active': true, 'currentWindow': true}, function (tabs) {
            var url = tabs[0].url;
            
            // only run the chrome extension from twitter
            var temp = document.createElement("a"); 
            temp.href = url; 
            var baseURL = temp.origin + "/";
            
            if (baseURL.localeCompare("https://twitter.com/") == 0) {
                // send to Sentiment Analysis API before storing in chrome storage
                var data = {
                    username: 'test',
                    tweet: tweetText
                }
                
                // send the post request with tweet data
                $http({
                    method: 'POST',
                    url: 'http://localhost:8000/getTweetSentiment',
                    data: data
                }).then(function successCallback(response) {
                    // this callback will be called asynchronously
                    // when the response is available

                    var tweet = {
                        username: response.data.username,
                        tweet: response.data.tweet,
                        sentiment: response.data.sentiment
                    }

                    // send the tweet and analysis to the chrome storage
                    tweetStorage.add(tweet);

                  }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log("Error with API Post Request");
                });
            }
        });
        
        $scope.newTweet = '';
    }

    $scope.remove = function(rec) {
        tweetStorage.remove(rec);
    }

    $scope.removeAll = function() {
        tweetStorage.removeAll();
    }

});