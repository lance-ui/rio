const translate = global.translate;
const lang = `🔠Translated to: ${trans}`;
module.exports = {
    name: "translate",
    prefixRequired: true,
    adminOnly: false,
    async execute(api, args, event){
        const text = args.join(' ');
        const trans = text.match(--(d+)) || "en";
        const { threadID, senderID, messageReply } = event;
        async () => {
        try{
        if(!args.length && !messageReply){
            api.sendMessage(`Either reply to text translate or provide text to translate eg:\n${global.prefix}translates sayonara.\n\nIf your are still unable to use the command type ${global.prefix}translate help to see the tutorial`, threadID, senderID)
        };
        if(messageReply){
            const body = await translate(messageReply.body,trans);
            const messageBody = `Here is your translation\n\n${body}\n\n${lang}`;
            api.sendMessage(messageBody, threadID, senderID)
        };
        if(args.length){
            const body = await translate(text,trans);
            const messageBody = `Here is your translation\n\n${body}\n\n${lang}`;
            api.sendMessage(messageBody, threadID, senderID)
        };
        if(text === "help"){
            const helpmessage = `************************\n\n${global.prefix}translate i was bored while making this command --fr\nNOTE fr means french\n\n************************`;
            api.sendMessage(helpmessage, threadID)
        }
       } catch (error){
     }
   }
 }
}