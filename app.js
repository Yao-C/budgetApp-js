// IIFE: =(function() {})(); 

/* *****************************************************
** Budget Controller **
*/
var budgetController =(function() { 

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
  };
  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },
    getDOMstrings: function() {
      return DOMstrings;
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

    // 3. Add the item to the UI

    // 4. Calculate the budget

    // 5. Display the budget on the UI

    console.log("It works!");
  };

  return {
    init: function() {
      console.log('Application has started!'),
      setupEventListener();
    }
  };
  

})(budgetController, UIController);  

controller.init();