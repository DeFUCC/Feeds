/**
 * Created by starov on 01.04.14.
 */
var fruitStory = angular.module('fruitStory',['hc.marked', 'ngAnimate']);
var controllers = {};
fruitStory.controller(controllers);

controllers.story = function ($scope) {
    $scope.phrase = {
        letters:'AA',
        head: 'Система подтверждения личностей',
        text: 'Личность - Лицо - Лицо затеи',
        img:'img/thing.svg'
    };
    $scope.story = [
        {
            letters:'B',
            head:'Личность',
            text:'— свод данных, характеризующих конкретное лицо или вымышленного персонажа',
            img:'img/persona.svg'
        },
        {
            letters:'B|A',
            head:'Личность: свод данных',
            text:'- любые авторские произведения, \n' +
                '- ник,\n' +
                '- ФИО,\n' +
                '- телефон\n' +
                '- email\n' +
                '- аккаунты в социальных сетях\n'
        },
        {
            letters:'E',
            head:'Лицо',
            text:'— человек, подтвердивший свою личность',
            img:'img/face.svg'     
        },
        {
            letters:'E|Y',
            head:'',
            text:'Лицом может стать любое физическое лицо, способное подтвердить свою личность'
            
        },
        {
            letters:'E|P',
            head:'Лицо затеи',
            text:'— конечный адресат всех вопросов, связанных с этой затеей. Глаза, уши, нос и рот затеи.'
            
        },
        {
            letters:'A',
            head:'Штука',
            text:'— материальная сущность',
            img:'img/thing.svg'
            
        },
        {
            letters:'X',
            head:'Задача',
            text:'– описание результативного действия с приложением всей необходимой для его совершения информации',
            img:'img/task.svg'

        },
        {
            letters:'X|A',
            head:'Полная задача',
            text:'подразумевает наличие инвентаря и необходимых материалов'

        },
        {
            letters:'X|O',
            head:'Выполнение задачи возмездно',
            text:'в зависимости от количества шагов, их сложности, а также от статуса собственности материалов и результатов выполнения задачи'

        },
        {
            letters:'X|A|M',
            head:'Всегда есть несколько способов наполнения задачи для ее выполнения',
            text:''

        },
        {
            letters:'H',
            head:'Затея',
            text:'— план реализации общественно-значимых инфраструктурных объектов или событий',
            img:'img/design.svg'
            
        },
        {
            letters:'C',
            head:'Событие',
            text:'— ограниченная по времени совместная деятельность или информация о ней, подтвержденная участниками',
            img:'img/event.svg'
            
        },
        {
            letters:'P',
            head:'Фонд развития',
            text:'— открытый экономический интерфейс'
            
        },
        {
            letters:'O',
            head:'ФРУКТ',
            text:'— это Фонд Развития Универсализации, Кооперации, Творчества'
            
        },
        {
            letters:'M',
            head:'Миссия ФРУКТа',
            text:'Всестороннее разнонаправленное развитие творческого потенциала каждого человека в коллективной реализации затей'
            
        },
        {
            letters:'Y',
            head:'Универсализация',
            text:'— реализация стремления каждого элемента системы овладеть практическим опытом многостороннего изучения всей системы'
            
        },
        {
            letters:'K',
            head:'Кооперация',
            text:'— сложение всех возможных усилий для выполнения задач, невыполнимых индивидуально'
            
        },
        {
            letters:'T',
            head:'Творчество',
            text:'— процесс осознанного приложения свободно определяемого усилия с целью увеличения меры совершенства окружающего мира'
            
        },
        {
            letters:'HA',
            head:'Навык',
            text:'— умение реализовывать известные задачи или получать творческие результаты с применением соответствующего инструмента по назначению, а также руководство по овладению им',
            img:'img/skill.svg'
            
        },
        {
            letters:'BO',
            head:'Лексическая форма',
            text:'— форма применения слова в контексте языка',
            img:'https://pp.vk.me/c406717/v406717088/4d27/nlPXEooE0fI.jpg'
            
        },
        {
            letters:'BC',
            head:'Высказывание',
            text:'— любая информативная фраза, содержащая упоминание ее автора, а также хотя бы одного адресата или предмета этой фразы',
            img:'https://pp.vk.me/c412618/v412618086/8333/6JOVMpyHTN0.jpg'
            
        },
        {
            letters:'AP',
            head:'Дар',
            text:'— любая ценность, принятая фондом развития и направленная на реализацию его затей, а также информация о ней',
            img:'img/donation.svg'
            
        },
        {
            letters:'BC|T',
            head:'Личные высказывания',
            text:'предназначены для получения только их адресатами',
            img:'https://pp.vk.me/c413728/v413728319/64ae/O5rpxOupIAY.jpg'
        },
        {
            letters:'X|O|P',
            head:'Шаг задачи',
            text:'— ограниченное по времени и направлению приложения усилия **выполнимое** действие одного человека.',
            img:''
        },
        {
            letters:'P|A',
            head:'Развитие',
            text:'— движение системы к сместившейся точке равновесия',
            img:''
        },
        {
            letters:'P|Y',
            head:'Фонд, юридически',
            text:'— некоммерческая организация, все ресурсы которой направляются только на выполнение ее миссии.',
            img:''
        }
    ];

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
                    for(key in saying) {
                        obj[key] = saying[key];
                    }
                } else { // Create nested object and update search object
                    search = 'next' in obj ? obj.next : obj.next = {};
                }
            }
        }
        return tree;
    }


    $scope.mtd = {}; //an object for universal methods
    $scope.mtd.preset = preset;
    $scope.mtd.colorize = colorize;
    $scope.mtd.parents = parents;
    $scope.tree=convertStory($scope.story);
    $scope.selected = 'B';

    $scope.mtd.updateStory = function (saying) {
        var said = angular.copy(saying);
        $scope.story.push(said);
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
    }


    function parents (lttrs) {
        var letters;
        letters=lttrs.split('|');
        letters.pop();
        return letters;
    }

    function colorize (lttrs) {
        var numOfSteps, step, letters,letter;
        letters=lttrs.lastIndexOf('|');
        letter=lttrs.slice(letters+1);
        letter=letter.slice(0,4);
        numOfSteps=Math.pow(12,letter.length);
        step=preset(letter.length).indexOf(letter.toUpperCase());
        if (!~step) {step=Math.round(Math.random()*numOfSteps)} //if not set is not valid make random
        return rainbow(numOfSteps,step+1);
    };

    function preset (bit){
        var baseLetters = ['Y', 'A', 'O', 'T', 'H', 'B', 'X', 'C', 'P', 'E', 'M', 'K'];
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

    function rainbow (numOfSteps, step) {
        // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distiguishable vibrant markers in Google Maps and other apps.
        // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
        // Adam Cole, 2011-Sept-14
        var r, g, b;
        var h = step / numOfSteps;
        var i = ~~(h * 6);
        var f = h * 6 - i;
        var q = 1 - f;
        switch(i % 6){
            case 0: r = 1, g = f, b = 0; break;
            case 1: r = q, g = 1, b = 0; break;
            case 2: r = 0, g = 1, b = f; break;
            case 3: r = 0, g = q, b = 1; break;
            case 4: r = f, g = 0, b = 1; break;
            case 5: r = 1, g = 0, b = q; break;
        }
        var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
        return (c);
    }
};

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
            selected: '='
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

fruitStory.filter('objectAsArray', function() {
    return function(object) {
        var array = [];
        for (item in object) {
            array.push(object[item]);
        }
        return array;
    }
});