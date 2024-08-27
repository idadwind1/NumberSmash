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
function getCombinations(arr, n) {
	if (n > arr.length) return [];
	const result = [];
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
	const btnReset = document.getElementById("Reset");
	const btnSwitchColorScheme = document.getElementById("switch_color_scheme");
	const btnSubmit = document.getElementById("Submit");
	const btnHelp = document.getElementById("Help");
	const btnCheckGame = document.getElementById("checkGame");
	const checkBoxShowSum = document.getElementById("ShowSumCheckBox");
	const spanSum = document.getElementById("sum_span");
	const spanScore = document.getElementById("score_span");
	const spanHelp = document.getElementById("help_span");
	const spanGameOver = document.getElementById("gameover_text");

	///////////////////////////////////////////////////////
	// Controls
	///////////////////////////////////////////////////////
	function lose(bool_switch, text) {
		gameover = bool_switch;
		spanGameOver.textContent = text;
		if (bool_switch) {
			divGameOver.classList.remove("hide");
			divNumbers.classList.add("hide");
			divControls.classList.add("hide");
			btnReset.style.display = "inline-block";
			if (!basic) btnSwitchColorScheme.style.display = "inline-block";
			checkBoxShowSum.classList.remove("inline_block");
		} else {
			divGameOver.classList.add("hide");
			divNumbers.classList.remove("hide");
			divControls.classList.remove("hide");
			btnReset.style.display = "";
			if (!basic) btnSwitchColorScheme.style.display = "";
			checkBoxShowSum.classList.add("inline_block");
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

	function initGame(numbers = 7) {
		updateScore(0);
		updateHelp(0);
		initNumbers(numbers);
	}

	function initNumbers(numbers = 7){
		selected = 0;
		selectedNumbers.clear();
		updateSum(0);
		numbers = [];
		divNumbers.innerHTML = "";
		for (var i = 1; i <= numberCount; i++){
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
		lose(false, "")
		initGame(numberCount);
	});
	checkBoxShowSum.addEventListener("click", function() {
		if (spanSum.classList.contains("hide-with-self")) spanSum.classList.remove("hide-with-self");
		else spanSum.classList.add("hide-with-self");
	});
	btnHelp.addEventListener("click", function() {
		updateHelp(helpUsedTime+1);
		arr = getPossibleCombinations();
		for (let i of selectedNumbers) document.getElementById(i).classList.remove("submit_button");
		selectedNumbers = new Set(arr[randomNum(0,arr.length-1)]);
		for (let i of selectedNumbers) document.getElementById(i).classList.add("submit_button");
		selected = selectedNumbers.length;
	});
	btnCheckGame.addEventListener("click", function() {
		arr = getPossibleCombinations();
		if (arr.length == 0) {initNumbers(numberCount);return;}
		arr = arr[randomNum(0,arr.length-1)];
		tmp = "";
		console.log(arr);
		for (let i of arr) tmp += getNumberString(numbers[i-1]) + "+";
		tmp = tmp.substr(0, tmp.length - 1);
		lose(true, "A valid smash found! " + tmp + " can still be smashed");
	});
}
if (document.readyState !== "loading") {
  DocumentReadyEvent();
} else {
  document.addEventListener("DOMContentLoaded", DocumentReadyEvent);
}