function message(api, event) {
    async function sendMessageError(err) {
      if (typeof err === "object" && !err.stack)
        err = removeHomeDir(JSON.stringify(err, null, 2));
      else
        err = removeHomeDir(`${err.name || err.error}: ${err.message}`);
      return await api.sendMessage(err.message, event.threadID, event.messageID);
    }
    return {
      send: async (form, callback) => {
        try {
          return await api.sendMessage(form, event.threadID, callback);
        }
        catch (err) {
          if (JSON.stringify(err).includes('spam')) {
            throw err;
          }
        }
      },
      reply: async (form, callback) => {
        try {
          return await api.sendMessage(form, event.threadID, callback, event.messageID);
        }
        catch (err) {
          if (JSON.stringify(err).includes('spam')) {
            throw err;
          }
        }
      },
      unsend: async (messageID, callback) => await api.unsendMessage(messageID, callback),
      reaction: async (emoji, messageID, callback) => {
        try {
          return await api.setMessageReaction(emoji, messageID, callback, true);
        }
        catch (err) {
          if (JSON.stringify(err).includes('spam')) {
            throw err;
          }
        }
      },
      err: async (err) => await sendMessageError(err),
      error: async (err) => await sendMessageError(err)
    };
  }
  