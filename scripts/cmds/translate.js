const translate = global.translate;

module.exports = {
    name: "translate",
    prefixRequired: true,
    adminOnly: false,
    async execute(api, args, event) {
        const { threadID, senderID, messageReply } = event;
        const text = args.join(' ');
        const transMatch = text.match(/--([a-z]{2})/);
        const trans = transMatch ? transMatch[1] : "en";
        const lang = `🔠Translated to: ${trans}`;

        try {
            if (!args.length && !messageReply) {
                api.sendMessage(`Please reply to a text to translate or provide text to translate. Example:\n${global.prefix}translate sayonara.\n\nIf you need help, type ${global.prefix}translate help.`, threadID, senderID);
                return;
            }

            let body;
            if (messageReply) {
                body = await translate(messageReply.body, trans);
                const messageBody = `Here is your translation:\n\n${body}\n\n${lang}`;
                api.sendMessage(messageBody, threadID, senderID);
            } else if (args.length) {
                body = await translate(text.replace(/--[a-z]{2}/, '').trim(), trans);
                const messageBody = `Here is your translation:\n\n${body}\n\n${lang}`;
                api.sendMessage(messageBody, threadID, senderID);
            }

            if (text.trim() === "help") {
                const helpMessage = `************************\n\nUsage:\n${global.prefix}translate i was bored while making this command --fr\n(Note: 'fr' means French)\n\n************************`;
                api.sendMessage(helpMessage, threadID);
            }
        } catch (error) {
            api.sendMessage("Failed to translate text. Please try again later.", threadID, senderID);
            console.error("Translation error:", error);
        }
    }
};
