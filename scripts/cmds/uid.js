module.exports = {
    name: "uid",
    description: "Get your user ID.",
    prefixRequired: true,
    adminOnly: false,
    async execute(api, event) {
        try {
            const { threadID, messageID, senderID, messageReply } = event;
            if (messageReply) {
                await api.sendMessage(messageReply.senderID, threadID, messageID);
            }else if(senderID){
                await api.sendMessage(senderID, threadID, messageI);
            }
        } catch (e){
            throw e
        }
    },
};
