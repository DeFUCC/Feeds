/**
 * Created by starov on 01.04.14.
 */
var fruitStory = angular.module('fruitStory',['hc.marked','firebase', 'sticky', 'ngStorage']);
var controllers = {};
fruitStory.controller(controllers);


controllers.feeds = function ($scope, Designs, Types, $localStorage, $firebase) {

    $scope.mtd = {}; //an object for universal methods

    $scope.$storage=$localStorage.$default(
        {
            feeds:{
                designs:{
                    title:'Публичные',
                    feed:Designs.designs,
                    rating:{},
                    ratingMode:{news:true,plus:true,zero:true,minus:false},
                    selected:[]
                },
                personal:{
                    title:'Личные',
                    feed:[],
                    rating:{},
                    ratingMode:{news:true,plus:true,zero:true,minus:false},
                    selected:[]
                }
            },
            persona:''
        }
    );

    $scope.feeds=$scope.$storage.feeds;

    $scope.code=0;
    $scope.mtd.persona=$scope.$storage.persona;
    $scope.mtd.isLogged = function () {
        if ($scope.mtd.persona) {
            return true
        }
        return false;
    };

    //initial feed



    $scope.changeFeed = function (feedTitle) {
        if (feedTitle) {
            $scope.feed = $scope.feeds[feedTitle].feed;
            $scope.feedTitle=$scope.feeds[feedTitle].title;
            $scope.rating = $scope.feeds[feedTitle].rating;
            $scope.ratingMode = $scope.feeds[feedTitle].ratingMode;
            $scope.selected = $scope.feeds[feedTitle].selected;
        }
    };

    $scope.changeFeed('designs');



    $scope.mtd.types=Types.types;

    $scope.mtd.viewType='';

    $scope.mtd.getTypes=function (phrase, user) {
        var types=[];
        console.log(phrase);
        if (phrase.type) {
            if ($scope.mtd.types.hasOwnProperty(phrase.type)) {
                types.push($scope.mtd.types[phrase.type].open);
                if ($scope.mtd.persona==user) {
                    types.push($scope.mtd.types[phrase.type].closed);
                }
            }
        }
        if (!phrase.type) {
            types.push('design');
        }
        return types;
    };
    $scope.mtd.showLetters=false;
    $scope.mtd.preset = preset;
    $scope.mtd.shuffle = shuffle;
    $scope.mtd.colorize = colorize;
    $scope.mtd.parent = parent;
    $scope.mtd.convertLetters = convertLetters;
    $scope.mtd.convertStory=convertStory;
    $scope.mtd.loadFeed=function (json) {
        if (json) {$scope.JSON=json}
        $scope.feed=JSON.parse($scope.JSON);
        $scope.mtd.updateStory();
    };

    $scope.mtd.selected=$scope.selected;
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

    $scope.mtd.select = function (letters, select) {
        if (letters==select) {
            select=false;
            return false;
        } else {
            select=letters;
            return letters;
        }
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

