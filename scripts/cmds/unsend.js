module.exports = {
    name: "unsend",
    description: "Unsend a replied message.",
    prefixRequired: true,
    adminOnly: false,
    
    async execute(api, event, args, getText) {
        if (!event.messageReply) {
            return api.sendMessage("Please reply to bot message", event.threadID, event.messageID);
        }

        if (event.messageReply.senderID !== api.getCurrentUserID()) {
            return api.sendMessage("Cannot unsend anothers user id message", event.threadID, event.messageID);
        }

        try {
            await api.unsendMessage(event.messageReply.messageID);
        } catch (error) {
            console.error("Error unsending message:", error);
            api.sendMessage(error.message, event.threadID); 
        }
    },
};
