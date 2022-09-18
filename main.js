import { Library } from './messageArchive.js';
import { Items } from './messageArchive.js';
import { Choices } from './messageArchive.js';

import { setLocal } from './messageArchive.js';
import { getLocal } from './messageArchive.js';
import { getObj } from './messageArchive.js';

var settings;
var log;
var stats;
var charInfo;
var inv;

////////DOM VARIABLES////////
const board =               document.getElementById("board");
const board_box =           document.getElementById("board-box");
const board_list =          document.getElementById("board-log");
const board_scroll =        document.getElementById("scrollToBottom");
const choicebox =           document.getElementById("choice-box");

const stat_calendar =       document.getElementById("calendar");
const stat_actions =        document.getElementById("actions");
const stat_health =         document.getElementById("health");
const stat_sanity =         document.getElementById("sanity");
const sidebar_save =        document.getElementById("saveBtn");
const sidebar_options =     document.getElementById("optionsBtn");

const modal_save =          document.getElementsByClassName("saveModal")[0];
const modal_options =       document.getElementsByClassName("optionsModal")[0];
const modal_saveClose =     document.getElementsByClassName("close")[1];

const tablinks_Arr =        document.getElementsByClassName("tablinks");
const tabContent_Arr =      document.getElementsByClassName("tabcontent");

const data_loadLocal =      document.getElementById("loadLocal");
const data_wipeGame =       document.getElementById("wipeGame");
const data_fileInput =      document.getElementById('fileInput');
const data_filePreview =    document.getElementById('filePreview');
const data_textarea =       document.getElementById('textArea');
const data_exportLog =      document.getElementById("data_Export");
const data_loadLog =        document.getElementById("data_Load");

////////EVENTLISTENERS////////
board_scroll.addEventListener("click", () => scrollToBottom(board_box));
for(let i = 0; i < Choices.length; i++) {
    let listItem = document.createElement('l');
    let button = document.createElement('button');

    button.id = Choices[i];
    button.disabled = true;
    button.classList.add("btn","choice-btn");
    button.innerHTML = Choices[i];
    button.addEventListener("click", (event) => {executeMessage(event.target.id)});

    listItem.appendChild(button);
    choicebox.firstElementChild.appendChild(listItem);
}

sidebar_save.addEventListener("click", () => {
    //TODO: add confirmation
    saveGame();
    modal_save.style.display = "block";
});
sidebar_options.addEventListener("click", () => {
    //TODO: add confirmation
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
//modal_confirmClose.addEventListener("click", () => modal_confirm.style.display = "none");

for (let i = 0; i < tablinks_Arr.length; i++) {
    tablinks_Arr[i].addEventListener("click", (event) => {openTab(event,"_"+event.target.id)});
}

data_loadLocal.addEventListener("click", () => triggerConfirm(loadGame, 'Are you sure you want to load? This will overwrite current progress.'));
data_wipeGame.addEventListener("click", () => triggerConfirm(wipeGame, 'Are you sure you want to wipe your save data?'));
data_exportLog.addEventListener("click", () => data_textarea.innerHTML = exportGame());
//input.style.opacity = 0; //figure out how to style later
data_fileInput.addEventListener("change", () => updateFileInput());

////////UTILITY FUNCTIONS////////
function scrollToBottom(scrollBox) {
    scrollBox.scrollTop = scrollBox.scrollHeight;
}

function validateFile(file) {
    if (file.type == "text/plain") return true;
    return false;
}

function triggerConfirm(func, message) {
    if (confirm(message)) {
        func()
    }
}

var breakString_SPC = (str, limit) => { //break on spaces
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

 /**
  * Save log, stats, npcs & character info lists to local storage
  */
function saveGame() {
    setLocal(log,       "logData");
    setLocal(stats,     "statData");
    setLocal(charInfo,  "charData");
    setLocal(inv,       "invData");
}
/**
 * resetDisplay then load form local storage or defaults
 */
function loadGame() {
    resetDisplay();

    let localLog =  getLocal("logData");
    let localStat = getLocal("statData");
    let localChar = getLocal("charData");
    let localInv =  getLocal("invData");

    //load lists from local storage
    log =       localLog;
    stats =     localStat;
    charInfo =  localChar;
    inv =       localInv;

    let lastLog = log[log.length-1];

    updateStatDisplay(stats);
    //TODO: ADD INVENTORY TO DISPLAY TOO
    addToDisplay( getObj(Library, lastLog).message, "msg-li" );
    setUpChoices( getObj(Library, lastLog) );
}

function loadFromTextArea() {
    //load from file here
    let exampleLog = ["1", "2"]; //replace with real log & code to upload
    //if (validateLog(exampleLog)) //check if data is valid
    //{
    //    saveGame(); //make sure to save to local after loading from file
    //}
}

function exportGame() {
    saveGame(); // save to local first, then export
    return getLocal("logData");
}

function updateFileInput() {
    while(data_filePreview.firstChild) {
        data_filePreview.removeChild(data_filePreview.firstChild);
      }

    const files =   data_fileInput.files;
    const para =    document.createElement('p');

    if (files.length == 0) {
        para.textContent = 'No file currently selected.';
        data_filePreview.appendChild(para);
    } else {
        const file = files[0];

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
function validateLog(_log) {
    let message;
    let next;

    for (let i = 0; i < _log.length; i++) {
        if (i+1 < _log.length)
        {
            message = getObj(Library, _log[i]);
            next = getObj(Library, _log[i+1]);
            let vChoice = false;

            Choices.forEach(choice => {
                if (message[choice].nextMsgId == next) {
                    vChoice = true;
                }
            });

            if (vChoice == false) {
                console.log ("INVALID LOG");
                console.log("Message ID: " + message);
                console.log("Next message ID: " + next);
                return false;
            }
        }
    }
    return true;
}

function wipeGame() { //set local storage to defaults
    setLocal("logData",     window.localStorage.getItem("logDefault"));
    setLocal("statData",    window.localStorage.getItem("statDefault"));
    setLocal("charData",    window.localStorage.getItem("charDefault"));
    setLocal("invData",     window.localStorage.getItem("invDefault"));

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
    Choices.forEach(choice => {
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
    const choiceTxt = document.getElementById(choiceString).innerHTML;
    addToDisplay("> "+ choiceTxt, "ch-li");

    let last = getObj(Library, log[log.length-1]);
    let next = getObj(Library, last[choiceString].nextMsgId);
    let modifyStat = next.modifyStat;
    
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

    log.push(next.id);
    addToDisplay(next.message, "msg-li"); //add message to board box from updated log
    setUpChoices(next);
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
