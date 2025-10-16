/**
 * 🔍 DIAGNÓSTICO COMPLETO DEL SISTEMA DE DATOS
 * 
 * Este script inspecciona todo lo que está guardado en localStorage
 * y muestra un reporte detallado del estado de los datos
 */

console.log('\n' + '='.repeat(70));
console.log('🔍 DIAGNÓSTICO COMPLETO DEL SISTEMA DE DATOS');
console.log('='.repeat(70) + '\n');

// ============================================================================
// 1. INSPECCIONAR TODAS LAS KEYS DE LOCALSTORAGE
// ============================================================================
console.log('📦 KEYS EN LOCALSTORAGE:');
console.log('-'.repeat(70));

const allKeys = Object.keys(localStorage);
const pl300Keys = allKeys.filter(key => key.startsWith('pl300_'));

console.log(`Total de keys: ${allKeys.length}`);
console.log(`Keys de PL-300: ${pl300Keys.length}\n`);

pl300Keys.forEach(key => {
  const data = localStorage.getItem(key);
  const size = new Blob([data]).size;
  console.log(`  ✓ ${key.padEnd(35)} ${(size / 1024).toFixed(2)} KB`);
});

// ============================================================================
// 2. ANALIZAR QUESTION TRACKING
// ============================================================================
console.log('\n📝 QUESTION TRACKING (pl300_question_tracking):');
console.log('-'.repeat(70));

const trackingData = localStorage.getItem('pl300_question_tracking');
if (trackingData) {
  const tracking = JSON.parse(trackingData);
  const questionIds = Object.keys(tracking);
  
  console.log(`Total de preguntas rastreadas: ${questionIds.length}\n`);
  
  if (questionIds.length > 0) {
    // Estadísticas por estado
    const byStatus = {};
    const byConfidence = {};
    let totalAttempts = 0;
    let totalCorrect = 0;
    
    questionIds.forEach(id => {
      const q = tracking[id];
      byStatus[q.status] = (byStatus[q.status] || 0) + 1;
      byConfidence[q.confidenceLevel] = (byConfidence[q.confidenceLevel] || 0) + 1;
      totalAttempts += q.totalAttempts || 0;
      totalCorrect += q.correctAttempts || 0;
    });
    
    console.log('  Por Estado:');
    Object.entries(byStatus).forEach(([status, count]) => {
      console.log(`    ${status}: ${count}`);
    });
    
    console.log('\n  Por Nivel de Confianza:');
    Object.entries(byConfidence).forEach(([conf, count]) => {
      console.log(`    ${conf}: ${count}`);
    });
    
    console.log(`\n  Total de intentos: ${totalAttempts}`);
    console.log(`  Intentos correctos: ${totalCorrect}`);
    console.log(`  Precisión global: ${totalAttempts > 0 ? ((totalCorrect / totalAttempts) * 100).toFixed(1) : 0}%`);
    
    // Mostrar ejemplo de una pregunta
    console.log('\n  Ejemplo de pregunta rastreada:');
    const firstQuestion = tracking[questionIds[0]];
    console.log(JSON.stringify(firstQuestion, null, 2));
  }
} else {
  console.log('  ⚠️ No hay datos de tracking');
}

// ============================================================================
// 3. ANALIZAR PROGRESO
// ============================================================================
console.log('\n📊 PROGRESO (pl300_progress):');
console.log('-'.repeat(70));

const progressData = localStorage.getItem('pl300_progress');
if (progressData) {
  const progress = JSON.parse(progressData);
  
  console.log(`  Puntos totales: ${progress.totalPoints || 0}`);
  console.log(`  XP total: ${progress.totalXP || 0}`);
  console.log(`  Nivel actual: ${progress.currentLevel || 1}`);
  console.log(`  Preguntas totales: ${progress.totalQuestions || 0}`);
  console.log(`  Preguntas correctas: ${progress.correctAnswers || 0}`);
  
  if (progress.domainStats) {
    console.log('\n  Estadísticas por Dominio:');
    Object.entries(progress.domainStats).forEach(([domain, stats]) => {
      const accuracy = stats.total > 0 ? ((stats.correct / stats.total) * 100).toFixed(1) : 0;
      console.log(`    ${domain}: ${stats.correct}/${stats.total} (${accuracy}%)`);
    });
  }
  
  if (progress.levelStats) {
    console.log('\n  Estadísticas por Nivel:');
    Object.entries(progress.levelStats).forEach(([level, stats]) => {
      const accuracy = stats.total > 0 ? ((stats.correct / stats.total) * 100).toFixed(1) : 0;
      console.log(`    ${level}: ${stats.correct}/${stats.total} (${accuracy}%)`);
    });
  }
  
  console.log('\n  Datos completos:');
  console.log(JSON.stringify(progress, null, 2));
} else {
  console.log('  ⚠️ No hay datos de progreso');
}

// ============================================================================
// 4. ANALIZAR PREGUNTAS RESPONDIDAS
// ============================================================================
console.log('\n✅ PREGUNTAS RESPONDIDAS (pl300_answered_questions):');
console.log('-'.repeat(70));

const answeredData = localStorage.getItem('pl300_answered_questions');
if (answeredData) {
  const answered = JSON.parse(answeredData);
  console.log(`  Total: ${answered.length}`);
  console.log(`  IDs: ${answered.join(', ')}`);
} else {
  console.log('  ⚠️ No hay preguntas respondidas registradas');
}

// ============================================================================
// 5. VERIFICAR CONSISTENCIA
// ============================================================================
console.log('\n🔧 VERIFICACIÓN DE CONSISTENCIA:');
console.log('-'.repeat(70));

const trackingCount = trackingData ? Object.keys(JSON.parse(trackingData)).length : 0;
const answeredCount = answeredData ? JSON.parse(answeredData).length : 0;

console.log(`  Preguntas en tracking: ${trackingCount}`);
console.log(`  Preguntas en answered: ${answeredCount}`);

if (trackingCount !== answeredCount) {
  console.log(`  ⚠️ INCONSISTENCIA: Hay ${Math.abs(trackingCount - answeredCount)} preguntas de diferencia`);
} else {
  console.log(`  ✅ Consistente`);
}

// ============================================================================
// 6. RECOMENDACIONES
// ============================================================================
console.log('\n💡 RECOMENDACIONES:');
console.log('-'.repeat(70));

if (!trackingData || trackingCount === 0) {
  console.log('  • No hay datos de tracking. Completa un quiz para empezar.');
}

if (!progressData) {
  console.log('  • No hay datos de progreso. El sistema creará datos al completar el primer quiz.');
}

if (trackingCount > 0 && answeredCount === 0) {
  console.log('  • Hay tracking pero no answered questions. Posible error en el guardado.');
}

console.log('\n' + '='.repeat(70));
console.log('✅ Diagnóstico completado');
console.log('='.repeat(70) + '\n');
