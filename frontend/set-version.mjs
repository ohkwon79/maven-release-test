// from : https://github.com/vercel/release/blob/5b434c96e8809b2c9b287ea17124887e260d8aab/lib/bump.js#L30
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const newVersion = process.env.NEW_VERSION;

function readJSONSync(path) {
    const data = fs.readFileSync(path);
    return JSON.parse(data);
}

function writeJSONSync(path, content, space) {
    fs.writeFileSync(path, JSON.stringify(content, null, space), 'utf8');
}

function changeVersion(pkgFile, newVersion, mustExists) {
    const pkgPath = path.join(__dirname, pkgFile);

    if (!fs.existsSync(pkgPath)) {
        if (mustExists) {
            throw new Error(`The "${pkgFile}" file doesn't exist`);
        } else {
            console.log(`The "${pkgFile}" file doesn't exist. no change.`)
            return;
        }
    }

    let pkgContent;

    try {
        pkgContent = readJSONSync(pkgPath);
    } catch (err) {
        throw new Error(`Couldn't parse "${pkgFile}"`);
    }

    if (!pkgContent.version) {
        throw new Error(`No "version" field inside "${pkgFile}"`);
    }

    // console.log(`parentVersion: ${newVersion}, ${pkgFile} version: ${pkgContent.version}`);
    const { version: oldVersion } = pkgContent;
    if (oldVersion !== newVersion) {
        pkgContent.version = newVersion;

        try {
            writeJSONSync(pkgPath, pkgContent, 2);
        } catch (err) {
            throw new Error(`Couldn't write to "${pkgFile}"`);
        }

        console.log(`${pkgFile} - version: ${oldVersion} => ${newVersion}`);
    } else {
        console.log(`${pkgFile} - version: ${oldVersion}! => skip!`);
    }
}

changeVersion('package.json', newVersion, true);
changeVersion('package-lock.json', newVersion);