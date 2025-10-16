// Script para contar preguntas exactas
import { preguntasEjemplo } from './src/data/preguntas.js';

let totalCount = 0;
const countByDomain = {};
const countByLevel = {};
const detailByDomainLevel = {};

Object.keys(preguntasEjemplo).forEach(domain => {
  countByDomain[domain] = 0;
  detailByDomainLevel[domain] = {};
  
  Object.keys(preguntasEjemplo[domain]).forEach(level => {
    const count = preguntasEjemplo[domain][level].length;
    totalCount += count;
    countByDomain[domain] += count;
    detailByDomainLevel[domain][level] = count;
    
    if (!countByLevel[level]) {
      countByLevel[level] = 0;
    }
    countByLevel[level] += count;
  });
});

console.log('\n' + '='.repeat(60));
console.log('📊 RESUMEN EXACTO DE PREGUNTAS DISPONIBLES');
console.log('='.repeat(60));
console.log(`\n🎯 TOTAL DE PREGUNTAS: ${totalCount}\n`);

console.log('📚 POR DOMINIO:');
console.log('-'.repeat(60));
Object.entries(countByDomain).forEach(([domain, count]) => {
  const percentage = ((count / totalCount) * 100).toFixed(1);
  const domainNames = {
    'preparar-datos': 'Preparar los Datos',
    'modelar-datos': 'Modelar los Datos',
    'visualizar-analizar': 'Visualizar y Analizar',
    'administrar-asegurar': 'Administrar y Asegurar'
  };
  console.log(`  ${domainNames[domain].padEnd(30)} ${count.toString().padStart(3)} preguntas (${percentage}%)`);
});

console.log('\n⭐ POR NIVEL DE DIFICULTAD:');
console.log('-'.repeat(60));
Object.entries(countByLevel).forEach(([level, count]) => {
  const percentage = ((count / totalCount) * 100).toFixed(1);
  const levelNames = {
    'principiante': '🟢 Principiante',
    'intermedio': '🟠 Intermedio',
    'avanzado': '🔴 Avanzado'
  };
  console.log(`  ${levelNames[level].padEnd(30)} ${count.toString().padStart(3)} preguntas (${percentage}%)`);
});

console.log('\n📋 DESGLOSE DETALLADO (Dominio x Nivel):');
console.log('-'.repeat(60));
Object.entries(detailByDomainLevel).forEach(([domain, levels]) => {
  const domainNames = {
    'preparar-datos': 'Preparar los Datos',
    'modelar-datos': 'Modelar los Datos',
    'visualizar-analizar': 'Visualizar y Analizar',
    'administrar-asegurar': 'Administrar y Asegurar'
  };
  console.log(`\n  ${domainNames[domain]}:`);
  Object.entries(levels).forEach(([level, count]) => {
    const levelName = level === 'principiante' ? 'Principiante' : level === 'intermedio' ? 'Intermedio' : 'Avanzado';
    console.log(`    - ${levelName}: ${count} preguntas`);
  });
});

console.log('\n' + '='.repeat(60));
console.log('✅ Conteo completado\n');
