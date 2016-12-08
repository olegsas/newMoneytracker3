function toPlainDays(anyDATA){//returns tow many days between the 1-st January and the anyDATA
    // we use .getTime() method
    var anyYear = anyDATA.getFullYear();
    var startTime = (new Date(anyYear,0,1)).getTime();//new year
    var anyTime = anyDATA.getTime();
    var deltaTIME = anyTime - startTime;
    var plainDays = Math.floor(deltaTIME/(1000*60*60*24))+1;
    return plainDays;

}

var A = new Date(2016,0,31);// 0 is January
print (A);
print(toPlainDays(A));
