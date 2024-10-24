const axios = require('axios');
const mimeDB = require("mime-db");
const path = require('path');
const fs = require("fs-extra");

const gothicFont = {
  A: "𝖠", B: "𝖡", C: "𝖢", D: "𝖣", E: "𝖤", F: "𝖥", G: "𝖦", H: "𝖧", I: "𝖨", J: "𝖩", K: "𝖪", L: "𝖫", M: "𝖬", N: "𝖭", O: "𝖮", P: "𝖯", Q: "𝖰", R: "𝖱",
  S: "𝖲", T: "𝖳", U: "𝖴", V: "𝖵", W: "𝖶", X: "𝖷", Y: "𝖸", Z: "𝖹", 
  a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂",
  j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆", n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋",
  s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
  0: "𝟢", 1: "𝟣", 2: "𝟤", 3: "𝟥", 4: "𝟦", 5: "𝟧", 6: "𝟨", 7: "𝟩", 8: "𝟪", 9: "𝟫"
};

const convertToGothic = (text) => {
  return text.split('').map(char => gothicFont[char] || char).join('');
};

async function getStreamsFromAttachment(attachments) {
  const streams = [];
  for (const attachment of attachments) {
    const url = attachment.url;
    const ext = getExtFromUrl(url);
    const fileName = `${randomString(10)}.${ext}`;
    streams.push({
      pending: axios({
        url,
        method: "GET",
        responseType: "stream"
      }),
      fileName
    });
  }
  for (let i = 0; i < streams.length; i++) {
    const stream = await streams[i].pending;
    stream.data.path = streams[i].fileName;
    streams[i] = stream.data;
  }
  return streams;
}

function getExtFromUrl(url = "") {
  if (!url || typeof url !== "string")
    throw new Error('The first argument (url) must be a string');
  const reg = /(?<=https:\/\/cdn.fbsbx.com\/v\/.*?\/|https:\/\/video.xx.fbcdn.net\/v\/.*?\/|https:\/\/scontent.xx.fbcdn.net\/v\/.*?\/).*?(\/|\?)/g;
  const fileName = url.match(reg)[0].slice(0, -1);
  return fileName.slice(fileName.lastIndexOf(".") + 1);
}
async function getStreamFromURL(url = "", pathName = "", options = {}) {
  if (!options && typeof pathName === "object") {
    options = pathName;
    pathName = "";
  }
  try {
    if (!url || typeof url !== "string")
      throw new Error(`The first argument (url) must be a string`);
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
      ...options
    });
    if (!pathName)
      pathName = randomString(10) + (response.headers["content-type"] ? '.' + getExtFromMimeType(response.headers["content-type"]) : ".noext");
    response.data.path = pathName;
    return response.data;
  }
  catch (err) {
    throw err;
  }
}
async function shortenURL(url) {
  try {
    const result = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
    return result.data;
  }
  catch (err) {
    let error;
    if (err.response) {
      error = new Error();
      Object.assign(error, err.response.data);
    }
    else
      error = new Error(err.message);
  }
}
function splitPage(arr, limit) {
  const allPage = _.chunk(arr, limit);
  return {
    totalPage: allPage.length,
    allPage
  };
}

function translateAPI(text, lang) {
  return new Promise((resolve, reject) => {
    axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`)
      .then(res => {
        resolve(res.data[0][0][0]);
      })
      .catch(err => {
        reject(err);
      });
  });
}

async function downloadFile(url = "", path = "") {
  if (!url || typeof url !== "string")
    throw new Error(`The first argument (url) must be a string`);
  if (!path || typeof path !== "string")
    throw new Error(`The second argument (path) must be a string`);
  const getFile = await axios.get(url, {
    responseType: "arraybuffer"
  });
  fs.writeFileSync(path, Buffer.from(getFile.data));
  return path;
}
async function translate(text, lang) {
  if (typeof text !== "string")
    throw new Error(`The first argument (text) must be a string`);
  if (!lang)
    lang = 'en';
  if (typeof lang !== "string")
    throw new Error(`The second argument (lang) must be a string`);
  const wordTranslate = [''];
  const wordNoTranslate = [''];
  const wordTransAfter = [];
  let lastPosition = 'wordTranslate';

  if (word.indexOf(text.charAt(0)) == -1)
    wordTranslate.push('');
  else
    wordNoTranslate.splice(0, 1);

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (word.indexOf(char) !== -1) { // is word
      const lengWordNoTranslate = wordNoTranslate.length - 1;
      if (wordNoTranslate[lengWordNoTranslate] && wordNoTranslate[lengWordNoTranslate].includes('{') && !wordNoTranslate[lengWordNoTranslate].includes('}')) {
        wordNoTranslate[lengWordNoTranslate] += char;
        continue;
      }
      const lengWordTranslate = wordTranslate.length - 1;
      if (lastPosition == 'wordTranslate') {
        wordTranslate[lengWordTranslate] += char;
      }
      else {
        wordTranslate.push(char);
        lastPosition = 'wordTranslate';
      }
    }
    else { // is no word
      const lengWordNoTranslate = wordNoTranslate.length - 1;
      const twoWordLast = wordNoTranslate[lengWordNoTranslate]?.slice(-2) || '';
      if (lastPosition == 'wordNoTranslate') {
        if (twoWordLast == '}}') {
          wordTranslate.push("");
          wordNoTranslate.push(char);
        }
        else
          wordNoTranslate[lengWordNoTranslate] += char;
      }
      else {
        wordNoTranslate.push(char);
        lastPosition = 'wordNoTranslate';
      }
    }
  }

  for (let i = 0; i < wordTranslate.length; i++) {
    const text = wordTranslate[i];
    if (!text.match(/[^\s]+/))
      wordTransAfter.push(text);
    else
      wordTransAfter.push(translateAPI(text, lang));
  }

  let output = '';

  for (let i = 0; i < wordTransAfter.length; i++) {
    let wordTrans = (await wordTransAfter[i]);
    if (wordTrans.trim().length === 0) {
      output += wordTrans;
      if (wordNoTranslate[i] != undefined)
        output += wordNoTranslate[i];
      continue;
    }

    wordTrans = wordTrans.trim();
    const numberStartSpace = lengthWhiteSpacesStartLine(wordTranslate[i]);
    const numberEndSpace = lengthWhiteSpacesEndLine(wordTranslate[i]);

    wordTrans = ' '.repeat(numberStartSpace) + wordTrans.trim() + ' '.repeat(numberEndSpace);

    output += wordTrans;
    if (wordNoTranslate[i] != undefined)
      output += wordNoTranslate[i];
  }
  return output;
}
async function uploadImgbb(file) {
  let type = "file";
  try {
    if (!file)
      throw new Error('The first argument (file) must be a stream or a image url');
    if (regCheckURL.test(file) == true)
      type = "url";
    if (
      (type != "url" && (!(typeof file._read === 'function' && typeof file._readableState === 'object')))
      || (type == "url" && !regCheckURL.test(file))
    )
      throw new Error('The first argument (file) must be a stream or an image URL');

    const res_ = await axios({
      method: 'GET',
      url: 'https://imgbb.com'
    });

    const auth_token = res_.data.match(/auth_token="([^"]+)"/)[1];
    const timestamp = Date.now();

    const res = await axios({
      method: 'POST',
      url: 'https://imgbb.com/json',
      headers: {
        "content-type": "multipart/form-data"
      },
      data: {
        source: file,
        type: type,
        action: 'upload',
        timestamp: timestamp,
        auth_token: auth_token
      }
    });

    return res.data.image.url;
  }
  catch (err) {
    throw new CustomError(err.response ? err.response.data : err);
  }
}
function mssg(api, event) {
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
};
function removeHomeDir(fullPath) {
	if (!fullPath || typeof fullPath !== "string")
		throw new Error('The first argument (fullPath) must be a string');
	while (fullPath.includes(process.cwd()))
		fullPath = fullPath.replace(process.cwd(), "");
	return fullPath;
}
function randomString(max, onlyOnce = false, possible) {
	if (!max || isNaN(max))
		max = 10;
	let text = "";
	possible = possible || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (let i = 0; i < max; i++) {
		let random = Math.floor(Math.random() * possible.length);
		if (onlyOnce) {
			while (text.includes(possible[random]))
				random = Math.floor(Math.random() * possible.length);
		}
		text += possible[random];
	}
	return text;
}

function randomNumber(min, max) {
	if (!max) {
		max = min;
		min = 0;
	}
	if (min == null || min == undefined || isNaN(min))
		throw new Error('The first argument (min) must be a number');
	if (max == null || max == undefined || isNaN(max))
		throw new Error('The second argument (max) must be a number');
	return Math.floor(Math.random() * (max - min + 1)) + min;
}



module.exports = { 
  convertToGothic, 
  getStreamsFromAttachment, 
  getExtFromUrl,
  getStreamFromURL,
  shortenURL,
  translateAPI,
  downloadFile,
  translate,
  uploadImgbb,
  mssg,
  removeHomeDir,
  randomNumber,
  randomString
};
