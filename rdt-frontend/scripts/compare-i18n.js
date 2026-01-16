import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCALES_ROOT = path.resolve(__dirname, '../src/locales');
const SOURCE_LANG = 'zh-CN';
const TARGET_LANGS = ['en-US'];

let hasError = false;

/**
 * Check if value is an I18nRecord type
 * @param value
 * @returns
 */
function isI18nRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Recursively get all Keys (flattened)
 * @param obj I18n record object
 * @param prefix key prefix
 * @returns flattened keys array
 */
function getKeys(obj, prefix = '') {
  let keys = [];
  for (const key of Object.keys(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    if (isI18nRecord(value)) {
      keys = keys.concat(getKeys(value, newKey));
    } else {
      keys.push(newKey);
    }
  }
  return keys;
}

/**
 * Compare a single target language module
 * @param sourceKeys source language keys
 * @param targetLang target language code
 * @param moduleName module file name
 */
function compareTargetModule(sourceKeys, targetLang, moduleName) {
  const targetPath = path.join(LOCALES_ROOT, targetLang, moduleName);

  if (!fs.existsSync(targetPath)) {
    console.error(chalk.red(`  ❌ [${targetLang}] Module missing: ${moduleName}`));
    hasError = true;
    return;
  }

  try {
    const targetRaw = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));
    if (!isI18nRecord(targetRaw)) {
      console.error(chalk.red(`  ❌ [${targetLang}] Invalid JSON structure: ${moduleName}`));
      hasError = true;
      return;
    }
    const targetKeys = new Set(getKeys(targetRaw));

    // Check missing Keys (In Source, not in Target)
    const missingKeys = [...sourceKeys].filter((k) => !targetKeys.has(k));
    if (missingKeys.length > 0) {
      console.error(chalk.red(`  ❌ [${targetLang}] Missing keys:`));
      missingKeys.forEach((k) => console.error(chalk.red(`     - ${k}`)));
      hasError = true;
    }

    // Check extra Keys (In Target, not in Source)
    const extraKeys = [...targetKeys].filter((k) => !sourceKeys.has(k));
    if (extraKeys.length > 0) {
      console.warn(chalk.yellow(`  ⚠️  [${targetLang}] Extra keys:`));
      extraKeys.forEach((k) => console.warn(chalk.yellow(`     + ${k}`)));
    }

    if (missingKeys.length === 0 && extraKeys.length === 0) {
      console.log(chalk.green(`  ✅ [${targetLang}] Perfect match`));
    }
  } catch (error) {
    console.error(chalk.red(`  ❌ [${targetLang}] Failed to parse JSON: ${moduleName}`));
    console.error(error);
    hasError = true;
  }
}

/**
 * Compare two language modules
 * @param moduleName module file name
 */
function compareModules(moduleName) {
  const sourcePath = path.join(LOCALES_ROOT, SOURCE_LANG, moduleName);

  if (!fs.existsSync(sourcePath)) {
    console.warn(
      chalk.yellow(`Start check failed: Source module ${SOURCE_LANG}/${moduleName} not found`)
    );
    return;
  }

  const sourceRaw = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'));
  if (!isI18nRecord(sourceRaw)) {
    console.error(chalk.red(`Invalid JSON structure in ${SOURCE_LANG}/${moduleName}`));
    return;
  }
  const sourceKeys = new Set(getKeys(sourceRaw));

  console.log(chalk.blue(`Checking module: ${moduleName}...`));

  for (const targetLang of TARGET_LANGS) {
    compareTargetModule(sourceKeys, targetLang, moduleName);
  }
}

// Main function
/**
 *
 */
function main() {
  const sourceDir = path.join(LOCALES_ROOT, SOURCE_LANG);
  if (!fs.existsSync(sourceDir)) {
    console.error(chalk.red(`Source language directory not found: ${sourceDir}`));
    process.exit(1);
  }

  const files = fs.readdirSync(sourceDir).filter((f) => f.endsWith('.json'));

  files.forEach((file) => {
    compareModules(file);
  });

  if (hasError) {
    console.error(chalk.bold.red('\nValidation Failed: I18n files are not synchronized!'));
    process.exit(1);
  } else {
    console.log(chalk.bold.green('\n✨ All I18n files are aligned!'));
  }
}

main();
