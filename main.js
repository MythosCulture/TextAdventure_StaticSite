import { Library } from './gameObjects.js';
import { choices } from './gameObjects.js';
import { playerObject } from './gameObjects.js';

import { setLocal } from './gameObjects.js';
import { getLocal } from './gameObjects.js';

let player = playerObject;

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
const modal_optionsClose =  document.getElementsByClassName("close")[0];

const tablinks_Arr =        document.getElementsByClassName("tablinks");
const tabContent_Arr =      document.getElementsByClassName("tabcontent");

const loadLocal =           document.getElementById("loadLocal");
const wipeGameBtn =            document.getElementById("wipeGame");
const fileInput =           document.getElementById('fileInput');
const filePreview =         document.getElementById('filePreview');
const dataTextArea =        document.getElementById('textArea');
const exportGameBtn =          document.getElementById("data_Export");
const loadExternal =        document.getElementById("data_Load");

////////EVENTLISTENERS////////
board_scroll.addEventListener("click", () => scrollToBottom(board_box));
for(let i = 0; i < choices.length; i++) {
    let listItem = document.createElement('l');
    let button = document.createElement('button');

    button.id = choices[i];
    button.disabled = true;
    button.classList.add("btn","choice-btn");
    button.innerHTML = choices[i];
    button.addEventListener("click", (event) => {executeNextPrompt(event.target.id)});

    listItem.appendChild(button);
    choicebox.firstElementChild.appendChild(listItem);
}

sidebar_save.addEventListener("click", () => {
    //TODO: add confirmation
    saveGame();
    modal_save.style.display = "block";
});
sidebar_options.addEventListener("click", () => {
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
    tablinks_Arr[i].addEventListener("click", (event) => {
        openTab(event,"_" + event.target.id)
    });
}

loadLocal.addEventListener("click", () => triggerConfirm(loadGame, 'Are you sure you want to load? This will overwrite current progress.'));
wipeGameBtn.addEventListener("click", () => triggerConfirm(wipeGame, 'Are you sure you want to wipe your save data?'));
exportGameBtn.addEventListener("click", () => dataTextArea.innerHTML = exportGame());
//input.style.opacity = 0; //figure out how to style later
fileInput.addEventListener("change", () => updateFileInput());

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

function getLastPrompt() {
    return Library.getPrompt(player.log[player.log.length - 1].id);
}

function possibleFunction(object) {
    if(object instanceof Function) return object(player);
    return object;
}

function saveGame() {
    setLocal(player, "playerSave");
}

/**
 * resetDisplay then load form local storage or defaults
 */
function loadGame() {
    resetDisplay();

    //load object values from local storage
    player = getLocal("playerSave");
    console.log(player); //delete later

    updateStatDisplay(player);
    //TODO: ADD INVENTORY UPDATING
    addToDisplay( player.log[player.log.length - 1].message, "msg-li" );
    setUpChoices( getLastPrompt());
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
    saveGame(); 
    //TODO: Prints "[Object object]" need to update how exporting works anyways
    return getLocal("playerSave");
}

function updateFileInput() {
    while(filePreview.firstChild) {
        filePreview.removeChild(filePreview.firstChild);
      }

    const files =   fileInput.files;
    const para =    document.createElement('p');

    if (files.length === 0) {
        para.textContent = 'No file currently selected.';
        filePreview.appendChild(para);
    } else {
        const file = files[0];

        if(validateFile(file)){ //validate file type & populate contents into text area
            let reader = new FileReader();
            reader.addEventListener("load", () =>{
                dataTextArea.innerText = reader.result;
            });
            reader.onerror = (e) => alert(e.target.error.name);
            reader.readAsText(file);
            
            para.textContent = file.name; //TODO: returning 'file is undefined' when submitting .txt
            filePreview.appendChild(para);
        } else { //invalid file type
            para.textContent = `Error, ${file.name}: Not a valid file type. Update your selection.`;
            filePreview.appendChild(para);
        }
    }
}
function validateLog(log) { //change_log
    let message;
    let next;

    for (let i = 0; i < log.all.length - 1; i++) {
        message = log.getMessageAt(i);
        next = log.getMessageAt(i+1);
        let validChoice = false;

        for (let choice in choices) {
            if (message[choice].nextMsgId === next.id) {
                validChoice = true;
                break;
            }
        }

        if (validChoice === false) {
            console.log ("INVALID LOG");
            console.log("Message ID: " + message.id);
            console.log("Next message ID: " + next.id);
            return false;
        }
    }
    return true;
}

function wipeGame() { //reset player object & local save to defaults
    player = playerObject;

    saveGame();
    loadGame();
}

/*Game functions*/

function resetDisplay() { //Remove all items with the "board-li" class
    while(board_list.firstChild) {
        board_list.removeChild(board_list.firstChild);
    }
}
function updateStatDisplay(statObj) { //updates display on sidebar to match stats
    //TODO: stat names should be interchangable
    //stat_calendar.innerHTML =  //implement calendar stat
    stat_actions.innerHTML = statObj.actions;
    stat_health.innerHTML = statObj.health;
    stat_sanity.innerHTML = statObj.sanity;
    //TODO: add inventory here
}
function addToDisplay(content, classToAssign) {
    const element = document.createElement("li");
    element.className = classToAssign + " board-li"
    element.innerHTML = content;
    board_list.appendChild(element);

    //Scroll to bottom
    scrollToBottom(board_box);
}
function setUpChoices(libraryPrompt) { //TODO: UPDATE
    //cycle through choiceList, hide/disable choices that are undefined
    choices.forEach(choice => {
        const element = document.getElementById(choice);
        let promptChoice = possibleFunction(libraryPrompt[choice]);
        
        if (promptChoice === undefined) { //no choice defined
            element.disabled = true;
            element.classList.add("hidden");
        } else { //choice defined
            element.disabled = false;
            element.classList.remove("hidden");
            element.innerHTML = promptChoice.buttonText;
        }
    });
}

function executeNextPrompt(choiceString) {
    const lastChoice = possibleFunction(getLastPrompt()[choiceString]);
    const next = Library.getPrompt(lastChoice.nextId); //next prompt
    const nextMessage = possibleFunction(next.message);

    if (next.modifyStats) player = next.modifyStats(player);

    console.log(next);
    //add choice obj to last log obj in player
    player.log[player.log.length - 1][choiceString] = lastChoice;
    player.log.push({
        id: next.id,
        message: nextMessage
    });

    const choiceTxt = document.getElementById(choiceString).innerHTML;
    addToDisplay("> "+ choiceTxt, "ch-li");
    addToDisplay(nextMessage, "msg-li"); //add message to board box from updated log
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
