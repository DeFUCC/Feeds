/**
 * Created by starov on 01.04.14.
 */
var fruitStory = angular.module('fruitStory',['hc.marked', 'ngAnimate']);
var controllers = {};
fruitStory.controller(controllers);

controllers.story = function ($scope) {
    $scope.story = [
        {
            set:'B',
            head:'Личность',
            text:'— свод данных, характеризующих конкретное лицо или вымышленного персонажа',
            img:'img/persona.svg',
            next:[
                {
                    set:'A',
                    head:'Личность: свод данных',
                    text:'- любые авторские произведения, \n' +
                        '- ник,\n' +
                        '- ФИО,\n' +
                        '- телефон\n' +
                        '- email\n' +
                        '- аккаунты в социальных сетях\n',
                    next:[]
                }
            ]
        },
        {
            set:'E',
            head:'Лицо',
            text:'— человек, подтвердивший свою личность',
            img:'img/face.svg',
            next:[
                {
                    set:'Y',
                    head:'',
                    text:'Лицом может стать любое физическое лицо, способное подтвердить свою личность',
                    next:[]
                },
                {
                    set:'P',
                    head:'Лицо затеи',
                    text:'— конечный адресат всех вопросов, связанных с этой затеей. Глаза, уши, нос и рот затеи.',
                    next:[]
                }
            ]
        },
        {
            set:'A',
            head:'Штука',
            text:'— материальная сущность',
            img:'img/thing.svg',
            next:[]
        },
        {
            set:'X',
            head:'Задача',
            text:'– описание результативного действия с приложением всей необходимой для его совершения информации',
            img:'img/task.svg',
            next:[
                {
                    set:'A',
                    head:'Полная задача',
                    text:'подразумевает наличие инвентаря и необходимых материалов',
                    next:[
                        {
                            set:'M',
                            head:'Всегда есть несколько способов наполнения задачи для ее выполнения',
                            text:'',
                            next:[]
                        }
                    ]
                },
                {
                    set:'O',
                    head:'Выполнение задачи возмездно',
                    text:'в зависимости от количества шагов, их сложности, а также от статуса собственности материалов и результатов выполнения задачи',
                    next:[]
                }
            ]
        },
        {
            set:'H',
            head:'Затея',
            text:'— план реализации общественно-значимых инфраструктурных объектов или событий',
            img:'img/design.svg',
            next:[]
        },
        {
            set:'C',
            head:'Событие',
            text:'— ограниченная по времени совместная деятельность или информация о ней, подтвержденная участниками',
            img:'img/event.svg',
            next:[]
        },
        {
            set:'P',
            head:'Фонд развития',
            text:'— открытый экономический интерфейс',
            next:[]
        },
        {
            set:'O',
            head:'ФРУКТ',
            text:'— это Фонд Развития Универсализации, Кооперации, Творчества',
            next:[]
        },
        {
            set:'M',
            head:'Миссия ФРУКТа',
            text:'Всестороннее разнонаправленное развитие творческого потенциала каждого человека в коллективной реализации затей',
            next:[]
        },
        {
            set:'Y',
            head:'Универсализация',
            text:'— реализация стремления каждого элемента системы овладеть практическим опытом многостороннего изучения всей системы',
            next:[]
        },
        {
            set:'K',
            head:'Кооперация',
            text:'— сложение всех возможных усилий для выполнения задач, невыполнимых индивидуально',
            next:[]
        },
        {
            set:'T',
            head:'Творчество',
            text:'— процесс осознанного приложения свободно определяемого усилия с целью увеличения меры совершенства окружающего мира',
            next:[]
        },
        {
            set:'HA',
            head:'Навык',
            text:'— умение реализовывать известные задачи или получать творческие результаты с применением соответствующего инструмента по назначению, а также руководство по овладению им',
            img:'img/skill.svg',
            next:[]
        },
        {
            set:'BO',
            head:'Лексическая форма',
            text:'— форма применения слова в контексте языка',
            img:'https://pp.vk.me/c406717/v406717088/4d27/nlPXEooE0fI.jpg',
            next:[]
        },
        {
            set:'BC',
            head:'Высказывание',
            text:'— любая информативная фраза, содержащая упоминание ее автора, а также хотя бы одного адресата или предмета этой фразы',
            img:'https://pp.vk.me/c412618/v412618086/8333/6JOVMpyHTN0.jpg',
            next:[]
        },
        {
            set:'AP',
            head:'Дар',
            text:'— любая ценность, принятая фондом развития и направленная на реализацию его затей, а также информация о ней',
            img:'img/donation.svg',
            next:[]
        }
    ];

    $scope.sayings=[{
        set:'T|E',
        head: 'Творческая информация',
        text: '— информация о гармонии, структуре, порядке, способах реализации, созидательном опыте'
    }];

    function checkStory (story, saying) {
        var splittedSet = saying.split('|');
        var checker=0;
        for (var i=0;i<story.length;i++) {
            if (story[i].set==splittedSet[0]) {
                if (splittedSet.length==1) {
                    return 'false'
                } else {

                }
            }
        }
    }

    function said (story, sayings) { //функция для разбора массива высказываний и собирания иерархического объекта истории
        var splittedSet;
        for (var i= 0; i<sayings.length; i++) { //перебираем все высказывания
            splittedSet=sayings[i].set.split('|'); //разбираем набор букв высказывания
            if (angular.isArray(splittedSet)) { //ЕСЛИ получился массив,
                for (var j= 0;j<splittedSet;j++) { //перебираем по уровням

                }
            }
        }
    }

    $scope.mtd = {}; //an object for universal methods
    $scope.mtd.preset = preset;
    $scope.mtd.colorize = colorize;
    $scope.selected = 'A';

    function colorize (set) {
        var numOfSteps, step;
        numOfSteps=Math.pow(12,set.length);
        step=preset(set.length).indexOf(set.toUpperCase());
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