module.exports = {
    name: "ping",
    description: "Check latency.",
    prefixRequired: true,
    adminOnly: false,
    async execute(api, event, args) {
        const { threadID, messageID } = event;

        const sentMessage = await api.sendMessage(global.convertToGothic("Calculating ping, please wait..."), threadID, messageID);
        const sentMessageID = sentMessage.messageID;

        const startTime = Date.now();
        const latency = startTime - Date.now();

        await api.editMessage(global.convertToGothic(`Ping: ${latency}ms`), sentMessageID);
    },
};
