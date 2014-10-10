/**
 * Created by starov on 01.04.14.
 */
var fruitStory = angular.module('fruitStory',['hc.marked', 'smoothScroll','firebase', 'ngStorage', 'cfp.loadingBar', 'fireUser','ui.router', 'videosharing-embed', 'angularMoment']);
var controllers = {};

fruitStory.run(function(amMoment){
    amMoment.changeLocale('ru');
});

angular.module('fireUser').value('FireUserConfig', {
    url:'https://frktfeeds.firebaseio.com/'
});

fruitStory.controller(controllers);


controllers.feeds = function ($rootScope, $scope, Types, $localStorage, $firebase, $firebaseSimpleLogin, cfpLoadingBar) {

    $scope.mtd = {}; //an object for universal methods

    cfpLoadingBar.start();

    $scope.$storage=$localStorage.$default(
        {
            feeds:{
                personal:{
                    title:'personal',
                    feed:[],
                    rating:{},
                    ratingMode:{news:true,plus:true,zero:true,minus:false},
                    selected:[],
                    filter:''
                },
                publicFeed:{
                    title:'publicFeed',
                    ratingMode:{news:true,plus:true,zero:true,minus:false},
                    selected:[],
                    rating:[],
                    filter:''
                }
            }
        }
    );



    $scope.localReset = function () {
        $localStorage.$reset();
    };

    $scope.feeds=$scope.$storage.feeds;





    //LOGIN

    $scope.$on('fireuser:login_error', function (data) {
        $scope.error='Не удалось войти.'
    });

    $scope.$on('fireuser:login', function (data, user) {

        $scope.mtd.persona=user.md5_hash;
    });


    $scope.$on('fireuser:logout', function (data) {

        $scope.mtd.persona=false;
    });


    $scope.mtd.personae=$firebase(new Firebase('https://frktfeeds.firebaseio.com/personal/feed')).$asObject();

    $scope.$on('fireuser:user_created', function (data, user) {
        $scope.mtd.personae[user.md5_hash] = {
            type:'persona',
            title:$scope.mtd.userName,
            gender:$scope.mtd.userGender,
            letters:$scope.mtd.userLetters,
            letter:$scope.mtd.userLetters,
            time:Date.now(),
            author:user.md5_hash,
            md5_hash: user.md5_hash
        };
        $scope.mtd.personae.$save();
        $scope.mtd.userLetters=null;
        $scope.mtd.userName=null;
        if($scope.feedTitle!='personal') {
            $scope.mtd.switchToPersonal();
        }
        $scope.mtd.creating=0;
    });



    //FIREBASE CONNECTIONS


    // Connection status

    $scope.status={};
    $scope.status.loaded=false;

    $scope.status.online=false;


    var connectedRef = new Firebase("https://frktfeeds.firebaseio.com/.info/connected");
    connectedRef.on("value", function(snap) {
        if (snap.val() === true) {
            $scope.status.online=true;
        } else {
            $scope.status.online=false;
        }
    });

    // public ratings

    var ratingSync = $firebase(new Firebase('https://frktfeeds.firebaseio.com/public/rating'));
    $scope.fireRating=ratingSync.$asObject();

    //public feed

    $scope.publicFeed=$firebase(new Firebase('https://frktfeeds.firebaseio.com/public/feed')).$asArray();
    $scope.publicFeed.$loaded().then(function () {

        $scope.mtd.switchToPublic();
        $scope.status.publicLoaded=true;
    });

    //public rates

    $scope.mtd.rates={};
    var ratesSync = $firebase(new Firebase('https://frktfeeds.firebaseio.com/public/rates'));


    // users

    var usersSync = $firebase(new Firebase('https://frktfeeds.firebaseio.com/users'));
    var users=usersSync.$asObject().$bindTo($scope, 'mtd.users');

    // authentication connection

    $scope.auth=$firebaseSimpleLogin(new Firebase('https://frktfeeds.firebaseio.com/'));

    //open public feed

    $scope.mtd.switchToPublic = function () {
        var feedTitle = 'publicFeed';
        $scope.feed =$scope.publicFeed;
        $scope.mtd.unwatch = $scope.feed.$watch(function () {
            $scope.mtd.updateTree();
        });
        $scope.feedTitle=feedTitle;
        $scope.mtd.switchRate('global');
        $scope.ratingMode = $scope.feeds[feedTitle].ratingMode || {news:true,plus:true,zero:true,minus:false};
        $scope.mtd.selected = $scope.feeds[feedTitle].selected || [];
        $scope.mtd.firebase=true;
    };


    // personal ratings

    var personalRatingSync = $firebase(new Firebase('https://frktfeeds.firebaseio.com/personal/rating'));


    //personal feed

    $scope.personalFeed=$firebase(new Firebase('https://frktfeeds.firebaseio.com/personal/feed')).$asArray();
    $scope.personalFeed.$loaded().then(function () {
        $scope.status.personalLoaded=true;

    });

    //personal rates

    $scope.mtd.personalRates={};
    var personalRatesSync = $firebase(new Firebase('https://frktfeeds.firebaseio.com/personal/rates'));



    $scope.mtd.switchToPersonal = function () {
        var feedTitle = 'personal';
        $scope.feed =$scope.personalFeed;
        $scope.mtd.unwatch = $scope.feed.$watch(function () {
            $scope.mtd.updateTree();
        });
        $scope.feedTitle=feedTitle;
        $scope.mtd.switchRate('personal');
        $scope.ratingMode = $scope.feeds[feedTitle].ratingMode || {news:true,plus:true,zero:true,minus:false};
        $scope.mtd.selected = $scope.feeds[feedTitle].selected || [];
        $scope.mtd.firebase=true;
    };



    $scope.mtd.switchRate = function (type) {
        if (type=='global') {
            if ($scope.mtd.personalRating) {
                $scope.mtd.personalRating.then(function(unbind) {unbind()});
                $scope.mtd.personalRates.then(function(unbind) {unbind()});

            }
            $scope.mtd.publicRating = ratingSync.$asObject().$bindTo($scope,'rating');
            $scope.mtd.publicRates=ratesSync.$asObject().$bindTo($scope, 'mtd.rates');
            $scope.mtd.ratingView='global';
        }
        if (type=='local') {
            if ($scope.mtd.personalRating) {
                $scope.mtd.personalRating.then(function(unbind) {unbind()});
                $scope.mtd.personalRates.then(function(unbind) {unbind()});
                $scope.rating=$scope.feeds.personal.rating;

            }
            if ($scope.mtd.publicRating) {
                $scope.mtd.publicRating.then(function(unbind) {unbind()});
                $scope.mtd.publicRates.then(function(unbind) {unbind()});
                $scope.rating=$scope.feeds.publicFeed.rating;

            }
            $scope.mtd.ratingView='local';
        }
        if (type=='personal') {
            if ($scope.mtd.publicRating) {
                $scope.mtd.publicRating.then(function(unbind) {unbind()});
                $scope.mtd.publicRates.then(function(unbind) {unbind()});

            }
            $scope.mtd.personalRating = personalRatingSync.$asObject().$bindTo($scope,'rating');
            $scope.mtd.personalRates=personalRatesSync.$asObject().$bindTo($scope, 'mtd.rates');
            $scope.mtd.ratingView='global';
        }

    };

};



fruitStory.filter('objectAsArray', function() {
    return function(object) {
        var array = [];
        for (var item in object) {
            array.push(object[item]);
        }
        return array;
    }
});

