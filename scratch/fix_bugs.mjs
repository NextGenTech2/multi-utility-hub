import fs from 'fs';
import path from 'path';

// Fix "use client" in all files
function fixUseClient(dir) {
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const fullPath = path.resolve(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            fixUseClient(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('"use client";') && !content.trim().startsWith('"use client";')) {
                // Remove all instances of "use client";
                content = content.replace(/"use client";\s*/g, '');
                // Add it to the top
                content = '"use client";\n' + content;
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Fixed use client in', fullPath);
            }
        }
    }
}

fixUseClient(path.resolve('src/app'));

// Fix the salaryOptimizerEngine.ts bug
const enginePath = path.resolve('src/lib/engines/salaryOptimizerEngine.ts');
let engineContent = fs.readFileSync(enginePath, 'utf8');

engineContent = engineContent.replace(/currentResult\.newRegime\.taxBreakdown\.totalTax/g, 'currentResult.newRegime.totalTax');
engineContent = engineContent.replace(/currentResult\.newRegime\.takeHomeBreakdown\.yearlyTakeHome/g, 'currentResult.newRegime.takeHomeSalary');

engineContent = engineContent.replace(/optimizedResult\.newRegime\.taxBreakdown\.totalTax/g, 'optimizedResult.newRegime.totalTax');
engineContent = engineContent.replace(/optimizedResult\.newRegime\.takeHomeBreakdown\.yearlyTakeHome/g, 'optimizedResult.newRegime.takeHomeSalary');

fs.writeFileSync(enginePath, engineContent, 'utf8');
console.log('Fixed salaryOptimizerEngine.ts');
