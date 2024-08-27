///////////////////////////////////////////////////////
// Variables
///////////////////////////////////////////////////////
var sum = 0;
var selected = 0;
var numberCount = 7;
var score = 0;
var gameover = false;
var numbers = [];
var selectedNumbers = new Set();
var helpUsedTime = 0;

// basic refers to if the game is in basic mode or not
// if you want to play the game in basic mode, set basic to true
// if basic is not null or undefined, the game will be in basic mode
var basic = true;

///////////////////////////////////////////////////////
// Algorithms
///////////////////////////////////////////////////////
function getCombinations(arr, n) {
	if (n > arr.length) return [];
	const result = [];
	function generateCombos(currentCombo, remainingElements) {
		if (currentCombo.length === n) result.push(currentCombo);
		else {
			for (let i = 0; i < remainingElements.length; i++) {
				const newCombo = currentCombo.concat(remainingElements[i]);
				const newRemaining = remainingElements.slice(i + 1);
				generateCombos(newCombo, newRemaining);
			}
		}
	}
	generateCombos([], arr);
	return result;
}
function getPossibleCombinations() {
	var res = [];
	for (let i = 1; i < numberCount; i++) {
		ls = getCombinations(Array.from({length: numberCount}, (val, j) => j),i);
		for (let j of ls) {
			j_sum = 0;
			for (let k of j) {
				j_sum += numbers[k];
			}
			if (j_sum == 0){
				tmp = [];
				for (let k of j) {
					tmp.push(k+1);
				}
				res.push(tmp);
			}
		}
	}
	return res;
}
function randomNum(minNum,maxNum){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1,10);
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
		default: 
			return 0;
    }
} 
///////////////////////////////////////////////////////
// Document Ready Event Listener
///////////////////////////////////////////////////////
function DocumentReadyEvent() {
	// Define controls in constant
	const divGameOver = document.getElementById("gameover_div");
	const divNumbers = document.getElementById("numbers");
	const divControls = document.getElementById("controls");
	const divShowSum = document.getElementById("show_sum_checkbox_container");
	const btnReset = document.getElementById("reset_button");
	const btnSwitchColorScheme = document.getElementById("switch_color_scheme_button");
	const btnSubmit = document.getElementById("submit_button");
	const btnHelp = document.getElementById("help_button");
	const btnCheckGame = document.getElementById("check_game_button");
	const checkBoxShowSum = document.getElementById("show_sum_checkbox");
	const spanSum = document.getElementById("sum_span");
	const spanSumContainer = document.getElementById("sum_span_container");
	const spanScore = document.getElementById("score_span");
	const spanHelp = document.getElementById("help_span");
	const spanGameOver = document.getElementById("gameover_span");

	///////////////////////////////////////////////////////
	// Controls
	///////////////////////////////////////////////////////
	function lose(bool_switch, text) {
		gameover = bool_switch;
		spanGameOver.innerHTML = text;
		if (bool_switch) {
			divGameOver.classList.remove("hide");
			divNumbers.classList.add("hide");
			divControls.classList.add("hide");
			divShowSum.classList.add("hide");
			btnReset.style.display = "inline-block";
			if (!basic) btnSwitchColorScheme.style.display = "inline-block";
			divShowSum.classList.remove("inline_block");
		} else {
			divGameOver.classList.add("hide");
			divNumbers.classList.remove("hide");
			divControls.classList.remove("hide");
			divShowSum.classList.remove("hide");
			btnReset.style.display = "";
			if (!basic) btnSwitchColorScheme.style.display = "";
			divShowSum.classList.add("inline_block");
		}
	}

	function updateSum(value) {
		sum = value;
		if (selected == 0){
			spanSum.textContent = "None";
			spanSum.style.color = "red";
			return;
		}
		if (sum == 0){
			spanSum.style.color = "green";
			spanSum.textContent = "0";
			return;
		}
		spanSum.textContent = sum;
		spanSum.style.color = "";
	}

	function updateScore(value) {
		score = value;
		spanScore.textContent = score;
	}

	function updateHelp(value) {
		helpUsedTime = value;
		spanHelp.textContent = helpUsedTime;
	}

	function getNumberString(n){
		if (n<0) return "(" + n + ")";
		if (n==0) return "(0)";
		return "(+" + n + ")";
	}

	function numberbuttons_clicked(){
		if (this.classList.contains("submit_button")){
			this.classList.remove("submit_button");
			selectedNumbers.delete(this.getAttribute("id"));
			selected--;
			updateSum(sum - numbers[parseInt(this.getAttribute("id"))-1]);
		}
		else {
			selectedNumbers.add(this.getAttribute("id"));
			this.classList.add("submit_button");
			selected++;
			updateSum(sum + numbers[parseInt(this.getAttribute("id"))-1]);
		}
	}

	function initGame(count = 7) {
		updateScore(0);
		updateHelp(0);
		initNumbers(count);
	}

	function initNumbers(count = 7){
		selected = 0;
		selectedNumbers.clear();
		updateSum(0);
		numbers = [];
		divNumbers.innerHTML = "";
		for (var i = 1; i <= count; i++){
			n = randomNum(-10,9);
			numbers.push(n);
			divNumbers.insertAdjacentHTML("beforeend", "<input type=\"button\" id=\"" + i + "\" value=\"" + getNumberString(n) + "\" class=\"" + (basic?"":"buttons ") + "numberbuttons\">");
		}
		for (let i of document.getElementsByClassName("numberbuttons")) {
			i.addEventListener("click", numberbuttons_clicked);
		}
	}

	///////////////////////////////////////////////////////
	// Initialize Game
	///////////////////////////////////////////////////////

	initGame(numberCount);
	if (!basic && btnSwitchColorScheme != null) {
		if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
			document.body.classList.add("night");
			btnSwitchColorScheme.value = "Light Mode";
		}
		btnSwitchColorScheme.addEventListener("click", function(){
			if (document.body.classList.contains("night")){
				document.body.classList.remove("night");
				btnSwitchColorScheme.value="Dark Mode";
			}
			else{
				document.body.classList.add("night")
				btnSwitchColorScheme.value="Light Mode";
			}
		});
	}

	///////////////////////////////////////////////////////
	// Event Listeners
	///////////////////////////////////////////////////////

	btnSubmit.addEventListener("click", function(){
		if (sum == 0 && selected != 0){
			updateScore(score + 1);
			selected = 0;
			updateSum(0);
			for (let i of selectedNumbers) {
				numbers[parseInt(i)-1] = randomNum(-10,9);
				document.getElementById(i).value = getNumberString(numbers[parseInt(i)-1]);
				document.getElementById(i).classList.remove("submit_button");
			}
			selectedNumbers.clear();
		}
		else if (selected == 0) {
			alert("You must select at least one number to submit");
		}
		else{
			if (sum!=0){
				var polynomial = "";
				for (let i of selectedNumbers) polynomial += document.getElementById(i).value + "+";
				polynomial = polynomial.slice(0, -1);
				lose(true, polynomial + " equals to " + sum + " and it's not equals to 0");
			}
		}
	});
	btnReset.addEventListener("click",function(){
		lose(false, "");
		initGame(numberCount);
	});
	checkBoxShowSum.addEventListener("click", function() {
		if (spanSumContainer.classList.contains("hide-with-self")) spanSumContainer.classList.remove("hide-with-self");
		else spanSumContainer.classList.add("hide-with-self");
	});
	btnHelp.addEventListener("click", function() {
		updateHelp(helpUsedTime+1);
		var arr = getPossibleCombinations();
		if (arr.length == 0) {
			alert("No possible combinations found, you may click the 'I can't find a valid smash' button to reset the game");
			return;
		}
		for (let i of selectedNumbers) document.getElementById(i).classList.remove("submit_button");
		selectedNumbers = new Set(arr[randomNum(0,arr.length-1)]);
		for (let i of selectedNumbers) document.getElementById(i).classList.add("submit_button");
		selected = selectedNumbers.length;
	});
	btnCheckGame.addEventListener("click", function() {
		var arr = getPossibleCombinations();
		if (arr.length == 0) {
			initNumbers(numberCount);
			return;
		}
		var tmp = arr.map(item => item.map(i => getNumberString(numbers[i-1])).join("+")).join("<br/>");
		lose(true, "A valid smash found!<br/>" + tmp + "<br/>can still be smashed");
	});
}
if (document.readyState !== "loading") {
  DocumentReadyEvent();
} else {
  document.addEventListener("DOMContentLoaded", DocumentReadyEvent);
}