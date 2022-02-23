/*----LOCAL VARIABLES AND FUNCTIONS----*/
	/*How to Play button*/

	/*History*/
const historyObj = {

}
let dataId = 0;

function currDate(){
	const date = new Date();
	const currDay = (String(date.getDate()).length == 1) ? ("0" + date.getDate()) : (date.getDate());
	const currMonth = (String(date.getMonth()).length == 1) ? ("0" + date.getMonth()) : (date.getMonth());
	const currFullYear = date.getFullYear();
	const currTwoDigYear = String(currFullYear)[2] + String(currFullYear)[3];


	const dateFormat = `${currDay} - ${currMonth} - ${currTwoDigYear}`

	return dateFormat;
};

/*----DOOM VARIABLES AND EVENT HANDLERS----*/

	/*How to Play button*/
const howToPlayCont = document.querySelector("#how-to-play--cont");
const howToPlayBtn = document.querySelector("#how-to-play--btn");

howToPlayBtn.addEventListener("click", createFloatingWindow);

	/*Histoy*/
const historyBtn = document.querySelector("#history-btn");
const historyContent = document.querySelector("#history-content");
const ulHistoryContent = document.querySelector("#ul-history-content");

historyBtn.addEventListener("click", expandHistoryContent);

	/*Gameboard*/
		/**Gameboard users**/
const inputBox = document.querySelectorAll(".input-box");
const userDisplay = document.querySelectorAll(".user-display");

userDisplay.forEach(display => display.addEventListener("click", openCloseInputDiv));
inputBox.forEach(input => input.addEventListener("input", updateUsername));

/*----EVENT HANDLERS FUNCTIONS----*/
	/*How to Play button*/
function createFloatingWindow(){
	const floatingWindowBg = document.createElement("div");
	const floatingWindow = document.createElement("div");
	// Goes inside the floatingWindow, before the floatingWindowContent.
	const closeFloatingWindowBtn = document.createElement("button");
	// Goes inside the floatingWindow, after closeFloatingWindowBtn.
	const floatingWindowContent = document.createElement("div");
			//Content that goes inside our close button.
	closeFloatingWindowBtn.textContent = "X";

			//Tags and content that goes inside our floatingWindowContent
	const floatingWindowContentHeader = document.createElement("h2");
	const floatingWindowContentFiPara = document.createElement("p");
	const floatingWindowContentSePara = document.createElement("p");
	const floatingWindowContentThiPara = document.createElement("p");

	floatingWindowContentHeader.textContent = "How to Play?";
	floatingWindowContentFiPara.textContent = "Tic tac toe, Noughts and Crosses, Xs and Ox... Is a game for two players (or one planer and the AI) who take turns marking spaces in the board, with X or O. The player who succeeds in marking three squares in a horizontal, vertical, or diagonal row is the winner.";
	floatingWindowContentSePara.textContent = "Unfortunately, there is no standard in which refer to who make the first move. To the purpouse of this game, the first turn is gonnabe aleatory assigned for one of the player (including A.I if the player chooses to play against it.";
	floatingWindowContentThiPara.textContent = "To make a move we just have to click in the square we want to put our mark in, and that's it!";

				//Appending it to the floatingWindowContent
	floatingWindowContent.appendChild(floatingWindowContentHeader);
	floatingWindowContent.appendChild(floatingWindowContentFiPara);
	floatingWindowContent.appendChild(floatingWindowContentSePara);
	floatingWindowContent.appendChild(floatingWindowContentThiPara);
			//Appending the close btn and the floatingWindowContent to our floatingWindow
	floatingWindow.appendChild(closeFloatingWindowBtn);
	floatingWindow.appendChild(floatingWindowContent);
		//Assign each respective class to the elements it belongs
	floatingWindowBg.classList.add("floating-window-bg");
	floatingWindow.classList.add("floating-window");
	closeFloatingWindowBtn.classList.add("close-floating-window--btn");
	floatingWindowContent.classList.add("floating-window-content");
	floatingWindowContentHeader.classList.add("floating-window-content--h2");

	//Appending it to our HowToPlayCont
	howToPlayCont.appendChild(floatingWindowBg);
	howToPlayCont.appendChild(floatingWindow);

	//Assigning eventListener to our close btn.
	closeFloatingWindowBtn.addEventListener("click", closeHowToPlayBtn);
}

function closeHowToPlayBtn(e){
	const floatingWindowBg = document.querySelector(".floating-window-bg");
	const floatingWindow = document.querySelector(".floating-window");

	howToPlayCont.removeChild(floatingWindowBg);
	howToPlayCont.removeChild(floatingWindow);
}

	/*History*/
function pushDataToHistoryObj(){
	let historyData = {
		date: currDate(),
		name: "Jane Doe",
		id: dataId,
	};

	historyObj[dataId] = historyData;
	dataId++;
}

/*V________TESTING_________V*/
console.log(historyObj)
pushDataToHistoryObj();
pushDataToHistoryObj();
pushDataToHistoryObj();
pushDataToHistoryObj();
console.log(historyObj)
/*^________TESTING_________^*/

function expandHistoryContent(){
	historyContent.classList.toggle("history-expand-content")
};

function createHistoryItems(data, idx, parent){
	//Creating each element.
	const liCont = document.createElement("li");
	const divCont = document.createElement("div");
	const winnerSpan = document.createElement("span");
	const dateSpan = document.createElement("span");
	const removeBtn = document.createElement("button")

	//assigning the respective data and classes for each element.
	divCont.id = data[idx]["id"];
	divCont.classList.add("history-content--item");

	winnerSpan.textContent = data[idx]["name"];
	winnerSpan.classList.add("item-winner");

	dateSpan.textContent = data[idx]["date"];
	dateSpan.classList.add("item-date");

	removeBtn.textContent = "X";
	removeBtn.classList.add("history-remove-btn");

	//adding the eventListener to removeBtn.
	removeBtn.addEventListener("click", removeHistoryItem)

	//Appendind each element in its respective order.
	divCont.appendChild(winnerSpan);
	divCont.appendChild(dateSpan);
	divCont.appendChild(removeBtn);

	liCont.appendChild(divCont);
	parent.appendChild(liCont);
};

function removeHistoryItem(e){
	const divCont = e.target.parentElement;
	const liCont = divCont.parentElement;
	const itemId = divCont.id;

	let fInterval;
	let cancelInterval;
	fInterval = setInterval(deletingFromTheDOM, 100);
	delete historyObj[itemId];

	function deletingFromTheDOM(){
		ulHistoryContent.removeChild(liCont)
		clearInterval(fInterval);
	}
};

function displayHistoryItems(){
	let counter = 0
	while(counter < Object.keys(historyObj).length){
		if(historyObj[counter]){
			createHistoryItems(historyObj, counter, ulHistoryContent);
			counter++;
		}
		else {
			counter++;
		}
	}
};

	/*Changing username*/
function openCloseInputDiv(e){
	const displayN = e.target.id[e.target.id.length - 1];

	function obtainInput(e){
		for(let i = 0; i < inputBox.length; i++){
			if(inputBox[i].id[ inputBox[i].id.length - 1 ] == displayN){
				return inputBox[i];
			}
		}
	};

	function autofocus(){
		if(inputDiv.classList.contains("input-box--open")){
			inputDiv.children[0].focus();
		}
	}

	function enterKeyToClose(){
		const checkKey = (e) => {
			console.log(e.code)
			if(e.code == "Enter" || e.code == "NumpadEnter"){
				if(inputDiv.classList.contains("input-box--open")){
					inputDiv.classList.toggle("input-box--open");
					inputDiv.children[0].blur();
				}
			}
		}

		document.addEventListener("keypress", checkKey);

	}

	const inputDiv = obtainInput(e);

	inputDiv.classList.toggle("input-box--open");
	autofocus();
	enterKeyToClose();
}
//////----------Working on this------->
function updateUsername(e){
	const inputEl = e.target;
	const inputN = inputEl.id[inputEl.id.length - 1];

	function obtainDisplay(e){
		for(let i = 0; i < userDisplay.length; i++){
			if(userDisplay[i].id[ userDisplay[i].id.length - 1 ] == inputN)
				return userDisplay[i];
		}
	}

	const displaySpan = obtainDisplay(e);

	displaySpan.textContent = inputEl.value;
}
//////----------Working on this-------<


//Calling functions
displayHistoryItems();