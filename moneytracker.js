// We write the constants here
var NUMBER_OF_CATEGORY_NAMES = 4;//how many names are in one category
var DATE_OF_DENOMINATION = new Date("2016-07-01");//the date of denomination, the constants
var WEEK = 7;//days in a week

function randomUsd(min, max){
    var minCent = min*100;
    var maxCent = max*100;
    var amount = Math.floor(Math.random()*(maxCent-minCent) + minCent);
    return amount/100;// we work with cents
}

function randomByn(min, max){
    var minByn = min*100;
    var maxByn = max*100;
    var amount =  Math.floor(Math.random()*(maxByn-minByn) + minByn);
    return amount/100; // we work with cents
}

function randomByr(min, max){
    var minByr = min/100;
    var maxByr = max/100;
    var amount = Math.floor(Math.random()*(maxByr - minByr) + minByr);
    return amount*100; // we work with 100 rub minimum

}

function oneDayOfUser(){// we parse all transaction list
    var i = 1, 
    TypeA = [],// TypeA because there is an array of Type
    OperationNameA = [],// 
    AmountMinA = [],
    AmountMaxA = [],
    CurrencyA = [],
    RateA = [],// Rate[2] - is the Rate field of the transaction 2
    PeriodA = [],
    AccountA = [],
    StudentH = {},// this is the hash, {TypeH : TypeA, and so on}
    cursor = db.student.find(),
    length;
    cursor.forEach(
        function(obj){
            TypeA[i] = obj.Type;// we find certain field of the certain transaction
            OperationNameA[i] = obj.OperationName;
            AmountMinA[i] = obj.AmountMin;
            AmountMaxA[i] = obj.AmountMax;
            CurrencyA[i] = obj.Currency;
            RateA[i] = obj.Rate;
            PeriodA[i] = obj.Period;
            AccountA[i] = obj.Account;
                i++; 
        }
    );
    length = i-1;//after last cycle step i=last step+1
    StudentH = {len : length,// StudentH is a hash of transactions and the it has .len
            Type : TypeA ,
            OperationName : OperationNameA,
            AmountMin : AmountMinA,
            AmountMax : AmountMaxA,
            Currency : CurrencyA,
            Rate : RateA,
            Period : PeriodA,
            Account : AccountA}
 return StudentH;   
}

function standartDate(anyDay){// this function normalize string date into a Date object

    var anyDayA = anyDay.split("/");// we have got an array of 3 numbers in a string type
    
    var anyDATE = new Date();
        anyDATE.setFullYear(anyDayA[2]);// A means Array
        anyDATE.setMonth(anyDayA[1]-1);// we have months in range of 0...11
        anyDATE.setDate(anyDayA[0]);// anyDATE is in a correct format

    
    return anyDATE;

}


function plusWeek(nowDay){// function finds a period in 1 week for a transactions
    var pointOne = standartDate(nowDay)//start day
    var day = (pointOne.getDate());// day of a week in range 0...6

    var pointTwo = pointOne;// we assign pointOne to pointTwo because we gonna use a method setDate()
    var x = pointTwo.setDate(day+10);
    return pointTwo;
}    
   /*print(plusWeek("1/1/2010"));
   /*var now = new Date();*/
  /* print(new Date(2016,12,0).getDate());*/
function RandomAmount(AmountMin, AmountMax, Currency){
    var result ;
    var AmountMin = AmountMin,
        AmountMax = AmountMax,
        Currency = Currency;//we will return a result only, we do not need to return currency
    print("currency= "+Currency);
    switch(Currency){
        case "Usd":
            result = randomUsd(AmountMin, AmountMax);break;
        
        case "Byr":
            result = randomByr(AmountMin, AmountMax);break;
        
        case "Byn":
            result = randomByn(AmountMin, AmountMax);break;
        
    }
    return result;
}//RandomAmount returns random result 

function WriteTransaction(Date, Type, Category, Name, Amount, Currency, Account){
    //Date is in standart format
    db.transactions.insert({"Date": Date, "Type": Type, "Category": Category, "Name": Name,
                           "Amount": Amount, "Currency": Currency, "Account": Account});
}// we insert document into the collection

function makeMonthlyTransactions(start_Day, finish_Day, Month, Year){// we check the list of transactions and if we have a monthly one we generate a random day and make a transaction
    //there are arrays typeA[1]...typeA[length] - for every transaction
    // if we have a full month then start_Day is 1 and if we have the first month we use the start_Day
    
    for(i=1; i<oneDayOfUser().len+1; i++){// we check the transaction list
        //print("i="+i);
        //print("oneDayOfUser().Period[i] = "+ oneDayOfUser().Period[i]);
        //print("oneDayOfUser().Rate[i] = "+ oneDayOfUser().Rate[i]);
        if(
            (oneDayOfUser().Period[i] === "Month") && 
            (oneDayOfUser().Rate[i] === 1)){
        
            var transactionDay = Math.floor(Math.random()*(finish_Day - start_Day) + start_Day);
            var transaction_Date = new Date();// we convert it into an object format
            transaction_Date.setFullYear(Year);
            transaction_Date.setMonth(Month);
            transaction_Date.setDate(transactionDay);
            //print("@@Full transaction date is"+transaction_Date);
            var transactionAmount = RandomAmount(oneDayOfUser().AmountMin[i], oneDayOfUser().AmountMax[i],oneDayOfUser().Currency[i])//returns  amount 
            // make a monthly transaction, we need to call random day
            var Number_of_the_name_of_transaction = Math.floor((Math.random()*NUMBER_OF_CATEGORY_NAMES));//0...NUMBER-1
            // Math.random()<1 that`s why name_of_transactions<NUMBER_OF_CATEGORY_NAMES
            var operationName =  oneDayOfUser().OperationName[i]
            var transactionNameH = db.names.find({"transaction":oneDayOfUser().OperationName[i]},{"names":1,_id:0}).toArray();
            // we have an object from the cursor with transactions names of the operation
            //print("transactionName array - " + transactionNameH[0].names);
            var transactionNameOnly = transactionNameH[0].names[Number_of_the_name_of_transaction];
            //print("name of any transaction = "+ transactionNameOnly);
            var transactionType = oneDayOfUser().Type[i];
            var transactionCurrency = oneDayOfUser().Currency[i];
            var transactionAccount = oneDayOfUser().Account[i];
            /*=============================*/
            // we have
            // transactionNameOnly - the name of the transaction
            // operationName - the name of operation the category of transaction
            // transactionDay - the day of the transaction
            // Month, Year - from the arguments of the function
            // Question - have I make the variables like var Month = Month?
            // transactionType - the type of the transaction
            // transactionAmount - the amount of the transaction
            // transactionCurrency - the currency of the transaction
            // transactionAccount - the account for the transaction

            
            if(transaction_Date >= DATE_OF_DENOMINATION){
                if((oneDayOfUser().Currency[i] === "Byn") || (oneDayOfUser().Currency[i] === "Usd")){
                    WriteTransaction(transaction_Date,transactionType, operationName, transactionNameOnly, 
                             transactionAmount, transactionCurrency, transactionAccount)
                }
            }

            if(transaction_Date < DATE_OF_DENOMINATION){
                if((oneDayOfUser().Currency[i] === "Byr") || (oneDayOfUser().Currency[i] === "Usd")){
                    WriteTransaction(transaction_Date,transactionType, operationName, transactionNameOnly, 
                             transactionAmount, transactionCurrency, transactionAccount)
                }
            }
            // this 2 if-conditions checks if the denomination time, and choose the correct currency of the operation
            // use all this variables);//we write a transaction and only we need to give a random name for it
        }
    }
}

function makeTwoRandom(startDay, finishDay){
    var arr = [];
    var n;
    while(arr.length<2){
        n = Math.floor(Math.random()*(finishDay - startDay) + startDay);
        if(arr.indexOf(n) == -1){// the mistake was to use = instead of == or even ===
            arr.push(n);
        }
    }
return arr;
}

function makeThreeRandom(startDay, finishDay){
    var arr = [];
    var n;
    while(arr.length<3){
        n = Math.floor(Math.random()*(finishDay - startDay) + startDay);
        if(arr.indexOf(n) == -1){// the mistake was to use = instead of == or even ===
            arr.push(n);
        }
    }
return arr;
}

function makeSixRandom(startDay, finishDay){
    var arr = [];
    var n;
    while(arr.length<6){
        n = Math.floor(Math.random()*(finishDay - startDay) + startDay);
        if(arr.indexOf(n) == -1){// the mistake was to use = instead of == or even ===
            arr.push(n);
        }
    }
return arr;
}

function makeMonthlyTransactionsTwice(start_Day, finish_Day, Month, Year){
    for(i=1; i<oneDayOfUser().len+1; i++){// we check the transaction list
        print("i="+i);
        print("oneDayOfUser().Period[i] = "+ oneDayOfUser().Period[i]);
        print("oneDayOfUser().Rate[i] = "+ oneDayOfUser().Rate[i]);
        if(
            (oneDayOfUser().Period[i] === "Month") && 
            (oneDayOfUser().Rate[i] === 2)){
        
            var transactionDays = makeTwoRandom(start_Day, finish_Day);// 
            // we have transactionDays[0] and transactionDays[1];
            var transaction_Date1 = new Date();// we convert it into an object format
            transaction_Date1.setFullYear(Year);
            transaction_Date1.setMonth(Month);
            transaction_Date1.setDate(transactionDays[0]);

            var transaction_Date2 = new Date();// we convert it into an object format
            transaction_Date2.setFullYear(Year);
            transaction_Date2.setMonth(Month);
            transaction_Date2.setDate(transactionDays[1]);
            // we have got transaction_Date1 and transaction_Date2

            print("@@Full transaction date1 is"+transaction_Date1);
            print("@@Full transaction date2 is"+transaction_Date2);

            var transactionAmount1 = RandomAmount(oneDayOfUser().AmountMin[i], oneDayOfUser().AmountMax[i],oneDayOfUser().Currency[i])//returns  amount 
            var transactionAmount2 = RandomAmount(oneDayOfUser().AmountMin[i], oneDayOfUser().AmountMax[i],oneDayOfUser().Currency[i])//returns  amount
            // make a monthly transaction, we need to call random day
            var Number_of_the_name_of_transaction1 = Math.floor((Math.random()*NUMBER_OF_CATEGORY_NAMES));//0...NUMBER-1
            var Number_of_the_name_of_transaction2 = Math.floor((Math.random()*NUMBER_OF_CATEGORY_NAMES));//0...NUMBER-1
            // Math.random()<1 that`s why name_of_transactions<NUMBER_OF_CATEGORY_NAMES
            var operationName =  oneDayOfUser().OperationName[i]
            var transactionNameH = db.names.find({"transaction":oneDayOfUser().OperationName[i]},{"names":1,_id:0}).toArray();
            // we have an object from the cursor with transactions names of the operation
            print("transactionName array - " + transactionNameH[0].names);
            var transactionNameOnly1 = transactionNameH[0].names[Number_of_the_name_of_transaction1];
            var transactionNameOnly2 = transactionNameH[0].names[Number_of_the_name_of_transaction2];
            print("name of any transaction1 = "+ transactionNameOnly1);
            print("name of any transaction2 = "+ transactionNameOnly2);

            var transactionType = oneDayOfUser().Type[i];
            var transactionCurrency = oneDayOfUser().Currency[i];
            var transactionAccount = oneDayOfUser().Account[i];
            /*=============================*/
            // we have
            // transactionNameOnly1 - the name of the transaction
            // transactionNameOnly2
            // operationName - the name of operation the category of transaction
            // transaction_Date1 - the day of the transaction
            // transaction_Date2
            // Month, Year - from the arguments of the function
            // Question - have I make the variables like var Month = Month?
            // transactionType - the type of the transaction
            // transactionAmount1 - the amount of the transaction
            // transactionAmount2
            // transactionCurrency - the currency of the transaction
            // transactionAccount - the account for the transaction

            
            if(transaction_Date1 >= DATE_OF_DENOMINATION){
                if((oneDayOfUser().Currency[i] === "Byn") || (oneDayOfUser().Currency[i] === "Usd")){
                    WriteTransaction(transaction_Date1,transactionType, operationName, transactionNameOnly1, 
                             transactionAmount1, transactionCurrency, transactionAccount)
                }
            }

            if(transaction_Date1 < DATE_OF_DENOMINATION){
                if((oneDayOfUser().Currency[i] === "Byr") || (oneDayOfUser().Currency[i] === "Usd")){
                    WriteTransaction(transaction_Date1,transactionType, operationName, transactionNameOnly1, 
                             transactionAmount1, transactionCurrency, transactionAccount)
                }
            }
            // this 2 if-conditions checks if the denomination time, and choose the correct currency of the operation
            // use all this variables);//we write a transaction and only we need to give a random name for it

          if(transaction_Date2 >= DATE_OF_DENOMINATION){
                if((oneDayOfUser().Currency[i] === "Byn") || (oneDayOfUser().Currency[i] === "Usd")){
                    WriteTransaction(transaction_Date2,transactionType, operationName, transactionNameOnly2, 
                             transactionAmount2, transactionCurrency, transactionAccount)
                }
            }

            if(transaction_Date2 < DATE_OF_DENOMINATION){
                if((oneDayOfUser().Currency[i] === "Byr") || (oneDayOfUser().Currency[i] === "Usd")){
                    WriteTransaction(transaction_Date2,transactionType, operationName, transactionNameOnly2, 
                             transactionAmount2, transactionCurrency, transactionAccount)
                }
            }  
        }
    }
}

function runMonthlyOneAndTwice(startDate, finishDate){// global function runs transaction generation
    var startDATE = standartDate(startDate);
    print("##startDATE-"+startDATE);
    
    var finishDATE = standartDate(finishDate);//standart Data objects
    var start_Day = startDATE.getDate();
    print("##start_Day - "+ start_Day);
    var start_Month = startDATE.getMonth();// month is in range 0...11
    print("##start_Month - "+start_Month);
    var start_Year = startDATE.getFullYear();
    print("##start_Year - "+start_Year);

    var max_day_month = new  Date(start_Year, start_Month+1, 0).getDate();// how many days in month
    print("##max_day_month - "+max_day_month);

    var last_Day = max_day_month; // for the first month
        
    makeMonthlyTransactions(start_Day, last_Day, start_Month, start_Year);
    makeMonthlyTransactionsTwice(start_Day, last_Day, start_Month, start_Year);// we call this functions
    //to make all monthly transactions for the first month

       
        var zDATE = new Date(start_Year, start_Month, last_Day);
        zDATE.setDate(zDATE.getDate()+1);
        print("### 1 now NOW DATE = "+zDATE);// 1-st February

var cycleDATEstart,
    cycleDATEfinish,
    cycle_day_in_month,
    cycleDay,
    cycleMonth,
    cycleYear,
    bufferDay,
    bufferMonth,
    bufferYear;
    do{
        cycleDATEstart = zDATE;// first day of month
        print("##cycleDATEstart - " + cycleDATEstart);
        cycleDayFirst = zDATE.getDate();
        print("cycleDay - " + cycleDayFirst);
        cycleMonth = zDATE.getMonth();
        print("cycleMonth - " + cycleMonth);//february = 1
        cycleYear = zDATE.getFullYear();
        print("cycleYear - " + cycleYear);
        cycle_day_in_month = new Date(cycleYear, cycleMonth+1,0).getDate();//how many days in month - OK
        print("##cycle_day_in_month - " + cycle_day_in_month);

        bufferDay = cycleDATEstart.getDate();
        bufferMonth = cycleDATEstart.getMonth();
        bufferYear = cycleDATEstart.getFullYear();
        
        cycleDATEfinish = new Date(bufferYear, bufferMonth, bufferDay);//just now we have a clone
        cycleDATEfinish.setDate(cycleDATEfinish.getDate()+cycle_day_in_month-1);
        print("##cycleDATEfinish - " + cycleDATEfinish);
    
        if(cycleDATEfinish > finishDATE){
            makeMonthlyTransactions(cycleDayFirst, finishDATE.getDate(), cycleMonth, cycleYear);
            makeMonthlyTransactionsTwice(cycleDayFirst, finishDATE.getDate(), cycleMonth, cycleYear);
            //we are in the last short month
        }
        else{
            makeMonthlyTransactions(cycleDayFirst, cycle_day_in_month, cycleMonth, cycleYear);
            makeMonthlyTransactionsTwice(cycleDayFirst, cycle_day_in_month, cycleMonth, cycleYear);
            //we work with full month
        }
    
        bufferDay = cycleDATEfinish.getDate();
        bufferMonth = cycleDATEfinish.getMonth();
        bufferYear = cycleDATEfinish.getFullYear();
        
        zDATE = new Date(bufferYear, bufferMonth, bufferDay);//just now we have a clone 
        zDATE.setDate(cycleDATEfinish.getDate()+1);
        print("##zDATE = cycleDATEfinish+1 = "+zDATE);
        print("$$cycleDATEfinish - "+cycleDATEfinish);
        print("$$finishDATE - "+finishDATE);
    }while(cycleDATEfinish < finishDATE);
}

function DaysInYear(Year){
    var jan = new Date(Year,1,0).getDate();// getDay is the method to find the day of a week
    var feb = new Date(Year,2,0).getDate();
    var mar = new Date(Year,3,0).getDate();
    var apr = new Date(Year,4,0).getDate();
    var may = new Date(Year,5,0).getDate();
    var jun = new Date(Year,6,0).getDate();
    var jul = new Date(Year,7,0).getDate();
    var aug = new Date(Year,8,0).getDate();
    var sep = new Date(Year,9,0).getDate();
    var oct = new Date(Year,10,0).getDate();
    var nov = new Date(Year,11,0).getDate();
    var dec = new Date(Year,12,0).getDate();
    var SumDay = jan+feb+mar+apr+may+jun+jul+aug+sep+oct+nov+dec;
    return SumDay;
}

function toPlainDays(anyDate, anyMonth, anyYear){//returns tow many days between the 1-st January and the anyDATA
    // we use .getTime() method
   // var anyYear = anyDATA.getFullYear();
    var startTime = (new Date(anyYear,0,1)).getTime();//new year
    var anyDATA = new Date(anyYear, anyMonth, anyDate);
    var anyTime = anyDATA.getTime();
    var deltaTIME = anyTime - startTime;
    var plainDays = Math.floor(deltaTIME/(1000*60*60*24))+1;
    return plainDays;

}


function makeYearlyTransactionsTriple(start_Day, last_Day, Year){
    for(i=1; i<oneDayOfUser().len+1; i++){// we check the transaction list
        print("i="+i);
        print("oneDayOfUser().Period[i] = "+ oneDayOfUser().Period[i]);
        print("oneDayOfUser().Rate[i] = "+ oneDayOfUser().Rate[i]);
        if(
            (oneDayOfUser().Period[i] === "Year") && 
            (oneDayOfUser().Rate[i] === 3)){
        
            var transactionDays = makeThreeRandom(start_Day, last_Day);// 
            // we have transactionDays[0] to transactionDays[2];
            var transaction_Date1 = new Date(Year, 0, transactionDays[0]);// we convert it into an object format
            
            var transaction_Date2 = new Date(Year, 0, transactionDays[1]);// we convert it into an object format
            
            var transaction_Date3 = new Date(Year, 0, transactionDays[2]);// we convert it into an object format
            
            // we have got from transaction_Date1 to transaction_Date3

            print("@@Full transaction date1 is"+transaction_Date1);
            print("@@Full transaction date2 is"+transaction_Date2);
            print("@@Full transaction date3 is"+transaction_Date3);

            var transactionAmount1 = RandomAmount(oneDayOfUser().AmountMin[i], oneDayOfUser().AmountMax[i],oneDayOfUser().Currency[i])//returns  amount 
            var transactionAmount2 = RandomAmount(oneDayOfUser().AmountMin[i], oneDayOfUser().AmountMax[i],oneDayOfUser().Currency[i])//returns  amount
            var transactionAmount3 = RandomAmount(oneDayOfUser().AmountMin[i], oneDayOfUser().AmountMax[i],oneDayOfUser().Currency[i])//returns  amount
            // make a monthly transaction, we need to call random day
            var Number_of_the_name_of_transaction1 = Math.floor((Math.random()*NUMBER_OF_CATEGORY_NAMES));//0...NUMBER-1
            var Number_of_the_name_of_transaction2 = Math.floor((Math.random()*NUMBER_OF_CATEGORY_NAMES));//0...NUMBER-1
            var Number_of_the_name_of_transaction3 = Math.floor((Math.random()*NUMBER_OF_CATEGORY_NAMES));//0...NUMBER-1
            // Math.random()<1 that`s why name_of_transactions<NUMBER_OF_CATEGORY_NAMES
            var operationName =  oneDayOfUser().OperationName[i]
            var transactionNameH = db.names.find({"transaction":oneDayOfUser().OperationName[i]},{"names":1,_id:0}).toArray();
            // we have an object from the cursor with transactions names of the operation
            print("transactionName array - " + transactionNameH[0].names);
            var transactionNameOnly1 = transactionNameH[0].names[Number_of_the_name_of_transaction1];
            var transactionNameOnly2 = transactionNameH[0].names[Number_of_the_name_of_transaction2];
            var transactionNameOnly3 = transactionNameH[0].names[Number_of_the_name_of_transaction3];
            print("name of any transaction1 = "+ transactionNameOnly1);
            print("name of any transaction2 = "+ transactionNameOnly2);
            print("name of any transaction3 = "+ transactionNameOnly3);

            var transactionType = oneDayOfUser().Type[i];
            var transactionCurrency = oneDayOfUser().Currency[i];
            var transactionAccount = oneDayOfUser().Account[i];
            /*=============================*/
            // we have
            // transactionNameOnly1 - the name of the transaction
            // transactionNameOnly2
            // operationName - the name of operation the category of transaction
            // transaction_Date1 - the day of the transaction
            // transaction_Date2
            // Month, Year - from the arguments of the function
            // Question - have I make the variables like var Month = Month?
            // transactionType - the type of the transaction
            // transactionAmount1 - the amount of the transaction
            // transactionAmount2
            // transactionCurrency - the currency of the transaction
            // transactionAccount - the account for the transaction

            
            if(transaction_Date1 >= DATE_OF_DENOMINATION){
                if((oneDayOfUser().Currency[i] === "Byn") || (oneDayOfUser().Currency[i] === "Usd")){
                    WriteTransaction(transaction_Date1,transactionType, operationName, transactionNameOnly1, 
                             transactionAmount1, transactionCurrency, transactionAccount)
                }
            }

            if(transaction_Date1 < DATE_OF_DENOMINATION){
                if((oneDayOfUser().Currency[i] === "Byr") || (oneDayOfUser().Currency[i] === "Usd")){
                    WriteTransaction(transaction_Date1,transactionType, operationName, transactionNameOnly1, 
                             transactionAmount1, transactionCurrency, transactionAccount)
                }
            }
            // this 2 if-conditions checks if the denomination time, and choose the correct currency of the operation
            // use all this variables);//we write a transaction and only we need to give a random name for it

          	if(transaction_Date2 >= DATE_OF_DENOMINATION){
                if((oneDayOfUser().Currency[i] === "Byn") || (oneDayOfUser().Currency[i] === "Usd")){
                    WriteTransaction(transaction_Date2,transactionType, operationName, transactionNameOnly2, 
                             transactionAmount2, transactionCurrency, transactionAccount)
                }
            }

            if(transaction_Date2 < DATE_OF_DENOMINATION){
                if((oneDayOfUser().Currency[i] === "Byr") || (oneDayOfUser().Currency[i] === "Usd")){
                    WriteTransaction(transaction_Date2,transactionType, operationName, transactionNameOnly2, 
                             transactionAmount2, transactionCurrency, transactionAccount)
                }
            } 

            // this 2 if-conditions checks if the denomination time, and choose the correct currency of the operation
            // use all this variables);//we write a transaction and only we need to give a random name for it

            if(transaction_Date3 >= DATE_OF_DENOMINATION){
                if((oneDayOfUser().Currency[i] === "Byn") || (oneDayOfUser().Currency[i] === "Usd")){
                    WriteTransaction(transaction_Date3,transactionType, operationName, transactionNameOnly3, 
                             transactionAmount3, transactionCurrency, transactionAccount)
                }
            }

            if(transaction_Date3 < DATE_OF_DENOMINATION){
                if((oneDayOfUser().Currency[i] === "Byr") || (oneDayOfUser().Currency[i] === "Usd")){
                    WriteTransaction(transaction_Date3,transactionType, operationName, transactionNameOnly3, 
                             transactionAmount3, transactionCurrency, transactionAccount)
                }
            } 

            // this 2 if-conditions checks if the denomination time, and choose the correct currency of the operation
            // use all this variables);//we write a transaction and only we need to give a random name for it

		}
	}

};

function makeYearlyTransactionsSixTimes(start_Day, last_Day, Year){
    for(i=1; i<oneDayOfUser().len+1; i++){// we check the transaction list
        print("i="+i);
        print("oneDayOfUser().Period[i] = "+ oneDayOfUser().Period[i]);
        print("oneDayOfUser().Rate[i] = "+ oneDayOfUser().Rate[i]);
        if(
            (oneDayOfUser().Period[i] === "Year") && 
            (oneDayOfUser().Rate[i] === 6)){
        
            var transactionDays = makeSixRandom(start_Day, last_Day);// 
            // we have transactionDays[0] to transactionDays[5];
            var transaction_Date1 = new Date(Year, 0, transactionDays[0]);// we convert it into an object format
            
            var transaction_Date2 = new Date(Year, 0, transactionDays[1]);// we convert it into an object format
            
            var transaction_Date3 = new Date(Year, 0, transactionDays[2]);// we convert it into an object format

            var transaction_Date4 = new Date(Year, 0, transactionDays[3]);// we convert it into an object format

            var transaction_Date5 = new Date(Year, 0, transactionDays[4]);// we convert it into an object format

            var transaction_Date6 = new Date(Year, 0, transactionDays[5]);// we convert it into an object format
            // we have got from transaction_Date1 to transaction_Date6

            print("@@Full transaction date1 is"+transaction_Date1);
            print("@@Full transaction date2 is"+transaction_Date2);
            print("@@Full transaction date3 is"+transaction_Date3);
            print("@@Full transaction date4 is"+transaction_Date4);
            print("@@Full transaction date5 is"+transaction_Date5);
            print("@@Full transaction date6 is"+transaction_Date6);

            var transactionAmount1 = RandomAmount(oneDayOfUser().AmountMin[i], oneDayOfUser().AmountMax[i],oneDayOfUser().Currency[i])//returns  amount 
            var transactionAmount2 = RandomAmount(oneDayOfUser().AmountMin[i], oneDayOfUser().AmountMax[i],oneDayOfUser().Currency[i])//returns  amount
            var transactionAmount3 = RandomAmount(oneDayOfUser().AmountMin[i], oneDayOfUser().AmountMax[i],oneDayOfUser().Currency[i])//returns  amount
            var transactionAmount4 = RandomAmount(oneDayOfUser().AmountMin[i], oneDayOfUser().AmountMax[i],oneDayOfUser().Currency[i])//returns  amount
            var transactionAmount5 = RandomAmount(oneDayOfUser().AmountMin[i], oneDayOfUser().AmountMax[i],oneDayOfUser().Currency[i])//returns  amount
            var transactionAmount6 = RandomAmount(oneDayOfUser().AmountMin[i], oneDayOfUser().AmountMax[i],oneDayOfUser().Currency[i])//returns  amount
            // make a monthly transaction, we need to call random day
            var Number_of_the_name_of_transaction1 = Math.floor((Math.random()*NUMBER_OF_CATEGORY_NAMES));//0...NUMBER-1
            var Number_of_the_name_of_transaction2 = Math.floor((Math.random()*NUMBER_OF_CATEGORY_NAMES));//0...NUMBER-1
            var Number_of_the_name_of_transaction3 = Math.floor((Math.random()*NUMBER_OF_CATEGORY_NAMES));//0...NUMBER-1
            var Number_of_the_name_of_transaction4 = Math.floor((Math.random()*NUMBER_OF_CATEGORY_NAMES));//0...NUMBER-1
            var Number_of_the_name_of_transaction5 = Math.floor((Math.random()*NUMBER_OF_CATEGORY_NAMES));//0...NUMBER-1
            var Number_of_the_name_of_transaction6 = Math.floor((Math.random()*NUMBER_OF_CATEGORY_NAMES));//0...NUMBER-1
            // Math.random()<1 that`s why name_of_transactions<NUMBER_OF_CATEGORY_NAMES
            var operationName =  oneDayOfUser().OperationName[i]
            var transactionNameH = db.names.find({"transaction":oneDayOfUser().OperationName[i]},{"names":1,_id:0}).toArray();
            // we have an object from the cursor with transactions names of the operation
            print("transactionName array - " + transactionNameH[0].names);
            var transactionNameOnly1 = transactionNameH[0].names[Number_of_the_name_of_transaction1];
            var transactionNameOnly2 = transactionNameH[0].names[Number_of_the_name_of_transaction2];
            var transactionNameOnly3 = transactionNameH[0].names[Number_of_the_name_of_transaction3];
            var transactionNameOnly4 = transactionNameH[0].names[Number_of_the_name_of_transaction4];
            var transactionNameOnly5 = transactionNameH[0].names[Number_of_the_name_of_transaction5];
            var transactionNameOnly6 = transactionNameH[0].names[Number_of_the_name_of_transaction6];
            print("name of any transaction1 = "+ transactionNameOnly1);
            print("name of any transaction2 = "+ transactionNameOnly2);
            print("name of any transaction3 = "+ transactionNameOnly3);
            print("name of any transaction4 = "+ transactionNameOnly4);
            print("name of any transaction5 = "+ transactionNameOnly5);
            print("name of any transaction6 = "+ transactionNameOnly6);

            var transactionType = oneDayOfUser().Type[i];
            var transactionCurrency = oneDayOfUser().Currency[i];
            var transactionAccount = oneDayOfUser().Account[i];
            /*=============================*/
            // we have
            // transactionNameOnly1 - the name of the transaction
            // transactionNameOnly2
            // operationName - the name of operation the category of transaction
            // transaction_Date1 - the day of the transaction
            // transaction_Date2
            // Month, Year - from the arguments of the function
            // Question - have I make the variables like var Month = Month?
            // transactionType - the type of the transaction
            // transactionAmount1 - the amount of the transaction
            // transactionAmount2
            // transactionCurrency - the currency of the transaction
            // transactionAccount - the account for the transaction

            
            if(transaction_Date1 >= DATE_OF_DENOMINATION){
                if((oneDayOfUser().Currency[i] === "Byn") || (oneDayOfUser().Currency[i] === "Usd")){
                    WriteTransaction(transaction_Date1,transactionType, operationName, transactionNameOnly1, 
                             transactionAmount1, transactionCurrency, transactionAccount)
                }
            }

            if(transaction_Date1 < DATE_OF_DENOMINATION){
                if((oneDayOfUser().Currency[i] === "Byr") || (oneDayOfUser().Currency[i] === "Usd")){
                    WriteTransaction(transaction_Date1,transactionType, operationName, transactionNameOnly1, 
                             transactionAmount1, transactionCurrency, transactionAccount)
                }
            }
            // this 2 if-conditions checks if the denomination time, and choose the correct currency of the operation
            // use all this variables);//we write a transaction and only we need to give a random name for it

          	if(transaction_Date2 >= DATE_OF_DENOMINATION){
                if((oneDayOfUser().Currency[i] === "Byn") || (oneDayOfUser().Currency[i] === "Usd")){
                    WriteTransaction(transaction_Date2,transactionType, operationName, transactionNameOnly2, 
                             transactionAmount2, transactionCurrency, transactionAccount)
                }
            }

            if(transaction_Date2 < DATE_OF_DENOMINATION){
                if((oneDayOfUser().Currency[i] === "Byr") || (oneDayOfUser().Currency[i] === "Usd")){
                    WriteTransaction(transaction_Date2,transactionType, operationName, transactionNameOnly2, 
                             transactionAmount2, transactionCurrency, transactionAccount)
                }
            } 

            // this 2 if-conditions checks if the denomination time, and choose the correct currency of the operation
            // use all this variables);//we write a transaction and only we need to give a random name for it

            if(transaction_Date3 >= DATE_OF_DENOMINATION){
                if((oneDayOfUser().Currency[i] === "Byn") || (oneDayOfUser().Currency[i] === "Usd")){
                    WriteTransaction(transaction_Date3,transactionType, operationName, transactionNameOnly3, 
                             transactionAmount3, transactionCurrency, transactionAccount)
                }
            }

            if(transaction_Date3 < DATE_OF_DENOMINATION){
                if((oneDayOfUser().Currency[i] === "Byr") || (oneDayOfUser().Currency[i] === "Usd")){
                    WriteTransaction(transaction_Date3,transactionType, operationName, transactionNameOnly3, 
                             transactionAmount3, transactionCurrency, transactionAccount)
                }
            } 

            // this 2 if-conditions checks if the denomination time, and choose the correct currency of the operation
            // use all this variables);//we write a transaction and only we need to give a random name for it

            if(transaction_Date4 >= DATE_OF_DENOMINATION){
                if((oneDayOfUser().Currency[i] === "Byn") || (oneDayOfUser().Currency[i] === "Usd")){
                    WriteTransaction(transaction_Date4,transactionType, operationName, transactionNameOnly4, 
                             transactionAmount4, transactionCurrency, transactionAccount)
                }
            }

            if(transaction_Date4 < DATE_OF_DENOMINATION){
                if((oneDayOfUser().Currency[i] === "Byr") || (oneDayOfUser().Currency[i] === "Usd")){
                    WriteTransaction(transaction_Date4,transactionType, operationName, transactionNameOnly4, 
                             transactionAmount4, transactionCurrency, transactionAccount)
                }
            } 

            // this 2 if-conditions checks if the denomination time, and choose the correct currency of the operation
            // use all this variables);//we write a transaction and only we need to give a random name for it

            if(transaction_Date5 >= DATE_OF_DENOMINATION){
                if((oneDayOfUser().Currency[i] === "Byn") || (oneDayOfUser().Currency[i] === "Usd")){
                    WriteTransaction(transaction_Date5,transactionType, operationName, transactionNameOnly5, 
                             transactionAmount5, transactionCurrency, transactionAccount)
                }
            }

            if(transaction_Date5 < DATE_OF_DENOMINATION){
                if((oneDayOfUser().Currency[i] === "Byr") || (oneDayOfUser().Currency[i] === "Usd")){
                    WriteTransaction(transaction_Date5,transactionType, operationName, transactionNameOnly5, 
                             transactionAmount5, transactionCurrency, transactionAccount)
                }
            } 

            // this 2 if-conditions checks if the denomination time, and choose the correct currency of the operation
            // use all this variables);//we write a transaction and only we need to give a random name for it

            if(transaction_Date6 >= DATE_OF_DENOMINATION){
                if((oneDayOfUser().Currency[i] === "Byn") || (oneDayOfUser().Currency[i] === "Usd")){
                    WriteTransaction(transaction_Date6,transactionType, operationName, transactionNameOnly6, 
                             transactionAmount6, transactionCurrency, transactionAccount)
                }
            }

            if(transaction_Date6 < DATE_OF_DENOMINATION){
                if((oneDayOfUser().Currency[i] === "Byr") || (oneDayOfUser().Currency[i] === "Usd")){
                    WriteTransaction(transaction_Date6,transactionType, operationName, transactionNameOnly6, 
                             transactionAmount6, transactionCurrency, transactionAccount)
                }
            } 

            // this 2 if-conditions checks if the denomination time, and choose the correct currency of the operation
            // use all this variables);//we write a transaction and only we need to give a random name for it
		}
	}
};

function makeWeeklyTransactions(startTimeDay, lastTimeDay){
    for(i=1; i<oneDayOfUser().len+1; i++){// we check the transaction list
    
    	if(
        	(oneDayOfUser().Period[i] === "Week") && 
            (oneDayOfUser().Rate[i] === 1)){

            var transactionTimeDay = Math.floor(Math.random()*(lastTimeDay - startTimeDay) + startTimeDay);
            var transaction_Date = new Date();
            transaction_Date.setTime(transactionTimeDay*1000*60*60*24);// Data object format
            var transactionAmount = RandomAmount(oneDayOfUser().AmountMin[i], oneDayOfUser().AmountMax[i],oneDayOfUser().Currency[i])//returns  amount
            var Number_of_the_name_of_transaction = Math.floor((Math.random()*NUMBER_OF_CATEGORY_NAMES));//0...NUMBER-1
            var operationName =  oneDayOfUser().OperationName[i]
            var transactionNameH = db.names.find({"transaction":oneDayOfUser().OperationName[i]},{"names":1,_id:0}).toArray();
            var transactionNameOnly = transactionNameH[0].names[Number_of_the_name_of_transaction];
            var transactionType = oneDayOfUser().Type[i];
            var transactionCurrency = oneDayOfUser().Currency[i];
            var transactionAccount = oneDayOfUser().Account[i];

            if(transaction_Date >= DATE_OF_DENOMINATION){
                if((oneDayOfUser().Currency[i] === "Byn") || (oneDayOfUser().Currency[i] === "Usd")){
                    WriteTransaction(transaction_Date,transactionType, operationName, transactionNameOnly, 
                             transactionAmount, transactionCurrency, transactionAccount)
                }
            }

            if(transaction_Date < DATE_OF_DENOMINATION){
                if((oneDayOfUser().Currency[i] === "Byr") || (oneDayOfUser().Currency[i] === "Usd")){
                    WriteTransaction(transaction_Date,transactionType, operationName, transactionNameOnly, 
                             transactionAmount, transactionCurrency, transactionAccount)
                }
            }
        }          
	}
}

function makeWeeklyTransactionsTriple(startTimeDay, lastTimeDay){
    for(i=1; i<oneDayOfUser().len+1; i++){// we check the transaction list
    	
    	if(
        	(oneDayOfUser().Period[i] === "Week") && 
            (oneDayOfUser().Rate[i] === 3)){

            var transactionTimeDays = makeThreeRandom(startTimeDay, lastTimeDay);// 
            // we have transactionTimeDays[0] to transactionTimeDays[2];
            var transaction_Date1 = new Date();
            transaction_Date1.setTime(transactionTimeDays[0]*1000*60*60*24);// Data object format
            var transaction_Date2 = new Date();
            transaction_Date2.setTime(transactionTimeDays[1]*1000*60*60*24);// Data object format
            var transaction_Date3 = new Date();
            transaction_Date3.setTime(transactionTimeDays[2]*1000*60*60*24);// Data object format
            // we have transaction_Date1...transaction_Date3

            var transactionAmount1 = RandomAmount(oneDayOfUser().AmountMin[i], oneDayOfUser().AmountMax[i],oneDayOfUser().Currency[i])//returns  amount
            var transactionAmount2 = RandomAmount(oneDayOfUser().AmountMin[i], oneDayOfUser().AmountMax[i],oneDayOfUser().Currency[i])//returns  amount
            var transactionAmount3 = RandomAmount(oneDayOfUser().AmountMin[i], oneDayOfUser().AmountMax[i],oneDayOfUser().Currency[i])//returns  amount
            var Number_of_the_name_of_transaction1 = Math.floor((Math.random()*NUMBER_OF_CATEGORY_NAMES));//0...NUMBER-1
            var Number_of_the_name_of_transaction2 = Math.floor((Math.random()*NUMBER_OF_CATEGORY_NAMES));//0...NUMBER-1
            var Number_of_the_name_of_transaction3 = Math.floor((Math.random()*NUMBER_OF_CATEGORY_NAMES));//0...NUMBER-1
            var operationName =  oneDayOfUser().OperationName[i]
            var transactionNameH = db.names.find({"transaction":oneDayOfUser().OperationName[i]},{"names":1,_id:0}).toArray();
            var transactionNameOnly1 = transactionNameH[0].names[Number_of_the_name_of_transaction1];
            var transactionNameOnly2 = transactionNameH[0].names[Number_of_the_name_of_transaction2];
            var transactionNameOnly3 = transactionNameH[0].names[Number_of_the_name_of_transaction3];
            var transactionType = oneDayOfUser().Type[i];
            var transactionCurrency = oneDayOfUser().Currency[i];
            var transactionAccount = oneDayOfUser().Account[i];

            if(transaction_Date1 >= DATE_OF_DENOMINATION){
                if((oneDayOfUser().Currency[i] === "Byn") || (oneDayOfUser().Currency[i] === "Usd")){
                    WriteTransaction(transaction_Date1,transactionType, operationName, transactionNameOnly1, 
                             transactionAmount1, transactionCurrency, transactionAccount)
                }
            }

            if(transaction_Date1 < DATE_OF_DENOMINATION){
                if((oneDayOfUser().Currency[i] === "Byr") || (oneDayOfUser().Currency[i] === "Usd")){
                    WriteTransaction(transaction_Date1,transactionType, operationName, transactionNameOnly1, 
                             transactionAmount1, transactionCurrency, transactionAccount)
                }
            }

            if(transaction_Date2 >= DATE_OF_DENOMINATION){
                if((oneDayOfUser().Currency[i] === "Byn") || (oneDayOfUser().Currency[i] === "Usd")){
                    WriteTransaction(transaction_Date2,transactionType, operationName, transactionNameOnly2, 
                             transactionAmount2, transactionCurrency, transactionAccount)
                }
            }

            if(transaction_Date2 < DATE_OF_DENOMINATION){
                if((oneDayOfUser().Currency[i] === "Byr") || (oneDayOfUser().Currency[i] === "Usd")){
                    WriteTransaction(transaction_Date2,transactionType, operationName, transactionNameOnly2, 
                             transactionAmount2, transactionCurrency, transactionAccount)
                }
            }

            if(transaction_Date3 >= DATE_OF_DENOMINATION){
                if((oneDayOfUser().Currency[i] === "Byn") || (oneDayOfUser().Currency[i] === "Usd")){
                    WriteTransaction(transaction_Date3,transactionType, operationName, transactionNameOnly3, 
                             transactionAmount3, transactionCurrency, transactionAccount)
                }
            }

            if(transaction_Date3 < DATE_OF_DENOMINATION){
                if((oneDayOfUser().Currency[i] === "Byr") || (oneDayOfUser().Currency[i] === "Usd")){
                    WriteTransaction(transaction_Date3,transactionType, operationName, transactionNameOnly3, 
                             transactionAmount3, transactionCurrency, transactionAccount)
                }
            }
        }          
	}
}

function runYearlyThreeAndSix(startDate, finishDate){// global function runs transaction generation
    var startDATE = standartDate(startDate);
    print("##startDATE-"+startDATE);
    
    var finishDATE = standartDate(finishDate);//standart Data objects
    var start_Day = startDATE.getDate();
    print("##finishDATE - "+finishDATE);
    print("##start_Day - "+ start_Day);
    var start_Month = startDATE.getMonth();// month is in range 0...11
    print("##start_Month - "+start_Month);
    var start_Year = startDATE.getFullYear();
    print("##start_Year - "+start_Year);


    var last_Day = DaysInYear(start_Year);// it will be 365 or 366

    makeYearlyTransactionsTriple(start_Day, last_Day, start_Year);
    makeYearlyTransactionsSixTimes(start_Day, last_Day, start_Year);// we call this functions
    
    var zDATE = new Date(start_Year, 0, last_Day);
        zDATE.setDate(zDATE.getDate()+1);
        print("### New Year = "+zDATE);// New Year

    var cycleDATEstart,
    cycleDATEfinish,
    cycle_day_in_year,
    cycleDay,
    cycleMonth,
    cycleYear,
    bufferDay,
    bufferMonth,
    bufferYear;

    do{
        cycleDATEstart = zDATE;// 1 jan 2011
        print("##cycleDATEstart - " + cycleDATEstart);
        cycleDayFirst = zDATE.getDate();
        print("cycleDay - " + cycleDayFirst);
        cycleMonth = zDATE.getMonth();
        print("cycleMonth - " + cycleMonth);//february = 1
        cycleYear = zDATE.getFullYear();
        print("cycleYear - " + cycleYear);
        cycle_day_in_year = DaysInYear(cycleYear);// 365 or 366
        print("##cycle_day_in_year - " + cycle_day_in_year);

        bufferDay = cycleDATEstart.getDate();
        bufferMonth = cycleDATEstart.getMonth();
        bufferYear = cycleDATEstart.getFullYear();
        
        cycleDATEfinish = new Date(bufferYear, bufferMonth, bufferDay);//just now we have a clone
        cycleDATEfinish.setDate(cycleDATEfinish.getDate()+cycle_day_in_year-1);
        print("##cycleDATEfinish - " + cycleDATEfinish);

        if(cycleDATEfinish > finishDATE){
            makeYearlyTransactionsTriple(cycleDayFirst, toPlainDays(finishDATE.getDate(), finishDATE.getMonth(), finishDATE.getFullYear()), cycleYear);
            makeYearlyTransactionsSixTimes(cycleDayFirst, toPlainDays(finishDATE.getDate(), finishDATE.getMonth(), finishDATE.getFullYear()), cycleYear);
            //we are in the last short month
            //toPlainDays(anyDATA) returns how many days are between the 1-st January
            //and the anyDATA
        }
        else{
            makeYearlyTransactionsTriple(cycleDayFirst, cycle_day_in_year, cycleYear);
            makeYearlyTransactionsSixTimes(cycleDayFirst, cycle_day_in_year, cycleYear);
            //we work with full month
        }

        bufferDay = cycleDATEfinish.getDate();
        bufferMonth = cycleDATEfinish.getMonth();
        bufferYear = cycleDATEfinish.getFullYear();
        
        zDATE = new Date(bufferYear, bufferMonth, bufferDay);//just now we have a clone 
        zDATE.setDate(cycleDATEfinish.getDate()+1);
        print("##zDATE = cycleDATEfinish+1 = "+zDATE);
        print("$$cycleDATEfinish - "+cycleDATEfinish);
        print("$$finishDATE - "+finishDATE);
    }while(cycleDATEfinish < finishDATE);
}

function runweeklyOneAndThree(startDate, finishDate){// global function runs transaction generation
    var startDATE = standartDate(startDate);
    var startTimeDay = Math.floor(startDATE.getTime()/(1000*60*60*24));// we find a day since the zero point
    // we do not need to use start_Day, start_Month, start_Year
    // we count days from the begining of the time;
    // the next step we want to transform days into the data;
    var finishDATE = standartDate(finishDate);//standart Data objects
    var finishTimeDay = Math.floor(finishDATE.getTime()/(1000*60*60*24));
    
    var lastTimeDay = startTimeDay + WEEK - 1;// first week - we count it from the begining of the zero point

    makeWeeklyTransactions(startTimeDay, lastTimeDay);
    makeWeeklyTransactionsTriple(startTimeDay, lastTimeDay);// we call this functions for the 1-st week
    
    var zTimeDay = lastTimeDay + 1;//the first day of the next week

    var cycleTimeDaystart;
    
    do{
        cycleTimeDayStart = zTimeDay;// 1-st day of the next week
        cycleTimeDayFinish = cycleTimeDayStart + WEEK - 1;// last day of the next week

        if(cycleTimeDayFinish <= finishTimeDay){
            makeWeeklyTransactions(cycleTimeDayStart, cycleTimeDayFinish);
            makeWeeklyTransactionsTriple(cycleTimeDayStart, cycleTimeDayFinish);
            // we are in a full-time week
            // we ignore short last week
        }

        zTimeDay = cycleTimeDayFinish + 1; // 1-st day of the next next week
    
    }while(cycleTimeDayFinish < finishTimeDay);

}    

/*--------------------- this three functions run three periods of transactions - month, year, week -----------------*/

runMonthlyOneAndTwice("1/1/2010", "25/11/2016");//start date and final date - in my task 2016

runYearlyThreeAndSix("1/1/2010", "25/101/2016");//start date and final date - in my task 2016

runweeklyOneAndThree("1/1/2010", "25/11/2016");//start date and final date - in my task 2016

