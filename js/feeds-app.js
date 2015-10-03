/**
 * Created by starov on 01.04.14.
 */
var fruitStory = angular.module('fruitStory',['hc.marked', 'smoothScroll','firebase', 'ngStorage', 'cfp.loadingBar', 'fireUser','ui.router', 'videosharing-embed', 'angularMoment', 'adaptive.googlemaps']);
var controllers = {};

fruitStory.run(function(amMoment){
    amMoment.changeLocale('ru');
});

fruitStory.run(
    [          '$rootScope', '$state', '$stateParams',
        function ($rootScope,   $state,   $stateParams) {

            // It's very handy to add references to $state and $stateParams to the $rootScope
            // so that you can access them from any scope within your applications.For example,
            // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
            // to active whenever 'contacts.list' or one of its decendents is active.
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ]
)

angular.module('fireUser').value('FireUserConfig', {
    url:'https://frktfeeds.firebaseio.com/'
});

fruitStory.config(
    [          '$stateProvider', '$urlRouterProvider', '$locationProvider',
        function ($stateProvider,   $urlRouterProvider, $locationProvider) {

            /////////////////////////////
            // Redirects and Otherwise //
            /////////////////////////////

            $locationProvider.html5Mode(false);

            // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
            $urlRouterProvider

                // The `when` method says if the url is ever the 1st param, then redirect to the 2nd param
                // Here we are just setting up some convenience urls.
                     // .when('/c?id', '/contacts/:id')
                   // .when('/user/:id', '/contacts/:id')

                // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
                .otherwise('/');

            $stateProvider


                .state("personal", {

                    // Use a url of "/" to set a states as the "index".
                    url: "/personal",


                    template: '<div ui-view></div>',
                    controller: 'personal'

                })

                .state("personal.feed", {
                    url: "/:id",
                    templateUrl:"partials/feed.html",
                    controller:"feed"
                })

                .state("public", {

                    // Use a url of "/" to set a states as the "index".
                    url: "",

                    // ui-view within index.html.
                    template: '<div ui-view></div>',
                    controller: 'public'

                })

                .state("public.feed", {
                    url: "/:id",
                    templateUrl:"partials/feed.html",
                    controller:"feed"
                })
        }
    ]
);


fruitStory.controller(controllers);







controllers.personal = function ($scope, $localStorage, $firebase, cfpLoadingBar, $stateParams, $state) {

    var feedTitle = 'personal';
    $scope.mtd.feedTitle=$scope.feedTitle=feedTitle;
    $scope.ratingMode =  {news:true,plus:true,zero:true,minus:false};
    $scope.mtd.selected = $scope.feeds[feedTitle].selected || [];

    //personal feed

    $scope.personalFeed=$firebase(new Firebase('https://frktfeeds.firebaseio.com/personal/feed')).$asArray();
    $scope.personalFeed.$loaded().then(function () {
        $scope.status.personalLoaded=true;

    });
    $scope.feed = $scope.personalFeed;
    var unwatch = $scope.feed.$watch(function () {
        $scope.mtd.updateTree();
    });

    // personal ratings

    personalRatingSync = $firebase(new Firebase('https://frktfeeds.firebaseio.com/personal/rating'));

    //personal rates

    $scope.mtd.personalRates={};
    var personalRatesSync = $firebase(new Firebase('https://frktfeeds.firebaseio.com/personal/rates'));


    if ($scope.mtd.publicRating) {
        $scope.mtd.publicRating.then(function(unbind) {unbind()});
        $scope.mtd.publicRates.then(function(unbind) {unbind()});

    }
    $scope.mtd.personalRating = personalRatingSync.$asObject().$bindTo($scope,'rating');
    $scope.mtd.personalRates=personalRatesSync.$asObject().$bindTo($scope, 'mtd.rates');
    $scope.mtd.ratingView='global';

    $scope.mtd.firebase=true;
    cfpLoadingBar.complete();
    $scope.status.ready=true;
    $state.go('personal.feed');

    if ($scope.unwatch) {
        $scope.unwatch();
        delete $scope.unwatch;
    }

    $scope.unwatch = $scope.personalFeed.$watch(function () {
        $scope.mtd.updateTree();
    })

};




controllers.public = function ($scope, $localStorage, $firebase, cfpLoadingBar, $stateParams, $state) {

    var feedTitle = 'publicFeed';
    $scope.mtd.feedTitle=$scope.feedTitle=feedTitle;
    $scope.ratingMode =  {news:true,plus:true,zero:true,minus:false};
    $scope.mtd.selected = $scope.feeds[feedTitle].selected || [];

    // public ratings

    var ratingSync = $firebase(new Firebase('https://frktfeeds.firebaseio.com/public/rating'));
    $scope.fireRating=ratingSync.$asObject();

    //public feed

    $scope.publicFeed=$firebase(new Firebase('https://frktfeeds.firebaseio.com/public/feed')).$asArray();
    $scope.publicFeed.$loaded().then(function () {
        //  $scope.mtd.switchToPublic();
        $scope.status.publicLoaded=true;
        $scope.feed = $scope.publicFeed;
    });


    //public rates

    $scope.mtd.publicRates={};
    var ratesSync = $firebase(new Firebase('https://frktfeeds.firebaseio.com/public/rates'));


    if ($scope.mtd.personalRating) {
        $scope.mtd.personalRating.then(function(unbind) {unbind()});
        $scope.mtd.personalRates.then(function(unbind) {unbind()});

    }
    $scope.mtd.publicRating = ratingSync.$asObject().$bindTo($scope,'rating');
    $scope.mtd.publicRates=ratesSync.$asObject().$bindTo($scope, 'mtd.rates');
    $scope.mtd.ratingView='global';

    $scope.mtd.firebase=true;
    cfpLoadingBar.complete();
    $scope.status.ready=true;
    $state.go('public.feed');

    if ($scope.unwatch) {
        $scope.unwatch();
        delete $scope.unwatch;
    }

    $scope.unwatch = $scope.publicFeed.$watch(function () {
        $scope.mtd.updateTree();
    })

};







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

    $scope.$on('$stateChangeStart', function () {
        cfpLoadingBar.start();
    });

    $scope.$on('$stateChangeSuccess', function () {
        cfpLoadingBar.complete();
    });


    $scope.mtd.personae=$firebase(new Firebase('https://frktfeeds.firebaseio.com/personae')).$asObject();

    $scope.$on('fireuser:user_created', function (data, user) {
        var persona = {
            type:'persona',
            title:$scope.mtd.userName,
            gender:$scope.mtd.userGender,
            letters:$scope.mtd.userLetters,
            letter:$scope.mtd.userLetters,
            time:Date.now(),
            author:user.md5_hash,
            md5_hash: user.md5_hash
        };

        $scope.mtd.personae[user.md5_hash] = persona;
        $scope.mtd.personae[user.md5_hash].ratingMode={news:true,plus:true,zero:true,minus:false};
        $scope.mtd.personae.$save();
        $scope.personalFeed.$add(persona);
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


    // authentication connection

    $scope.auth=$firebaseSimpleLogin(new Firebase('https://frktfeeds.firebaseio.com/'));






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
