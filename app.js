// IIFE: =(function() {})(); 

/* *****************************************************
** Budget Controller **
*/
var budgetController =(function() { 
  
  // Function constructor: to create a lot of objects, be used when create newItem
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // Data structure: to store and receive data
  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1  // -1 means not exist
  };

  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(current) {
      sum += current.value;
    });
    data.totals[type] = sum;
  };

  return {
    addItem: function(type, des, val) {
      var newItem, ID;
      // [1 2 3 4 5], next ID = 6 
      // [1 2 4 6 8], next ID = 9
      // ID = lastID + 1

      // Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length-1].id + 1;
      } else {
        ID = 0;
      }

      // Create new item based on 'inc' or 'exp' type, and function constructor
      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }

      // Push to data structure
      data.allItems[type].push(newItem);

      // Return the new element
      return newItem;
    },

    deleteItem: function(type, id) {
      var ids, index;
      
      ids = data.allItems[type].map(function(current) {
        return current.id;
      });

      index = ids.indexOf(id);

      if(index !== -1) {
        data.allItems[type].splice(index, 1); // Start from splice and delete 1 item
      }
    },

    calculateBudget: function() {
      // Calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');

      // Calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      // Calculate the percentage of income that we spent
      if (data.totals.inc > 0 ) {    // avoid to divide 0
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    calculatePercentages: function() {
      data.allItems.exp.forEach(function(cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function() {
      var allPerc = data.allItems.exp.map(function(cur) {
        return cur.getPercentage();
      });
      return allPerc;
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },


    // Use budgetController.testing() to check on the console
    testing: function() {
      console.log(data);
    }
  };
})(); 
 
/* ES 5
  var x = 23;
  var add = function(a) {
    return x+a;
  }
  return {
    publicTest: function(b) {
      return add(b);
    }
  }
*/

/* ES 6 
var budgetController2 = () => {
  const x = 23;
  const add = a => x + a;
  return (
    {
    publicTest: b => add(b),
    }
  )
}
*/ 


/* *****************************************************
** UI Controller **
*/

var UIController =(function() {
  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  };

  var formatNumber = function(num, type) {
    // + or - to indicate type, exactly 2 decimal points, comma separating the thousands
    var numSplit, int, dec, type;
    num = Math.abs(num);
    num = num.toFixed(2); //2.4567 --> 2.46, 2 --> 2.00, toFixed is from Number proto

    /*
    numSplit = num.split('.');
    int = numSplit[0];
    
    for(var i = 0; i < Math.round(int.length / 3); i ++) {

    }

    function thousandsRegel(int) {
      if (int.length > 3) {
        int = int.substr(0, int.length-3) + ',' + int.substr(int.length-3, 3);
      } 
    }
    
    dec = numSplit[1];
    
    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    */
    return (type === 'exp' ? '-' : '+') + ' ' + parseFloat(num).toLocaleString();

  };  

  // Create own ForEach for nodeList, to be private, so other return methods in UI contr can also use
  var nodeListForEach = function(list, callback) {
    for(var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  return {
    getDOMstrings: function() {
      return DOMstrings;
    },
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        //change string to number
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },
    addListItem: function(obj, type) {
      var html, element, newHtml;

      // HTML with placeholder %id%, %description%, %value%
      if (type === 'inc') {
        element = DOMstrings.incomeContainer;

        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      } else if (type === 'exp') {
        element = DOMstrings.expensesContainer;

        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }

      // Replace placeholder
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

      // Insert HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    deleteListItem: function(selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el); // Can only delete child element
    },

    clearFields: function() {
      var fields, fieldsArr;
      fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
      // fields returned is not a array, is a nodeList, so can not use fields.forEach(), need to use slice.call return an array first
      fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function(current, index, array) {
        current.value = "";
      });
      // After clearing input fields, set focus back to description
      fieldsArr[0].focus();
    },

    displayBudget: function(obj) {
      var type;
      obj.budget > 0 ? type = 'inc' : type = 'exp';
      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
      }
      
    },

    displayPercentages: function(percentages) {
      var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
      
      nodeListForEach(fields, function(current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '---';
        }
      });
    },

    displayMonth: function() {
      var now, month, months, year;
      now = new Date();
      month = now.getMonth();
      year = now.getFullYear();

      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
    },

    changedType: function() {
      var fields = document.querySelectorAll(
        DOMstrings.inputType + ',' +
        DOMstrings.inputDescription + ',' +
        DOMstrings.inputValue
      );

      nodeListForEach(fields, function(cur) {
        cur.classList.toggle('red-focus'); // a class in CSS
      });

      document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
    }

  };
})(); 




/* *****************************************************
** App Controller **
*/
var controller =(function(budgetCtrl, UICtrl) {
  /*
  var z = budgetCtrl.publicTest(5);
  return {
    anotherPublic: function() {
      console.log(z);
    }
  }
  */

  // Put addEL in a function
  var setupEventListener = function() {
    var DOM = UICtrl.getDOMstrings();
    
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      } 
    });

    // Event Delegation because of event bubbling
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    // When change between + and -
    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
  };

  var updateBudget = function() {
    // Better in a seperate func, for both add items and delete items

    // 1. Calculate the budget
    budgetCtrl.calculateBudget();
    // 2. Return the budget
    var budget = budgetCtrl.getBudget();
    // 3. Display the budget on the UI
    // console.log(budget);
    UICtrl.displayBudget(budget);
  };

  var updatePercentages = function() {
    // 1. Calculate percentages
    budgetCtrl.calculatePercentages();
    // 2. Read percentages from the budget controller
    var percentages = budgetCtrl.getPercentages();
    
    // 3. Update the UI with the new percentage
    UICtrl.displayPercentages(percentages);
  }
  

  var ctrlAddItem = function() {
    var input, newItem;
    // 1. Get the field input data as an object {type: , description: , value: }
    input = UICtrl.getInput(); 

    // Prevent false inputs
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2. Add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      // 3. Add the item to the UI
      
      UICtrl.addListItem(newItem, input.type);
      // 4. Clear the fields
      UICtrl.clearFields();
      // 5. Calculate and update the budget
      updateBudget();

      // 6. Calculate and update percentages
      updatePercentages();
    }
      // console.log("It works!");
  };

  var ctrlDeleteItem = function(event) {
    var itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      // f.ex. "inc-1"
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // 1. Delete the item from data structure
      budgetCtrl.deleteItem(type, ID);

      // 2. Delete the item from the UI
      UICtrl.deleteListItem(itemID);

      // 3. Update and show the new budget
      updateBudget();

      // 4. Calculate and update percentages
      updatePercentages();
    }
  };

  return {
    init: function() {
      console.log('Application has started!');
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListener();
    }
  };
  

})(budgetController, UIController);  

controller.init();