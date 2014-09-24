
fruitStory.directive("navigator", function() {
    return {
        restrict: "A",
        templateUrl: 'partials/navigator.html',
        controller: function ($scope) {

            $scope.cleanLetters = function (letters) {
                return letters.split('|') || '';
            }


        }
    };
});


fruitStory.directive("rating", function() {
    return {
        restrict: "A",
        templateUrl: 'partials/rating.html',
        scope: {
            letters:'=letter',
            rate:'='
        },
        controller: function ($scope) {


        }
    };
});


fruitStory.directive("letterGrid", function() {
    return {
        restrict: "A",
        templateUrl: 'partials/letter-grid.html',
        scope: {
            used: '=',
            mtd:'=',
            result: '='
        },
        controller: function ($scope) {
            $scope.bit=1;


            $scope.$watch('used', function (used) {
                if (angular.isArray(used)) {
                    $scope.grid=exclude(used);
                }
            });

            $scope.choose=function (letter) {
                if ($scope.result==letter) {
                    $scope.result=''
                } else $scope.result=letter;
            };


            $scope.baseLetters = ["M","E","P","C","X","B","H","T","O","A","Y","K"];

            function getBit (count) {
                var power=1;
                do {
                    count=count-Math.pow(12,power++);
                } while(count>=0);
                return --power;
            }
            function exclude (arr) {
                var bit=getBit(arr.length);
                var full=preset(bit);
                for (var i=0;i<arr.length;i++) {
                    for (var j=0;j<full.length;j++) {
                        if (arr[i]==full[j]) {
                            full.splice(j,1);
                        }
                    }
                }
                return full;
            }

            function preset (bit){
                var baseLetters = ['K', 'Y', 'A', 'O', 'T', 'H', 'B', 'X', 'C', 'P', 'E', 'M'];
                var current, count, result = baseLetters.concat(), order;
                if (typeof bit == "number" && bit>0 && bit<=12) {
                    count=bit-1;
                    for (var b = 0; b < count; b++) {
                        current = result.slice(0);
                        order = 0;
                        for (var i = 0; i < current.length; i++) {

                            for (var j = 0; j < 12; j++) {

                                result[order++] = current[i] + baseLetters[j];
                            }
                        }
                    }
                };
                return result;
            }
        }
    };
});

fruitStory.directive("contents", function() {
    return {
        restrict: "E",
        templateUrl: 'partials/contents.html',
        scope: {
            tree: '=',
            mtd:'='
        }
    };
});


fruitStory.directive("filters", function() {
    return {
        restrict: "A",
        templateUrl: 'partials/filters.html',
        controller: function($scope) {
            $scope.$watch('fltr', function (fltr) {
                if (angular.isString(fltr)) {
                    $scope.fltr=$scope.mtd.convertLetters(fltr);

                }
            });
        }
    };
});

fruitStory.directive("content", function($compile) {
    return {
        restrict: "E",
        templateUrl: 'partials/content.html',
        scope: {
            next: '=',
            mtd:'='
        },
        compile: function(tElement, tAttr) {
            var contents = tElement.contents().remove();
            var compiledContents;
            return function(scope, iElement, iAttr) {
                if(!compiledContents) {
                    compiledContents = $compile(contents);
                }
                compiledContents(scope, function(clone, scope) {
                    iElement.append(clone);
                });
            };
        }
    };
});

fruitStory.directive("letters", function() {
    return {
        restrict: "A",
        templateUrl: 'partials/letters.html',
        scope: {
            letter: '=',
            mtd:'=',
            select:'&'
        },
        controller: function ($scope) {

            $scope.$watch('letter',function (letter) {
                if (angular.isString(letter)) {
                $scope.letter=$scope.mtd.convertLetters(letter);
                $scope.lttrs=$scope.letter.split('|') || '';
                }
            });


        }
    };
});

fruitStory.directive("plus", function() {
    return {
        restrict: "A",
        templateUrl: 'partials/plus.html',
        controller: function ($scope) {
            if ($scope.letter) {
                $scope.lttrs=$scope.letter.split('|');
            };

        }
    };
});

fruitStory.directive("icon", function() {
    return {
        restrict: "AE",
        scope: {
            iconType:'=',
            iconTitle:'=',
            iconText:'='
        },
        templateUrl: 'partials/icon.html',
        controller: function ($scope) {
            $scope.$watch('iconType', function (type) {
                $scope.iconURL = 'icons/' + type + '.svg';
            });



        }
    };
});

fruitStory.directive("previewBox", function() {
    return {
        restrict: "A",
        templateUrl: 'partials/preview-box.html',
        scope: {
            phrase:'=',
            mtd:'='
        },
        controller: function ($scope) {


        }
    };
});



fruitStory.directive("addForm", function() {
    return {
        restrict: "A",
        templateUrl: 'partials/add-form.html',
        scope: {
            phrase: '=',
            used:'=',
            mtd: '=',
            address: '=',
            close: '&'
        },
        controller: function ($scope) {
            $scope.phrase = $scope.phrase || {letters:''};
            $scope.$watch('letter', function (letter) {
                if (angular.isString(letter)) {
                    $scope.letter=$scope.mtd.convertLetters(letter);
                    if ($scope.address) {
                        $scope.phrase.letters=$scope.address + '|';
                    } else {$scope.phrase.letters=''}
                    $scope.phrase.letters+=$scope.letter;

                }
            });
        }
    };
});

fruitStory.directive("overCard", function($compile) {
    return {
        restrict: "A",
        templateUrl: 'partials/over-card.html',
        scope: {
            nxt: '=',
            mtd: '=',
            close: '&'
        },
        controller: function ($scope){
            $scope.over={};
            $scope.selected=false;
            $scope.size = function(obj) {
                var size = 0, key;
                if (angular.isObject(obj)) {
                    for (key in obj) {
                        if (obj.hasOwnProperty(key)) size++;
                    }
                    return size;
                } else return obj.length;

            };
        },
        compile: function(tElement, tAttr) {
            var contents = tElement.contents().remove();
            var compiledContents;
            return function(scope, iElement, iAttr) {
                if(!compiledContents) {
                    compiledContents = $compile(contents);
                }
                compiledContents(scope, function(clone, scope) {
                    iElement.append(clone);
                });
            };
        }
    };
});

fruitStory.directive("card", function() {
    return {
        restrict: "A",
        templateUrl: 'partials/card.html',
        scope: {
            phrase:'=',
            mtd:'=',
            rate:'=',
            selected:'=',
            nxt:'=',
            rf:'='
        },
        controller: function ($scope) {
            $scope.time=new Date($scope.phrase.time);



        }
    };
});

fruitStory.directive("cards", function($compile) {
    return {
        restrict: "AE",
        templateUrl: 'partials/cards.html',
        scope: {
            next: '=', //source
            mtd: '=',
            rate:'=',
            selected: '=',
            fltr:'=',
            rf:'=', //for rating filtering
            search:'=',
            addr:'=' //higher letters for adding new in place
        },
        controller: function ($scope){
            $scope.over={};
            $scope.selected=false;
            $scope.pluses=0;
            $scope.minuses=0;
            $scope.zeros=0;
            $scope.cancelNew=function(){
                delete $scope.next.new;
            };

            $scope.$watch('next', function (next) {
                $scope.used=getUsed(next);
            });

            function getUsed (source) {
                var result=[];
                var letters;
                for (var phrase in source) {
                    if (source[phrase].letters) {
                        letters=source[phrase].letters.replace($scope.addr+'|', '');
                        if (letters.indexOf('|') == -1) {
                            result[result.length] = source[phrase].letter
                        }
                    }
                }
                return result;
            }

            function child (lttrs) {
                var letters;
                letters=lttrs.split('|');
                return letters.pop();
            }
        },
        compile: function(tElement, tAttr) {
            var contents = tElement.contents().remove();
            var compiledContents;
            return function(scope, iElement, iAttr) {
                if(!compiledContents) {
                    compiledContents = $compile(contents);
                }
                compiledContents(scope, function(clone, scope) {
                    iElement.append(clone);
                });
            };
        }
    };
});