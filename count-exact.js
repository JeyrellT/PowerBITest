// Script simple para contar preguntas
const fs = require('fs');

// Leer el archivo
const content = fs.readFileSync('./src/data/preguntas.js', 'utf8');

// Contar IDs únicos
const idMatches = content.match(/id:\s*'[^']+'/g);
const uniqueIds = new Set(idMatches);

console.log('\n' + '='.repeat(60));
console.log('📊 CONTEO EXACTO DE PREGUNTAS');
console.log('='.repeat(60));
console.log(`\n🎯 TOTAL DE PREGUNTAS: ${uniqueIds.size}\n`);

// Contar por dominio
const dominios = {
  'prep': 'Preparar los Datos',
  'model': 'Modelar los Datos', 
  'viz': 'Visualizar y Analizar',
  'admin': 'Administrar y Asegurar'
};

const niveles = {
  'prin': 'Principiante',
  'inter': 'Intermedio',
  'avanz': 'Avanzado'
};

const countByDomain = {};
const countByLevel = {};
const detailCounts = {};

uniqueIds.forEach(id => {
  const cleanId = id.replace(/id:\s*'/, '').replace(/'/, '');
  const parts = cleanId.split('_');
  const dominio = parts[0];
  const nivel = parts[1];
  
  // Contar por dominio
  if (!countByDomain[dominio]) {
    countByDomain[dominio] = 0;
  }
  countByDomain[dominio]++;
  
  // Contar por nivel
  if (!countByLevel[nivel]) {
    countByLevel[nivel] = 0;
  }
  countByLevel[nivel]++;
  
  // Desglose detallado
  if (!detailCounts[dominio]) {
    detailCounts[dominio] = {};
  }
  if (!detailCounts[dominio][nivel]) {
    detailCounts[dominio][nivel] = 0;
  }
  detailCounts[dominio][nivel]++;
});

console.log('📚 POR DOMINIO:');
console.log('-'.repeat(60));
Object.entries(countByDomain).forEach(([dom, count]) => {
  const nombre = dominios[dom] || dom;
  const percentage = ((count / uniqueIds.size) * 100).toFixed(1);
  console.log(`  ${nombre.padEnd(30)} ${count.toString().padStart(3)} preguntas (${percentage}%)`);
});

console.log('\n⭐ POR NIVEL DE DIFICULTAD:');
console.log('-'.repeat(60));
Object.entries(countByLevel).forEach(([niv, count]) => {
  const nombre = niveles[niv] || niv;
  const icon = niv === 'prin' ? '🟢' : niv === 'inter' ? '🟠' : '🔴';
  const percentage = ((count / uniqueIds.size) * 100).toFixed(1);
  console.log(`  ${icon} ${nombre.padEnd(25)} ${count.toString().padStart(3)} preguntas (${percentage}%)`);
});

console.log('\n📋 DESGLOSE DETALLADO (Dominio x Nivel):');
console.log('-'.repeat(60));
Object.entries(detailCounts).forEach(([dom, niveles]) => {
  const nombreDom = dominios[dom] || dom;
  console.log(`\n  ${nombreDom}:`);
  let total = 0;
  Object.entries(niveles).forEach(([niv, count]) => {
    const nombreNiv = niv === 'prin' ? 'Principiante' : niv === 'inter' ? 'Intermedio' : 'Avanzado';
    console.log(`    - ${nombreNiv}: ${count} preguntas`);
    total += count;
  });
  console.log(`    TOTAL: ${total} preguntas`);
});

console.log('\n' + '='.repeat(60));
console.log('✅ Conteo completado\n');
