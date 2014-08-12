fruitStory.service('Types', function () {
    this.types = {
        design:{
            title:"Затея",
            discourse:'H',
            open:[],
            closed:[]
        },
        event:{
            title:"Событие",
            discourse:"H|A",
            open:[],
            closed:[]
        },
        thing:{
            title:"Штука",
            discourse:"A",
            open:[],
            closed:[]
        },
        persona:{
            title:"Личность",
            discourse:"B",
            open:[],
            closed:[]
        }
    };
});