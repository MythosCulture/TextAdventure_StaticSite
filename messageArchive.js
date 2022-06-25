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
const logArchive = [
    {
        messageId: "P0_000",
        message: "Opening message. Put game information/warnings here.",
        choice1: { buttonText:"Continue", nextMsgId:"P0_001"}
    }
];
