const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const CryptoJS = require('crypto-js');
const {v4: uuidv4} = require('uuid');


// shixian
async function translateText(text, targetLanges = ['en']) {
  let appKey = '0992e25dd284b2b2';
  let secretKey = 'igEei4bBKjNPZThoOQMol7jaIGXycpip';//注意：暴露appSecret，有被盗用造成损失的风险
  let salt = uuidv4();
  let curtime = Math.floor(Date.now() / 1000).toString();
  let query = text;
  // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
  let from = 'auto'; // zh-CHS - 简体中文

  // 构造签名函数
  function generateSign(query, salt, curtime) {
    const input = truncate(query);
    const signStr = appKey + input + salt + curtime + secretKey;
    return CryptoJS.SHA256(signStr).toString(CryptoJS.enc.Hex)
  }

  // 存储多语言翻译结果
  const translations = {};
  for (const to of targetLanges) {
    const sign = generateSign(query, salt, curtime);
    
    try {
      const res = await axios.get('https://openapi.youdao.com/api', {
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

      // 检查是否成功返回翻译结果
      if (res.data && res.data.errorCode === '0') {
        translations[to] = res.data.translation.toString();
      } else {
        console.error(`Error with code ${res.data.errorCode} for language ${to}`);
        translations[to] = `Error: ${res.data.errorCode}`;
      }
    } catch (error) {
        console.error(`Request failed for language ${to}:`, error);
        translations[to] = `Request failed`;
    }
  }
  
  console.log('翻译结果:', translations);
  return translations;
}

// 截取字符串，防止过长
function truncate(q){
  var len = q.length;
  if(len<=20) return q;
  return q.substring(0, 10) + len + q.substring(len-10, len);
}

// 逐个翻译 keys 并存储翻译内容
async function translateKeys(keys, targetLanges) {
    const translations = {};

    for (const key of keys) {
        translations[key] = await translateText(key, targetLanges);
    }

    return translations;
}

// 保存翻译为多语言 JSON 文件
async function saveTranslations(translations, targetLanges) {
    // 为每种目标语言生成一个文件
    for (const lang of targetLanges) {
      const langTranslations = {};

      // 提取每个 key 的特定语言的翻译
      for (const [key, translationObj] of Object.entries(translations)) {
          langTranslations[key] = translationObj[lang] || 'Translation error';
      }

      // 设置文件路径，并保存到 JSON 文件
      const filePath = path.join(__dirname, `../locales/translations.${lang}.json`);
      await fs.outputJson(filePath, langTranslations, { spaces: 2 });
      console.log(`保存翻译文件: ${filePath}`);
  }
}

module.exports = {
    translateKeys,
    saveTranslations,
};