const default_CharInfo = {Name: "No Name Given", Pronouns: {pr1: "he/she/they", pr2:"him/her/them", pr3:"his/hers/theirs" } };
const default_Stats = {Health:100, Sanity:100, Inventory:[], Actions:10};
const default_log = [
    {
        messageId: "P0_000",
        message: "Opening message. Put game information/warnings here.",
        choice1: { buttonText:"Continue", nextMsgId:"P0_001"}
    }
];

//preload defaults into local storage as values that can be retrieved later
setLocal(default_log, "logDefault");
setLocal(default_Stats, "statDefault");
setLocal(default_CharInfo, "charDefault");
//set these to default values to start
setLocal(default_log, "logData");
setLocal(default_Stats, "statData");
setLocal(default_CharInfo, "charData");

export function setLocal (setObj, setName) {
    window.localStorage.setItem(setName, JSON.stringify(setObj));
}

export function getLocal (getName) {
    return JSON.parse(window.localStorage.getItem(getName));
}

export {Library};
const Library = [
    {
        messageId: "P0_000",
        message: "Opening message. Put game information/warnings here.",
        choice1: { buttonText:"Continue", nextMsgId:"P0_001"}
    },
    {
        messageId: "P0_001",
        message: "This is a test message." +
        "<br> Pick a favorite color.",
        choice1: { buttonText:"Red", nextMsgId:"P1_000"},
        choice2: { buttonText:"Blue", nextMsgId:"P2_000"},
        choice3: { buttonText:"Green", nextMsgId:"P3_000"},
    },
    {
        messageId: "P1_000",
        message: "Test Route 1",
        choice1: { buttonText:"Go back", nextMsgId:"P0_001"},
        choice2: getLocal("statData").Health==100?{ buttonText:"Health at 100", nextMsgId:"P0_000"}:undefined
        //choice2: stats.Health==100?{ buttonText:"Health at 100", nextMsgId:"P0_000"}:undefined
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
const logArchive = [
    {
        messageId: "P0_000",
        message: "Opening message. Put game information/warnings here.",
        choice1: { buttonText:"Continue", nextMsgId:"P0_001"}
    }
];

const keyEvents = [ //checks if certain choices have been made or events have been triggered
    {
        exampleEvent: false,
        exampleEvent2: true
    }
];
