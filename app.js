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
    }
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

    // Use budgetController.testing() to check on the console
    testing: function() {
      console.log(data);
    }
  }
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
  };
  return {
    getDOMstrings: function() {
      return DOMstrings;
    },
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
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

        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }

      // Replace placeholder
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      // Insert HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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

  };

  

  var ctrlAddItem = function() {
    // 1. Get the field input data as an object {type: , description: , value: }
    var input = UICtrl.getInput(); 
    // 2. Add the item to the budget controller
    var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
    // 3. Add the item to the UI
    UICtrl.addListItem(newItem, input.type);
    // 4. Calculate the budget

    // 5. Display the budget on the UI

    // console.log("It works!");
  };

  return {
    init: function() {
      console.log('Application has started!'),
      setupEventListener();
    }
  };
  

})(budgetController, UIController);  

controller.init();