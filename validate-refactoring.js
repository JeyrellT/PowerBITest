#!/usr/bin/env node

/**
 * 🔍 Script de Validación de Refactorización
 * 
 * Verifica que:
 * 1. No haya imports deprecated en componentes activos
 * 2. Todos los componentes principales usen useCxCProgress
 * 3. No haya escrituras directas a localStorage fuera del servicio
 */

const fs = require('fs');
const path = require('path');

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.cyan}ℹ️  ${msg}${colors.reset}`),
  title: (msg) => console.log(`\n${colors.bold}${colors.blue}${msg}${colors.reset}\n`)
};

// Configuración
const srcDir = path.join(__dirname, 'src');
const componentsDir = path.join(srcDir, 'components');
const utilsDir = path.join(srcDir, 'utils');

// Patrones a buscar
const patterns = {
  deprecatedImports: [
    /from ['"].*progressManager['"]/g,
    /from ['"].*questionTracker['"]/g,
    /from ['"].*questionScorer['"]/g
  ],
  contextImport: /useCxCProgress/g,
  localStorageWrite: /localStorage\.setItem|localStorage\.removeItem|localStorage\.clear/g
};

// Archivos excluidos de validación (porque están deprecated)
const excludedFiles = [
  'progressManager.js',
  'questionTracker.js',
  'questionScorer.js',
  'ProfileScreenEnhanced.old.js'
];

/**
 * Lee archivo y retorna contenido
 */
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    log.error(`Error leyendo archivo ${filePath}: ${error.message}`);
    return null;
  }
}

/**
 * Obtiene todos los archivos .js en un directorio recursivamente
 */
function getJsFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.js')) {
        // Excluir archivos deprecated
        if (!excludedFiles.includes(entry.name)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  traverse(dir);
  return files;
}

/**
 * Verifica imports deprecated
 */
function checkDeprecatedImports(files) {
  log.title('🔍 Verificando imports deprecated...');
  
  let foundIssues = false;
  
  for (const file of files) {
    const content = readFile(file);
    if (!content) continue;
    
    for (const pattern of patterns.deprecatedImports) {
      const matches = content.match(pattern);
      if (matches) {
        foundIssues = true;
        log.error(`Archivo: ${path.relative(srcDir, file)}`);
        log.warning(`  Encontrado: ${matches.join(', ')}`);
        log.info(`  Acción: Reemplazar con 'import { useCxCProgress } from '../contexts/CxCProgressContext'`);
      }
    }
  }
  
  if (!foundIssues) {
    log.success('No se encontraron imports deprecated en archivos activos');
  }
  
  return !foundIssues;
}

/**
 * Verifica que componentes principales usen el contexto
 */
function checkContextUsage() {
  log.title('🔍 Verificando uso de useCxCProgress...');
  
  const criticalComponents = [
    'ResultsScreen.js',
    'QuizScreen.js',
    'ProfileScreen.js',
    'HomeScreen.js'
  ];
  
  let allUsingContext = true;
  
  for (const component of criticalComponents) {
    const filePath = path.join(componentsDir, component);
    
    if (!fs.existsSync(filePath)) {
      log.warning(`Componente ${component} no encontrado`);
      continue;
    }
    
    const content = readFile(filePath);
    if (!content) continue;
    
    const hasContextImport = patterns.contextImport.test(content);
    
    if (hasContextImport) {
      log.success(`${component} usa useCxCProgress`);
    } else {
      log.error(`${component} NO usa useCxCProgress`);
      allUsingContext = false;
    }
  }
  
  return allUsingContext;
}

/**
 * Verifica escrituras directas a localStorage (fuera de services)
 */
function checkDirectLocalStorageWrites(files) {
  log.title('🔍 Verificando escrituras a localStorage...');
  
  let foundIssues = false;
  const servicesDir = path.join(srcDir, 'services');
  
  for (const file of files) {
    // Permitir en archivos de servicios
    if (file.startsWith(servicesDir)) {
      continue;
    }
    
    const content = readFile(file);
    if (!content) continue;
    
    const matches = content.match(patterns.localStorageWrite);
    if (matches) {
      foundIssues = true;
      log.warning(`Archivo: ${path.relative(srcDir, file)}`);
      log.warning(`  Encontrado: ${matches.join(', ')}`);
      log.info(`  Acción: Usar funciones del contexto en su lugar`);
    }
  }
  
  if (!foundIssues) {
    log.success('No se encontraron escrituras directas a localStorage fuera de services');
  }
  
  return !foundIssues;
}

/**
 * Genera reporte final
 */
function generateReport(results) {
  log.title('📊 REPORTE FINAL');
  
  console.log(`${colors.bold}Estado de Validación:${colors.reset}`);
  console.log(`  ├─ Imports deprecated: ${results.deprecatedImports ? '✅' : '❌'}`);
  console.log(`  ├─ Uso de contexto: ${results.contextUsage ? '✅' : '❌'}`);
  console.log(`  └─ Escrituras localStorage: ${results.localStorageWrites ? '✅' : '❌'}`);
  
  const allPassed = results.deprecatedImports && results.contextUsage && results.localStorageWrites;
  
  console.log();
  
  if (allPassed) {
    log.success('🎉 ¡TODAS LAS VALIDACIONES PASARON!');
    log.info('La refactorización está completa y lista para producción.');
  } else {
    log.error('❌ Algunas validaciones fallaron');
    log.warning('Revisa los errores arriba y corrígelos antes de continuar.');
    process.exit(1);
  }
}

/**
 * Función principal
 */
function main() {
  console.log(`${colors.bold}${colors.cyan}
╔════════════════════════════════════════════════════════════╗
║    🔍 VALIDADOR DE REFACTORIZACIÓN                        ║
║    Sistema de Progreso Centralizado                       ║
╚════════════════════════════════════════════════════════════╝
${colors.reset}`);
  
  log.info(`Escaneando archivos en: ${srcDir}`);
  
  // Obtener archivos
  const componentFiles = getJsFiles(componentsDir);
  const utilFiles = getJsFiles(utilsDir);
  const allFiles = [...componentFiles, ...utilFiles];
  
  log.info(`Archivos encontrados: ${allFiles.length}`);
  
  // Ejecutar validaciones
  const results = {
    deprecatedImports: checkDeprecatedImports(allFiles),
    contextUsage: checkContextUsage(),
    localStorageWrites: checkDirectLocalStorageWrites(allFiles)
  };
  
  // Generar reporte
  generateReport(results);
}

// Ejecutar
main();
