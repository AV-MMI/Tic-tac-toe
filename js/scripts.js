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
const howToPlayBtn = document.querySelector("#how-to-play--btn");

	/*Histoy*/
const historyFold = document.querySelector("#history-fold");
const historyContent = document.querySelector("#history-Content");
testBtn.addEventListener("click", testing);
logBtn.addEventListener("click", log)

/*EVENT HANDLERS FUNCTIONS*/
	/*How to Play button*/

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