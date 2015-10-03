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
    if (story) {
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
}

function parent (lttrs) {
    var letters;
    letters=lttrs.split('|');
    return letters.shift();
}



function colorize (lttrs,opacity) {
    if (lttrs) {
        var hue, sat, light, alpha, step, numOfSteps;
        var hsla = function (hue,sat,light,alpha) {
            return 'hsla('+(hue || '0')+','+(sat || '70')+'%,'+(light || '50')+'%,'+(alpha || 1)+')';
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
        if (opacity && opacity>=0 && opacity<=1) {alpha=opacity}
        return hsla(hue,sat,light,alpha);

    } else return '#fff'; // hsla(0,0%,50%,0.5)

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
    letters=letters.replace(/[\s.:;,//]/g,'|');
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
}/**
 * Created by starov on 10.10.14.
 */
