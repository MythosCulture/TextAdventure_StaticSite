//TODO: 
//  Save - add saving (export)
//      -auto save
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
        - wrote export function (7/1)
        - worked on encoding for export save (7/7)
        - added export text box/fixed formatting for modals (7/7)
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
        - moved const value defaults to messageArchive.js & added local storage functions to share across files (7/1)
        - accordian for load export test closes when option modal is closed (7/7)
        - added string breaker (7/7)
*/


import { Library } from './messageArchive.js';
import { setLocal } from './messageArchive.js';
import { getLocal } from './messageArchive.js';

var settings;
var log;
var stats;
var charInfo;

function scrollToBottom(scrollBox_Element) {
    let scrollBox = scrollBox_Element;
    scrollBox.scrollTop = scrollBox.scrollHeight;
}

/*options menu function*/
var export_btn = document.getElementById("exportGame");
export_btn.onclick = function() {
    document.getElementById("exportTxt").innerHTML = exportGame();
}

var opt_modal = document.getElementsByClassName("optionsModal")[0];
var opt_btn = document.getElementById("optionsBtn"); //get options button
var opt_close = document.getElementsByClassName("close")[0]; //get options close button
opt_btn.onclick = function() {
    opt_modal.style.display = "block";
}
opt_close.onclick = function() {
    opt_modal.style.display = "none";
}
var save_modal = document.getElementsByClassName("saveModal")[0]
var save_btn = document.getElementById("saveBtn"); //get save button
var save_close = document.getElementsByClassName("close")[1]; //get save close button
save_btn.onclick = function() {
    //on save button click
    saveGame();
    save_modal.style.display = "block";
}
save_close.onclick = function() {
    save_modal.style.display = "none";
}
window.onclick = function(event) { //close modals when clicking outside the box
    if (event.target == opt_modal) {
        opt_modal.style.display = "none";
        for (let i = 0; i < acc.length; i++) {
            if (acc[i].nextElementSibling.style.maxHeight) {
                acc[i].nextElementSibling.style.maxHeight = null;
            }
          } 
    }
    if (event.target == save_modal) {
        save_modal.style.display = "none";
    }
}

var acc = document.getElementsByClassName("accordion");
//var i;
for (let i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {

    this.classList.toggle("active");

    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
    } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
} 


/*Save & Load Game*/

//break on spaces
var breakString_SPC = (str, limit) => {
    let brokenString = '';
    for(let i = 0, count = 0; i < str.length; i++){

        if(str[i]===' ') {
            var j = 1;
            while (str[i+j] != ' ') {
                j++;
            }
            
            if (count + j > limit) {
                count = 0;
                brokenString += '\n';
            } else {
                count++;
                brokenString += str[i];
            }
        } else {
            count++;
            brokenString += str[i];
        }
    }
    return brokenString;
 }
var breakString = (str, limit) => {
    let brokenString = '';
    for(let i = 0, count = 0; i < str.length; i++){

        if(count == limit) {
            count = 0;
            brokenString += '<br>';
        } else {
            count++;
            brokenString += str[i];
        }
    }
    return brokenString;
 }

function saveGame() { //Save to local storage
    // Save log, stats, npcs & character info lists
    //  - Only save last log message?
    setLocal(log, "logData"); //save entire log to local storage under "logData" key
    setLocal(stats, "statData");
    setLocal(charInfo, "charData");
}
function exportGame(){
    saveGame(); // save to local first, then export
    //export as encoded string, should be able to paste this somewhere

    var templog = getLocal("logData");
    var tempexport = [];

    //adds msgID and next msgID (if avalible) to export
    //prevents massive export text
    for (let i = 0; i < templog.length; i++) { 
        var element = templog[i];
        tempexport.push(element.messageId);

        /* frankly, dont know why i put this here
        if (i+1 < templog.length) {
            var element2 = templog[i+1];
            tempexport.push(element2.messageId);
        }
        */
    }

    //var result = breakString(btoa(tempexport), 40);
    //var result = breakString(tempexport, 20);
    var result = btoa(tempexport);

    //get the log, only save the msg ID and next msg IDs
    return result; //obfuscate the log
}
//encode function (str)
//  var i = 0;
//  var tempstr = str[0]
//  Idk what to do from here tbh

function loadFromFile(){
    //load from file
    //check if data is valid
    saveGame(); //make sure to save to local after loading from file
}

function loadGame(){ //resetDisplay then load form local storage or defaults
    resetDisplay();

    let localLog = getLocal("logData");
    let localStat = getLocal("statData");
    let localChar = getLocal("charData");

    //load stat from local storage
    log = localLog;
    stats = localStat;
    charInfo = localChar;

    updateStatDisplay(stats);
    addToDisplay(log[log.length-1].message, "msg-li");
    setUpChoices(log[log.length-1]);
}
var wipeGameBtn = document.getElementById("wipeGame");
wipeGameBtn.onclick = function() {
    wipeGame();
}
function wipeGame(){ //set local storage to defaults
    setLocal("logData", window.localStorage.getItem("logDefault"));
    setLocal("statData", window.localStorage.getItem("statDefault"));
    setLocal("charData", window.localStorage.getItem("charDefault"));

    loadGame(); //resets displays to default info
}

/*Game functions*/

function resetDisplay(){ //Delete all items with the "board-li" class
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
    let libIndex = Library.findIndex( function(element) {
        return element.messageId === lastLogItem_nextMsgId;
    });

    log.push(Library[libIndex]);
    addToDisplay(log[log.length-1].message, "msg-li"); //add message to board box from updated log
    setUpChoices(Library[libIndex]);
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
