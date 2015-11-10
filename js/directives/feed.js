/**
 * Created by starov on 05.09.14.
 */


controllers.feed = function ($scope, cfpLoadingBar, $stateParams, $state, Types, smoothScroll, $timeout) {


    //View options






    $scope.mtd.showLetters=false;
    $scope.mtd.showRating=false;


    //Find free letters for registering new users

    $scope.mtd.getPersonalUsed = function () {
        var result=[];
        var letters;
        for (var phrase in $scope.mtd.personae) {
            if (angular.isObject($scope.mtd.personae[phrase]) && $scope.mtd.personae[phrase].letters) {
                letters=$scope.mtd.personae[phrase].letters;
                if (letters.indexOf('|') == -1) {
                    result.push($scope.mtd.personae[phrase].letters);
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


    $scope.mtd.selector = function (letters,addOnly) {
        if (letters) {
            letters=convertLetters(letters);
            var found = false;
            for (var i = 0; i < $scope.mtd.selected.length; i++) {
                if ($scope.mtd.selected[i] == letters) {
                    found = true;
                    if (!addOnly) {
                        $scope.mtd.selected.splice(i, 1);
                    }
                }
            }
            if (!found) {
                $scope.mtd.selected.push(letters);
            }
            if (letters.indexOf('|') == -1) {
                if (found && letters==$scope.mtd.fltr && !addOnly) {
                    $scope.mtd.fltr = ''
                }
                if (!found || addOnly) {
                    $scope.mtd.fltr = letters;
                }
            }
        }
    };

    $scope.mtd.parseParams = function (id) {
        id=convertLetters(id);
        if(id) {
            var parts=id.split('|');
            for (var j=parts.length;j>0;j--) {

                if(parts[j-1]) {
                    $scope.mtd.selector(parts.join('|'), true);
                }
                parts.pop();
            }
        }
        $timeout(function () {
            var element = document.getElementById(id);
            smoothScroll(element, {duration:80});
        },4000);

    };
    if ($stateParams.id) {
        $scope.mtd.parseParams($stateParams.id);
    } else $scope.mtd.fltr='';

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
            if (said.next) {delete said.next}
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
                    console.log('card edited in database');
                } else {
                  $scope.feed.$add(said);
                  console.log('card added to database');
              }

            } else {
                if (found) {
                    $scope.feed[found]=said;
                    console.log('card edited locally');
                } else {
                    $scope.feed.push(said);
                    console.log('card added locally');
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

    });


    $scope.mtd.isRated = function (letters) {
        if($scope.rating[letters]) {return $scope.rating[letters].pluses+$scope.rating[letters].minuses+$scope.rating[letters].zeros}
        return 0;
    };


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
            if ($scope.rating && !$scope.rating[$scope.source[i].letters]) {total++}
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
        if (result && $scope.rating && !$scope.rating[phrase.letters] && $scope.ratingMode.news) {return true}
        return result && $scope.rating && $scope.rating[phrase.letters] &&
            (
                (($scope.rating[phrase.letters].pluses > $scope.rating[phrase.letters].minuses) && $scope.ratingMode.plus) ||
                (($scope.rating[phrase.letters].minuses > $scope.rating[phrase.letters].pluses) && $scope.ratingMode.minus) ||
                (($scope.rating[phrase.letters].pluses == $scope.rating[phrase.letters].minuses)
                    && $scope.ratingMode.zero)
                );
    };

};
