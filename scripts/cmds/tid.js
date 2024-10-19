module.exports = {
    name: "tid",
    prefixRequired: true,
    adminOonly: false,
    async execute(api, event){
        const { threadID, messageID } = event;
        api.sendMessage(threadID,threadID,messageID)
    }
}