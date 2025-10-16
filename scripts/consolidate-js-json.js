const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const outputFile = path.join(projectRoot, 'codigo_consolidado_js_json.txt');
const allowedExtensions = new Set(['.js', '.json']);
const ignoreDirNames = new Set(['node_modules', 'build', '.git']);

const collectedFiles = [];

function collectRootFiles() {
  const entries = fs.readdirSync(projectRoot, { withFileTypes: true });
  entries.forEach((entry) => {
    if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (allowedExtensions.has(ext)) {
        collectedFiles.push(path.join(projectRoot, entry.name));
      }
    }
  });
}

function walkDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  entries.forEach((entry) => {
    const absolutePath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (ignoreDirNames.has(entry.name)) {
        return;
      }
      walkDirectory(absolutePath);
      return;
    }

    if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (allowedExtensions.has(ext)) {
        collectedFiles.push(absolutePath);
      }
    }
  });
}

collectRootFiles();
walkDirectory(path.join(projectRoot, 'src'));
walkDirectory(path.join(projectRoot, 'public'));

const uniqueFiles = Array.from(new Set(collectedFiles))
  .filter((filePath) => fs.existsSync(filePath))
  .sort((a, b) => a.localeCompare(b));

let outputContent = '';
uniqueFiles.forEach((filePath, index) => {
  const relativePath = path.relative(projectRoot, filePath).split(path.sep).join('/');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  outputContent += `/* ===== File: ${relativePath} ===== */\n`;
  outputContent += `${fileContent}\n`;
  if (index !== uniqueFiles.length - 1) {
    outputContent += '\n';
  }
});

fs.writeFileSync(outputFile, outputContent, 'utf8');
console.log(`Consolidated ${uniqueFiles.length} files into ${path.basename(outputFile)}`);
