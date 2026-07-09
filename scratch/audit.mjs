import fs from 'fs';
import path from 'path';

const calculatorsDir = 'src/app/calculators';
const calculators = fs.readdirSync(calculatorsDir).filter(name => fs.statSync(path.join(calculatorsDir, name)).isDirectory());

const results = [];

for (const calc of calculators) {
    const pagePath = path.join(calculatorsDir, calc, 'page.tsx');
    const clientPathCandidates = fs.readdirSync(path.join(calculatorsDir, calc))
        .filter(f => f.endsWith('Client.tsx'));
    
    let hasFAQSchema = false;
    let hasFAQComponent = false;
    let hasExploreMore = false;
    let hasSEOArticle = false;

    if (fs.existsSync(pagePath)) {
        const content = fs.readFileSync(pagePath, 'utf8');
        hasFAQSchema = content.includes('"@type": "FAQPage"');
    }

    if (clientPathCandidates.length > 0) {
        const clientPath = path.join(calculatorsDir, calc, clientPathCandidates[0]);
        const content = fs.readFileSync(clientPath, 'utf8');
        
        hasFAQComponent = content.includes('<FAQAccordion') || content.includes('FAQAccordion');
        hasExploreMore = content.includes('Explore More') || content.includes('Salary & Tax') || content.includes('Employee Benefits');
        hasSEOArticle = content.includes('Understanding') || content.includes('What is') || content.includes('How is'); // Rough heuristic
    }

    results.push({
        calculator: calc,
        hasFAQSchema,
        hasFAQComponent,
        hasExploreMore,
        hasSEOArticle
    });
}

console.table(results);
