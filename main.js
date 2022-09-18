/* TODO:
    Save
        - auto save
    Export
        - add character stats to export data
        - add character info to export data
        - add inventory to export data
        - add settings to export data (?)
    Options
        - add Font, Font Size, export Save options
        - add "Are you sure?" screen, Y/N should return true/false
        - trigger "Are you sure?" for load/save/export/load from textarea
    Stats
        - add name and pronouns to sidebar / add input to change
        How will actions work? How will the calendar/timekeeping work?
        - change updateStatDisplay() so that stat names are interchangable
    Inventory 
        - add inventory box
    Library
        - change how stats are pulled, currently pull from local which isnt saved after every choice.
    NPC 
        - figure out npc affinity behavior
    Other 
        - Expand Key Events Idea
        - Implement calendar
*/
/* IDEAS:
    - Personality options that change choices or change how characters respond to you.
*/
/*  COMPLETED TASKS
    Save 
        - add saving (local storage) (6/20)
        - add save confirmation modal (6/20)
    Export
        - worked on encoding for export save (7/7)
        - added export text box/fixed formatting for modals (7/7)
        - added export function (8/29)
    Load 
        - add loading from local storage (6/20)
        - add loading from file to textarea (9/1)
        - load local button added to Options modal (9/1)
    Options 
        - add Wipe Save button (6/20)
    Inventory
        - added inventory variable + functions to pull information for use in Library objects (9/16)
        - expanded executeMessage function to modify stats and add/remove from inv (9/18)
    Log Display 
        - add choice picked to log display w/o adding it to log variable (6/19)
        - reset display function (6/20)
    Library
        - link main.js to messageArchive.js so that list of messages doesn't need to be in main file (6/22)
        - added modifyStat key to library objects for handling stats & inv (9/18)
    Other
        - updated game data variables to have defaults that load when there is no local storage (6/20)
        - moved const value defaults to messageArchive.js & added local storage functions to share across files (7/1)
        - accordian for load export test closes when option modal is closed (7/7)
        - added string breaker (7/7)
        - changed log to a list of messageIDs & updated code that interacted w/ it (8/29)
        - added getStoryObj(msgID) function to retrieve object form Libary (8/29)
        - organized & created variables for retrieving DOM elements (9/1)
        - added scroll to bottom button for scroll bar (9/1)
*/


import { Library } from './messageArchive.js';
import { Items } from './messageArchive.js';
import { setLocal } from './messageArchive.js';
import { getLocal } from './messageArchive.js';

var settings;
var log;
var stats;
var charInfo;
var inv;
const choiceList = ["choice1", "choice2", "choice3", "choice4"];

////////DOM VARIABLES////////
const board = document.getElementById("board");
const board_box = document.getElementById("board-box");
const board_list = document.getElementById("board-log");
const board_scroll = document.getElementById("scrollToBottom");
const choicebox = document.getElementById("choice-box");

const stat_calendar = document.getElementById("calendar");
const stat_actions = document.getElementById("actions");
const stat_health = document.getElementById("health");
const stat_sanity = document.getElementById("sanity");
const sidebar_save = document.getElementById("saveBtn");
const sidebar_options = document.getElementById("optionsBtn");

const modal_save = document.getElementsByClassName("saveModal")[0];
const modal_options = document.getElementsByClassName("optionsModal")[0];
const modal_saveClose = document.getElementsByClassName("close")[1];
const modal_optionsClose = document.getElementsByClassName("close")[0];

const tablinks_Arr = document.getElementsByClassName("tablinks");
const tabContent_Arr = document.getElementsByClassName("tabcontent");

const data_loadLocal = document.getElementById("loadLocal");
const data_wipeGame = document.getElementById("wipeGame");
const data_fileInput = document.getElementById('fileInput');
const data_filePreview = document.getElementById('filePreview');
const data_textarea = document.getElementById('textArea');
const data_exportLog = document.getElementById("data_Export");
const data_loadLog = document.getElementById("data_Load");

////////EVENTLISTENERS////////
board_scroll.addEventListener("click", () => scrollToBottom(board_box));
for(let i = 0; i < choiceList.length; i++) {
    let listItem = document.createElement('l');
    let button = document.createElement('button');
    button.id = choiceList[i];
    button.disabled = true;
    button.classList.add("btn","choice-btn");
    button.innerHTML = choiceList[i];
    button.addEventListener("click", (event) => {executeMessage(event.target.id)});

    listItem.appendChild(button);
    choicebox.firstElementChild.appendChild(listItem);
}

sidebar_save.addEventListener("click", () => {
    //add confirmation
    saveGame();
    modal_save.style.display = "block";
});
sidebar_options.addEventListener("click", () => {
    //add confirmation
    modal_options.style.display = "block"
});

window.addEventListener("click", (event)=>{
    if (event.target == modal_options) {
        modal_options.style.display = "none";
        for (let i = 0; i < acc.length; i++) {
            if (acc[i].nextElementSibling.style.maxHeight) {
                acc[i].nextElementSibling.style.maxHeight = null;
            }
          } 
    }
    if (event.target == modal_save) {
        modal_save.style.display = "none";
    }
});
modal_saveClose.addEventListener("click", () => modal_save.style.display = "none");
modal_optionsClose.addEventListener("click", () => modal_options.style.display = "none");

for (let i = 0; i < tablinks_Arr.length; i++) {
    tablinks_Arr[i].addEventListener("click", (event) => {openTab(event,"_"+event.target.id)});
}

data_loadLocal.addEventListener("click", () => loadGame());
data_wipeGame.addEventListener("click", () => wipeGame());
data_exportLog.addEventListener("click", () => data_textarea.innerHTML = exportGame());
//input.style.opacity = 0; //figure out how to style later
data_fileInput.addEventListener("change", () => {updateFileInput()});

////////UTILITY FUNCTIONS////////
function scrollToBottom(scrollBox) {
    scrollBox.scrollTop = scrollBox.scrollHeight;
}
function getObj(list, _id) { //used to retrieve messages or inventory items
    let objIndex = list.findIndex( function(element) {
        return element.id === _id;
    });

    return list[objIndex];
}
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

 /*Save & Load Game*/

function saveGame() { //Save to local storage
    // Save log, stats, npcs & character info lists
    setLocal(log, "logData"); //save entire log to local storage under "logData" key
    setLocal(stats, "statData");
    setLocal(charInfo, "charData");
    setLocal(inv, "invData");
}
function exportGame() {
    saveGame(); // save to local first, then export
    return getLocal("logData");
}

function loadFromTextArea() {
    //load from file

    let exampleLog = ["1", "2"]; //replace with real log & code to upload

    //if (validateLog(exampleLog)) //check if data is valid
    //{
    //    saveGame(); //make sure to save to local after loading from file
    //}
}

function updateFileInput() {
    while(data_filePreview.firstChild) {
        data_filePreview.removeChild(data_filePreview.firstChild);
      }

    var files = data_fileInput.files;
    var para = document.createElement('p');
    if (files.length == 0) {
        para.textContent = 'No file currently selected.';
        data_filePreview.appendChild(para);
    } else {
        var file = files[0];
        if(validateFile(file)){ //validate file type & populate contents into text area
            let reader = new FileReader();
            reader.addEventListener("load", () =>{
                data_textarea.innerText = reader.result;
            });
            reader.onerror = (e) => alert(e.target.error.name);
            reader.readAsText(file);
            
            para.textContent = file.name; //TODO: returning 'file is undefined' when submitting .txt
            data_filePreview.appendChild(para);

        } else { //invalid file type
            para.textContent = `Error, ${file.name}: Not a valid file type. Update your selection.`;
            data_filePreview.appendChild(para);
        }
    }
}

function loadGame() { //resetDisplay then load form local storage or defaults
    resetDisplay();

    let localLog = getLocal("logData");
    let localStat = getLocal("statData");
    let localChar = getLocal("charData");
    let localInv = getLocal("invData");

    //load stat from local storage
    log = localLog;
    stats = localStat;
    charInfo = localChar;
    inv = localInv;

    updateStatDisplay(stats);
    //TODO: ADD INVENTORY TO DISPLAY TOO
    addToDisplay( getObj(Library, log[log.length-1]).message, "msg-li" );
    setUpChoices( getObj(Library, log[log.length-1]) );
}

function validateFile(file) {
    if (file.type == "text/plain") return true;
    return false;
}
function validateLog(_log) {
    let msg;
    let msg_next;

    for (let i = log.length; i > 0; i--) {
        if (i-1 > 0 )
        {
            const element = log[i];
            msg = getObj(Library, element);
            msg_next = getObj(Library, log[i-1]);
            let vChoice = false;

            choiceList.forEach(choice => {
                if (msg[choice] === undefined || msg[choice].nextMsgId != msg_next.id) {
                    //undefined or no match
                    Continue;
                } else {
                    //choice match
                    vChoice = true;
                    Continue;
                }
            });
            if (vChoice == false) {
                console.log ("INVALID LOG");
                console.log(msg);
                console.log(msg_next);
                return false;
            }
        }
    }
    return true;
}

function wipeGame() { //set local storage to defaults
    setLocal("logData", window.localStorage.getItem("logDefault"));
    setLocal("statData", window.localStorage.getItem("statDefault"));
    setLocal("charData", window.localStorage.getItem("charDefault"));
    setLocal("invData", window.localStorage.getItem("invDefault"));

    loadGame(); //resets displays to default info
}

/*Game functions*/

function resetDisplay() { //Delete all items with the "board-li" class
    while(board_list.firstChild) {
        board_list.removeChild(board_list.firstChild);
    }
}
function updateStatDisplay(statObj) { //updates display on sidebar to match stats
    //TODO: stat names should be interchangable
    //stat_calendar.innerHTML =  //implement calendar stat
    stat_actions.innerHTML = statObj.Actions;
    stat_health.innerHTML = statObj.Health;
    stat_sanity.innerHTML = statObj.Sanity;
}
function addToDisplay(content, classToAssign) {
    const element = document.createElement("li");
    element.className = classToAssign + " board-li"
    element.innerHTML = content;
    board_list.appendChild(element);

    //Scroll to bottom
    scrollToBottom(board_box);
}
function setUpChoices(storyObj) {
    //cycle through choiceList, hide/disable choices that are undefined
    choiceList.forEach(choice => {
        let element = document.getElementById(choice);
        if (storyObj[choice] === undefined) { //no choice defined
            element.disabled = true;
            element.classList.add("hidden");
        } else { //choice defined
            element.disabled = false;
            element.classList.remove("hidden");
            element.innerHTML = storyObj[choice].buttonText;
        }
    });
}
function executeMessage(choiceString) {
    //add the clicked choice to board box w/ the ch-li class name
    let choiceTxt = document.getElementById(choiceString).innerHTML;
    addToDisplay("> "+ choiceTxt, "ch-li");

    let lastMsg = getObj(Library, log[log.length-1]);
    let nextMsg = getObj(Library, lastMsg[choiceString].nextMsgId);
    let modifyStat = nextMsg.modifyStat;
    
    if (modifyStat) {
        for (let i = 0; i < modifyStat.length; i++) {
            const element = modifyStat[i];
            let key = element[0];
            let value = element[1];
            
            if (key == "Inv") { //add inventory item
                inv.push(value);
            } else if (key == "InvRemove") { //remove inventory item
                let index = inv.indexOf(value);
                inv.splice(index, 1);
            } else { // Otherwise, add value to indicated stat
                stats[key] += value;
            }
        }
    }

    log.push(nextMsg.id);
    addToDisplay(nextMsg.message, "msg-li"); //add message to board box from updated log
    setUpChoices(nextMsg);
}

function openTab(event, tabId) {
    var i;
    for (i = 0; i < tabContent_Arr.length; i++) {
      tabContent_Arr[i].style.display = "none";
    }
    for (i = 0; i < tablinks_Arr.length; i++) {
      tablinks_Arr[i].className = tablinks_Arr[i].className.replace(" active", "");
    }
    document.getElementById(tabId).style.display = "block";
    event.currentTarget.className += " active";
}

//code for accordians
var acc = document.getElementsByClassName("accordion");
//useful for assigning multiple accordions this eventlistener
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

loadGame();
