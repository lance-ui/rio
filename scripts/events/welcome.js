const fs = require('fs-extra');
function checkdir() {
    const dataPath = __dirname + "/cache/approvedThreads.json";
    const pendingPath = __dirname + "/cache/pendingThreads.json";
    if (!fs.existsSync(dataPath)) {
      fs.writeFileSync(dataPath, JSON.stringify([]));
    }
    if (!fs.existsSync(pendingPath)) {
      fs.writeFileSync(pendingPath, JSON.stringify([]));
    }
  };
  checkdir();
module.exports = {
    name: 'welcome',
    description: 'Sends a greeting message to new users who join the group',
    async handle(api, event) {
        try {
                const { threadID, messageID, senderID } = event;
                const dataPath = __dirname + "/cache/approvedThreads.json";
                const pendingPath = __dirname + "/cache/pendingThreads.json";
                let data = JSON.parse(fs.readFileSync(dataPath));
                let pending = JSON.parse(fs.readFileSync(pendingPath));
                let idBox = event.threadID;
                const dataAddedParticipants = event.logMessageData.addedParticipants;
                const nickNameBot = global.botname;
            if(event.logMessageType === 'log:subscribe' && dataAddedParticipants.some((item) => item.userFbId == api.getCurrentUserID())){
                if(nickNameBot){
                    if(!data.includes(idBox)){
                        api.sendMessage({
                            body: "🚫 | You added the bot without permission!!!!🖕🖕\n\nBot will automatically leave the gc in 30s\n\nYou will need to get approval from admin\n\nYou may contact admin in his gc,to join the gc type +jmmygc within 30s\nor\n👉🏻pm admin with this fb link:\n fb.me/100083670401783\n Fb.me/100091893014482",
                            attachment: fs.createReadStream("image.jpg")
                        });
                        setTimeout(() => {
                            api.removeUserFromGroup(api.getCurrentUserID(), idBox)
                        },30000)
                    }else{
                        api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
                        api.sendMessage({ body:  `✅ | Connected successfully!`, attachment: fs.createReadStream(`image2.jpg`) }, idBox);
                    }
                }
            }else if(event.logMessageType === 'log:subscribe' && event.logMessageData.addedParticipants.length > 0) {
                const addedParticipants = event.logMessageData.addedParticipants;

                for (const participant of addedParticipants) {
                    const userName = participant.fullName || 'New User';
                    const greetingMessage = `Welcome to the group, ${userName}! We're happy to have you here. 😊`;

                    await api.sendMessage(greetingMessage, event.threadID);
                }
            }
        } catch (error) {
            console.error('Error handling new user join event:', error);
        }
    }
};
