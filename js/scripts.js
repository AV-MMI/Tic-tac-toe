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

/*----EVENT HANDLERS FUNCTIONS----*/

const DOMFuncs = (function(){

	//Public Methods and Variables.
		/*How to Play button*/

			/**
			* Create a floating window when the how-to-play--btn is clicked,
			* along with a background "window" of gray color with an opacity
			* of 0.8
			**/
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
	};
			/**
			* Function in charge of closing the floating window once the user
			* press the closeFloatingWindowBtn. This button is created
			* through our createFloatingWindow, and its styles along with
			* its event listener are added in the process of its creation.
			**/
	function closeHowToPlayBtn(e){
		const floatingWindowBg = document.querySelector(".floating-window-bg");
		const floatingWindow = document.querySelector(".floating-window");

		howToPlayCont.removeChild(floatingWindowBg);
		howToPlayCont.removeChild(floatingWindow);
	};

		/*History*/
	function expandHistoryContent(){
		historyContent.classList.toggle("history-expand-content");
	};

	function displayHistoryItems(){
		let counter = 0
		while(counter < Object.keys(historyObj).length){
			if(historyObj[counter]){
				_createHistoryItems(historyObj, counter, ulHistoryContent);
				counter++;
			}
			else {
				counter++;
			}
		}
	};

		/*Gameboard*/
			//users:
	const _inputBox = document.querySelectorAll(".input-box");

				/**
				* It toggles the css class input-box--open to open or close
				* the _inputBox that we have clicked. It has three inner functions:
				*
				* _obtainInput(e) return the _inputBox element that was clicked.
				*
				* _autofocus() makes sure that when the _inputDiv element is "open"
				* the input tag inside is focused automatically.
				*
				* _enterKeyToClose() makes sure to close the _inputDiv that is open when the
				* Enter key or the Numpad Enter key are pressed. If both _inputDiv
				* are open, then it closes both of them.
				**/
	function openCloseInputDiv(e){
		const displayN = e.target.id[e.target.id.length - 1];
		const _inputDiv = _obtainInput();

		function _obtainInput(e){
			for(let i = 0; i < _inputBox.length; i++){
				if(_inputBox[i].id[ _inputBox[i].id.length - 1 ] == displayN){
					return _inputBox[i];
				}
			}
		};

		function _autofocus(){
			if(_inputDiv.classList.contains("input-box--open")){
				_inputDiv.children[0].focus();
			}
		};

		function _enterKeyToClose(){
			const checkKey = (e) => {
				if(e.code == "Enter" || e.code == "NumpadEnter"){
					if(_inputDiv.classList.contains("input-box--open")){
						_inputDiv.classList.toggle("input-box--open");
						_inputDiv.children[0].blur();
					}
				}
			}

			document.addEventListener("keypress", checkKey);

		};

		_inputDiv.classList.toggle("input-box--open");
		_autofocus();
		_enterKeyToClose();
	};

	_inputBox.forEach(input => input.addEventListener("input", _updateUsername));



	//Private Methods and Variables.
		/*History*/
	function _pushDataToHistoryObj(historyData){
		historyData = {
			date: currDate(),
			name: "Jane Doe",
			id: dataId,
		};

		historyObj[dataId] = historyData;
		dataId++;
	};

	function _removeHistoryItem(e){
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


	function _createHistoryItems(data, idx, parent){
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
		removeBtn.addEventListener("click", _removeHistoryItem)

		//Appendind each element in its respective order.
		divCont.appendChild(winnerSpan);
		divCont.appendChild(dateSpan);
		divCont.appendChild(removeBtn);

		liCont.appendChild(divCont);
		parent.appendChild(liCont);
	};

		/*Gameboard*/
			//users:
	function _updateUsername(e){
		const _inputEl = e.target;
		const _inputN = _inputEl.id[_inputEl.id.length - 1];

		function _obtainDisplay(e){
			for(let i = 0; i < userDisplay.length; i++){
				if(userDisplay[i].id[ userDisplay[i].id.length - 1 ] == _inputN)
					return userDisplay[i];
			}
		}

		const _displaySpan = _obtainDisplay(e);

		_displaySpan.textContent = _inputEl.value;
	};

	return {
		//How to Play button:
		createFloatingWindow,
		closeHowToPlayBtn,

		//History
		_pushDataToHistoryObj, //Public while testing.
		expandHistoryContent,
		displayHistoryItems,
		openCloseInputDiv,
	}

})();



/*V________TESTING_________V*/
console.log(historyObj)
DOMFuncs._pushDataToHistoryObj();
DOMFuncs._pushDataToHistoryObj();
DOMFuncs._pushDataToHistoryObj();
DOMFuncs._pushDataToHistoryObj();
console.log(historyObj)
/*^________TESTING_________^*/

	/*Changing username*/

//////----------Working on this------->


/*----DOOM VARIABLES AND EVENT HANDLERS----*/

	/*How to Play button*/
const howToPlayCont = document.querySelector("#how-to-play--cont");
const howToPlayBtn = document.querySelector("#how-to-play--btn");
howToPlayBtn.addEventListener("click", DOMFuncs.createFloatingWindow);

	/*Histoy*/
const historyBtn = document.querySelector("#history-btn");
const historyContent = document.querySelector("#history-content");
const ulHistoryContent = document.querySelector("#ul-history-content");

historyBtn.addEventListener("click", DOMFuncs.expandHistoryContent);

	/*Gameboard*/
		/**Gameboard users**/

const userDisplay = document.querySelectorAll(".user-display");

userDisplay.forEach(display => display.addEventListener("click", DOMFuncs.openCloseInputDiv));

//Calling functions
DOMFuncs.displayHistoryItems();