//TODO: 
//  Save - add saving (export)
//  Load - add loading from file
//  Options - add Font, Font Size, export Save options
//          - add "Are you sure?" screen for delete save
//  Stats - add name and pronouns to sidebar / add input to change
//          How will actions work? How will the calendar/timekeeping work?
//  Inventory - add inventory box
//              add variable with preset items & function that allows user to add to inventory
//  NPC - figure out npc affinity behavior
//  Other - add scroll to bottom function for scroll bar

// IDEAS:
//  Personality options that change choices or change how characters respond to you.
//  
/*  COMPLETED TASKS
    Save 
        - add saving (local storage) (6/20)
        - add save confirmation modal (6/20)
    Load 
        - add loading from local storage (6/20)
    Options 
        - add Wipe Save button (6/20)
    Log Display 
        - add choice picked to log display w/o adding it to log variable (6/19)
        - reset display function (6/20)
    Library
        - link main.js to messageArchive.js so that list of messages doesn't need to be in main file (6/22)
    Other
        - updated game data variables to have defaults that load when there is no local storage (6/20)
*/


import { Library } from './messageArchive.js';

const default_settings = {};
const default_CharInfo = {Name: "No Name Given", Pronouns: {pr1: "he/she/they", pr2:"him/her/them", pr3:"his/hers/theirs" } };
const default_Stats = {Health:100, Sanity:100, Inventory:[], Actions:10};
const default_log = [
    {
        messageId: "P0_000",
        message: "Opening message. Put game information/warnings here.",
        choice1: { buttonText:"Continue", nextMsgId:"P0_001"}
    }
];
var settings;
var log;
var stats;
var charInfo;

const npcList = [
    {
        Name: "NPC Name",
        Affinity: 0
    },
];
function scrollToBottom(scrollBox_Element) {
    let scrollBox = scrollBox_Element;
    scrollBox.scrollTop = scrollBox.scrollHeight;
}

window.onclick = function(event) { //close modals when clicking outside the box
    if (event.target == optModal) {
        optModal.style.display = "none";
    }
    if (event.target == saveModal) {
        saveModal.style.display = "none";
    }
}

/*options menu*/
var optModal = document.getElementsByClassName("optionsModal")[0]; //get options modal element
var optBtn = document.getElementById("optionsBtn"); //get options button
var closeOpt = document.getElementsByClassName("close")[0]; //get options close button
optBtn.onclick = function() {
    optModal.style.display = "block";
}
closeOpt.onclick = function() {
    optModal.style.display = "none";
}

/*Save & Load Game*/
var saveModal = document.getElementsByClassName("saveModal")[0];
var saveBtn = document.getElementById("saveBtn"); //get save button
var closeSave = document.getElementsByClassName("close")[1]; //get save close button
saveBtn.onclick = function() {
    //on save button click
    saveGame();
    saveModal.style.display = "block";
}
closeSave.onclick = function() {
    saveModal.style.display = "none";
}
function saveGame() { //Save to local storage
    // Save log, stats, npcs & character info lists
    //  - Only save last log message?
    window.localStorage.setItem("logData", JSON.stringify(log)); //save entire log to local storage under "logData" key
    window.localStorage.setItem("statData", JSON.stringify(stats));
    window.localStorage.setItem("charData", JSON.stringify(charInfo)); 
}

function exportGame(){
    saveGame(); // save to local first, then export
    //export as .txt in JSON format
}

function loadFromFile(){
    //load from file
    //check if data is valid
    saveGame(); //make sure to save to local after loading from file
}

function loadGame(){ //resetDisplay then load form local storage or defaults
    resetDisplay();

    let localLog = JSON.parse(window.localStorage.getItem("logData"));
    let localStat = JSON.parse(window.localStorage.getItem("statData"));
    let localChar = JSON.parse(window.localStorage.getItem("charData"));

    if(localStat != null && localLog != null && localChar != null) { //load stat from local storage
        log = localLog;
        stats = localStat;
        charInfo = localChar;
    } else { //otherwise use defaults
        log = default_log
        stats = default_Stats;
        charInfo = default_CharInfo;
    }

    updateStatDisplay(stats);
    addToDisplay(log[log.length-1].message, "msg-li");
    setUpChoices(log[log.length-1]);
}
var wipeGameBtn = document.getElementById("wipeGame");
wipeGameBtn.onclick = function() {
    wipeGame();
}
function wipeGame(){
    window.localStorage.removeItem("logData");
    window.localStorage.removeItem("statData");
    window.localStorage.removeItem("charData");

    loadGame(); //resets displays to default info
}

/*Game functions*/

function resetDisplay(){
    var boardLog_ListItems = document.getElementsByClassName("board-li");
    var listLength = boardLog_ListItems.length;
    for (let i = 0; i < listLength; i++) {
        //deleting an item shrinks list by 1, causing index 1 to become index 0
        boardLog_ListItems[0].remove();
    }
}
function updateStatDisplay(statObj) { //updates display on sidebar to match stats
    //document.getElementById("calendar").innerHTML =  //implement calendar stat
    document.getElementById("actions").innerHTML = statObj.Actions;
    document.getElementById("health").innerHTML = statObj.Health;
    document.getElementById("sanity").innerHTML = statObj.Sanity;
}
function addToDisplay(text, classToAssign) {
    const element = document.createElement("li");
    element.className = classToAssign + " board-li"
    element.innerHTML = text;
    document.getElementsByClassName("board-log")[0].appendChild(element);

    //Scroll to bottom
    scrollToBottom(document.getElementsByClassName("board-box")[0]);
}
function executeNextMessage(choiceString) {
    //add the clicked choice to board box w/ the ch-li class name
    let choiceTxt = document.getElementById(choiceString).innerHTML;
    addToDisplay("> "+ choiceTxt, "ch-li");

    let lastLogItem = log[log.length-1];
    let lastLogItem_nextMsgId = lastLogItem[choiceString].nextMsgId;

    //find the index of message being pointed to in storyObjList and append to the log
    let storyIndex = Library.findIndex( function(element) {
        return element.messageId === lastLogItem_nextMsgId;
    });

    log.push(Library[storyIndex]);
    addToDisplay(log[log.length-1].message, "msg-li"); //add message to board box from updated log
    setUpChoices(Library[storyIndex]);
}
function setUpChoices(storyObj) {
    const choiceList = ["choice1", "choice2", "choice3", "choice4"];

    //cycle through choiceList, hide/disable choices that are undefined
    //defined choices are assigned event listener
    choiceList.forEach(choice => {
        let element = document.getElementById(choice);
        if (storyObj[choice] === undefined) {
            //no choice defined
            element.disabled=true;
            element.classList.add("hidden");
        } else {
            //choice defined
            element.disabled=false;
            element.classList.remove("hidden");
            element.innerHTML = storyObj[choice].buttonText;
        }
    });
}

/*Actions on start up*/
loadGame();
document.getElementById("choice1").addEventListener("click", () => executeNextMessage("choice1"));
document.getElementById("choice2").addEventListener("click", () => executeNextMessage("choice2"));
document.getElementById("choice3").addEventListener("click", () => executeNextMessage("choice3"));
document.getElementById("choice4").addEventListener("click", () => executeNextMessage("choice4"));

//Test libary, delete later
const xLibrary = [
    {
        messageId: "P0_000",
        message: "Opening message. Put game information/warnings here.",
        choice1: { buttonText:"Continue", nextMsgId:"P0_001"}
    },
    {
        messageId: "P0_001",
        message: "This is a test message." +
        "<br> Pick a favorite color.",
        choice1: { buttonText:"Red", nextMsgId:"P1_000"}, //Hector route
        choice2: { buttonText:"Blue", nextMsgId:"P2_000"}, //Opocht & Pequod route
        choice3: { buttonText:"Green", nextMsgId:"P3_000"}, //Vince & Hugo route
    },
    {
        messageId: "P1_000",
        message: "Test Route 1",
        choice1: { buttonText:"Go back", nextMsgId:"P0_001"},
        choice2: stats.Health==100?{ buttonText:"Health at 100", nextMsgId:"P0_000"}:undefined
    },
    {
        messageId: "P2_000",
        message: "Test Route 2",
        choice1: { buttonText:"Go back", nextMsgId:"P0_001"},
    },
    {
        messageId: "P3_000",
        message: "Test Route 3",
        choice1: { buttonText:"Go back", nextMsgId:"P0_001"},
    },
];
