/**
 * Created by starov on 01.04.14.
 */
var fruitStory = angular.module('fruitStory',['hc.marked', 'sticky']);
var controllers = {};
fruitStory.controller(controllers);

controllers.story = function ($scope, StoryService) {
    $scope.story = StoryService.story;
    $scope.phrase = {
        letters:'',
        head: '',
        text: '',
        img:''
    };




    $scope.mtd = {}; //an object for universal methods
    $scope.mtd.preset = preset;
    $scope.mtd.shuffle = shuffle;
    $scope.mtd.colorize = colorize;
    $scope.mtd.parents = parents;
    $scope.mtd.convertLetters = convertLetters;
    $scope.mtd.convertStory=convertStory;
    $scope.mtd.my=$scope.my;
    $scope.tree=convertStory($scope.story);
    $scope.source=$scope.tree;

    $scope.JSON=JSON.stringify($scope.story, '',4);
    $scope.selected = 'B';
    $scope.mtd.updateStory = function (saying) {
        var said = angular.copy(saying);
        saying={};
        said.letters=convertLetters(said.letters);
        $scope.story.push(said);
        $scope.JSON=JSON.stringify($scope.story, '',4);
        $scope.tree=convertStory($scope.story);
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
    $scope.loadLocal = function (where, what) {
        if (localStorage[where]) {
            if (what) {what=JSON.parse(localStorage[where]);}
            return JSON.parse(localStorage[where]);
        }

    };
    $scope.saveLocal = function (where, what) {
        localStorage[where] = JSON.stringify(what);
    };

    $scope.mtd.persona=$scope.loadLocal('persona') || '';
    $scope.mtd.savePersona = function () {
        $scope.saveLocal('persona',this.persona);
    };
    $scope.rating=$scope.loadLocal('rating') || {};
    $scope.ratingMode=$scope.loadLocal('ratingMode') || {news:true,plus:true,zero:true,minus:false};
    $scope.mtd.rate={};
    $scope.mtd.rate.rating = $scope.rating;
    $scope.mtd.rate.plus=function (letters) {
        if (angular.isObject(letters)) {letters=letters.letters;}
        $scope.rating[letters] = $scope.rating[letters] || {pluses:0,zeros:0,minuses:0};
        $scope.rating[letters].pluses++;
        $scope.saveLocal('rating', $scope.rating);
    };
    $scope.mtd.rate.minus=function (letters) {
        if (angular.isObject(letters)) {letters=letters.letters;}
        $scope.rating[letters] = $scope.rating[letters] || {pluses:0,zeros:0,minuses:0};
        $scope.rating[letters].minuses++;
        $scope.saveLocal('rating', $scope.rating);
    };
    $scope.mtd.rate.zero=function (letters) {
        if (angular.isObject(letters)) {letters=letters.letters;}
        $scope.rating[letters] = $scope.rating[letters] || {pluses:0,zeros:0,minuses:0};
        $scope.rating[letters].zeros++;
        $scope.saveLocal('rating', $scope.rating);
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
    };    $scope.mtd.rate.getZeros=function (letters) {
        if ($scope.rating[letters]) {return $scope.rating[letters].zeros+$scope.rating[letters].pluses+$scope.rating[letters].minuses}
        else return '';
    };
    $scope.mtd.rate.getRating = function (letters) {
        if($scope.rating[letters]) {return $scope.rating[letters].pluses-$scope.rating[letters].minuses}
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
        for (var i=0;i<$scope.story.length; i++) {
            if (!$scope.rating[$scope.story[i].letters]) {total++}
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
        $scope.saveLocal('ratingMode', $scope.ratingMode);
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



function colorize (lttrs) {
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
    return hsla(hue,sat,light,alpha);


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
    letters=letters.replace(/[\s.,//]/g,'|');
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

fruitStory.directive("contents", function($compile) {
    return {
        restrict: "E",
        templateUrl: 'contents.html',
        scope: {
            tree: '=',
            mtd:'='
        }
    };
});

fruitStory.directive("content", function($compile) {
    return {
        restrict: "E",
        templateUrl: 'content.html',
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
        templateUrl: 'letters.html',
        scope: {
            letter: '=',
            mtd:'='
        },
        controller: function ($scope) {
            $scope.lttrs=$scope.letter.split('|');

        }
    };
});

fruitStory.directive("card", function($compile) {
    return {
        restrict: "E",
        templateUrl: 'card.html',
        scope: {
            nxt: '=',
            mtd: '=',
            close: '&'
        },
        controller: function ($scope){
            $scope.over={};
            $scope.selected=false;
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
        templateUrl: 'cards.html',
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

fruitStory.filter('objectAsArray', function() {
    return function(object) {
        var array = [];
        for (var item in object) {
            array.push(object[item]);
        }
        return array;
    }
});

fruitStory.service('StoryService', function () {
    this.story=[
        {
            "letters": "B",
            "head": "Личность",
            "text": "— свод данных, характеризующих конкретное лицо или вымышленного персонажа.",
            "icon": "icons/persona.svg"
        },
        {
            "letters": "B|A",
            "head": "Личность: свод данных",
            "text": "- любые авторские произведения, \n- ник,\n- ФИО,\n- телефон\n- email\n- аккаунты в социальных сетях.\n"
        },
        {
            "letters": "E",
            "head": "Лицо",
            "text": "— человек, подтвердивший свою личность.",
            "icon": "icons/face.svg"
        },
        {
            "letters": "E|Y",
            "head": "",
            "text": "Лицом может стать любое физическое лицо, способное подтвердить свою личность."
        },
        {
            "letters": "E|P",
            "head": "Лицо затеи",
            "icon": "icons/design-face-proven.svg",
            "text": "— конечный адресат всех вопросов, связанных с этой затеей. Глаза, уши, нос и рот затеи."
        },
        {
            "letters": "A",
            "head": "Штука",
            "text": "— материальная сущность.",
            "icon": "icons/thing.svg"
        },
        {
            "letters": "X",
            "head": "Задача",
            "text": "– описание результативного действия с приложением всей необходимой для его совершения информации.",
            "icon": "icons/task.svg"
        },
        {
            "letters": "X|A",
            "head": "Полная задача",
            "text": "подразумевает наличие инвентаря и необходимых материалов."
        },
        {
            "letters": "X|O",
            "head": "Выполнение задачи возмездно",
            "text": "в зависимости от количества шагов, их сложности, а также от статуса собственности материалов и результатов выполнения задачи."
        },
        {
            "letters": "X|A|M",
            "head": "Всегда есть несколько способов наполнения задачи для ее выполнения.",
            "text": ""
        },
        {
            "letters": "H",
            "head": "Затея",
            "text": "— план реализации общественно-значимых инфраструктурных объектов или событий.",
            "icon": "icons/design.svg"
        },
        {
            "letters": "C",
            "head": "Событие",
            "text": "— ограниченная по времени совместная деятельность или информация о ней, подтвержденная участниками.",
            "icon": "icons/event.svg"
        },
        {
            "letters": "P",
            "head": "Фонд развития",
            "text": "— открытый экономический интерфейс."
        },
        {
            "letters": "O",
            "head": "ФРУКТ",
            "text": "— это Фонд Развития Универсализации, Кооперации, Творчества."
        },
        {
            "letters": "M",
            "head": "Миссия ФРУКТа",
            "text": "Всестороннее разнонаправленное развитие творческого потенциала каждого человека в коллективной реализации затей."
        },
        {
            "letters": "Y",
            "head": "Универсализация",
            "text": "— реализация стремления каждого элемента системы овладеть практическим опытом многостороннего изучения всей системы."
        },
        {
            "letters": "K",
            "head": "Кооперация",
            "text": "— сложение всех возможных усилий для выполнения задач, невыполнимых индивидуально."
        },
        {
            "letters": "T",
            "head": "Творчество",
            "text": "— процесс осознанного приложения свободно определяемого усилия с целью увеличения меры совершенства окружающего мира."
        },
        {
            "letters": "HA",
            "head": "Навык",
            "text": "— умение реализовывать известные задачи или получать творческие результаты с применением соответствующего инструмента по назначению, а также руководство по овладению им.",
            "icon": "icons/skill.svg"
        },
        {
            "letters": "BO",
            "head": "Лексическая форма",
            "text": "— форма применения слова в контексте языка.",
            "img": "https://pp.vk.me/c406717/v406717088/4d27/nlPXEooE0fI.jpg"
        },
        {
            "letters": "BC",
            "head": "Высказывание",
            "text": "— любая информативная фраза, содержащая упоминание ее автора, а также хотя бы одного адресата или предмета этой фразы.",
            "img": "https://pp.vk.me/c412618/v412618086/8333/6JOVMpyHTN0.jpg"
        },
        {
            "letters": "AP",
            "head": "Дар",
            "text": "— любая ценность, принятая фондом развития и направленная на реализацию его затей, а также информация о ней.",
            "icon": "icons/donation.svg"
        },
        {
            "letters": "BC|T",
            "head": "Личные высказывания",
            "text": "предназначены для получения только их адресатами.",
            "img": "https://pp.vk.me/c413728/v413728319/64ae/O5rpxOupIAY.jpg"
        },
        {
            "letters": "X|O|P",
            "head": "Шаг задачи",
            "text": "— ограниченное по времени и направлению приложения усилия **выполнимое** действие одного человека.",
            "img": ""
        },
        {
            "letters": "P|A",
            "head": "Развитие",
            "text": "— движение системы к сместившейся точке равновесия.",
            "img": ""
        },
        {
            "letters": "P|Y",
            "head": "Фонд, юридически",
            "text": "— некоммерческая организация, все ресурсы которой направляются только на выполнение ее миссии.",
            "img": ""
        },
        {
            "letters": "P|E",
            "head": "Реализация целей и идей",
            "text": "Фонд развития обеспечивает системную реализацию затей, способствующих достижению его целей и осуществлению его обоснованных идей.",
            "img": ""
        },
        {
            "letters": "P|E|K",
            "head": "Цели",
            "text": "Цели фонда развития содержатся в его **Миссии**.",
            "img": ""
        },
        {
            "letters": "P|E|B",
            "head": "Идеи",
            "text": "Идеи фонда развития содержатся в его **названии** и в тексте их **обоснования**.",
            "img": ""
        },
        {
            "letters": "Y|B",
            "head": "Вопросы Универсализации",
            "text": "",
            "icon": "icons/question.svg"
        },
        {
            "letters": "Y|B|H",
            "head": "",
            "text": "Буду ли я делать что-то новое и необычное для меня?",
            "img": ""
        },
        {
            "letters": "Y|B|M",
            "head": "",
            "text": "Это непривычная деятельность?",
            "img": ""
        },
        {
            "letters": "Y|B|Y",
            "head": "",
            "text": "Научит ли это меня чему-то новому?",
            "img": ""
        },
        {
            "letters": "Y|B|P",
            "head": "",
            "text": "Есть ли возможность попробовать себя в новой роли?",
            "img": ""
        },
        {
            "letters": "K|B",
            "head": "Вопросы Кооперации",
            "text": "",
            "icon": "icons/question.svg"
        },
        {
            "letters": "K|B|A",
            "head": "",
            "text": "Это невозможно сделать в одиночку?",
            "img": ""
        },
        {
            "letters": "K|B|O",
            "head": "",
            "text": "Помощь других будет полезна?",
            "img": ""
        },
        {
            "letters": "K|B|C",
            "head": "",
            "text": "Усилия всех участников складываются?",
            "img": ""
        },
        {
            "letters": "K|B|H",
            "head": "",
            "text": "Победителей и побежденных быть не может?",
            "img": ""
        },
        {
            "letters": "T|B",
            "head": "Вопросы Творчества",
            "text": "",
            "icon": "icons/question.svg"
        },
        {
            "letters": "T|B|O",
            "head": "",
            "text": "Будет ли что-то создано в результате?",
            "img": ""
        },
        {
            "letters": "T|B|C",
            "head": "",
            "text": "Свободно ли определение прилагаемого усилия?",
            "img": ""
        },
        {
            "letters": "T|B|P",
            "head": "",
            "text": "Осознанно ли приложение усилия?",
            "img": ""
        },
        {
            "letters": "T|B|B",
            "head": "",
            "text": "Повышается ли мера совершенства окружающего мира?",
            "img": ""
        },
        {
            "letters": "Y|Y",
            "head": "Утверждения Универсализации",
            "text": "",
            "icon": "icons/statement.svg"
        },
        {
            "letters": "Y|Y|A",
            "head": "",
            "text": "Никогда не делал ничего подобного.",
            "img": ""
        },
        {
            "letters": "Y|Y|M",
            "head": "",
            "text": "Можно научиться что-то делать и что-то сделать.",
            "img": ""
        },
        {
            "letters": "Y|Y|O",
            "head": "",
            "text": "Как раз хотел получить навыки из этой сферы знания.",
            "img": ""
        },
        {
            "letters": "Y|Y|H",
            "head": "",
            "text": "Это может дать много полезного нового опыта.",
            "img": ""
        },
        {
            "letters": "K|Y",
            "head": "Утверждения Кооперации",
            "text": "",
            "icon": "icons/statement.svg"
        },
        {
            "letters": "K|Y|M",
            "head": "",
            "text": "В одиночку это невозможно.",
            "img": ""
        },
        {
            "letters": "K|Y|H",
            "head": "",
            "text": "Я помогу и мне помогут.",
            "img": ""
        },
        {
            "letters": "K|Y|K",
            "head": "",
            "text": "Каждый найдет, чем заняться полезным.",
            "img": ""
        },
        {
            "letters": "K|Y|B",
            "head": "",
            "text": "Вместе, сложив усилия, мы сделаем это реальным.",
            "img": ""
        },
        {
            "letters": "T|Y",
            "head": "Утверждения творчества",
            "text": "",
            "icon": "icons/statement.svg"
        },
        {
            "letters": "T|Y|M",
            "head": "",
            "text": "В результате получится новая штука.",
            "img": ""
        },
        {
            "letters": "T|Y|T",
            "head": "",
            "text": "Это может дать возможность записать на долговечный носитель **творческую информацию** о штуке или событии.",
            "img": ""
        },
        {
            "letters": "T|Y|K",
            "head": "",
            "text": "Это сделает мир ближе к совершенству.",
            "img": ""
        },
        {
            "letters": "T|Y|P",
            "head": "",
            "text": "Удалось запечатлеть редкую творческую информацию.",
            "img": ""
        },
        {
            "letters": "T|E",
            "head": "Творческая информация",
            "text": "— информация о гармонии, структуре, порядке, способах реализации, созидательном опыте.",
            "img": ""
        },
        {
            "letters": "Y|H",
            "head": "Универсализация",
            "text": "— это процесс разработки и доказательства новых **навыков**, а также процесс обмена уже имеющимися.",
            "img": ""
        },
        {
            "letters": "T|E|H",
            "head": "",
            "text": "Документация процесса разработки и доказательства новых **навыков**, а также любая информация, способствующая процессу обмена навыками — **творческая информация**.",
            "img": ""
        },
        {
            "letters": "K|O",
            "head": "",
            "text": "Объединение для разработки и доказательства новых навыков и обмена уже имеющимися — **кооперация**, т.к. задача **универсализации** в рамках общества неразрешима индивидуально.",
            "icon": "icons/skill.svg"
        },
        {
            "letters": "X|A|H",
            "head": "Наиболее полная задача",
            "text": "предполагает наличие:\n- необходимого и достаточного **инструмента** с описанием его назначения,\n- инструкции ко всем задействованным **навыкам**,\n- весь необходимый **материал** для получения навыков и выполнения задачи,\n- варианты возмещения труда.",
            "icon": "icons/task.svg"
        },
        {
            "letters": "P|E|A",
            "head": "Дерево фонда",
            "text": "— система реализации затей этого фонда.",
            "img": ""
        },
        {
            "letters": "O|C",
            "head": "Фруктовое дерево",
            "text": "— система реализации **фруктовых** затей.",
            "img": ""
        },
        {
            "letters": "O|C|C",
            "head": "",
            "text": "**ФРУКТ** предоставляет интерфейсы доступа к фруктовому дереву.",
            "img": ""
        },
        {
            "letters": "O|O",
            "head": "Интерфейсы ФРУКТа",
            "text": "",
            "img": ""
        },
        {
            "letters": "O|O|Y",
            "head": "",
            "text": "Обзор дерева затей",
            "img": ""
        },
        {
            "letters": "O|O|B",
            "head": "Песочница",
            "text": "Доступ к системе индивидуальной и коллективной **разработки затей**.",
            "icon": "icons/sandbox.svg"
        },
        {
            "letters": "O|O|P",
            "head": "УКТ",
            "text": "Доступ к системе рейтинга затей **УКТ**.",
            "img": ""
        },
        {
            "letters": "O|O|O",
            "head": "Задачи",
            "text": "Доступ к списку **настоящих задач** фруктовых затей с возможностью вписаться на их выполнение.",
            "icon": "icons/task.svg"
        },
        {
            "letters": "O|O|M",
            "head": "Поставки",
            "text": "Доступ к списку необходимых для реализации затей **поставок** с возможностью вписаться на их реализацию.",
            "icon": "icons/demand.svg"
        },
        {
            "letters": "O|O|A",
            "head": "Вывеска затеи",
            "text": "Доступ к **полной информации** затеи с возможностью добавления информации лицами и участниками данной затеи.",
            "icon": "icons/design.svg"
        },
        {
            "letters": "O|O|C",
            "head": "Стена затеи",
            "text": "— собрание событий с упоминанием этой затеи, высказываний ее лиц, участников и личностей, совершивших дар, а также событий этой затеи, вносимых ее лицами.",
            "img": ""
        },
        {
            "letters": "O|O|H",
            "head": "Личности",
            "text": "Доступ к списку личностей с возможностью просмотра их **публичной** информации.",
            "icon": "icons/persona.svg"
        },
        {
            "letters": "O|O|K",
            "head": "ЭКошелек",
            "text": "Доступ к **ЭКошельку** личности с возможностью внесения средств, формирования даров и управления ими, а также отслеживания их совершения.",
            "icon": "icons/donation.svg"
        },
        {
            "letters": "O|O|Y|E",
            "head": "",
            "text": "Обзор дерева затей предоставляет возможность просмотра и анализа подробной информации о настоящем и предыдущих состояниях **кроны** и **ствола**, а также доступной информации о **корнях** дерева.",
            "img": ""
        },
        {
            "letters": "P|E|A|O",
            "head": "Крона",
            "text": "",
            "img": ""
        },
        {
            "letters": "P|E|A|O|B",
            "head": "",
            "text": "Система разработки и публикации затей.",
            "img": ""
        },
        {
            "letters": "P|E|A|O|P",
            "head": "Рейтинг",
            "text": "Система отбора и рейтинга затей.",
            "img": ""
        },
        {
            "letters": "P|E|A|O|O",
            "head": "",
            "text": "Система выполнения настоящих задач актуальных затей.",
            "img": ""
        },
        {
            "letters": "P|E|A|O|M",
            "head": "",
            "text": "Система обеспечения поставок материалов, необходимых для реализации затей.",
            "img": ""
        },
        {
            "letters": "P|E|A|O|C",
            "head": "",
            "text": "Система информационной поддержки затей.",
            "img": ""
        },
        {
            "letters": "P|E|A|K",
            "head": "Корневая система",
            "text": "обеспечивает прием и хранение средств и штук населения, а также формирование из них даров и направление их на реализацию затей.",
            "img": ""
        },
        {
            "letters": "P|E|A|B",
            "head": "Ствол",
            "text": "",
            "img": ""
        },
        {
            "letters": "P|E|A|B|A",
            "head": "",
            "text": "Система учета и логистики даров.",
            "img": ""
        },
        {
            "letters": "P|E|A|B|T",
            "head": "",
            "text": "Система хранения и транспортировки даров.",
            "img": ""
        },
        {
            "letters": "P|E|A|B|P",
            "head": "",
            "text": "Система рециркуляции несовершённых даров.",
            "img": ""
        },
        {
            "letters": "P|E|A|B|O",
            "head": "",
            "text": "Система обмена информацией между кроной и корневой системой.",
            "img": ""
        },
        {
            "letters": "O|C|A",
            "head": "Крона фруктового дерева",
            "text": "",
            "img": ""
        },
        {
            "letters": "O|C|A|H",
            "head": "Песочница",
            "text": "— инкубатор затей.",
            "icon": "icons/sandbox.svg"
        },
        {
            "letters": "O|C|A|B",
            "head": "Каталог затей",
            "text": "",
            "icon": "icons/design.svg"
        },
        {
            "letters": "O|C|A|A",
            "head": "Витрина задач",
            "text": "",
            "icon": "icons/task.svg"
        },
        {
            "letters": "O|C|A|T",
            "head": "Витрина поставок",
            "text": "",
            "icon": "icons/demand.svg"
        },
        {
            "letters": "O|C|A|P",
            "head": "Ленты высказываний",
            "text": "",
            "img": ""
        },
        {
            "letters": "O|C|A|O",
            "head": "Личное—Публичное",
            "text": "— система доставки и публикации высказываний.",
            "img": ""
        },
        {
            "letters": "O|C|A|C",
            "head": "Ленты событий",
            "text": "Система уведомления о настоящих событиях.",
            "img": ""
        },
        {
            "letters": "O|C|T",
            "head": "Ствол фруктового дерева",
            "text": "",
            "img": ""
        },
        {
            "letters": "O|C|T|Y",
            "head": "",
            "text": "Автоматизированный учет даров.",
            "img": ""
        },
        {
            "letters": "O|C|T|O",
            "head": "",
            "text": "Управляемая автоматическая логистика даров.",
            "img": ""
        },
        {
            "letters": "O|C|T|A",
            "head": "",
            "text": "Децентрализованная сеть транспортировки даров.",
            "img": ""
        },
        {
            "letters": "O|C|T|E",
            "head": "",
            "text": "Комиссионная рециркуляция несовершённых даров.",
            "img": ""
        },
        {
            "letters": "O|C|T|P",
            "head": "",
            "text": "Высокоскоростное уведомление о создании, направлении и продвижении даров.",
            "img": ""
        },
        {
            "letters": "O|C|E",
            "head": "Корневая система фруктового дерева",
            "text": "",
            "img": ""
        },
        {
            "letters": "O|C|E|H",
            "head": "",
            "text": "Распределенная сеть пунктов учёта, приёма, сбора и временного хранения различных средств и разных штук, принятых в качестве дара, направленного на реализацию фруктовых затей.",
            "img": ""
        },
        {
            "letters": "O|C|E|A",
            "head": "",
            "text": "Децентрализованная сеть пунктов хранения личной—публичной информации с расширяемой системой подтверждения личностей.",
            "img": ""
        },
        {
            "letters": "O|C|E|B",
            "head": "",
            "text": "Устойчивая сеть высокоскоростной передачи и надежного хранения творческой информации, а также других фруктовых данных.",
            "img": ""
        },
        {
            "letters": "H|Y|A",
            "head": "Каталог фонда затей",
            "text": "— это список всех опубликованных затей фонда с возможностью просмотра и пополнения их **вывесок**, **стен** и **окон**.",
            "img": ""
        },
        {
            "letters": "H|O",
            "head": "Окно затеи",
            "text": "Поток актуальной информации о затее от её лиц и участников, а также иной информации, связанной с затеей, одобренной к публикации ее лицами.",
            "img": ""
        },
        {
            "letters": "H|C",
            "head": "Стена затеи",
            "text": "Собрание событий с упоминанием этой затеи, а также высказываний о ней от ее лиц, участников, а также от личностей, совершивших **дар** и авторов ее оценки **УКТ**.",
            "img": ""
        },
        {
            "letters": "H|B",
            "head": "Вывеска затеи",
            "text": "содержит всю необходимую для реализации затеи информацию.",
            "img": ""
        },
        {
            "letters": "H|Y",
            "head": "Фонд затей",
            "text": "Собрание затей, объединенных целями и идеями этого фонда.",
            "img": ""
        },
        {
            "letters": "H|B|X",
            "head": "Порядок",
            "text": "Буквенный порядок в каталоге затей.",
            "img": ""
        },
        {
            "letters": "H|B|A",
            "head": "Названия",
            "text": "Названия затеи на разных языках.",
            "img": ""
        },
        {
            "letters": "H|B|P",
            "head": "Идея",
            "text": "Мысль, предлагаемая к реализации.",
            "img": ""
        },
        {
            "letters": "H|B|K",
            "head": "Цели",
            "text": "Особенности предполагаемых результатов реализации затеи.",
            "img": ""
        },
        {
            "letters": "H|B|H",
            "head": "Суть",
            "text": "Схема действий, необходимых для реализации затеи, а также описание достаточного количества и качества материалов.",
            "img": ""
        },
        {
            "letters": "H|B|H|Y",
            "head": "Графиколексические упоминания",
            "text": "Суть затеи содержит упоминания всех настоящих **ступеней**, **задач**, **поставок**, **событий** в наглядной графиколексической форме.",
            "img": ""
        },
        {
            "letters": "H|B|M",
            "head": "Места",
            "text": "Возможно точное описание расположения точек реализации затеи и точек поставок и задач.",
            "img": ""
        },
        {
            "letters": "H|B|E",
            "head": "Сроки",
            "text": "Возможно точные даты и длительности ступеней реализации затеи.",
            "img": ""
        },
        {
            "letters": "H|B|T",
            "head": "Информация о лицах и участниках",
            "text": "Вся доступная публичная информация о **лицах** затеи и ее участниках.",
            "img": ""
        },
        {
            "letters": "H|B|C",
            "head": "Контакты представительств",
            "text": "",
            "img": ""
        },
        {
            "letters": "H|B|X",
            "head": "Статусное состояние",
            "text": "Собрание всех настоящих статусов всех ступеней затеи.",
            "img": ""
        },
        {
            "letters": "H|B|T",
            "head": "Теория затеи",
            "text": "Обоснование затеи и теоретический дискурс.",
            "img": ""
        },
        {
            "letters": "H|B|Y",
            "head": "Ответы на частые вопросы",
            "text": "**Лица** обязаны отвечать на любые вопросы, связанные с реализуемой затеей, ответы собираются и группируются.",
            "img": ""
        },
        {
            "letters": "H|B|YK",
            "head": "Оценка УКТ",
            "text": "",
            "img": ""
        },
        {
            "letters": "H|B|OA",
            "head": "План поставок",
            "text": "",
            "img": ""
        },
        {
            "letters": "H|B|EO",
            "head": "План задач",
            "text": "",
            "img": ""
        },
        {
            "letters": "H|B|OA|P",
            "head": "Архив поставок",
            "text": "",
            "img": ""
        },
        {
            "letters": "H|B|EO|P",
            "head": "Архив задач",
            "text": "",
            "img": ""
        },
        {
            "letters": "H|B|PE",
            "head": "Обзор результатов",
            "text": "",
            "img": ""
        },
        {
            "letters": "O|O|X",
            "head": "Личное—Публичное",
            "text": "Система доставки **личных** и издания **публичных** высказываний.",
            "img": ""
        },
        {
            "letters": "BC|E",
            "head": "Публичные высказывания",
            "text": "Высказывания, содержащие упоминания хотя бы одного предмета дискурса.",
            "img": ""
        },
        {
            "letters": "O|X",
            "head": "Фруктовый дискурс",
            "text": "Включает **дары**, а также все элементы затей, в том числе и самого **ФРУКТ**а.",
            "img": ""
        },
        {
            "letters": "O|H",
            "head": "ФРУКТ — это такая ежегодная затея.",
            "text": "",
            "img": ""
        },
        {
            "letters": "BC|Y",
            "head": "Ленты высказываний",
            "text": "Последовательности связанных высказываний.",
            "img": ""
        },
        {
            "letters": "BC|Y|E",
            "head": "Ленты привязаны",
            "text": "Ленты высказываний привязаны к упоминаемым этими высказываниями **личностям** или иным **предметам дискурса**.",
            "img": ""
        },
        {
            "letters": "BC|T|A",
            "head": "Личные ленты",
            "text": "Связывают адресатов.",
            "img": ""
        },
        {
            "letters": "BC|E|M",
            "head": "Публичные ленты",
            "text": "Привязаны к предметам дискурса.",
            "img": ""
        },
        {
            "letters": "AP|O",
            "head": "",
            "text": "Дар обязательно содержит свой уникальный порядок и **определение его ценности**.",
            "img": ""
        },
        {
            "letters": "AP|A",
            "head": "Определение ценности",
            "text": "Состоит из **качественного** и **количественного** описаний.",
            "img": ""
        },
        {
            "letters": "AP|A|A",
            "head": "Качественное описание не бывает короче двух слов.",
            "text": "",
            "img": ""
        },
        {
            "letters": "AP|A|O",
            "head": "Количественное описание",
            "text": "Свод значимых результатов измерения в стандартных единицах.",
            "img": ""
        },
        {
            "letters": "C|Y",
            "head": "Создание события",
            "text": "События создаются первым упоминанием их **порядка**, **названия**, возможно точной **даты** и **времени (длительности)**, а также **места** и возможного количества участников и свидетелей в одном высказывании.",
            "img": ""
        },
        {
            "letters": "C|Y|A",
            "head": "Деятель",
            "text": "Автор такого первого высказывания становится **автором** и **участником** события — его **деятелем**.",
            "img": ""
        },
        {
            "letters": "C|E",
            "head": "Деятель может",
            "text": "Деятель события может предоставить личностям право тоже стать деятелем, либо отдельно автором или участником или свидетелем этого события в рамках возможного их количества.",
            "img": ""
        },
        {
            "letters": "C|Y|E",
            "head": "",
            "text": "Для изменения начальных условий нужно согласие более, чем половины ее деятелей.",
            "img": ""
        },
        {
            "letters": "AP|E",
            "head": "Уточнения",
            "text": "Лица, формирующие дары из предоставленных ими ФРУКТу ценностей, могут предусмотреть **уточнения**.",
            "img": ""
        },
        {
            "letters": "AP|E|H",
            "head": "Уточнение места",
            "text": "Определение территории, на которой возможно совершение этого дара, с любой точностью.\n\nПланета — континент — регион — страна — область — поселение — район — улица — здание — помещение... или координаты точки.",
            "img": ""
        },
        {
            "letters": "AP|E|B",
            "head": "Уточнение времени",
            "text": "Диапазон допустимых дат и времени совершения дара внутри **одного года** со для его формирования.",
            "img": ""
        },
        {
            "letters": "AP|E|K",
            "head": "Уточнение затеи или класса затей.",
            "text": "Список желательных и нежелательных затей для получения данного дара.",
            "img": ""
        },
        {
            "letters": "AP|E|C",
            "head": "Уточнение лиц",
            "text": "Список желательных и нежелательных лиц, реализующих затеи.",
            "img": ""
        },
        {
            "letters": "AP|E|Y",
            "head": "Уточнение УКТ",
            "text": "Желательный рейтинг УКТ затеи.",
            "img": ""
        },
        {
            "letters": "AP|E|A",
            "head": "Уточнение назначения",
            "text": "Назначить дар можно на выполнение определенного типа задач и/или определенного типа поставок.",
            "img": ""
        },
        {
            "letters": "H|K",
            "head": "Класс затей",
            "text": "Группа затей, объединенных общим названием, идеей, целью, теорией.",
            "img": ""
        },
        {
            "letters": "AP|E|O",
            "head": "Уточнение статуса и ступени",
            "text": "",
            "img": ""
        },
        {
            "letters": "H|A",
            "head": "Ступень затеи",
            "text": "Отдельный этап реализации затеи с получением конкретных результатов в известные сроки.",
            "img": ""
        },
        {
            "letters": "H|A|A",
            "head": "Ступень — это",
            "text": "создание объекта или проведение события.",
            "img": ""
        },
        {
            "letters": "H|A|M",
            "head": "Две и более",
            "text": "План затеи содержит не менее двух ступеней.",
            "img": ""
        },
        {
            "letters": "H|A|H",
            "head": "Первый уровень",
            "text": "Ступени первого уровня реализуются независимо.",
            "img": ""
        },
        {
            "letters": "H|A|B",
            "head": "Уровни выше",
            "text": "Ступени уровней выше зависят от результатов нижележащих опорных ступеней и реализуются только после их завершения.",
            "img": ""
        },
        {
            "letters": "O|P",
            "head": "ФРУКТ — это",
            "text": "Открытый экономический интерфейс, предоставляющий возможность реализации общественно-значимых инфраструктурных проектов — **затей** — прозрачным способом коллективного взаимодействия, т.е. **открытая система общественного взаимодействия**.",
            "img": ""
        }
    ]
});
