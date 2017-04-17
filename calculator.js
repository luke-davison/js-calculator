document.addEventListener('DOMContentLoaded', loadPage)
var calculated = false;

function loadPage() {
  var buttons = document.getElementsByClassName("button");
  for (var i = 0; i < buttons.length; i ++) {
    buttons[i].addEventListener('click', pressButton)
  }
}

function pressButton(btn) {
  console.log(btn.target.id);
  switch (btn.target.id) {
    case "btn-ac":
      pressClearButton("all");
      break;
    case "btn-ce":
      pressClearButton("some");
      break;
    case "btn-divide":
      pressActionButton("/");
      break;
    case "btn-multiply":
      pressActionButton("x");
      break;
    case "btn-add":
      pressActionButton("+");
      break;
    case "btn-subtract":
      pressActionButton("-");
      break;
    case "btn-equals":
      pressEqualsButton();
      break;
    case "btn-decimal":
      pressDecimalButton();
      break;
    default:
      pressDigitButton(parseInt(btn.target.id.substr(btn.target.id.length-1,1)));
      break;
  }
}

function pressActionButton(type) {
  if (calculated) {
    document.getElementsByClassName("formula-screen")[0].innerHTML = "";
    calculated = false;
  }
  if (checkNum()) {
    saveInput();
    setInput(type,true);
    saveInput();
  }
  else {
    clearRecentFormula();
    setInput(type,true)
    saveInput();
  }
}

function pressClearButton(type) {
  if ((type === "all") || (calculated)) {
    setInput("0",true);
    document.getElementsByClassName("formula-screen")[0].innerHTML = ""
    calculated = false;
  }
  else {
    if (checkNum()) {
      setInput("0",true)
    }
  }
}

function pressDigitButton(digit) {
  if (calculated) {
    pressClearButton("all");
    calculated = false;
  }
  if (document.getElementsByClassName("input-screen")[0].innerHTML.replace(/\./g,"").length < 9) {
    if (checkNum()) {
      if (document.getElementsByClassName("input-screen")[0].innerHTML === "0") {
        setInput(digit,true);
      }
      else {
        setInput(digit,false);
      }
    }
  else {
      setInput(digit,true);
    }
  }
}

function pressEqualsButton() {
  if (calculated === false) {
    if (checkNum()) {
      saveInput();
      document.getElementsByClassName("formula-screen")[0].innerHTML += " =";
      calculateFormula();
    }
  }
}

function pressDecimalButton() {
  if (calculated) {
    pressClearButton("all");
    calculated = false;
  }
  if (document.getElementsByClassName("input-screen")[0].innerHTML.replace(/\./g,"").length < 9) {
    if (checkNum()) {
      if (document.getElementsByClassName("input-screen")[0].innerHTML.indexOf(".") === -1) {
        setInput(".",false);
      }
    }
    else {
      setInput("0.",true);
    }
  }
}

function setInput(str,clear) {
  if (clear) {
    document.getElementsByClassName("input-screen")[0].innerHTML = str;
  }
  else {
    document.getElementsByClassName("input-screen")[0].innerHTML += str;
  }
  adjustCommas();
}

function checkNum() {
  var inputStr = document.getElementsByClassName("input-screen")[0].innerHTML;
  if ((inputStr === "/") || (inputStr === "x") || (inputStr === "+") || (inputStr === "-")) {
    return false;
  }
  return true;
}

function saveInput() {
  document.getElementsByClassName("formula-screen")[0].innerHTML += " " + document.getElementsByClassName("input-screen")[0].innerHTML;
}

function clearRecentFormula() {
  document.getElementsByClassName("formula-screen")[0].innerHTML = document.getElementsByClassName("formula-screen")[0].innerHTML.slice(0,document.getElementsByClassName("formula-screen")[0].innerHTML.length - 1)
}

function calculateFormula() {
  var formulaArr = document.getElementsByClassName("formula-screen")[0].innerHTML.replace(/,/g,"").split(" ");
  console.log(formulaArr);
  var runningTotal = parseFloat(formulaArr[1]);
  for (var i = 2; i < formulaArr.length; i++) {
    if (parseFloat(formulaArr[i]) > 0) {
      switch (formulaArr[i-1]) {
        case "+":
          runningTotal += parseFloat(formulaArr[i]);
          break;
        case "-":
          runningTotal -= parseFloat(formulaArr[i]);
          break;
        case "x":
          runningTotal *= parseFloat(formulaArr[i]);
          break;
        case "/":
          runningTotal /= parseFloat(formulaArr[i]);
          break;
      }
    }
  }
  if (runningTotal >= 1000000000) {
    console.log("hi");
    runningTotal = 0;
  }
  if (runningTotal != round(runningTotal)) {
    runningTotal = round(runningTotal);
  }
  setInput(runningTotal,true);
  calculated = true;
}

function adjustCommas() {
  //this doesn't work for decimal numbers
  /*var inputStr = document.getElementsByClassName("input-screen")[0].innerHTML
  inputStr = inputStr.replace(/,/g,"");
  for (var i = 1; i < inputStr.length; i++) {
    if ((i + 1) % 4 === 0) {
      inputStr = inputStr.slice(0,inputStr.length-i) + "," + inputStr.slice(inputStr.length-i);
    }
  }
  document.getElementsByClassName("input-screen")[0].innerHTML = inputStr;*/
}

function round(value) {
  console.log(String(Math.round(Math.abs(value))),String(Math.round(Math.abs(value))).length);
  var decimals = 9 - String(Math.round(Math.abs(value))).length
  console.log(decimals)
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
