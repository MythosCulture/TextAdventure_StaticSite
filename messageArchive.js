export { choices };
export { Items };
export { Library };

export { log };
export { stats };
export { charInfo };
export { inventory };

export function setLocal(setObj, setName) {
    window.localStorage.setItem(setName, JSON.stringify(setObj));
}

export function getLocal(getName) {
    return JSON.parse(window.localStorage.getItem(getName));
}

const choices = ["choice1", "choice2", "choice3", "choice4"];

const stats = {
    _health: 100,
    _condition: 'healthy', //keep?
    _sanity: 100,
    _psyche: 'sane', //keep?
    actions: 10,
    get health() {
        return this._health;
    },
    set health(value) {
        if (value >= 0 && value <= 100) {
            this._health = value;
        } else {
            console.log('Health value out of bounds');
        }
    },
    modHealth(value) {
        let newVal = this._health += value;
        this.health = newVal;
        console.log(`health modded by ${value}. New Total: ${newVal}`);
    },
    get sanity() {
        return this._sanity;
    },
    set sanity(value) {
        if (value >= 0 && value <= 100) {
            this._sanity = value;
        } else {
            console.log('Sanity value out of bounds');
        }
    },
    modSanity(value) {
        let newVal = this._sanity += value;
        this.sanity(newVal);
    },
    cacheData() {
        const data = [this.health, this._condition, this._sanity, this._psyche, this.actions];
        setLocal(data, "playerStats");
    },
    loadCache() {
        const data = getLocal("playerStats");
        this.health = data[0];
        this._condition = data[1];
        this.sanity = data[2];
        this._psyche = data[3];
        this.actions = data[4];
    }
}

const pn = tense => {
   return charInfo.pronouns[tense];
} // ${pn(0)} for he ${pn(2)} his, etc.
const charInfo = {
    name: 'default name',
    _pronouns: [],
    _pnList: [
        ['he', 'him', 'his'],
        ['she', 'her', 'hers'],
        ['they', 'them', 'their'],
        ['xe', 'xem', 'xers']
    ],
    get pronouns () {
        if (this._pronouns.length === 0) {
            this._pronouns = this._pnList[0];
        }
        return this._pronouns;
    },
    set pronouns(pronouns) {
        this._pronouns = pronouns;
    },
    cacheData() {
        const data = [this.name, this.pronouns];
        setLocal(data, "characterInfo");
    },
    loadCache() {
        const data = getLocal("characterInfo");
        this.name = data[0];
        this.pronouns = data[1];
    }
}

const inventory = {
    _contents: [1],
    get contents() {
        return this._contents;
    },
    set contents(value) {
        this._contents = value;
    },
    hasItem(itemId) {
        return this._contents.includes(itemId);
    },
    addItem(itemId) {
        this._contents.push(itemId);
        console.log(`inventory id ${itemId} added.`);
    },
    removeItem(itemId) {
        if (this.hasItem(itemId)) {
            let index = this._contents.indexOf(itemId);
            this._contents.splice(index, 1);
            console.log(`inventory id ${itemId} removed.`);
        }
    },
    getItem(itemId) {
        if(this.hasItem(itemId)) {
            return Items.getItem(itemId);
        }
    },
    cacheData() {
        const data = this.contents;
        setLocal(data, "inventory");
    },
    loadCache() {
        const data = getLocal("inventory");
        this.contents = data;
    }
};

const itemName = id => {
    return Items.getItem(id).name;
}
const Items = {
    //let localItem = getLocal("invData");
    getItem (itemId) {
        return this._allItems.find(item => item.id === itemId);
    },
    get allItems () {
        return this._allItems;
    },
    //set allItems (itemsList) {},
    _allItems: [
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
    ],
};

const log = {
    _allMessages: ['P0_000'],
    get allMessages() {
        return this._allMessages;
    },
    set allMessages(list) {
        this._allMessages = list;
    },
    addMessage(msgId) {
        this._allMessages.push(msgId);
    },
    hasMessage(msgId) {
        return this._allMessages.includes(msgId);
    },
    getMessageAt(index) {
        return Library.getMessage(this._allMessages[index]);
    },
    getLastMessage() {
        return Library.getMessage(this._allMessages[this._allMessages.length -1]);
    },
    cacheData() {
        const data = this.allMessages;
        setLocal(data, "playerLog");
    },
    loadCache() {
        const data = getLocal("playerLog");
        this.allMessages = data;
    }
}

const keyEvents = { //checks if certain choices have been made or events have been triggered
    exampleEvent: false,
    exampleEvent2: true
}

const Library = {
    getMessage(msgId) {
        return this._allMessages.find(msg => msg.id === msgId);
    },
    hasItem(itemId) { // for making it easier to reference in the messages
        return inventory.hasItem(itemId);
    },
    _allMessages: [
        {
            id: "P0_000",
            message: "Opening message. Put game information/warnings here.",
            choice1: { buttonText: "Continue", nextMsgId: "P0_001" }
        },
        {
            id: "P0_001",
            message: "This is a test message." +
                "<br> Pick a favorite color.",
            choice1: { buttonText: "Test conidtionals for stats", nextMsgId: "P1_000" },
            choice2: { buttonText: "Test inventory", nextMsgId: "P2_000" },
            choice3: { buttonText: "option3", nextMsgId: "P3_000" },
        },
        {
            id: "P1_000",
            message: "Test Route 1",
            choice1: { buttonText: "Go back", nextMsgId: "P0_001" },
            choice2: stats.health === 100 ? { buttonText: "Health at 100", nextMsgId: "P0_000" } : undefined
        },
        {
            id: "P2_000",
            message: inventory.hasItem(0) ? "You do not see an item." : `You see a ${itemName(0)}`,
            choice1: { buttonText: "Go back", nextMsgId: "P0_001" },
            choice2: inventory.hasItem(0) ? undefined : { buttonText: "Grab item!", nextMsgId: "P2_001" },
            choice3: inventory.hasItem(0) ? { buttonText: "Put item back!", nextMsgId: "P2_002" } : undefined
        },
        {
            id: "P2_001",
            modifyStat: [
                ["stats", "modHealth", -5], ["inventory", "addItem", 0]
            ],
            message: `Ah! The ${itemName(0)} you grabbed was cursed! You lose 5 health. Total HP: ${stats.health}`,
            choice1: { buttonText: "Continue", nextMsgId: "P2_000" },
        },
        {
            id: "P2_002",
            modifyStat: [
                ["stats", "modHealth", 5], ["inventory", "removeItem", 0]
            ],
            message: `You respectfully put ${itemName(0)} back. You gain 5 health. Total HP: ${stats.health}`,
            choice1: { buttonText: "Continue", nextMsgId: "P2_000" },
        },
        {
            id: "P3_000",
            message: "Test Route 3",
            choice1: { buttonText: "Go back", nextMsgId: "P0_001" },
        },
    ]
};

log.cacheData();
stats.cacheData();
charInfo.cacheData();
inventory.cacheData();
