/**
 * Created by starov on 01.04.14.
 */
var fruitStory = angular.module('fruitStory',['hc.marked', 'ngAnimate']);
var controllers = {};
fruitStory.controller(controllers);

controllers.story = function ($scope) {
    $scope.phrase = {
        letters:'',
        head: '',
        text: '',
        img:''
    };
    $scope.story =[
        {
            "letters": "B",
            "head": "Личность",
            "text": "— свод данных, характеризующих конкретное лицо или вымышленного персонажа.",
            "img": "img/persona.svg"
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
            "img": "img/face.svg"
        },
        {
            "letters": "E|Y",
            "head": "",
            "text": "Лицом может стать любое физическое лицо, способное подтвердить свою личность."
        },
        {
            "letters": "E|P",
            "head": "Лицо затеи",
            "img": "img/design-face-proven.svg",
            "text": "— конечный адресат всех вопросов, связанных с этой затеей. Глаза, уши, нос и рот затеи."
        },
        {
            "letters": "A",
            "head": "Штука",
            "text": "— материальная сущность.",
            "img": "img/thing.svg"
        },
        {
            "letters": "X",
            "head": "Задача",
            "text": "– описание результативного действия с приложением всей необходимой для его совершения информации.",
            "img": "img/task.svg"
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
            "img": "img/design.svg"
        },
        {
            "letters": "C",
            "head": "Событие",
            "text": "— ограниченная по времени совместная деятельность или информация о ней, подтвержденная участниками.",
            "img": "img/event.svg"
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
            "img": "img/skill.svg"
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
            "img": "img/donation.svg"
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
            "img": "img/question.svg"
        },
        {
            "letters": "Y|B|H",
            "head": "",
            "text": "Буду ли я делать что-то новое и необычное для меня?",
            "img": "img/question.svg"
        },
        {
            "letters": "Y|B|M",
            "head": "",
            "text": "Это непривычная деятельность?",
            "img": "img/question.svg"
        },
        {
            "letters": "Y|B|Y",
            "head": "",
            "text": "Научит ли это меня чему-то новому?",
            "img": "img/question.svg"
        },
        {
            "letters": "Y|B|P",
            "head": "",
            "text": "Есть ли возможность попробовать себя в новой роли?",
            "img": "img/question.svg"
        },
        {
            "letters": "K|B",
            "head": "Вопросы Кооперации",
            "text": "",
            "img": "img/question.svg"
        },
        {
            "letters": "K|B|A",
            "head": "",
            "text": "Это невозможно сделать в одиночку?",
            "img": "img/question.svg"
        },
        {
            "letters": "K|B|O",
            "head": "",
            "text": "Помощь других будет полезна?",
            "img": "img/question.svg"
        },
        {
            "letters": "K|B|C",
            "head": "",
            "text": "Усилия всех участников складываются?",
            "img": "img/question.svg"
        },
        {
            "letters": "K|B|H",
            "head": "",
            "text": "Победителей и побежденных быть не может?",
            "img": "img/question.svg"
        },
        {
            "letters": "T|B",
            "head": "Вопросы Творчества",
            "text": "",
            "img": "img/question.svg"
        },
        {
            "letters": "T|B|O",
            "head": "",
            "text": "Будет ли что-то создано в результате?",
            "img": "img/question.svg"
        },
        {
            "letters": "T|B|C",
            "head": "",
            "text": "Свободно ли определение прилагаемого усилия?",
            "img": "img/question.svg"
        },
        {
            "letters": "T|B|P",
            "head": "",
            "text": "Осознанно ли приложение усилия?",
            "img": "img/question.svg"
        },
        {
            "letters": "T|B|B",
            "head": "",
            "text": "Повышается ли мера совершенства окружающего мира?",
            "img": "img/question.svg"
        },
        {
            "letters": "Y|Y",
            "head": "Утверждения Универсализации",
            "text": "",
            "img": "img/statement.svg"
        },
        {
            "letters": "Y|Y|A",
            "head": "",
            "text": "Никогда не делал ничего подобного.",
            "img": "img/statement.svg"
        },
        {
            "letters": "Y|Y|M",
            "head": "",
            "text": "Можно научиться что-то делать и что-то сделать.",
            "img": "img/statement.svg"
        },
        {
            "letters": "Y|Y|O",
            "head": "",
            "text": "Как раз хотел получить навыки из этой сферы знания.",
            "img": "img/statement.svg"
        },
        {
            "letters": "Y|Y|H",
            "head": "",
            "text": "Это может дать много полезного нового опыта.",
            "img": "img/statement.svg"
        },
        {
            "letters": "K|Y",
            "head": "Утверждения Кооперации",
            "text": "",
            "img": "img/statement.svg"
        },
        {
            "letters": "K|Y|M",
            "head": "",
            "text": "В одиночку это невозможно.",
            "img": "img/statement.svg"
        },
        {
            "letters": "K|Y|H",
            "head": "",
            "text": "Я помогу и мне помогут.",
            "img": "img/statement.svg"
        },
        {
            "letters": "K|Y|K",
            "head": "",
            "text": "Каждый найдет, чем заняться полезным.",
            "img": "img/statement.svg"
        },
        {
            "letters": "K|Y|B",
            "head": "",
            "text": "Вместе, сложив усилия, мы сделаем это реальным.",
            "img": "img/statement.svg"
        },
        {
            "letters": "T|Y",
            "head": "Утверждения творчества",
            "text": "",
            "img": "img/statement.svg"
        },
        {
            "letters": "T|Y|M",
            "head": "",
            "text": "В результате получится новая штука.",
            "img": "img/statement.svg"
        },
        {
            "letters": "T|Y|T",
            "head": "",
            "text": "Это может дать возможность записать на долговечный носитель **творческую информацию** о штуке или событии.",
            "img": "img/statement.svg"
        },
        {
            "letters": "T|Y|K",
            "head": "",
            "text": "Это сделает мир ближе к совершенству.",
            "img": "img/statement.svg"
        },
        {
            "letters": "T|Y|P",
            "head": "",
            "text": "Удалось запечатлеть редкую творческую информацию.",
            "img": "img/statement.svg"
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
            "img": "img/skill.svg"
        },
        {
            "letters": "X|A|H",
            "head": "Наиболее полная задача",
            "text": "предполагает наличие:\n- необходимого и достаточного **инструмента** с описанием его назначения,\n- инструкции ко всем задействованным **навыкам**,\n- весь необходимый **материал** для получения навыков и выполнения задачи,\n- варианты возмещения труда.",
            "img": "img/task.svg"
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
            "img": "img/sandbox.svg"
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
            "img": "img/task.svg"
        },
        {
            "letters": "O|O|M",
            "head": "Поставки",
            "text": "Доступ к списку необходимых для реализации затей **поставок** с возможностью вписаться на их реализацию.",
            "img": "img/demand.svg"
        },
        {
            "letters": "O|O|A",
            "head": "Вывеска затеи",
            "text": "Доступ к **полной информации** затеи с возможностью добавления информации лицами и участниками данной затеи.",
            "img": "img/design.svg"
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
            "img": "img/persona.svg"
        },
        {
            "letters": "O|O|K",
            "head": "ЭКошелек",
            "text": "Доступ к **ЭКошельку** личности с возможностью внесения средств, формирования даров и управления ими, а также отслеживания их совершения.",
            "img": "img/donation.svg"
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
            "img": "img/sandbox.svg"
        },
        {
            "letters": "O|C|A|B",
            "head": "Каталог затей",
            "text": "",
            "img": "img/design.svg"
        },
        {
            "letters": "O|C|A|A",
            "head": "Витрина задач",
            "text": "",
            "img": "img/task.svg"
        },
        {
            "letters": "O|C|A|T",
            "head": "Витрина поставок",
            "text": "",
            "img": "img/demand.svg"
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
    $scope.JSON=JSON.stringify($scope.story, '',4);
    $scope.selected = 'B';

    $scope.mtd.updateStory = function (saying) {
        var said = angular.copy(saying);
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