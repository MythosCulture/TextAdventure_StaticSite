export { choices };
export { Library };

export { playerObject };

export function setLocal(setObj, setName) {
    window.localStorage.setItem(setName, JSON.stringify(setObj));
}

export function getLocal(getName) {
    return JSON.parse(window.localStorage.getItem(getName));
}

const getItem = itemId => {
    return Library.allItems.find(item => item.id === itemId);
};


const choices = ["choice1", "choice2", "choice3", "choice4"];

let playerObject = {
    name: 'NoName',
    pronouns: ["he","him","his"],
    health: 100,
    sanity: 100,
    actions: 10,
    inventory:[
        {
            id: 1,
            name: "Item 2",
            description: "This is a description for item 2!"
        }
    ],
    log: [
        {
            id:"P0_000",
            message: "Opening message. Put game information/warnings here.",
        }
    ]
}

const Library = {
    getPrompt (promptId) {
        return this.allPrompts.find(msg => msg.id === promptId);
    },
    allItems: [
        {
            id: 1,
            name: "Item 1",
            description: "Enter description here"
        },
        {
            id: 2,
            name: "Item 2",
            description: "This is a description for item 2!"
        }
    ],
    allPrompts: [
        {
            id: "P0_000",
            message: "Opening message. Put game information/warnings here.",
            choice1: { buttonText: "Continue", nextId: "P0_001" }
        },
        {
            id: "P0_001",
            message: "This is a test message." +
                "<br> Pick an option below.",
            choice1: { buttonText: "Test conidtionals for stats", nextId: "P1_000" },
            choice2: { buttonText: "Test inventory", nextId: "P2_000" },
            choice3: { buttonText: "option3", nextId: "P3_000" },
        },
        {
            id: "P1_000",
            message: "Test Route 1",
            choice1: { buttonText: "Go back", nextId: "P0_001" },
            choice2(player) {
                if(player.health === 100) 
                    return { buttonText: "Health at 100", nextId: "P0_000" };
                return undefined;
            }
        },
        {
            id: "P2_000",
            message(player) {
                if(player.inventory.includes(1)) {
                    return "You do not see an item.";
                } else {
                    return `You see ${getItem(1).name}.`
                }
            },
            choice1: { buttonText: "Go back", nextId: "P0_001" },
            //choice2: inventory.hasItem(0) ? undefined : { buttonText: "Grab item!", nextId: "P2_001" },
            //choice3: inventory.hasItem(0) ? { buttonText: "Put item back!", nextId: "P2_002" } : undefined
        },
        {
            id: "P3_000",
            message: "Test Route 3",
            choice1: { buttonText: "Go back", nextId: "P0_001" },
        },
    ]
}

setLocal(playerObject, "playerSave");
