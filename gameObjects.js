export { choices };
export { Library };
export { playerObject };

export function setLocal(setObj, setName) {
    window.localStorage.setItem(setName, JSON.stringify(setObj));
}

export function getLocal(getName) {
    return JSON.parse(window.localStorage.getItem(getName));
}

const removeInvItem = (player, itemId) => {
    const itemToRemove = player.inventory.find(item => item.id === itemId);
    const index = player.inventory.indexOf(itemToRemove);
    if(index >= 0) player.inventory.splice(index, 1)
}

export const hasInvItem = (player, itemId) => {
    if(player.inventory.find(item => item.id === itemId)) return true;
    return false;
}

const getItem = itemId => {
    return Library.allItems.find(item => item.id === itemId);
}

const choices = ["choice1", "choice2", "choice3", "choice4"];

let playerObject = {
    name: 'NoName',
    pronouns: ["he","him","his"],
    health: 100,
    sanity: 100,
    actions: 10,
    inventory:[
        {
            id: "Inv_1",
            name: "Item 1",
            description: "Enter description here"
        }
    ],
    log: [
        {
            id:"P0_000",
            message: "Opening message. Put game information/warnings here.",
        }
    ]
}

setLocal(playerObject, "playerSave");

const Library = {
    getPrompt(promptId) {
        return this.allPrompts.find(msg => msg.id === promptId);
    },
    allItems: [
        {
            id: "Inv_1",
            name: "Item 1",
            description: "Enter description here"
        },
        {
            id: "Inv_2",
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
            choice1: { buttonText: "Test coniditionals for stats", nextId: "P1_000" },
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
                console.log(`player has item: ${hasInvItem(player, "Inv_1")}`);
                console.log(player.inventory);

                if(hasInvItem(player, "Inv_1")) {
                    return "You do not see an item.";
                } else {
                    return `You see ${getItem("Inv_1").name}.`
                }
            },
            choice1: { buttonText: "Go back", nextId: "P0_001" },
            choice2(player) {
                if(hasInvItem(player, "Inv_1")) {
                    return { buttonText: "Put item back!", nextId: "P2_002" }
                } else return { buttonText: "Grab item!", nextId: "P2_001" }
            }
        },
        {
            id: "P2_001",
            modifyStats(player) {
                player.inventory.push(getItem("Inv_1"));
                return player;
            },
            message(player) {
                return `You grab ${getItem("Inv_1").name} and add it to your inventory.`
            },
            choice1: {buttonText: "continue", nextId: "P2_000"}
        },
        {
            id: "P2_002",
            modifyStats(player){
                removeInvItem(player, "Inv_1");
                return player;
            },
            message(player) {
             return `You put ${getItem("Inv_1").name} back.`
            },
            choice1: {buttonText: "continue", nextId: "P2_000"}
        },
        {
            id: "P3_000",
            message: "Test Route 3",
            choice1: { buttonText: "Go back", nextId: "P0_001" },
        },
    ]
}
