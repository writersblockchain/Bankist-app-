'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};
``
const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const displayMovements = function(movements, sort = false) {
containerMovements.innerHTML = ``;

const movs = sort ? movements.slice().sort((a,b) => a - b) : movements;

movs.forEach(function(mov, i) {

  const type = mov > 0 ? `deposit` : `withdrawal`

const html = `
<div class="movements__row">
<div class="movements__type movements__type--${type}">${i +1} ${type}</div>
<div class="movements__value">${mov}€</div>
</div>

`;

containerMovements.insertAdjacentHTML(`afterbegin`, html);



})
}


const calcDisplayBalance = function(acc) {
 acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0); 
  labelBalance.textContent = `${acc.balance}€`;
};


const calcDisplaySummary = function(acc) {
  const incomes = acc.movements 
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`

const out = acc.movements
  .filter(mov => mov < 0)
  .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
  .filter(mov => mov > 0)
  .map(deposit => (deposit * acc.interestRate) /100)
  .filter((int, i, arr) => {
    // console.log(arr);
    return int >= 1;
  })
  .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${Math.abs(interest)}€`;
};





const createUsernames = function(accs) {

accs.forEach(function(acc) {
 acc.username = acc.owner
 .toLowerCase()
 .split(` `)
 .map(name => name[0])
 .join(``);
});
};

createUsernames(accounts); 
// console.log(accounts);

const updateUI = function(acc) {
  // Display movements 
displayMovements(acc.movements);

// Display balance 
calcDisplayBalance(acc);

//Display summary 
calcDisplaySummary(acc);
}

//EVENT HANDLER
let currentAccount;


btnLogin.addEventListener('click', function (e) {
  //Prevent form from submitting
e.preventDefault();

currentAccount = accounts
.find(acc => acc.username === inputLoginUsername.value);

console.log(currentAccount);

if(currentAccount?.pin === Number(inputLoginPin.value)) {
// Display UI and message
labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;

containerApp.style.opacity = 100;

//Clear input fields 
inputLoginUsername.value = inputLoginPin.value = 
``;
inputLoginPin.blur(); 

//Update UI 
updateUI(currentAccount);
}

});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault(); 

  const amount = Number(inputLoanAmount.value);

  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
  // Add Movement 
  currentAccount.movements.push(amount);

  //Update UI
  updateUI(currentAccount);
  }
  inputLoanAmount.value = ``;
});





btnTransfer.addEventListener('click', function (e) {
  e.preventDefault(); 
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value 
  );
  inputTransferAmount.value = inputTransferTo.value = '';

if(
  amount > 0 &&
  receiverAcc &&
  currentAccount.balance >= amount && 
  receiverAcc?.username !== currentAccount.username) {

    //Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Update UI 
updateUI(currentAccount);
  }

});

btnClose.addEventListener('click', function(e) {
  e.preventDefault(); 
 

  if (
    inputCloseUsername.value === currentAccount.username && 
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);

  // DELETE ACCOUNT
    accounts.splice(index, 1);

    // HIDE UI 
    containerApp.style.opacity = 0; 
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false; 
btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES


// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] }, { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] }, { weight: 32, curFood: 340, owners: ['Michael'] },
//   ];

//   //1.
// dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));

// console.log(dogs);
 

// //2. 

// const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));

// console.log(dogSarah);
// console.log(`Sarah's dog is eating too ${
//   dogSarah.curFood > dogSarah.recFood ? `much` : `little`
// }`);

// //3. 
// const ownersEatTooMuch = dogs
// .filter(dog => dog.curFood > dog.recFood)
// .map(dog => dog.owners)
// .flat();

// console.log(ownersEatTooMuch);

// const ownersEatTooLittle = dogs
// .filter(dog => dog.curFood < dog.recFood)
// .map(dog => dog.owners)
// .flat();

// console.log(ownersEatTooLittle);

// //4. 

// console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`); 
// console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`); 

// //5. 
// console.log(dogs.some(dog => dog.curFood === dog.recFood));

// //6. 

// const checkEatingOkay = dog => dog.curFood > dog.recFood * .9 && dog.curFood < dog.recFood * 1.1

// console.log(dogs.some(checkEatingOkay));

// //7. 

// console.log(dogs.filter(checkEatingOkay));

// //8. 
// // sort by recommended food portion in an ascending order

// const dogsSorted = dogs.slice().sort((a, b) => a.recFood - b.recFood);

// console.log(dogsSorted);





//ArrayMethods Pracice

// //1. 
// const bankDepositSum = accounts
// .flatMap(acc => acc.movements)
// .filter(mov => mov > 0)
// .reduce((sum, cur) => sum + cur, 0); 

// console.log(bankDepositSum);

// //2.

// // const numDeposits1000 = accounts
// // .flatMap(acc => acc.movements)
// // .filter (mov => mov >= 1000).length;

// const numDeposits1000 = accounts
// .flatMap(acc => acc.movements)
// .reduce((count, cur) => cur >= 1000 ? count + 1 : count, 0);

// console.log(numDeposits1000);

// //3. 

// const {deposits, withdrawals} = accounts
// .flatMap(acc => acc.movements)
// .reduce((sums, cur) => {
// // cur > 0 ? sums.deposits += cur : sums.withdrawals += cur;
// sums[cur > 0 ?  'deposits' : 'withdrawals'] += cur;
// return sums; 
// }, 
// {deposits: 0, withdrawals: 0}
// );


// console.log(deposits, withdrawals);

// //4. 
// //this is a nice title -> Thhis Is a Nice Title 
// const convertTitleCase = function(title) {
//   const capitalize = str => str[0].toUpperCase() + str.slice(1); 

// const  exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with']; 

// const titleCase = title
// .toLowerCase()
// .split(' ')
// .map(word => (exceptions.includes(word) ? word :
//  capitalize(word)))
//  .join(' ');

// return capitalize(titleCase);


// };
// console.log(convertTitleCase(`this is a LONG title but not tOO loNg`));












// const arr = [1, 2, 3, 4, 5, 6, 7];
// console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// // Empty arrays + fill method 
// const x = new Array(7);
// console.log(x);
// // console.log(x.map(() => 5));
// // x.fill(1);
// x.fill(1, 3, 5);
// console.log(x);

// arr.fill(23, 2, 6);
// console.log(arr);

// // Array.from
// const y = Array.from({length: 7}, () => 1); 
// console.log(y);

// const z = Array.from({length: 7}, (_, i) => i + 1);
// console.log(z);

// labelBalance.addEventListener('click', function() {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'), 
//     el => Number(el.textContent.replace('€', ''))
//   );
//   console.log(movementsUI);
// });


// Strings 
// const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// console.log(owners.sort());
// console.log(owners);

// Numbers
// console.log(movements);

// Return < 0; A, B (keep order)
// Return > 0; B, A (switch order)

//Ascending 
// movements.sort((a, b) => {
//   if (a > b)
//   return 1; 
//   if (a < b)
//   return -1;
// });
// movements.sort((a, b) => a - b);
// console.log(movements);

// Descending 
// movements.sort((a, b) => {
//   if (a > b)
//   return -1; 
//   if (a < b)
//   return 1;
// });
// movements.sort((a, b) => b - a);
// console.log(movements);










// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// const arrDeep= [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));

// // FLAT
// const overallBalance = accounts 
// .map(acc => acc.movements) 
// .flat()
// .reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance);

// //flatMap
// const overallBalance2 = accounts 
// .flatMap(acc => acc.movements) 
// .reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance2);

















// console.log(movements);

// // EQUALITY 
// console.log(movements.includes(-130));

// //SOME : CONDITION 
// console.log(movements.some(mov => mov === -130));

// const anyDeposits = movements.some(mov => mov > 0);
// console.log(anyDeposits);

// // EVERY 

// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// // SEPARATE CALLBACK
// const deposit = mov => mov > 0; 

// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));















// const firstWithdrawal = movements.find(mov => mov < 0 );

// console.log(movements);
// console.log(firstWithdrawal);

// console.log(accounts);

// const account = accounts.find(acc => acc.owner ===
//   `Jessica Davis`); 
//   console.log(account);











// const calcAverageHumanAge = ages => ages
//   .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//   .filter(age => age >= 18)
//   .reduce((acc, age, i, arr) => acc + age / arr.length, 0);


// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3])); 



















// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const eurToUsd = 1.1;

// // PIPELINE 
// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   .map((mov, i, arr) => {
    
//     // console.log(arr);
//     return mov * eurToUsd
//   })
//   // .map(mov => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(totalDepositsUSD);



















// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));

//   const adults = humanAges.filter(age => age >= 18);
//   console.log(humanAges);
//   console.log(adults);

//   const average = adults.reduce((acc, age) => acc + age, 0) / adults.length;

//   return average;
// };

// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);

// console.log(avg1);



















// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// console.log(movements);

// // accumulator is like a SNOWBALL
// const balance = movements.reduce(function(acc, cur, i, arr) {
//   console.log(`Iteration ${i}: ${acc}`);
//   return acc + cur
// }, 0);

// console.log(balance);

// let balance2 = 0; 
// for (const mov of movements) balance2 += mov; 
// console.log(balance2);

// // Maximum Value 
// const max = movements.reduce((acc, mov) => {
//   if(acc > mov)
//   return acc;
//   else
//   return mov;
// }, movements[0]);
// console.log(max);
















// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const deposits = movements.filter(function(mov) {
//   return mov > 0;
// });
// console.log(movements);
// console.log(deposits);

// const depositsFor = [];
// for(const mov of movements) if (mov > 0) depositsFor.push(mov);
// console.log(depositsFor);

// const withdrawls = movements.filter(mov => mov < 0);
// console.log(withdrawls);








// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const eurToUsd = 1.1; 

// // const movementsUSD = movements.map(function(mov) {
// //   return mov * eurToUsd;
// // });

// const movementsUSD = movements.map(mov => mov * eurToUsd
// );

// console.log(movements);
// console.log(movementsUSD);

// const movementsUSDfor = [];
// for(const mov of movements) movementsUSDfor.push(mov * eurToUsd);
// console.log(movementsUSDfor);

// const movementsDescriptions = movements.map(
//   (mov, i) =>
  
//     `Movement ${i + 1}: You ${mov > 0 ? `deposited` : `withdrew`} ${Math.abs(mov)}`

//   //   if(mov > 0) {
//   //   return`Movement ${i + 1}: You deposited ${mov}`;
//   //   } else {
//   //   return`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`;
//   //  }
// );

// console.log(movementsDescriptions);








 




// const dogsJulia = [3, 5, 2, 12, 7];
// const dogsKate = [4, 1, 15, 8, 3];

// const checkDogs = function (dogsJulia, dogsKate) {
// const dogsJulia2 = [3, 5, 2, 12, 7];
// const dogsJuliaCorrected =  dogsJulia2.slice(1, 3); 
// const dogsJuliaAndKate = dogsJuliaCorrected.concat(dogsKate);
  
//   dogsJuliaAndKate.forEach(function(age, i) {
//         if(age >= 3) {
//           console.log(`Dog number ${i + 1} is an adult, and is ${age}`);
//         } else if(age <= 2) {
//           console.log(`Dog number ${i + 1} is still a puppy.`);
//         }
       
// })

// };

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);








// //MAP
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function(value, key, map) {
// console.log(`${key}: ${value}`);

// })

// //SET

// const currenciesUnique = new Set ([`USD`, `GBP`, `USD`, `EUR`, `EUR`]);
// console.log(currenciesUnique);

// currenciesUnique.forEach(function(value, _, map){
//   console.log(`${value}: ${value}`);
// })











// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // for (const movement of movements) {
// for (const [i, movement] of movements.entries()) {  
//   if(movement > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
//   }
// }

// console.log(`---------FOR EACH ----------`);

// movements.forEach(function(mov, i, arr) {
//     if(mov > 0) {
//       console.log(`Movement ${i + 1}: You deposited ${mov}`);
//     } else {
//       console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
//     }
// });
// // 0: function(200)
// // 1: function(450)
// // 2: function(400)
// // ...

// console.log(`---------SEAN TEST ----------`);


// const babyNames = [`Skylar`, `Corinne`, `Sebastian`, `Alex Jones`, `Benjamin`];

// babyNames.forEach(function(name, i) {
// console.log(`Here's name idea # ${i +1}: How about ${name}?`);


// })













// const arr = [23, 11, 64];
// console.log(arr[0]);
// console.log(arr.at(0));

// // getting last array element 
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1));

// console.log('jonas'.at(0));








// let arr = ['a', 'b', 'c', 'd', 'e'];

// //SLICE
// console.log(arr.slice(2)); 
// console.log(arr.slice(2, 4)); 
// console.log(arr.slice(-2)); 

// //SPLICE
// console.log(arr.splice(2));
// console.log(arr);

// // REVERSE
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);

// //CONCAT
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]);

// //JOIN
// console.log(letters.join(' - '));