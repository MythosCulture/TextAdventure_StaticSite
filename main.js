import { Library } from './gameObjects.js';
import { choices } from './gameObjects.js';
import { playerObject } from './gameObjects.js';

import { setLocal } from './gameObjects.js';
import { getLocal } from './gameObjects.js';
import { hasInvItem } from './gameObjects.js';

let player = playerObject;

///////////OnClick/////////////
for (let i = 0; i < choices.length; i++) {
    const choicebox = document.getElementById("choice-box");
    let button = document.createElement('button');

    button.id = choices[i];
    button.disabled = true;
    button.classList.add("btn", "choice-btn");
    button.innerHTML = choices[i];
    button.addEventListener("click", event => executeNextPrompt(event.target.id));

    choicebox.firstElementChild.appendChild(button);
}

const options = document.getElementById("options");
options.addEventListener("click", openMenu);

const closeOptions = document.getElementsByClassName("closeOptions");
for (let i = 0; i < closeOptions.length; i++) {
    closeOptions[i].addEventListener("click", closeMenu);
}

const save = document.getElementById("saveOnClick");
save.addEventListener("click", () => {
    saveGame();
    if (player = getLocal("playerSave")) {
        console.log("Game saved");
        const saveMessage = "Game saved!";
        addToBoardList(saveMessage, "system-li");
        closeMenu();
    } else {
        console.log("Could not save game...");
    }
});

const load = document.getElementById("loadOnClick");
load.addEventListener("click", loadOnClick);

function loadOnClick() {
    triggerConfirm(() => {
        loadGame();
        console.log("Loading cached save from click");
        closeMenu();
    }, 'Are you sure you want to load? This will overwrite current progress.');
}

const wipe = document.getElementById("wipeOnClick");
wipe.addEventListener("click", wipeOnClick);

function wipeOnClick() {
    triggerConfirm(() => {
        wipeGame();
        console.log("Save Data wiped");
        closeMenu();
    }, 'Are you sure you want to wipe your save data?');
}

const slide = document.getElementsByClassName("offcanvas-slide")[0];
const overlay = document.getElementsByClassName("offcanvas-overlay")[0];
function openMenu() {
    overlay.style.opacity = ".25";
    overlay.style.left = 0;
    slide.style.left = 0;
}

function closeMenu() {
    overlay.style.opacity = "0";
    overlay.style.left = "-100vw";
    slide.style.left = "-100vw";
}

const scrollBtn = document.getElementById("scrollToBottom");
scrollBtn.addEventListener("click", scrollToBottom);

const scrollBox = document.getElementById("board-box");
function scrollToBottom() {
    scrollBox.scrollTop = scrollBox.scrollHeight;
}

////////UTILITY FUNCTIONS////////
function triggerConfirm(func, message) {
    if (confirm(message)) {
        func()
    }
}

function getLastPrompt() {
    return Library.getPrompt(player.log[player.log.length - 1].id);
}

function instanceOfFunction(object) {
    if (object instanceof Function) return object(player);
    return object;
}

/*Game functions*/

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

    updatePlayerDisplay(player);
    addToBoardList(player.log[player.log.length - 1].message, "msg-li");
    setUpChoices(getLastPrompt());
}

function wipeGame() { //reset player object & local save to defaults
    player = playerObject;

    saveGame();
    loadGame();
}

function resetDisplay() { //Remove all items with the "board-li" class
    const boardList = document.getElementById("board-list");
    while (boardList.firstChild) {
        boardList.removeChild(boardList.firstChild);
    }
}

function updatePlayerDisplay(player) { //updates display on sidebar to match stats
    const actions = document.getElementById("actions");
    const health = document.getElementById("health");
    const sanity = document.getElementById("sanity");

    actions.innerHTML = player.actions;
    health.innerHTML = player.health;
    sanity.innerHTML = player.sanity;

    const inventoryList = document.getElementById("inventory").firstElementChild;
    let listItems = inventoryList.children;

    //Add items from player inventory to html
    for (let i = 0; i < player.inventory.length; i++) {
        let invItem = player.inventory[i];
        if (!document.getElementById(invItem.id)) {
            const element = document.createElement("li");
            element.id = invItem.id;
            element.innerHTML = invItem.name + " - " + invItem.description

            inventoryList.appendChild(element);
        }
    }
    
    //Remove items from html list if player doesn't have them
    for (let i = 0; i < listItems.length; i++) {
        const listItem = listItems[i];
        console.log(hasInvItem(player, listItem.id));

        if (!hasInvItem(player, listItem.id)) {
            inventoryList.removeChild(listItems[i]);
            i -= 1;
        }
    }
}

function addToBoardList(content, classToAssign) {
    const boardList = document.getElementById("board-list");
    const element = document.createElement("li");
    element.className = classToAssign + " board-li"
    element.innerHTML = content;
    boardList.appendChild(element);

    scrollToBottom();
}
function setUpChoices(libraryPrompt) {
    //cycle through choiceList, hide/disable choices that are undefined
    choices.forEach(choice => {
        const element = document.getElementById(choice);
        let promptChoice = instanceOfFunction(libraryPrompt[choice]);

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
    const lastChoice = instanceOfFunction(getLastPrompt()[choiceString]);
    const next = Library.getPrompt(lastChoice.nextId); //next prompt
    
    if (next === undefined) { //cancel execute if no message exists
        return console.log(`Attempted to execute last prompt ID: ${getLastPrompt().id}, ${choiceString}. Next prompt ID: ${lastChoice.nextId} missing from library.`);
    }

    const nextMessage = instanceOfFunction(next.message);

    if (next.modifyStats) {
        player = next.modifyStats(player);
        updatePlayerDisplay(player);
    }

    //add choice obj to last log obj in player
    player.log[player.log.length - 1][choiceString] = lastChoice;
    player.log.push({
        id: next.id,
        message: nextMessage
    });

    const choiceTxt = document.getElementById(choiceString).innerHTML;
    addToBoardList(choiceTxt, "ch-li");
    addToBoardList(nextMessage, "msg-li"); //add message to board box from updated log
    setUpChoices(next);
}

loadGame();
