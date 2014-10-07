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
        controller: function ($scope, cfpLoadingBar) {



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