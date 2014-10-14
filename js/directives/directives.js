
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

fruitStory.directive("auth", function() {
    return {
        restrict: "A",
        templateUrl: 'partials/auth.html',
        scope: {
            auth:'=',
            mtd:'='
        },
        controller: function ($scope) {



        }
    };
});


fruitStory.directive("rating", function() {
    return {
        restrict: "A",
        templateUrl: 'partials/rating.html',
        scope: {
            letters:'=letter',
            rate:'=',
            mtd:'='
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


            function exclude (arr) {
                var bit=getBit(arr.length);
                var full=preset(bit).reverse();
                for (var i=0;i<arr.length;i++) {
                    for (var j=0;j<full.length;j++) {
                        if (arr[i]==full[j]) {
                            full.splice(j,1);
                        }
                    }
                }
                return full;
            }

            function getBit (count) {
                var power=1;
                do {
                    count=count-Math.pow(12,power++);
                } while(count>=0);
                return --power;
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
                    $scope.fltr=$scope.mtd.fltr=$scope.mtd.convertLetters(fltr);

                }
            });
            $scope.$watch('mtd.fltr', function (fltr) {
                if (angular.isString(fltr)) {
                    $scope.fltr=$scope.mtd.fltr=$scope.mtd.convertLetters(fltr);

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
            type:'=',
            close: '&'
        },
        controller: function ($scope) {

            $scope.add={};
            if ($scope.phrase.date) {
                $scope.add.dateTime=moment($scope.phrase.date).format('YYYY-MM-DDTHH:mm');

            }


            $scope.phrase = $scope.phrase || {letters:''};
            $scope.type=$scope.type || 'statement';
            $scope.phrase.type=$scope.phrase.type || $scope.mtd.types[$scope.type].canHave[0].type;



            $scope.$watch('phrase.type', function (type) {
                if($scope.phrase.type=="place") {
                    $scope.phrase.place=$scope.phrase.place || {};
                    $scope.phrase.place.zoom = $scope.phrase.place.zoom || 12;
                } else {
                    $scope.phrase.place=null;
                }
                if (type!='time' && $scope.phrase.date) {
                    $scope.phrase.date=null;
                    $scope.phrase.dateTime ? $scope.phrase.dateTime=null : null;
                }
            });

            $scope.add.refreshDate = function () {
                $scope.phrase.date=moment($scope.add.dateTime).valueOf();
            };






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

            $scope.$watch('nxt.place.address', function () {
                if ($scope.nxt && $scope.nxt.type=="place" && $scope.nxt.place) {
                    $scope.map = {
                        sensor:false,
                        size:'640x320',
                        zoom: $scope.nxt.place.zoom || 12,
                        center: $scope.nxt.place.address,
                        markers:[$scope.nxt.place.address],
                        mapevents: {
                            redirect:false,
                            loadmap:true
                        }
                    }
                }
            });

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
            rf:'=',
            edit:'='
        },
        controller: function ($scope) {



        $scope.$watch('phrase.place.address', function () {
            if ($scope.phrase.type=="place" && $scope.phrase.place) {
                $scope.map = {
                    sensor:false,
                    size:'640x320',
                    zoom: $scope.phrase.place.zoom || 12,
                    center: $scope.phrase.place.address,
                    markers:[$scope.phrase.place.address],
                    mapevents: {
                        redirect:false,
                        loadmap:true
                    }
                }
            }
        });

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
            type:'=',
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

            $scope.lettersFilter = function (phrase) {
                if ($scope.mtd.fltr) {var isChild=$scope.mtd.fltr==phrase.letters.substring(0,$scope.mtd.fltr.length);}
                if (phrase.letters==$scope.mtd.fltr || !$scope.mtd.fltr || isChild) {
                    return true;
                }
                return false;
            };


            $scope.$watch('next', function (next) {
                $scope.used=$scope.mtd.getUsed(next);


            });

            $scope.mtd.getUsed = function (source) {
                var result=[];
                var letters;
                for (var phrase in source) {
                    if (source[phrase].letters) {
                        letters=source[phrase].letters.replace($scope.addr+'|', '');
                        if (letters.indexOf('|') == -1) {
                            result.push( source[phrase].letter);
                        }
                    }
                }
                return result;
            };

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