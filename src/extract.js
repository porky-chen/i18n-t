const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

// 正则表达式匹配所有 `$t('...')` 或 `this.$t('...')` 调用中的内容
function extractHtmlTranslations(content) {
    const keys = new Set();
    const regex = /\$t\(['"`](.*?)['"`]\)/g;
    let match;

    // 使用正则表达式逐个匹配
    while ((match = regex.exec(content)) !== null) {
        if (match[1]) keys.add(match[1]);
    }
    return Array.from(keys);
}

// 提取 <script> 标签内的内容并解析为 AST
function extractScriptTranslations(scriptContent) {
    const keys = new Set();
    const ast = parser.parse(scriptContent, {
        sourceType: 'module',
        plugins: ['jsx'],
    });

    traverse(ast, {
        CallExpression({ node }) {
            const isTranslationCall = 
                (node.callee.name === '$t' || 
                 (node.callee.type === 'MemberExpression' && 
                  node.callee.object.type === 'ThisExpression' && 
                  node.callee.property.name === '$t'));

            if (isTranslationCall && node.arguments.length > 0) {
                const translationKey = node.arguments[0].value;
                if (translationKey) keys.add(translationKey);
            }
        },
    });

    return Array.from(keys);
}

// 提取 HTML 和 JavaScript 翻译内容
function extractAllTranslations(content) {
    const htmlTranslations = extractHtmlTranslations(content);

    // 提取 <script> 部分并解析
    const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>/);
    const scriptContent = scriptMatch ? scriptMatch[1] : '';
    const scriptTranslations = extractScriptTranslations(scriptContent);

    // 合并结果
    return Array.from(new Set([...htmlTranslations, ...scriptTranslations]));
}


function readVueFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    
    list.forEach(file => {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(readVueFiles(file));
        } else if (file.endsWith('.vue')) {
            results.push(file);
        }
    });
    
    return results;
}

function extractTranslationsFromProject(dir) {
    const files = readVueFiles(dir);
    console.log(files, 'files')
    const translations = new Set();

    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const keys = extractAllTranslations(content);
        keys.forEach(key => translations.add(key));
    });
    console.log(translations, 'translations')
    return Array.from(translations);
}

module.exports = extractTranslationsFromProject;