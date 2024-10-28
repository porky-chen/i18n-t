const extractTranslationsFromProject = require('./extract.js');
const { translateKeys, saveTranslations } = require('./translate.js');
const path = require('path');

async function main() {
    const projectDir = path.resolve(__dirname, '../pages');
    const targetLang = 'en';

    const keys = extractTranslationsFromProject(projectDir);
    console.log(`Found ${keys.length} translation keys`);

    console.log('Translating keys...');
    const translations = await translateKeys(keys, targetLang);

    console.log('Saving translations...');
    await saveTranslations(translations, targetLang);
    console.log('Translation process completed!');
}

main().catch(err => console.error(err));