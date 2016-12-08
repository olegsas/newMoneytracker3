function makeTwoRandom(startDay, finishDay){
    var arr = [];
    var n;
    while(arr.length<2){
        n = Math.floor(Math.random()*(finishDay - startDay) + startDay);
        print("n= "+n);
        if(arr.indexOf(n) == -1){// the mistake was to use = instead of == or even ===
            arr.push(n);
        }
    }
return arr;
}

var r = makeTwoRandom(1,30);
print("##1day - "+r[0]);
print("##2day - "+r[1]);