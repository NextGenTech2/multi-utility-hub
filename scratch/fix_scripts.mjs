import fs from 'fs';
import path from 'path';

const files = [
    'src/app/about/page.tsx',
    'src/app/contact/page.tsx',
    'src/app/calculators/mortgage/page.tsx',
    'src/app/calculators/sip/page.tsx',
    'src/app/calculators/ppf/page.tsx',
    'src/app/calculators/income-tax/page.tsx',
    'src/app/calculators/compound-interest/page.tsx',
    'src/app/calculators/date/page.tsx',
    'src/app/calculators/emi/page.tsx',
];

for (const f of files) {
    const fullPath = path.resolve(f);
    if (!fs.existsSync(fullPath)) continue;

    let content = fs.readFileSync(fullPath, 'utf8');

    // Replace <script> with <Script>
    content = content.replace(/<script/g, '<Script');
    content = content.replace(/<\/script>/g, '</Script>');

    // Add import if not present
    if (!content.includes('next/script') && content.includes('<Script')) {
        // Find first import
        content = content.replace(/import [^\n]+;\n/, match => match + 'import Script from "next/script";\n');
    }

    // Add id to <Script type="application/ld+json"> if missing
    // We can do a simple match and replace to add id randomly or sequentially
    let idCounter = 1;
    content = content.replace(/<Script([\s\S]*?)>/g, (match, p1) => {
        if (!p1.includes('id=')) {
            return `<Script id="ld-json-${idCounter++}"${p1}>`;
        }
        return match;
    });

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Fixed', f);
}
