/**
 * Created by starov on 05.09.14.
 */
fruitStory.directive("feed", function() {
    return {
        restrict: "A",
        templateUrl: 'partials/feed.html',
        scope: {
            mtd:'=',
            status:'=',
            feedTitle:'=',
            feed:'=feedSource',
            rating:'=feedRating',
            ratingMode:'=feedRatingMode',
            persona:'='
        },
        controller: function ($scope, cfpLoadingBar, Types) {


            //View options


            $scope.mtd.showLetters=false;
            $scope.mtd.showRating=false;


            //Find free letters for registering new users

            $scope.mtd.getPersonalUsed = function () {
                var result=[];
                var letters;
                for (var phrase in $scope.personalFeed) {
                    if ($scope.personalFeed[phrase].letters) {
                        letters=$scope.personalFeed[phrase].letters;
                        if (letters.indexOf('|') == -1) {
                            result.push($scope.personalFeed[phrase].letters);
                        }
                    }
                }
                return result;

            };


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

            $scope.mtd.addToFeed = function (saying) {
                var said;
                var found=false;
                if (saying && saying.title && saying.type && saying.letters) {

                    said = angular.copy(saying);
                    saying.text='';
                    saying.title='';
                    saying.letters='';
                    saying.image='';
                    said.letters=convertLetters(said.letters);
                    said.author=$scope.mtd.persona;
                    said.time=Date.now();
                    angular.forEach($scope.feed, function (val, key) {
                        if (val.letters && val.letters==said.letters) {
                            found = key;
                        }
                    });
                    if ($scope.mtd.firebase) {
                        if (found) {
                            $scope.feed[found]=said;
                            $scope.feed.$save(found);
                        } else $scope.feed.$add(said);

                    } else {
                        if (found) {
                            $scope.feed[found]=said;
                        } else {
                            $scope.feed.push(said);
                        }
                    }

                } else {console.log('a phrase without title, type, or color/letters')}

                $scope.updateTree();
            };

            $scope.updateTree=function () {
                $scope.tree=convertStory($scope.feed);
                $scope.source=$scope.tree;
            };

            $scope.mtd.updateTree=$scope.updateTree;

            $scope.$watch('feed', function (feed) {
                if (feed) {$scope.updateTree();}

                if($scope.status.publicLoaded && cfpLoadingBar.status()<1) {
                    cfpLoadingBar.complete();
                    $scope.status.ready=true;
                }

            });



            $scope.rate={};
            $scope.rate.rating = $scope.rating;
            $scope.rate.reset = function () {
                $scope.rating={};
            };

            $scope.rate.cancel = function (letters) {
                if ($scope.mtd.ratingView=='global' && $scope.mtd.rates[$scope.mtd.persona]) {
                    if ($scope.mtd.rates[$scope.mtd.persona][letters]=='+1' && $scope.rating[letters].pluses>0) {
                        $scope.rating[letters].pluses--;
                        delete $scope.mtd.rates[$scope.mtd.persona][letters];
                    }
                    if ($scope.mtd.rates[$scope.mtd.persona][letters]=='-1' && $scope.rating[letters].minuses>0) {
                        $scope.rating[letters].minuses--;
                        delete $scope.mtd.rates[$scope.mtd.persona][letters];
                    }
                    if ($scope.mtd.rates[$scope.mtd.persona][letters]=='-' && $scope.rating[letters].zeros>0) {
                        $scope.rating[letters].zeros--;
                        delete $scope.mtd.rates[$scope.mtd.persona][letters];
                    }

                }

            };
            $scope.rate.plus=function (letters) {
                if ($scope.mtd.ratingView=='global' && !$scope.mtd.rates[$scope.mtd.persona]) {
                    $scope.mtd.rates[$scope.mtd.persona]={};

                }
                if ($scope.mtd.ratingView=='global' && $scope.mtd.rates[$scope.mtd.persona] && !$scope.mtd.rates[$scope.mtd.persona][letters]) {
                    $scope.rating[letters] = $scope.rating[letters] || {pluses:0,zeros:0,minuses:0};
                    $scope.rating[letters].pluses++;
                    $scope.mtd.rates[$scope.mtd.persona][letters]='+1';
                } else {
                    $scope.rating[letters] = $scope.rating[letters] || {pluses:0,zeros:0,minuses:0};
                    $scope.rating[letters].pluses++;
                }

            };
            $scope.rate.minus=function (letters) {
                if ($scope.mtd.ratingView=='global' && !$scope.mtd.rates[$scope.mtd.persona]) {
                    $scope.mtd.rates[$scope.mtd.persona]={};

                }
                if ($scope.mtd.ratingView=='global' && $scope.mtd.rates[$scope.mtd.persona] && !$scope.mtd.rates[$scope.mtd.persona][letters]) {
                    $scope.rating[letters] = $scope.rating[letters] || {pluses:0,zeros:0,minuses:0};
                    $scope.rating[letters].minuses++;
                    $scope.mtd.rates[$scope.mtd.persona][letters]='-1';
                } else {
                    $scope.rating[letters] = $scope.rating[letters] || {pluses:0,zeros:0,minuses:0};
                    $scope.rating[letters].minuses++;
                }

            };
            $scope.rate.zero=function (letters) {
                if ($scope.mtd.ratingView=='global' && !$scope.mtd.rates[$scope.mtd.persona]) {
                    $scope.mtd.rates[$scope.mtd.persona]={};

                }
                if ($scope.mtd.ratingView=='global' && $scope.mtd.rates[$scope.mtd.persona] && !$scope.mtd.rates[$scope.mtd.persona][letters]) {
                    $scope.rating[letters] = $scope.rating[letters] || {pluses:0,zeros:0,minuses:0};
                    $scope.rating[letters].zeros++;
                    $scope.mtd.rates[$scope.mtd.persona][letters]='-';
                } else {
                    $scope.rating[letters] = $scope.rating[letters] || {pluses:0,zeros:0,minuses:0};
                    $scope.rating[letters].zeros++;
                }
            };
            $scope.rate.getPluses=function (letters) {
                if ($scope.rating[letters] && $scope.rating[letters].pluses>$scope.rating[letters].minuses) {
                    return $scope.rating[letters].pluses - $scope.rating[letters].minuses;
                } else return '';
            };
            $scope.rate.getMinuses=function (letters) {
                if ($scope.rating[letters] && $scope.rating[letters].pluses<$scope.rating[letters].minuses) {
                    return $scope.rating[letters].minuses - $scope.rating[letters].pluses
                }
                else return '';
            };
            $scope.rate.getZeros=function (letters) {
                if ($scope.rating[letters]) {return $scope.rating[letters].zeros+$scope.rating[letters].pluses+$scope.rating[letters].minuses}
                else return '';
            };
            $scope.rate.getRating = function (letters) {
                if($scope.rating[letters]) {return $scope.rating[letters].pluses-$scope.rating[letters].minuses}
                return 0;
            };
            $scope.rate.ratingSort = function (phrase) {
                if($scope.rating[phrase.letters]) {
                    return (-$scope.rating[phrase.letters].pluses+$scope.rating[phrase.letters].minuses);
                };
                return 0;
            };
            $scope.rate.seenSort = function (phrase) {
                if($scope.rating[phrase.letters]) {
                    return ($scope.rating[phrase.letters].zeros + $scope.rating[phrase.letters].pluses + $scope.rating[phrase.letters].minuses);
                };
                return 0;
            };
            $scope.rate.timeSort = function (phrase) {
                if (phrase.time) {
                    return -phrase.time;
                }
            };

            $scope.rate.totalRated = function (rate) {
                var total=0;
                for (var a in $scope.rating) {
                    if (rate>0 && $scope.rating[a] && $scope.rating[a].pluses > $scope.rating[a].minuses) {total++}
                    if (rate===0 && $scope.rating[a] && $scope.rating[a].pluses === $scope.rating[a].minuses && ($scope.rating[a].zeros>0 || $scope.rating[a].pluses>0)) {

                        total++
                    }
                    if (rate<0 && $scope.rating[a] && $scope.rating[a].pluses < $scope.rating[a].minuses) {total++}
                }
                return total;
            };
            $scope.rate.countNew = function () {
                var total=0;
                for (var i in $scope.source) {
                    if (!$scope.rating[$scope.source[i].letters]) {total++}
                }
                return total;
            };
            $scope.rate.toggleRF = function (rate) {
                if (rate == 'news') {$scope.ratingMode.news=!$scope.ratingMode.news
                } else if (rate>0) {
                    $scope.ratingMode.plus=!$scope.ratingMode.plus
                } else if (rate<0) {
                    $scope.ratingMode.minus=!$scope.ratingMode.minus
                } else {
                    $scope.ratingMode.zero=!$scope.ratingMode.zero
                }
            };
            $scope.rate.ratingFilter = function (phrase) {
                var result=true;
                result=result && phrase.letters;
                if (result && !$scope.rating[phrase.letters] && $scope.ratingMode.news) {return true}
                return result && $scope.rating[phrase.letters] &&
                    (
                        (($scope.rating[phrase.letters].pluses > $scope.rating[phrase.letters].minuses) && $scope.ratingMode.plus) ||
                        (($scope.rating[phrase.letters].minuses > $scope.rating[phrase.letters].pluses) && $scope.ratingMode.minus) ||
                        (($scope.rating[phrase.letters].pluses == $scope.rating[phrase.letters].minuses)
                            && $scope.ratingMode.zero)
                        );
            };

        }
    };
});

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