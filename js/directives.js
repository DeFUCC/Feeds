fruitStory.directive("contents", function($compile) {
    return {
        restrict: "E",
        templateUrl: 'partials/contents.html',
        scope: {
            tree: '=',
            mtd:'='
        }
    };
});


fruitStory.directive("filters", function($compile) {
    return {
        restrict: "A",
        templateUrl: 'partials/filters.html'
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
            mtd:'='
        },
        controller: function ($scope) {
            if ($scope.letter) {
                $scope.lttrs=$scope.letter.split('|');
            };

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

fruitStory.directive("addform", function() {
    return {
        restrict: "A",
        templateUrl: 'partials/addform.html',
        scope: {
            phrase: '=',
            mtd: '='
        },
        controller: function ($scope) {
            $scope.phrase = $scope.phrase || {letters:''};

        }
    };
});

fruitStory.directive("card", function($compile) {
    return {
        restrict: "E",
        templateUrl: 'partials/card.html',
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

fruitStory.directive("cards", function($compile) {
    return {
        restrict: "E",
        templateUrl: 'partials/cards.html',
        scope: {
            next: '=',
            mtd: '=',
            selected: '=',
            fltr:'=',
            rf:'=', //for rating filtering
            search:'='
        },
        controller: function ($scope){
            $scope.over={};
            $scope.selected=false;
            $scope.pluses=0;
            $scope.minuses=0;
            $scope.zeros=0;
            $scope.imgClick=function () {

                // Intensify all images with the 'intense' classname.
                var elements = document.querySelectorAll( '.intense' );
                Intense( elements );
                $scope.imgClick=function(){};
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