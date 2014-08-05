/**
 * Created by starov on 01.04.14.
 */
var fruitStory = angular.module('fruitStory',['hc.marked', 'sticky', 'ngStorage']);
var controllers = {};
fruitStory.controller(controllers);

controllers.discourse = function ($scope, Discourse, Designs, $localStorage) {

    $scope.$storage=$localStorage.$default(
        {
            discourse:Discourse.discourse,
            discourseRatingMode:{news:true,plus:true,zero:true,minus:false},
            discourseRating:{},
            designs:Designs.designs,
            designsRatingMode:{news:true,plus:true,zero:true,minus:false},
            designsRating:{},
            persona:''
        }
    );

    $scope.$watch('feed', function () {
        $scope.tree=convertStory($scope.feed);
        $scope.JSON=JSON.stringify($scope.feed, '',4);
        $scope.source=$scope.tree;
    });

    $scope.new={};

    $scope.code=0;
    $scope.persona=$scope.$storage.persona;
    $scope.designs=$scope.$storage.designs;
    $scope.discourse=$scope.$storage.discourse;

    //initial feed

    $scope.feed = $scope.discourse;
    $scope.rating= $scope.$storage.rating;
    $scope.ratingMode=$scope.$storage.ratingMode;


    $scope.changeFeed = function (feedTitle) {
        if (feedTitle) {
            $scope.feed = $scope[feedTitle];
            $scope.feedTitle=feedTitle;
            $scope.rating = $scope.$storage[feedTitle + 'Rating'];
            $scope.ratingMode = $scope.$storage[feedTitle + 'RatingMode'];
        }
    };

    $scope.changeFeed('designs');

    $scope.reset = function () {
        localStorage.clear();
        $scope.feed =Discourse.discourse;
        $scope.tree=convertStory($scope.feed);
        $scope.source=$scope.tree;
        $scope.rating={};
        $scope.ratingMode={news:true,plus:true,zero:true,minus:false};

    };





    $scope.mtd = {}; //an object for universal methods
    $scope.mtd.preset = preset;
    $scope.mtd.shuffle = shuffle;
    $scope.mtd.colorize = colorize;
    $scope.mtd.parents = parents;
    $scope.mtd.convertLetters = convertLetters;
    $scope.mtd.convertStory=convertStory;
    $scope.mtd.my=$scope.my;
    $scope.mtd.new=$scope.new;
    $scope.mtd.loadFeed=function (json) {
        if (json) {$scope.JSON=json}
        $scope.feed=JSON.parse($scope.JSON);
        console.log($scope.feed);
        $scope.mtd.updateStory();
    };
    $scope.source=$scope.tree;
    $scope.selected = 'B';
    $scope.mtd.updateStory = function (saying) {
        var said;
        if (saying) {

            said = angular.copy(saying);
            saying='';
            said.letters=convertLetters(said.letters);
            said.author=$scope.persona;
            $scope.feed.push(said);
            $scope.new[$scope.feedTitle]=$scope.new[$scope.feedTitle] || [];
            $scope.new[$scope.feedTitle].push(said);
        }

        $scope.tree=convertStory($scope.feed);
        $scope.source=$scope.tree;
        $scope.JSON=JSON.stringify($scope.feed, '',4);
    };

    $scope.mtd.select = function (letters, select) {
        if (letters==select) {
            select=false;
            return false;
        } else {
            select=letters;
            return letters;
        }
    };


    $scope.mtd.persona=$scope.persona;


    $scope.mtd.rate={};
    $scope.mtd.rate.rating = $scope.rating;
    $scope.mtd.rate.plus=function (letters) {
        if (angular.isObject(letters)) {letters=letters.letters;}
        $scope.rating[letters] = $scope.rating[letters] || {pluses:0,zeros:0,minuses:0};
        $scope.rating[letters].pluses++;
    };
    $scope.mtd.rate.minus=function (letters) {
        if (angular.isObject(letters)) {letters=letters.letters;}
        $scope.rating[letters] = $scope.rating[letters] || {pluses:0,zeros:0,minuses:0};
        $scope.rating[letters].minuses++;
    };
    $scope.mtd.rate.zero=function (letters) {
        if (angular.isObject(letters)) {letters=letters.letters;}
        $scope.rating[letters] = $scope.rating[letters] || {pluses:0,zeros:0,minuses:0};
        $scope.rating[letters].zeros++;
    };
    $scope.mtd.rate.getPluses=function (letters) {
        if ($scope.rating[letters] && $scope.rating[letters].pluses>$scope.rating[letters].minuses) {
            return $scope.rating[letters].pluses - $scope.rating[letters].minuses;
        } else return '';
    };
    $scope.mtd.rate.getMinuses=function (letters) {
        if ($scope.rating[letters] && $scope.rating[letters].pluses<$scope.rating[letters].minuses) {
            return $scope.rating[letters].minuses - $scope.rating[letters].pluses
        }
        else return '';
    };
    $scope.mtd.rate.getZeros=function (letters) {
        if ($scope.rating[letters]) {return $scope.rating[letters].zeros+$scope.rating[letters].pluses+$scope.rating[letters].minuses}
        else return '';
    };
    $scope.mtd.rate.getRating = function (letters) {
        if($scope.rating[letters]) {return $scope.rating[letters].pluses-$scope.rating[letters].minuses}
        return 0;
    };
    $scope.mtd.rate.ratingSort = function (phrase) {
        if($scope.rating[phrase.letters]) {
            return (-$scope.rating[phrase.letters].pluses+$scope.rating[phrase.letters].minuses);
        };
        return 0;
    };
    $scope.mtd.rate.seenSort = function (phrase) {
        if($scope.rating[phrase.letters]) {
            return ($scope.rating[phrase.letters].zeros);
        };
        return 0;
    };

    $scope.mtd.rate.totalRated = function (rate) {
        var total=0;
        for (var a in $scope.rating) {
            if (rate>0 && $scope.rating[a].pluses > $scope.rating[a].minuses) {total++}
            if (rate===0 && $scope.rating[a].pluses== $scope.rating[a].minuses) {total++}
            if (rate<0 && $scope.rating[a].pluses < $scope.rating[a].minuses) {total++}
        }
        return total;
    };
    $scope.countNew = function () {
        var total=0;
        for (var i=0;i<$scope.feed.length; i++) {
            if (!$scope.rating[$scope.feed[i].letters]) {total++}
        }
        return total;
    };
    $scope.mtd.toggleRF = function (rate) {
        if (rate == 'news') {$scope.ratingMode.news=!$scope.ratingMode.news
        } else if (rate>0) {
            $scope.ratingMode.plus=!$scope.ratingMode.plus
        } else if (rate<0) {
            $scope.ratingMode.minus=!$scope.ratingMode.minus
        } else {
            $scope.ratingMode.zero=!$scope.ratingMode.zero
        }
    };
    $scope.ratingFilter = function (phrase) {
        var result=true;
        result=result && phrase.letters;
        if (result && !$scope.rating[phrase.letters] && $scope.ratingMode.news) {return true}
        return result && $scope.rating[phrase.letters] &&
            (
                (($scope.rating[phrase.letters].pluses > $scope.rating[phrase.letters].minuses) && $scope.ratingMode.plus) ||
                    (($scope.rating[phrase.letters].minuses > $scope.rating[phrase.letters].pluses) && $scope.ratingMode.minus) ||
                    (($scope.rating[phrase.letters].pluses == $scope.rating[phrase.letters].minuses) && $scope.ratingMode.zero)
                );
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

function parents (lttrs) {
    var letters;
    letters=lttrs.split('|');
    letters.pop();
    return letters;
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

    } else return 'hsla(0,0%,50%,0.5)';

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

