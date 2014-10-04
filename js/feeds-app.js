/**
 * Created by starov on 01.04.14.
 */
var fruitStory = angular.module('fruitStory',['hc.marked', 'smoothScroll','firebase', 'ngStorage', 'cfp.loadingBar', 'fireUser','ui.router']);
var controllers = {};

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
                    title:'Личные',
                    feed:[],
                    rating:{},
                    ratingMode:{news:true,plus:true,zero:true,minus:false},
                    selected:[]
                },
                publicFeed:{
                    title:'Публичные',
                    ratingMode:{news:true,plus:true,zero:true,minus:false},
                    selected:[]
                }
            },
            localRating:{}
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


    $scope.$on('fireuser:user_created', function (data, user) {
        $scope.mtd.users[user.md5_hash]={};
        $scope.mtd.users[user.md5_hash].name=$scope.mtd.userName;
        $scope.mtd.creating=0;
    });









    //FIREBASE CONNECTIONS



    $scope.loaded=false;
    $scope.online=false;

    // Connection status

    var connectedRef = new Firebase("https://frktfeeds.firebaseio.com/.info/connected");
    connectedRef.on("value", function(snap) {
        if (snap.val() === true) {
            $scope.online=true;
        } else {
            $scope.online=false;
        }
    });

    // public ratings

    var ratingSync = $firebase(new Firebase('https://frktfeeds.firebaseio.com/public/rating'));
    $scope.fireRating=ratingSync.$asObject();

    //public feed

    $scope.publicFeed=$firebase(new Firebase('https://frktfeeds.firebaseio.com/public/feed')).$asArray();
    $scope.publicFeed.$loaded().then(function () {
        $scope.loaded=true;
        $scope.mtd.switchToPublic();
        cfpLoadingBar.complete();
    });

    //public rates

    $scope.mtd.rates={};
    var ratesSync = $firebase(new Firebase('https://frktfeeds.firebaseio.com/public/rates'));
    var rates=ratesSync.$asObject().$bindTo($scope, 'mtd.rates');

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
        $scope.feedTitle='Публичные';
        $scope.mtd.switchRate('global');

            $scope.ratingMode = $scope.feeds[feedTitle].ratingMode || {news:true,plus:true,zero:true,minus:false};
            $scope.mtd.selected = $scope.feeds[feedTitle].selected || [];

        $scope.mtd.firebase=true;
    };

    // personal ratings

    var personalRatingSync = $firebase(new Firebase('https://frktfeeds.firebaseio.com/personal/rating'));


    //personal feed

    $scope.personalFeed=$firebase(new Firebase('https://frktfeeds.firebaseio.com/personal/feed')).$asArray();


    //personal rates

    $scope.mtd.personalRates={};
    var personalRatesSync = $firebase(new Firebase('https://frktfeeds.firebaseio.com/personal/rates'));
    var personalRates=personalRatesSync.$asObject().$bindTo($scope, 'mtd.personalRates');



    $scope.mtd.switchRate = function (type) {
        if (type=='global') {
            $scope.mtd.fireRate = ratingSync.$asObject().$bindTo($scope,'rating');
            $scope.mtd.ratingView='global';
        }
        if (type=='local') {
            if ($scope.mtd.fireRate) {
                $scope.mtd.fireRate.then(function(unbind) {unbind()})
            }
            $scope.rating=$scope.$storage.localRating;
            $scope.mtd.ratingView='local';
        }
        if (type=='personal') {
            if ($scope.mtd.fireRate) {
                $scope.mtd.fireRate.then(function(unbind) {unbind()})
            }
            $scope.rating=$scope.$storage.feeds.personal.rating;
            $scope.mtd.ratingView='personal';
        }

    };






    //View options


    $scope.mtd.showLetters=false;
    $scope.mtd.showRating=false;



    //initial feed



    $scope.changeFeed = function (feedTitle) {
        if (feedTitle) {
            if ($scope.mtd.unwatch) {$scope.mtd.unwatch()}
            $scope.feed = $scope.feeds[feedTitle].feed;
            $scope.feedTitle=$scope.feeds[feedTitle].title;
            $scope.mtd.switchRate(feedTitle);
            $scope.ratingMode = $scope.feeds[feedTitle].ratingMode;
            $scope.mtd.selected = $scope.feeds[feedTitle].selected;
            $scope.mtd.firebase=false;
        }
    };

    $scope.changeFeed('personal');




    $scope.mtd.types=Types.types;  //types of phrases


    $scope.mtd.preset = preset;
    $scope.mtd.shuffle = shuffle;
    $scope.mtd.colorize = colorize;
    $scope.mtd.parent = parent;
    $scope.mtd.convertLetters = convertLetters;
    $scope.mtd.convertStory=convertStory;


    $scope.mtd.selector = function (letters) {
        var found=false;
        for (var i=0;i<$scope.mtd.selected.length;i++) {
            if ($scope.mtd.selected[i] == letters) {
                found = true;
                $scope.mtd.selected.splice(i, 1);
            }
        }
        if (!found) {
            $scope.mtd.selected.push(letters);
        }
    };

    $scope.mtd.isSelected = function (letters) {
        for (var i=0;i<$scope.mtd.selected.length;i++) {
            if ($scope.mtd.selected[i]==letters) {
                return true
            }
        }
        return false;
    };



};

function shuffle(massive) {
    arr = massive.concat();
    for (var i = arr.length - 1; i > 0; i--) {
        var num = Math.floor(Math.random() * (i + 1));
        var d = arr[num];
        arr[num] = arr[i];
        arr[i] = d;
    }

    return arr;
}

function checkAndAdd (add, arr) {
    for (var a in arr) {
        if (add==arr[a]) {return false}
    }
    arr.push(add);
    return arr;
}

function convertStory (story) {
    var tree = {};
    for(var i = 0; i < story.length; i++) {
        var saying = story[i];
        var letters = saying.letters.split('|');

        var search = tree;
        for(var j = 0; j < letters.length; j++) {
            var letter = letters[j];

            var obj = letter in search ? search[letter] : search[letter] = {};

            // Endpoint, assign letter and values to obj
            if(j == letters.length - 1) {
                obj.letter = letter;
                for(var key in saying) {
                    obj[key] = saying[key];
                }
            } else { // Create nested object and update search object
                search = 'next' in obj ? obj.next : obj.next = {};
            }
        }
    }
    return tree;
}

function parent (lttrs) {
    var letters;
    letters=lttrs.split('|');
    return letters.shift();
}



function colorize (lttrs,opacity) {
    if (lttrs) {
    var hue, sat, light, alpha, step, numOfSteps;
    var hsla = function (hue,sat,light,alpha) {
        return 'hsla('+(hue || '0')+','+(sat || '100')+'%,'+(light || '50')+'%,'+(alpha || 1)+')';
    };
    var lastLetters=lttrs.lastIndexOf('|');
    var lettersFull=lttrs.slice(lastLetters+1);
    var letters=lettersFull.slice(0,2);
    var residue=lettersFull.slice(2);
    residue=residue.split('');
    numOfSteps=Math.pow(12,letters.length);
    step=preset(letters.length).indexOf(letters.toUpperCase());
    hue=360*step/numOfSteps;
    if (residue.length>0) {
        step=preset(1).indexOf(residue.shift().toUpperCase());
        light=26+48*(12-step)/12;
    }
    if (residue.length>0) {
        step=preset(1).indexOf(residue.shift().toUpperCase());
        sat=20+80*(12-step)/12;
    }
    if (residue.length>0) {
        step=preset(1).indexOf(residue.shift().toUpperCase());
        alpha=0.3+0.7*(12-step)/12;
    }
    if (opacity && opacity>=0 && opacity<=1) {alpha=opacity}
    return hsla(hue,sat,light,alpha);

    } else return '#fff'; // hsla(0,0%,50%,0.5)

}

function preset (bit){
    var baseLetters = ['K', 'Y', 'A', 'O', 'T', 'H', 'B', 'X', 'C', 'P', 'E', 'M'];
    var current, count, result = baseLetters.concat(), order;
    if (typeof bit == "number" && bit>0 && bit<=12) {count=bit-1};
    for (var b = 0; b < count; b++) {
        current = result.slice(0);
        order = 0;
        for (var i = 0; i < current.length; i++) {

            for (var j = 0; j < 12; j++) {

                result[order++] = current[i] + baseLetters[j];
            }
        }
    }
    return result;
}


function convertLetters (letters) {
    if (!letters) {return ''}
    letters=letters.toUpperCase();
    letters=letters.replace(/[\s.:;,//]/g,'|');
    letters=letters.replace(/[^ABCEHKMOPTXYАВЕКМНОРСТУХ|]*/g,'');
    letters=letters.replace('А','A');
    letters=letters.replace('В','B');
    letters=letters.replace('С','C');
    letters=letters.replace('Е','E');
    letters=letters.replace('Н','H');
    letters=letters.replace('К','K');
    letters=letters.replace('М','M');
    letters=letters.replace('О','O');
    letters=letters.replace('Р','P');
    letters=letters.replace('Т','T');
    letters=letters.replace('Х','X');
    letters=letters.replace('У','Y');
    return letters;
}



fruitStory.filter('objectAsArray', function() {
    return function(object) {
        var array = [];
        for (var item in object) {
            array.push(object[item]);
        }
        return array;
    }
});

