const default_CharInfo = {Name: "No Name Given", Pronouns: {pr1: "he/she/they", pr2:"him/her/them", pr3:"his/hers/theirs" } };
const default_Stats = {Health:100, Sanity:100, Actions:10};
const default_Inv = [1];
const default_log = [ "P0_000"];

//preload defaults into local storage as values that can be retrieved later
setLocal(default_log, "logDefault");
setLocal(default_Stats, "statDefault");
setLocal(default_CharInfo, "charDefault");
setLocal(default_Inv, "invDefault");
//set these to default values to start
setLocal(default_log, "logData");
setLocal(default_Stats, "statData");
setLocal(default_CharInfo, "charData");
setLocal(default_Inv, "invData");

export {Choices};
export {Items};
export {Library};

/**
 * @param {Object} setObj 
 * @param {string} setName 
 */
export function setLocal (setObj, setName) {
    window.localStorage.setItem(setName, JSON.stringify(setObj));
}

export function getLocal (getName) {
    return JSON.parse(window.localStorage.getItem(getName));
}

/**
 * @param {Array} list 
 * @param {*} _id 
 * @returns Array object
 */
export function getObj(list, _id) { //used to retrieve messages or inventory items
    let objIndex = list.findIndex( function(element) {
        return element.id === _id;
    });

    return list[objIndex];
}

/**
 * @param {*} _itemId 
 * @returns array object from Items array
 */
function getItem(_itemId) {
    return getObj(Items, _itemId);
}

/**
 * @param {*} _itemId 
 * @returns list item or undefined
 */
function getInvItem(_itemId) { //returns item or undefined
    let localItem = getLocal("invData");
    return localItem.find(item => item.id === _itemId);
}

/**
 * @param {*} _itemId 
 * @returns boolean
 */
function hasItem(_itemId) { //True/False
    if (getInvItem(_itemId) == undefined) return false;
    return true;
}

const Stats = ["Health", "Sanity", "Actions"]; //TODO: have interchangable stat names
const Choices = ["choice1", "choice2", "choice3", "choice4"];
const Items = [
    {
        id: 0,
        name: "Item 1",
        description: "Enter description here"
    },
    {
        id: 1,
        name: "Item 2",
        description: "This is a description for item 2!"
    }
];

const Library = [
    {
        id: "P0_000",
        message: "Opening message. Put game information/warnings here.",
        choice1: { buttonText:"Continue", nextMsgId:"P0_001"}
    },
    {
        id: "P0_001",
        message: "This is a test message." +
        "<br> Pick a favorite color.",
        choice1: { buttonText:"Test conidtionals for stats", nextMsgId:"P1_000"},
        choice2: { buttonText:"Test inventory", nextMsgId:"P2_000"},
        choice3: { buttonText:"option3", nextMsgId:"P3_000"},
    },
    {
        id: "P1_000",
        message: "Test Route 1",
        choice1: { buttonText:"Go back", nextMsgId:"P0_001"},
        choice2: getLocal("statData").Health==100?{ buttonText:"Health at 100", nextMsgId:"P0_000"}:undefined
        //TODO: change getLocal for this action
        //Game doesnt save to cache after every choice, could potentially be pulling old data
    },
    {
        id: "P2_000",
        message: hasItem(1)?"You do not see an item.":`You see ${getItem(1).name}`,
        choice1: { buttonText:"Go back", nextMsgId:"P0_001"},
        choice2: hasItem(1)?undefined:{ buttonText:"Grab item!", nextMsgId: "P2_001"},
        choice3: hasItem(1)?{ buttonText:"Put item back!", nextMsgId: "P2_002"}:undefined
    },
    {
        id: "P2_001",
        modifyStat: [["Health", -5], ["Inv", 1]],
        message: `Ah! The ${getItem(1).name} you grabbed was cursed! You lose 5 health.`,
        choice1: { buttonText:"Continue", nextMsgId:"P2_000"},
    },
    {
        id: "P2_002",
        modifyStat: [["Health", 5], ["InvRemove", 1]],
        message: `You respectfully put ${getItem(1).name} back. You gain 5 health.`,
        choice1: { buttonText:"Continue", nextMsgId:"P2_000"},
    },
    {
        id: "P3_000",
        message: "Test Route 3",
        choice1: { buttonText:"Go back", nextMsgId:"P0_001"},
    },
];

const keyEvents = { //checks if certain choices have been made or events have been triggered
    exampleEvent: false,
    exampleEvent2: true
}
