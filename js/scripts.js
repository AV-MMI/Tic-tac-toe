/*LOCAL VARIABLES AND FUNCTIONS*/
	/*How to Play button*/

	/*History*/
const historyObj = {}
let dataId = 0;

function currDate(){
	const date = new Date();
	const currDay = "0" + date.getDate();
	const currMonth = "0" + (date.getMonth() + 1);
	const currYear = date.getFullYear();
	const second = date.getSeconds();

	const dateFormat = `${currDay} /- ${currMonth} /- ${currYear}`

	return dateFormat;
};

/*DOOM VARIABLES AND EVENT HANDLERS*/

	/*How to Play button*/
const howToPlayCont = document.querySelector("#how-to-play--cont");
const howToPlayBtn = document.querySelector("#how-to-play--btn");

			/*

const floatingWindowBg = document.querySelector("#floating-window--bg");
const floatingWindow = document.querySelector("#floating-window");
const closeFloatingWindowBtn = document.querySelector("#close-floating-window--btn");

closeFloatingWindowBtn.addEventListener("click", closeHTPBtn);
*/


	/*Histoy*/
const historyFold = document.querySelector("#history-fold");
const historyContent = document.querySelector("#history-Content");

/*EVENT HANDLERS FUNCTIONS*/
	/*How to Play button*/
function createFloatingWindow(){
	const floatingWindowBg = document.createElement("div");
	const floatingWindow = document.createElement("div");
	const closeFloatingWindowBtn = document.createElement("button");
	const floatingWindowContent = document.createElement("button");

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
	floatingWindowContent.classList("floating-window-content");

	//Appending it to our HowToPlayCont

}
	/*
function closeHTPBtn(e){
	howToPlayCont.removeChild(floatingWindowBg);
	howToPlayCont.removeChild(floatingWindow);
}
*/
	/*History*/
function pushDataToHistoryObj(){
	let historyData = {
		date: currDate(),
		name: "Jane Doe",
	};

	historyObj[dataId] = historyData;
	dataId++;
}

function log(e){
	e.target.style.border = "1px dotted red";
	console.log(historyObj);
}