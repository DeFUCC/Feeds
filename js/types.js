fruitStory.service('Types', function () {
    this.types = {
        design:{
            type:'design',
            title:"Затея",
            text: "Затея — план создания объектов или организации событий",
            color:"#f05a28",
            discourse:'H'
        },
        stage:{
            type:'stage'
        },
        event:{
            type:'event',
            title:"Событие",
            text: "Событие — ограниченная по времени совместная деятельность или информация о ней, подтвержденная участниками.",
            color:"#ffca00",
            discourse:'C|C'
        },
        thing:{
            type:'thing',
            title:"Штука",
            text: "Штука — материальная сушность",
            color:"#ffca00",
            discourse:'A'
        },
        persona:{
            type:'persona'
        },
        face:{
            type:'face'
        },
        designFace:{
            type:'design-face'
        },
        donation:{
            type:'donation'
        },
        skill:{
            type:'skill'
        },
        task:{
            type:'task'
        },
        demand:{
            type:'demand'
        }
    };
});