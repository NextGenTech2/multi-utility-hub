import fs from 'fs';
import path from 'path';

function findFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const fullPath = path.resolve(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(findFiles(fullPath));
        } else if (fullPath.endsWith('.tsx')) {
            results.push(fullPath);
        }
    }
    return results;
}

const files = findFiles(path.resolve('src/app'));

for (const fullPath of files) {
    let content = fs.readFileSync(fullPath, 'utf8');

    if (content.includes('<Script') && !content.includes('next/script')) {
        console.log('Fixing import in', fullPath);
        // Add import to the very top of the file
        content = 'import Script from "next/script";\n' + content;
        fs.writeFileSync(fullPath, content, 'utf8');
    }
}
