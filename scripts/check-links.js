const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');

// Helper to recursively list all files
function walkSync(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      filelist = walkSync(filepath, filelist);
    } else {
      filelist.push(filepath);
    }
  });
  return filelist;
}

// 1. Gather all valid route patterns in App Router
function getValidRoutes() {
  const appDir = path.join(SRC_DIR, 'app');
  if (!fs.existsSync(appDir)) return [];
  
  const files = walkSync(appDir);
  const routes = ['/']; // Homepage is always valid

  files.forEach(file => {
    // Look for page.tsx files
    if (file.endsWith('page.tsx')) {
      const relative = path.relative(appDir, file);
      // Format to URL path representation
      let routePath = '/' + relative.replace(/\\/g, '/').replace(/\/page\.tsx$/, '');
      if (routePath === '/page.tsx') routePath = '/';
      
      // Clean up parentheses groups (e.g. (marketing), (auth) subfolders)
      routePath = routePath.replace(/\/\([^)]+\)/g, '');
      if (routePath === '') routePath = '/';
      routes.push(routePath);
    }
  });

  return [...new Set(routes)];
}

// 2. Parse links from file contents using regex
function checkLinksInFile(filePath, validRoutes) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Match standard href="/path" inside links
  const hrefRegex = /href=["'](\/[^"']*)["']/g;
  let match;
  let errors = 0;

  while ((match = hrefRegex.exec(content)) !== null) {
    const link = match[1];
    
    // Ignore external links
    if (link.startsWith('http') || link.startsWith('//') || link.startsWith('#')) {
      continue;
    }

    // Clean hash anchors or query parameters for comparison
    const cleanLink = link.split(/[?#]/)[0];
    
    if (!validRoutes.includes(cleanLink)) {
      console.error(`\x1b[31m[BROKEN LINK]\x1b[0m In file: ${path.relative(PROJECT_ROOT, filePath)} -> Link target "${link}" does not match any valid route.`);
      errors++;
    }
  }
  return errors;
}

function runAudit() {
  console.log("=== APEX TOOL HUB - BROKEN LINK AUDIT ===");
  
  const validRoutes = getValidRoutes();
  console.log(`Found ${validRoutes.length} active routes in project:`);
  validRoutes.forEach(r => console.log(` - ${r}`));
  console.log("");

  const filesToCheck = walkSync(SRC_DIR).filter(file => 
    file.endsWith('.tsx') || file.endsWith('.ts')
  );

  let totalErrors = 0;
  filesToCheck.forEach(file => {
    totalErrors += checkLinksInFile(file, validRoutes);
  });

  if (totalErrors === 0) {
    console.log("\x1b[32m[SUCCESS] All internal links are valid!\x1b[0m");
    process.exit(0);
  } else {
    console.log(`\x1b[31m[FAILURE] Found ${totalErrors} broken internal link(s).\x1b[0m`);
    process.exit(1);
  }
}

runAudit();
