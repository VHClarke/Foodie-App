var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var trash = document.getElementsByClassName("fa-trash");
var thumbDown = document.getElementsByClassName("fa-thumbs-down");

Array.from(thumbDown).forEach(function (element) {
  element.addEventListener('click', function(){
    const name = this.parentNode.parentNode.childNodes[1].innerText //??
    const msg = this.parentNode.parentNode.childNodes[3].innerText //?
    const thumbDown = parseFloat(this.parentNode.parentNode.childNodes[5].innerText) //?
    fetch('decrease', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'name': name,
        'msg': msg,
        'thumbDown':thumbDown //?
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
  });
})

Array.from(thumbUp).forEach(function(element) {
  element.addEventListener('click', function(){
    const name = this.parentNode.parentNode.childNodes[1].innerText
    const msg = this.parentNode.parentNode.childNodes[3].innerText
    const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
    fetch('messages', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'name': name,
        'msg': msg,
        'thumbUp':thumbUp
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
  });
});

Array.from(trash).forEach(function(element) {
  element.addEventListener('click', function(){
    const name = this.parentNode.parentNode.childNodes[1].innerText
    const msg = this.parentNode.parentNode.childNodes[3].innerText
    fetch('messages', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'name': name,
        'msg': msg
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});

//codepen =================================================
var maxItems = 20;
var initItemAmount = 10; //this is the intial amount of input rows created in the HTML
var buttonAmount = 1;
var nonInputRows = 2; //The thead row and the bottom 2, button rows
var calColumn = 2;
var yellow = "#ffff00";
var white = "#ffffff";


/*
* totalCalories function adds all valid calories in the column of calories by
* modding the index by the calColumn to see if the index is the correct
* input field. Those calorie fields are then added together and displayed
* at the bottom of the table.
*/
function totalCalories() {
  var total = 0;
  var totalCalories = document.getElementById("totalCalories");
  var amountOfInputFields = document.getElementsByTagName("input").length - buttonAmount; //ignores the 3 buttons

  for (var index = 0; index < amountOfInputFields; index++) {
    if ((index % calColumn) == 1) {
      var calInput = document.getElementsByTagName("input")[index];
      var calNum = Number(calInput.value);
      if (isValid(calInput)) {
        total += calNum;
        calInput.style.backgroundColor = white; //needed in order to reset a previously yellowed input to white again
      }
    }
  }
  totalCalories.innerHTML = total;
}


/*
* isValid function checks if the input value is valid. This checks for too many
* decimals, plus symbols, blanks, fractions, and if the value between the max and min.
*/
function isValid(input) {
  var minCalories = 0;
  var maxCalories = 100000;

  if ((Number(input.value) > minCalories) && ((Number(input.value) < maxCalories)) && !isNaN(input.value) && (Number(input.value) % 1 == 0))
  return true;
  else {
    input.value = "";
    input.style.backgroundColor = yellow;
  }
  return false;
}


/*
* addRow function adds a row with the corresponding number and input cells.
* This also hides the "Add Another" button when the table adds the 20th row.
*/
function addRow() {
  var table = document.getElementById("calTable");
  var lastIndex = document.getElementsByTagName("tr").length - 1;

  if (lastIndex <= maxItems) {
    var row = table.insertRow(lastIndex);
    var numCell = row.insertCell(0);
    var foodCell = row.insertCell(1);
    var calCell = row.insertCell(2);
    var textElement = document.createElement("input");
    var numElement = document.createElement("input");
    textElement.type = "text";
    numElement.type = "number";
    row.className = "active";
    numCell.innerHTML = lastIndex + ".";
    foodCell.appendChild(textElement);
    calCell.appendChild(numElement);
  }
  if (lastIndex == maxItems)
  document.getElementById("Add").style.visibility = "hidden";
}

/*
* reset function sets the table back to its blank initial state of 10 rows and
* adds back the "Add Another" button. It also clears any yellowed input fields.
*/
function reset() {
  var amountOfInputFields = document.getElementsByTagName("input").length - buttonAmount; //ignores the 3 buttons
  var table = document.getElementById("calTable");
  var lastIndex = document.getElementsByTagName("tr").length - nonInputRows;

  for (var index = 0; index < amountOfInputFields; index++) {
    var inputField = document.getElementsByTagName("input")[index];
    inputField.value = "";
    inputField.style.backgroundColor = "#ffffff";
  }
  while (lastIndex > initItemAmount) {
    table.deleteRow(lastIndex);
    lastIndex = document.getElementsByTagName("tr").length - nonInputRows;
  }
  document.getElementById("totalCalories").innerHTML = 0;
  document.getElementById("Add").style.visibility = "visible";
}
