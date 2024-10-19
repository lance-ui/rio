const config = global.config;
const { writeFileSync } = require('fs-extra');
module.exports = { 
    name: "admin",
    prefixRequired: true,
    adminOnly: true,
    async execute( api, args, event ) {
        switch (args[0]) {
			case "add":
			case "-a": {
				if (args[1]) {
					let uids = [];
					if (Object.keys(event.mentions).length > 0)
						uids = Object.keys(event.mentions);
					else if (event.messageReply)
						uids.push(event.messageReply.senderID);
					else
						uids = args.filter(arg => !isNaN(arg));
					const notAdminIds = [];
					const adminIds = [];
					for (const uid of uids) {
						if (config.adminBot.includes(uid))
							adminIds.push(uid);
						else
							notAdminIds.push(uid);
					}

					config.adminBot.push(...notAdminIds);
                    return api.sendMessage('done', event.threadID)
				}
				else
					return api.sendMessage("missing ids", event.threadID);
			}
			case "remove":
			case "-r": {
				if (args[1]) {
					let uids = [];
					if (Object.keys(event.mentions).length > 0)
						uids = Object.keys(event.mentions)[0];
					else
						uids = args.filter(arg => !isNaN(arg));
					const notAdminIds = [];
					const adminIds = [];
					for (const uid of uids) {
						if (config.adminBot.includes(uid))
							adminIds.push(uid);
						else
							notAdminIds.push(uid);
					}
					for (const uid of adminIds)
						config.adminBot.splice(config.adminBot.indexOf(uid), 1);
                    return api.sendMessage('done', event.threadID)
				}
				else
					return;
			}
			case "list":
			case "-l": {
				const id = config.adminBot;
                if(id > 0){ api.sendMessage(id, event.threadID) }
			}
			default:
				return ;
		}
    }
}