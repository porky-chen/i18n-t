const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const CryptoJS = require('crypto-js');

function truncate(q){
  var len = q.length;
  if(len<=20) return q;
  return q.substring(0, 10) + len + q.substring(len-10, len);
}

async function translateText(text, targetLang = 'en') {
  let appKey = '0992e25dd284b2b2';
  let key = 'igEei4bBKjNPZThoOQMol7jaIGXycpip';//注意：暴露appSecret，有被盗用造成损失的风险
  let salt = (new Date).getTime();
  let curtime = Math.round(new Date().getTime()/1000);
  let query = text;
  // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
  let from = 'zh-CHS';
  let to = targetLang;
  let str1 = appKey + truncate(query) + salt + curtime + key;

  let sign = CryptoJS.SHA256(str1).toString(CryptoJS.enc.Hex);
    try {
        const response = await axios.get('https://openapi.youdao.com/api', {
          params: {
            q: query,
            appKey: appKey,
            salt: salt,
            from: from,
            to: to,
            sign: sign,
            signType: "v3",
            curtime: curtime
          }
        });
        console.log(response.data.translation, 'response');
        return response.data.translation.toString();
    } catch (error) {
        console.error('Error translating text:', error);
        return text; // fallback to original text if error occurs
    }
}

async function translateKeys(keys, targetLang) {
    const translations = {};

    for (const key of keys) {
        translations[key] = await translateText(key, targetLang);
    }

    return translations;
}

async function saveTranslations(translations, targetLang) {
    const filePath = path.join(__dirname, `translations.${targetLang}.json`);
    await fs.outputJson(filePath, translations, { spaces: 2 });
    console.log(`Translations saved to ${filePath}`);
}

module.exports = {
    translateKeys,
    saveTranslations,
};