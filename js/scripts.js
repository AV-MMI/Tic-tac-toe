/*----LOCAL VARIABLES AND FUNCTIONS----*/
const gameFlow = {
	history: {},
	players: {},
	board: {0: "", 3: "", 6: "",
			1: "", 4: "", 7: "",
			2: "", 5: "", 8: "",},
	status: true, // Indicates whether the game has ended or not..
	ai: {
		isActive: false,
		difficulty: "",
		mark: "",
		name: "Artificial Intelligence",
		turn: false,
		cont: { player: "",
				number: "",
			},
	},
};

const local = {
	utils: {
		history: {
			dataId: 0,
			currDate: function(){
				const date = new Date();
				const currDay = (String(date.getDate()).length == 1) ? ("0" + date.getDate()) : (date.getDate());
				const currMonth = (String(date.getMonth()).length == 1) ? ("0" + date.getMonth()) : (date.getMonth());
				const currFullYear = date.getFullYear();
				const currTwoDigYear = String(currFullYear)[2] + String(currFullYear)[3];


				const dateFormat = `${currDay} - ${currMonth} - ${currTwoDigYear}`

				return dateFormat;
			},
		},

		users: {
			createPlayer: function(name, mark, turn, container){
				return {
					name,
					mark,
					turn,
					container,
				}
			}
		}
	},
};

/*----EVENT HANDLERS FUNCTIONS----*/

const DOMFuncs = (function(){
	//---Public variables---.
		//Gameboard
			//users
				/**
				* NodeList.
				* Contains the elements in charge of displaying the name of each player.
				**/
	const usersDisplay = document.querySelectorAll(".user-display");

			//board
	const squares = document.querySelectorAll(".square"); // to return
	const gameboardBoard = document.querySelector(".gameboard-board"); // used by markSquare(e), _resetGame()

			//AI
	const AIButton = document.querySelector(".AI-btn");
	//let aiCont = gameFlow.ai.cont.number; // used by inner functions: toggleTurn(), currentMark(), of markSquare(). Also used by _highlightPlayerTurn();
	//let playerSide = (aiCont == 1) ? "leftPlayer" : "rightPlayer"; // used by inner functions: toggleTurn(), currentMark(), of markSquare();


	//---Private Methods and Variables---.
		/*History*/
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

	function _removeHistoryItem(e){
		const divCont = e.target.parentElement;
		const liCont = divCont.parentElement;
		const itemId = divCont.id;

		let fInterval;
		let cancelInterval;
		fInterval = setInterval(_deletingFromTheDOM, 100);
		delete gameFlow.history[itemId];

		function _deletingFromTheDOM(){
			ulHistoryContent.removeChild(liCont)
			clearInterval(fInterval);
		}
	};


	function _pushDataToHistoryObj(name="Odisseus"){
		let historyData = {
			date: local.utils.history.currDate(),
			name: name,
			id: local.utils.history.dataId,
		};

		gameFlow.history[local.utils.history.dataId] = historyData;
		local.utils.history.dataId++;
	};

		/*Gameboard*/
			//Users:
	function _updateUsername(e){
		const _inputEl = e.target;
		const _inputN = _inputEl.id[_inputEl.id.length - 1];

		function _obtainDisplay(e){
			for(let i = 0; i < usersDisplay.length; i++){
				if(usersDisplay[i].id[ usersDisplay[i].id.length - 1 ] == _inputN)
					return usersDisplay[i];
			}
		}

		const _displaySpan = _obtainDisplay(e);

		_displaySpan.textContent = _inputEl.value;

		if(gameFlow.ai.isActive){
			if(gameFlow.ai.cont.number == _inputN){
				gameFlow.ai.name = _inputEl.value;
			} else {
				for(player in gameFlow.players){
					gameFlow.players[player].name = _inputEl.value;
				}
			}

		} else {
			for(player in gameFlow.players){
				if(gameFlow.players[player].container == _inputN){
					gameFlow.players[player].name = _inputEl.value;
				}
			}
		}

	};

	const _inputBox = document.querySelectorAll(".input-box");
	_inputBox.forEach(input => input.addEventListener("input", _updateUsername));

				/**
				* _highlightPlayerTurn(obj)
				* highlight the container in which the player has the turn to mark the square.
				*	- If the current node of the nodeList usersDisplay coincides with the container
				*	of the player with the current turn, add the respective border.
				*
				*	- In case the current node does not coincide with the container of the user with
				*	the current turn, remove the border.
				**/

	let opponent;
	function _highlightPlayerTurn(obj, aiIsActive){
		if(!aiIsActive){
			for(node of usersDisplay){
				if(node.id[ node.id.length - 1 ] == obj.players.leftPlayer.container && obj.players.leftPlayer.turn ||
					node.id [ node.id.length - 1 ] == obj.players.rightPlayer.container && obj.players.rightPlayer.turn){
					node.parentElement.style.border = "1px solid #00FFDD";
				} else {
					node.parentElement.style.border = "1px solid #000";
				}
			}
		}


		else {
			for(node of usersDisplay){
				if(node.id[ node.id.length - 1 ] == obj.ai.cont.number && obj.ai.turn ||
					node.id[ node.id.length - 1 ] == opponent.cont && !obj.ai.turn ){
					node.parentElement.style.border = "1px solid #00FFDD";
				} else {
					node.parentElement.style.border = "1px solid #000";
				}
			}
		}
	}

			//Board:
				/**
				* assign the initial turn to one of the players in an
				* random way.
				**/

	function _assignRandomTurn(obj){
		function _generateRandomNum(max){
			return Math.floor(Math.random() * max);
		};

		const randomNum = _generateRandomNum(2);

		if(randomNum == 1){
			obj.leftPlayer.turn = true;
			obj.rightPlayer.turn = false;
		} else {
			obj.rightPlayer.turn = true;
			obj.leftPlayer.turn = false;
		};
	};
				/**
				* Check the gameboard looking for winning moves, if there is any
				* it will display a message for the winner in the div gameboard-bottom.
				* It will check for three different patterns: Vertical, Horizontal, and Diagonal
				* moves. It also will be invoked every time a player makes a move.
				**/

				/**
				* TODO:
				* - add support for ai.isActive.
				**/

	function _checkGame(obj){
		let winner;

		//Vertical.
		if(obj["0"] !== "" && obj["0"] == obj["1"] && obj["1"] == obj["2"] && gameFlow.status){
			winner = (gameFlow.players.leftPlayer.mark == obj["0"]) ? gameFlow.players.leftPlayer.name : gameFlow.players.rightPlayer.name;
			_pushDataToHistoryObj(winner);
			_createHistoryItems(gameFlow.history, local.utils.history.dataId - 1, ulHistoryContent);
			gameFlow.status = false;

			_bottomDisplay(`Congratulations ${winner}, you have won this game!`, true);
		}

		else if(obj["3"] !== "" && obj["3"] == obj["4"] && obj["4"] == obj["5"] && gameFlow.status){
			winner = (gameFlow.players.leftPlayer.mark == obj["3"]) ? gameFlow.players.leftPlayer.name : gameFlow.players.rightPlayer.name;
			_pushDataToHistoryObj(winner);
			_createHistoryItems(gameFlow.history, local.utils.history.dataId - 1, ulHistoryContent);
			gameFlow.status = false;

			_bottomDisplay(`Congratulations ${winner}, you have won this game!`, true);
		}

		else if(obj["6"] !== "" && obj["6"] == obj["7"] && obj["7"] == obj["8"] && gameFlow.status){
			winner = (gameFlow.players.leftPlayer.mark == obj["6"]) ? gameFlow.players.leftPlayer.name : gameFlow.players.rightPlayer.name;
			_pushDataToHistoryObj(winner);
			_createHistoryItems(gameFlow.history, local.utils.history.dataId - 1, ulHistoryContent);
			gameFlow.status = false;

			_bottomDisplay(`Congratulations ${winner}, you have won this game!`, true);
		}

		//Horizontal.
		else if(obj["0"] !== "" && obj["0"] == obj["3"] && obj["3"] == obj["6"] && gameFlow.status){
			winner = (gameFlow.players.leftPlayer.mark == obj["0"]) ? gameFlow.players.leftPlayer.name : gameFlow.players.rightPlayer.name;
			_pushDataToHistoryObj(winner);
			_createHistoryItems(gameFlow.history, local.utils.history.dataId - 1, ulHistoryContent);
			gameFlow.status = false;

			_bottomDisplay(`Congratulations ${winner}, you have won this game!`, true);
		}

		else if(obj["1"] !== "" && obj["1"] == obj["4"] && obj["4"] == obj["7"] && gameFlow.status){
			winner = (gameFlow.players.leftPlayer.mark == obj["1"]) ? gameFlow.players.leftPlayer.name : gameFlow.players.rightPlayer.name;
			_pushDataToHistoryObj(winner);
			_createHistoryItems(gameFlow.history, local.utils.history.dataId - 1, ulHistoryContent);
			gameFlow.status = false;

			_bottomDisplay(`Congratulations ${winner}, you have won this game!`, true);
		}

		else if(obj["2"] !== "" && obj["2"] == obj["5"] && obj["5"] == obj["8"] && gameFlow.status){
			winner = (gameFlow.players.leftPlayer.mark == obj["2"]) ? gameFlow.players.leftPlayer.name : gameFlow.players.rightPlayer.name;
			_pushDataToHistoryObj(winner);
			_createHistoryItems(gameFlow.history, local.utils.history.dataId - 1, ulHistoryContent);
			gameFlow.status = false;

			_bottomDisplay(`Congratulations ${winner}, you have won this game!`, true);
		}

		//Diagonal.
		else if(obj["0"] !== "" && obj["0"] == obj["4"] && obj["4"] == obj["8"] && gameFlow.status){
			winner = (gameFlow.players.leftPlayer.mark == obj["0"]) ? gameFlow.players.leftPlayer.name : gameFlow.players.rightPlayer.name;
			_pushDataToHistoryObj(winner);
			_createHistoryItems(gameFlow.history, local.utils.history.dataId - 1, ulHistoryContent);
			gameFlow.status = false;

			_bottomDisplay(`Congratulations ${winner}, you have won this game!`, true);
		}

		else if(obj["2"] !== "" && obj["2"] == obj["4"] && obj["4"] == obj["6"] && gameFlow.status){
			winner = (gameFlow.players.leftPlayer.mark == obj["2"]) ? gameFlow.players.leftPlayer.name : gameFlow.players.rightPlayer.name;
			_pushDataToHistoryObj(winner);
			_createHistoryItems(gameFlow.history, local.utils.history.dataId - 1, ulHistoryContent);
			gameFlow.status = false;

			_bottomDisplay(`Congratulations ${winner}, you have won this game!`, true);
		}

		// Check if there has been a draw.
		else if(obj["0"] !== "" && obj["3"] !== "" && obj["6"] !== ""
			&& obj["1"] !== "" && obj["4"] !== "" && obj["7"] !== ""
			&& obj["2"] !== "" && obj["5"] !== "" && obj["8"] !== "" && gameFlow.status){
			_pushDataToHistoryObj("Draw");
			_createHistoryItems(gameFlow.history, local.utils.history.dataId - 1, ulHistoryContent);
			gameFlow.status = false;

			_bottomDisplay(`It looks like there have been a draw`, true)
		}


		else{
			_highlightPlayerTurn(gameFlow, gameFlow.ai.isActive);
		}

	};

			//Bottom-display

				/**
				* Function in charge of creating the reset button to append it
				* as a sibling of _bottomSpanDisplay.
				**/
	function _createResetButton(){
		const button = document.createElement("button");

		button.textContent = "Reset Game";
		button.classList.add("reset-btn");
		button.addEventListener("click", _resetGame);

		return button;
	};

				/**
				* Event Handler.
				* will reset the game after its event is triggered, cleaning in that way
				* the board obj, and reassigning the current turn in a random way.
				**/

	function _resetGame(){
		for(let i = 0; i < Object.keys(gameFlow.board).length; i++){
			gameFlow.board[i] = "";
		}

		gameFlow.status = true

		displayBoard(gameFlow.board);
		gameboardBoard.style.borderLeft = "2px solid black";
		gameboardBoard.style.borderRight = "2px solid black";

		const deleteButton = document.querySelector(".reset-btn");
		deleteButton.remove();
		_assignRandomTurn(gameFlow.players);
		_highlightPlayerTurn(gameFlow, gameFlow.ai.isActive);
		_bottomDisplay("Click a square to start playing!");
	}

				/**
				* It's function is to display the message that we will pass
				* into the bottom display. It takes two parameters, the parameter
				* msg is the message that it will display, while btnBool will receive
				* a bool value, which will determine if a reset button (in case the game is finished)
				* will be added to our message or not.
				**/
	const _bottomSpanDisplay = document.querySelector("#bottom-display");

	function _bottomDisplay(msg, btnBool=false){
		_bottomSpanDisplay.textContent = msg;

		if(btnBool){
			const parentEl = _bottomSpanDisplay.parentElement;
			parentEl.appendChild(_createResetButton());
		}
	};

			//A.I

				/**
				* Function.
				* It takes the display of the user whose turn property is equal to false,
				* and assign that container to display our AI.
				**/
	let playerSide; // used by markSquare();
	function _invokeAI(){
		/**
		* Check what user has the turn property set to false.
		* - isActive to true.
		* - Assign the container number to aiContainer.
		* - Store the name of the player that owns that container.
		* - Assign the mark of that player to our ai.
		**/

		gameFlow.ai.isActive = true;

		for(player in gameFlow.players){
			if(!gameFlow.players[player].turn){
				gameFlow.ai.cont.number = gameFlow.players[player].container;
				gameFlow.ai.cont.player = gameFlow.players[player].name;
				gameFlow.ai.mark = gameFlow.players[player].mark;

				playerSide = ( gameFlow.ai.cont.number == 0) ? "rightPlayer" : "leftPlayer";
				opponent = { cont: gameFlow.players[playerSide].container, name: gameFlow.players[playerSide].name}

			}
		}

		/**
		* Display A.I in the previously assigned container.
		*	- Assign the AI name to the textContent of the designed container.
		**/
		for(node of usersDisplay){
			if(node.id[ node.id.length - 1 ] == gameFlow.ai.cont.number){
				node.textContent = gameFlow.ai.name;
			}
		}

	}

	//---Public Methods and Variables---.
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
		floatingWindowContentSePara.textContent = "Unfortunately, there is no standard in which refer to who make the first move. To the purpouse of this game, the first turn is gonna be aleatory assigned for one of the player (including A.I if the player chooses to play against it.";
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
		for(let i = 0; i < local.utils.history.dataId; i++){
			if(gameFlow.history[i]){ //Obj to display, Idx, parentEl.
				_createHistoryItems(gameFlow.history, i, ulHistoryContent)
			}
		}
	};

		/*Gameboard*/
			//Users:

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


			//Board:
				/**
				* Display the marks of each square of the board obj
				* inside the span tags with the id of each square.
				**/

	function displayBoard(obj){
		for(square in obj){
			let _span =  squares[square].firstChild;
			_span.textContent = obj[square];
		};
	};

			/**
			* Check if there is no players in the gameFlow.players obj.
			* In case there are no players it will create the two players
			* required to play.
			**/

	function createPlayers(obj, playersDisplay){
		if(Object.entries(obj).length == 0){
			const leftPlayer = local.utils.users.createPlayer(playersDisplay[0].textContent, "X", false, 0);
			const rightPlayer = local.utils.users.createPlayer(playersDisplay[1].textContent, "O", false, 1);

			gameFlow.players["leftPlayer"] = leftPlayer;
			gameFlow.players["rightPlayer"] = rightPlayer;

			_assignRandomTurn(gameFlow.players);
			_highlightPlayerTurn(gameFlow, gameFlow.ai.isActive);
		}
	}

			/**
			* Check if a square is already marked. If it is not marked
			* it will check which player is in turn to play, and will
			* set the mark of the user with the current turn.
			**/

	function markSquare(e){
		let aiCont = gameFlow.ai.cont.number;
		let playerSide = (aiCont == 1) ? "leftPlayer" : "rightPlayer";
		function toggleTurn(obj, aiActive){
			/**
			* TODO:
			*	- Check whether the AI is on the right or left cont.
			*	- Toggle turns in the designated way.
			**/
			if(!aiActive){
				if(obj.players.leftPlayer.turn){
					obj.players.rightPlayer.turn = true;
					obj.players.leftPlayer.turn = false;
				} else {
					obj.players.rightPlayer.turn = false;
					obj.players.leftPlayer.turn = true;
				}
			} else {
				if(obj.players[playerSide].turn){
					obj.ai.turn = true;
					obj.players[playerSide].turn = false;

				} else {
					obj.players[playerSide].turn = true;
					obj.ai.turn = false;
				}
			}

		}

		function currentMark(obj, aiActive){
			if(!aiActive){
				if(obj.players.leftPlayer.turn){
					return obj.players.leftPlayer.mark;
				} else {
					return obj.players.rightPlayer.mark;
				}
			}

			else if(aiActive){
				if(obj.players[playerSide].turn){
					return obj.players[playerSide].mark;
				} else {
					return obj.ai.mark;
				}
			}
		};

							//ID of square pressed,			Div/Span pressed?
		const squareData = [e.target.id[ e.target.id.length - 1], e.target.id[ e.target.id.length - 2 ] ];
		const squareEl = e.target;

		if(gameFlow.board[squareData[0]] == "" && gameFlow.status){
			_bottomDisplay("Good Luck!")

			gameboardBoard.style.borderLeft = "2px solid black";
			gameboardBoard.style.borderRight = "2px solid black";
			gameboardBoard.style.borderTop = "none";
			gameboardBoard.style.borderBottom = "none";

			// If the div tag was pressed, find the span child and put the mark inside it.
			if(squareData[1] == "D"){
				squareEl.firstChild.textContent = currentMark(gameFlow, gameFlow.ai.isActive);

				/**
				* assign the mark to the corresponding square in our board obj.
				**/
				gameFlow.board[squareData[0]] = currentMark(gameFlow, gameFlow.ai.isActive);
				toggleTurn(gameFlow, gameFlow.ai.isActive);
			}
			else if(squareData[1] == "S"){
				squareEl.textContent = currentMark(gameFlow, gameFlow.ai.isActive);

				/**
				* assign the mark to the corresponding square in our board obj.
				**/
				gameFlow.board[squareData[0]] = currentMark(gameFlow, gameFlow.ai.isActive);
				toggleTurn(gameFlow, gameFlow.ai.isActive);
			}
		} else {
			gameboardBoard.style.border = "5px solid red";
		}


		_checkGame(gameFlow.board);
	};

			//AI
				/**
				* Event Handler.
				* Open the AI menu toggling the AI--cont-open css class.
				**/
	function openAIMenu(){
		const parentEl = AIButton.parentElement;
		parentEl.classList.toggle("AI--cont-open");
	}


				/**
				* NodeList.
				* It contains all the elements with the css class "AI-menu-opt-btn".
				* Will be used in: selectedOpt(e).
				**/
	const difficultyOpts = document.querySelectorAll(".AI-menu-opt-btn");

				/**
				* Event Handler.
				* It assigns the css class "selected-opt" to the element triggered
				* by the "click" event. If any other siblings of this element has
				* the css class "selected-opt", then it will remove it from that element.
				*	- If any of the siblings of the triggered opt contains the css class
				* 	  "selected-opt" remove it from them.
				*
				*	- Once an option has been chosen, close the AI menu.
				**/
	function selectedOpt(e){
		const triggeredOpt = e.target;

		for(node of difficultyOpts){
			if(node == triggeredOpt){
				if(!gameFlow.ai.isActive){
					_invokeAI();
				}

				triggeredOpt.classList.add("selected-opt");
				gameFlow.ai.difficulty = [triggeredOpt.id][0].slice(4);
			}

			else {
				if(node.classList.contains("selected-opt")){
					node.classList.remove("selected-opt");
				}
			}
		}

		openAIMenu();
	}

	return {
		//How to Play button:
		createFloatingWindow, //function
		closeHowToPlayBtn, //function

		//History
		_pushDataToHistoryObj, //Public while testing. //function
		expandHistoryContent, //function
		displayHistoryItems, //function
		openCloseInputDiv, //function

		//Gameboard
			//Users
		usersDisplay, //const
		openCloseInputDiv, //function

			//Board
		displayBoard, //function
		squares, //const
		createPlayers,
		markSquare, //function

			//AI
		AIButton, //const
		openAIMenu, //function
		difficultyOpts, //nodelist
		selectedOpt, //event handler
	}

})();



/*V________TESTING_________V*/
DOMFuncs._pushDataToHistoryObj();
DOMFuncs._pushDataToHistoryObj();
DOMFuncs._pushDataToHistoryObj();
DOMFuncs._pushDataToHistoryObj();
DOMFuncs.displayBoard(gameFlow.board);

/*^________TESTING_________^*/


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
		//Users
DOMFuncs.usersDisplay.forEach(display => display.addEventListener("click", DOMFuncs.openCloseInputDiv));

		//Board
DOMFuncs.squares.forEach(square => square.addEventListener("click", DOMFuncs.markSquare));

		//AI
DOMFuncs.AIButton.addEventListener("click", DOMFuncs.openAIMenu);
DOMFuncs.difficultyOpts.forEach(option => option.addEventListener("click", DOMFuncs.selectedOpt));

//Calling functions
DOMFuncs.displayHistoryItems();
DOMFuncs.createPlayers(gameFlow.players, DOMFuncs.usersDisplay);