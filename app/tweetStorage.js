angular.module('app').service('tweetStorage', function ($q) {
    var _this = this;
    this.data = [];

    this.findAll = function(callback) {
        chrome.storage.sync.get('twr', function(keys) {
            if (keys.twr != null) {
                _this.data = keys.twr;
                for (var i=0; i<_this.data.length; i++) {
                    _this.data[i]['id'] = i + 1;
                }
                console.log(_this.data);
                callback(_this.data);
            }
        });
    }

    this.sync = function() {
        chrome.storage.sync.set({twr: this.data}, function() {
            console.log('Data is stored in Chrome storage');
        });
    }

    this.add = function (tweet) {
        var id = this.data.length + 1;
        var twData = {
            id: id,
            username: tweet.username,
            tweet: tweet.tweet,
            sentiment: tweet.sentiment,
            createdAt: new Date()
        };
        this.data.push(twData);
        this.sync();
    }

    this.remove = function(rec) {
        this.data.splice(this.data.indexOf(rec), 1);
        this.sync();
    }

    this.removeAll = function() {
        this.data = [];
        this.sync();
    }

});