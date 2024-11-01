
# i18n-t SDK

  

一个简单的 SDK，用于提取和翻译 Vue.js 项目内的文本内容。此 SDK 可识别 Vue 模板和脚本中用 `$t('...')` 包裹的文本，并使用有道 API 跨多种语言执行批量翻译。

## Features

  

- **自动文本提取**：识别 Vue 文件中的翻译键，搜索模板中的 `$t('...')` 和脚本中的 `this.$t('...')`。

- **批量翻译**：支持将提取的文本翻译成多种目标语言。

- **多语言 JSON 输出**：为每个目标语言生成独立的 JSON 文件，方便与支持 i18n 的项目集成。

  

## Installation

  

To install this SDK, clone the repository and install dependencies:

  

```bash
git  clone  https://github.com/porky-chen/i18n-t.git

cd  i18n-t

npm  install
```

**使用方法**

**1. 提取和翻译键**

translateKeys 函数接收一个键数组和目标语言列表，获取每个键的翻译，并为每种语言单独存储翻译内容。

**2. 保存翻译**

saveTranslations 函数将每种语言的翻译写入 translations.{lang}.json 格式的 JSON 文件中。

**使用示例**
```javascript
const { translateKeys, saveTranslations } = require('./translate-sdk');

(async () => {
    const keys = [
        '您好，欢迎再次使用有道智云文本翻译API接口服务',
        '这是另一段测试内容'
    ];
    const targetLanguages = ['en', 'fr', 'es'];

    // 执行翻译并保存为多语言 JSON 文件
    const translations = await translateKeys(keys, targetLanguages);
    await saveTranslations(translations, targetLanguages);
})();
```

**API 密钥配置**

要使用有道翻译 API，请直接在 translate.js 中配置 appKey 和 secretKey。**请确保不要公开暴露这些密钥**，以免造成潜在的安全风险。

**依赖项**

 - axios: 用于向有道 API 发送请求。
 - fs-extra: 便于文件操作。
 - crypto-js: 用于生成安全的 API 请求签名。
 - uuid: 用于生成随机数

**许可证**
该项目基于 MIT 许可证。