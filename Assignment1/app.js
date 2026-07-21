/* ========== Part 1 ========== */
// 1 :

let y = '123' - 0 + 7;
console.log(y);

// 2 : 

let input = 0;
let result = Boolean(input);
if (!result) {
    console.log("Invalid");
}


// 3 :

for(let i = 1 ; i < 10 ; i++){

    if ((i % 2) == 0) {
        continue;
    }
    console.log(i);
}

// 4 :

let arr = [1, 2, 3, 4, 5];
let newArr = arr.filter(
    (ele) =>{
        if(!(ele%2))
            {return ele}
    })
console.log(newArr);

// 5 : 

let inputArr1 = [1,2,3];
let inputArr2 = [4,5,6];
let mergedArr = [...inputArr1,...inputArr2];
console.log(mergedArr);

// 6 : 
let inputDay = 2;
switch (inputDay) {
    
    case 1:
        console.log("Sunday");
        break;
    case 2:
        console.log("Monday");
        break;
    case 3:
        console.log("Tuesday");
        break;
    case 4:
        console.log("Wednesday");
        break;
    case 5:
        console.log("Thursday");
        break;
    case 6:
        console.log("Friday");
        break;
    case 7:
        console.log("Saturday");
        break;

    default:
        console.log("Error");
        break;
}

// 7 : 

let inputArrString = ["a", "ab", "abc", "abcd", "abcde"];
let inputSizeArr = inputArrString.map((ele) => ele.length);
console.log(inputSizeArr);

// 8 : 
function divisible3Or5(num){
    if (((num % 3) == 0) && (((num % 5) == 0))) {
        console.log("“Divisible by both”");
    }
}
divisible3Or5(30);

// 9 : 

let val = 20;
let val2 = (val) => val * val;
console.log(val2(val));

// 10 : 

const person = {
    name: "Osama Jabr",
    age: 20
}

function getPersonInfo(per) {
    return `${per.name} is ${per.age}`;
}
console.log(getPersonInfo(person));

// 11 :

function sumation(...num) {
    
    let sum = 0;
        for (let j = 0; j < num.length; j++) {
            sum += num[j];
        }
        return sum;
    
}
console.log(sumation(5, 10, 15, 20));

// 12 :

function succ(){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Success");
        }, 3000);
    });
}
succ().then((value) => {
    console.log(value);
}).catch((error) => {
    console.log(error);
});

// 13 :

let inputArray = [5,20,45,12,9,7];
function findMaxValue(arr) {

let maxValue = inputArray[0];
for (let i = 1; i < inputArray.length; i++) {
    if (inputArray[i] > maxValue) {
        maxValue = inputArray[i];
    }
    return maxValue;
    }
}

console.log(findMaxValue(inputArray));

// 14 :

let objKey = function(obj) {
    let keys = Object.keys(obj);
    for (let key of keys) {
        console.log(key);
    }
    console.log(keys);
}
objKey({name: "Osama", age: 20, Major: "Computer Science"});

// 15 : 

function nbWords(sentence) {
    let words = [];
    let word = "";

    for (let char of sentence) {
        if (char === " ") {
            words.push(word);
            word = "";
        } else {
            word += char;
        }
    }

    words.push(word);

    return words;
}

console.log(nbWords("The quick brown fox"));

/* ========== Part 2 ========== */

// 1 :

// forEach is a method that executes a provided function once for each array element. 
// It is used to iterate over an array and perform an action on each element.
// while for ...of is a loop that iterates over iterable objects (like arrays, strings, etc.) and allows you to access each element directly.
// It is used for looping through the values of an iterable object.

// 2 :

// hoisting is a JavaScript mechanism where variables and function declarations are moved to the top of their containing scope during the compilation phase.
// This means that you can use variables and functions before they are declared in the code.
// However, only the declarations are hoisted, not the initializations.
// Temporal Dead Zone (TDZ) is a behavior in JavaScript where variables declared with let and const cannot be accessed before they are initialized.
// If you try to access them before their declaration, it will result in a ReferenceError.
// This is different from var, which is hoisted and can be accessed before its declaration (but will be undefined).

// 3 :

// == means checks for value equality, while === checks for both value and type equality.

// 4 :

// Try-catch works by wrapping a block of code in a try statement.
// If an error occurs within that block, the control is transferred to the catch block, where you can handle the error gracefully.
// This prevents the program from crashing and allows you to provide meaningful feedback or take corrective actions.
// it's important for asynchronous code because it allows you to handle errors that may occur during asynchronous operations, such as network requests or file I/O, without crashing the entire application.
// It helps maintain the stability and reliability of your code.

// 5 :

// the difference between conversion and coercion is that conversion is the explicit process of changing a value from one type to another, while coercion is the implicit process where JavaScript automatically converts a value to a different type based on the context in which it is used.

// ========== Bonus ========== // 

var createCounter = function(init) {
    let currentValue = init;

    return {
        increment: function() {
            return ++currentValue;
        },

        decrement: function() {
            return --currentValue;
        },

        reset: function() {
            currentValue = init;
            return currentValue;
        }
    };
};

const counter = createCounter(5)

console.log(counter.increment()); // 6
console.log(counter.reset()); // 5
console.log(counter.decrement()); // 4 
