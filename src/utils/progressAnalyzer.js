/**
 * 🎓 SISTEMA DE ANÁLISIS DE PROGRESO AVANZADO
 * 
 * Analiza el progreso del usuario de manera profunda y genera
 * insights útiles sobre habilidades, temas pendientes y recomendaciones
 */

import { PL300_SKILLS, getAllSkills } from './skillsMapping';
import { preguntasEjemplo } from '../data/preguntas';

/**
 * Obtener análisis completo del progreso del usuario
 */
export const getProgressAnalysis = (questionTracking, progress) => {
  return {
    skillsAnalysis: analyzeSkills(questionTracking, progress),
    topicsAnalysis: analyzeTopics(questionTracking, progress),
    readinessAnalysis: analyzeExamReadiness(questionTracking, progress),
    recommendationsAnalysis: generateRecommendations(questionTracking, progress),
    strengthsWeaknesses: identifyStrengthsAndWeaknesses(questionTracking, progress),
    learningPath: generateLearningPath(questionTracking, progress)
  };
};

/**
 * Analizar habilidades específicas del PL-300
 */
const analyzeSkills = (questionTracking, progress) => {
  const allSkills = getAllSkills();
  
  // Mapear preguntas a subdominios
  const subdomainStats = {};
  
  Object.entries(PL300_SKILLS).forEach(([domainKey, domain]) => {
    Object.entries(domain.subdomains).forEach(([subdomainKey, subdomain]) => {
      subdomainStats[subdomainKey] = {
        name: subdomain.name,
        icon: subdomain.icon,
        domain: domainKey,
        domainName: domain.name,
        attempted: 0,
        correct: 0,
        total: 0,
        mastery: 0,
        skills: subdomain.skills.map(skill => ({
          ...skill,
          progress: 0,
          mastered: false
        }))
      };
    });
  });
  
  // Contar preguntas por subdominio (basado en el campo 'subdominio' de las preguntas)
  if (questionTracking) {
    Object.values(questionTracking).forEach(track => {
      if (track.metadata && track.metadata.subdominio) {
        const subdominio = track.metadata.subdominio;
        
        if (subdomainStats[subdominio]) {
          subdomainStats[subdominio].attempted++;
          subdomainStats[subdominio].total++;
          
          if (track.correctAttempts > 0) {
            subdomainStats[subdominio].correct++;
          }
          
          // Calcular maestría (3+ intentos correctos consecutivos)
          if (track.consecutiveCorrect >= 3) {
            subdomainStats[subdominio].mastery++;
          }
        }
      }
    });
  }
  
  // Calcular progreso de cada subdominio
  Object.values(subdomainStats).forEach(stat => {
    if (stat.total > 0) {
      const accuracy = stat.correct / stat.total;
      const masteryRate = stat.mastery / stat.total;
      stat.progress = Math.round((accuracy * 0.6 + masteryRate * 0.4) * 100);
      
      // Marcar habilidades como dominadas si el progreso es alto
      stat.skills.forEach(skill => {
        skill.progress = stat.progress;
        skill.mastered = stat.progress >= 80;
      });
    }
  });
  
  return {
    bySubdomain: subdomainStats,
    summary: {
      totalSkills: allSkills.length,
      masteredSkills: Object.values(subdomainStats).reduce((sum, s) => 
        sum + s.skills.filter(sk => sk.mastered).length, 0
      ),
      inProgressSkills: Object.values(subdomainStats).reduce((sum, s) => 
        sum + s.skills.filter(sk => sk.progress > 0 && !sk.mastered).length, 0
      ),
      notStartedSkills: Object.values(subdomainStats).reduce((sum, s) => 
        sum + s.skills.filter(sk => sk.progress === 0).length, 0
      )
    }
  };
};

/**
 * Analizar temas y subdominios
 */
const analyzeTopics = (questionTracking, progress) => {
  const topics = {};
  
  // Contar todas las preguntas disponibles por dominio y subdominio
  Object.entries(preguntasEjemplo).forEach(([domain, levels]) => {
    if (!topics[domain]) {
      topics[domain] = {
        name: PL300_SKILLS[domain]?.name || domain,
        icon: PL300_SKILLS[domain]?.icon || '📚',
        subdomains: {},
        totalQuestions: 0,
        answeredQuestions: 0,
        correctQuestions: 0,
        pendingQuestions: 0,
        masteredQuestions: 0
      };
    }
    
    Object.values(levels).forEach(questionList => {
      questionList.forEach(q => {
        topics[domain].totalQuestions++;
        
        const subdomain = q.subdominio || 'otros';
        if (!topics[domain].subdomains[subdomain]) {
          topics[domain].subdomains[subdomain] = {
            name: PL300_SKILLS[domain]?.subdomains[subdomain]?.name || subdomain,
            icon: PL300_SKILLS[domain]?.subdomains[subdomain]?.icon || '📌',
            total: 0,
            answered: 0,
            correct: 0,
            pending: 0,
            mastered: 0
          };
        }
        
        topics[domain].subdomains[subdomain].total++;
        
        // Verificar si está respondida
        if (questionTracking && questionTracking[q.id]) {
          const track = questionTracking[q.id];
          topics[domain].answeredQuestions++;
          topics[domain].subdomains[subdomain].answered++;
          
          if (track.correctAttempts > 0) {
            topics[domain].correctQuestions++;
            topics[domain].subdomains[subdomain].correct++;
          }
          
          if (track.status === 'MASTERED') {
            topics[domain].masteredQuestions++;
            topics[domain].subdomains[subdomain].mastered++;
          }
        } else {
          topics[domain].pendingQuestions++;
          topics[domain].subdomains[subdomain].pending++;
        }
      });
    });
  });
  
  // Calcular porcentajes
  Object.values(topics).forEach(topic => {
    topic.completionRate = topic.totalQuestions > 0 
      ? Math.round((topic.answeredQuestions / topic.totalQuestions) * 100) 
      : 0;
    
    topic.accuracy = topic.answeredQuestions > 0
      ? Math.round((topic.correctQuestions / topic.answeredQuestions) * 100)
      : 0;
    
    topic.masteryRate = topic.totalQuestions > 0
      ? Math.round((topic.masteredQuestions / topic.totalQuestions) * 100)
      : 0;
    
    // Calcular para subdominios
    Object.values(topic.subdomains).forEach(sub => {
      sub.completionRate = sub.total > 0 
        ? Math.round((sub.answered / sub.total) * 100) 
        : 0;
      
      sub.accuracy = sub.answered > 0
        ? Math.round((sub.correct / sub.answered) * 100)
        : 0;
    });
  });
  
  return topics;
};

/**
 * Analizar preparación para el examen
 */
const analyzeExamReadiness = (questionTracking, progress) => {
  const totalQuestions = Object.values(preguntasEjemplo).reduce((sum, levels) => 
    sum + Object.values(levels).reduce((s, arr) => s + arr.length, 0), 0
  );
  
  const answeredCount = questionTracking ? Object.keys(questionTracking).length : 0;
  const masteredCount = questionTracking 
    ? Object.values(questionTracking).filter(t => t.status === 'MASTERED').length 
    : 0;
  
  const coverageRate = (answeredCount / totalQuestions) * 100;
  const masteryRate = answeredCount > 0 ? (masteredCount / answeredCount) * 100 : 0;
  
  // Calcular cobertura por dominio
  const domainCoverage = {};
  Object.entries(PL300_SKILLS).forEach(([key, domain]) => {
    domainCoverage[key] = {
      name: domain.name,
      weight: domain.weight,
      coverage: 0,
      mastery: 0,
      ready: false
    };
  });
  
  if (questionTracking) {
    Object.values(questionTracking).forEach(track => {
      if (track.metadata && track.metadata.domain) {
        const domain = track.metadata.domain;
        if (domainCoverage[domain]) {
          domainCoverage[domain].coverage++;
          if (track.status === 'MASTERED') {
            domainCoverage[domain].mastery++;
          }
        }
      }
    });
  }
  
  // Determinar si está listo por dominio
  Object.values(domainCoverage).forEach(dc => {
    const masteryPercentage = dc.coverage > 0 ? (dc.mastery / dc.coverage) * 100 : 0;
    dc.ready = masteryPercentage >= 70 && dc.coverage >= 15;
  });
  
  // Calcular puntuación general de preparación
  const readinessScore = Math.round(
    (coverageRate * 0.3) + 
    (masteryRate * 0.4) + 
    (Object.values(domainCoverage).filter(d => d.ready).length / 4 * 100 * 0.3)
  );
  
  let readinessLevel = 'Comenzando';
  let readinessMessage = 'Estás en las etapas iniciales. Sigue practicando!';
  let readinessColor = '#ff6b6b';
  
  if (readinessScore >= 85) {
    readinessLevel = 'Listo para Certificar';
    readinessMessage = '¡Excelente! Estás preparado para el examen PL-300';
    readinessColor = '#51cf66';
  } else if (readinessScore >= 70) {
    readinessLevel = 'Casi Listo';
    readinessMessage = 'Muy bien! Refuerza algunas áreas débiles y estarás listo';
    readinessColor = '#74c0fc';
  } else if (readinessScore >= 50) {
    readinessLevel = 'En Progreso';
    readinessMessage = 'Buen avance. Continúa practicando regularmente';
    readinessColor = '#ffd43b';
  } else if (readinessScore >= 25) {
    readinessLevel = 'Desarrollando';
    readinessMessage = 'Has comenzado bien. Mantén el ritmo de estudio';
    readinessColor = '#ff922b';
  }
  
  return {
    score: readinessScore,
    level: readinessLevel,
    message: readinessMessage,
    color: readinessColor,
    coverage: {
      total: totalQuestions,
      answered: answeredCount,
      mastered: masteredCount,
      pending: totalQuestions - answeredCount,
      coverageRate: Math.round(coverageRate),
      masteryRate: Math.round(masteryRate)
    },
    domainReadiness: domainCoverage,
    recommendations: generateExamRecommendations(readinessScore, domainCoverage)
  };
};

/**
 * Generar recomendaciones para el examen
 */
const generateExamRecommendations = (score, domainCoverage) => {
  const recommendations = [];
  
  if (score < 50) {
    recommendations.push({
      type: 'practice',
      priority: 'high',
      message: 'Aumenta tu práctica diaria a 30-45 minutos'
    });
  }
  
  // Recomendar dominios débiles
  const weakDomains = Object.entries(domainCoverage)
    .filter(([_, d]) => !d.ready)
    .sort((a, b) => a[1].coverage - b[1].coverage)
    .slice(0, 2);
  
  weakDomains.forEach(([key, domain]) => {
    recommendations.push({
      type: 'domain',
      priority: 'high',
      domain: key,
      message: `Enfócate en ${domain.name} (${domain.coverage} preguntas practicadas)`
    });
  });
  
  if (score >= 70 && score < 85) {
    recommendations.push({
      type: 'review',
      priority: 'medium',
      message: 'Repasa tus preguntas marcadas como "REVIEWING"'
    });
  }
  
  if (score >= 85) {
    recommendations.push({
      type: 'exam',
      priority: 'high',
      message: '¡Agenda tu examen de certificación PL-300!'
    });
  }
  
  return recommendations;
};

/**
 * Identificar fortalezas y debilidades
 */
const identifyStrengthsAndWeaknesses = (questionTracking, progress) => {
  const domainStats = progress?.domainStats || {};
  const levelStats = progress?.levelStats || {};
  
  const strengths = [];
  const weaknesses = [];
  const opportunities = [];
  
  // Analizar por dominio
  Object.entries(domainStats).forEach(([domain, stats]) => {
    if (stats.total >= 5) { // Solo si hay suficientes datos
      const accuracy = (stats.correct / stats.total) * 100;
      
      if (accuracy >= 80) {
        strengths.push({
          type: 'domain',
          area: PL300_SKILLS[domain]?.name || domain,
          icon: PL300_SKILLS[domain]?.icon || '📚',
          value: Math.round(accuracy),
          description: `Excelente dominio con ${stats.correct}/${stats.total} respuestas correctas`
        });
      } else if (accuracy < 60) {
        weaknesses.push({
          type: 'domain',
          area: PL300_SKILLS[domain]?.name || domain,
          icon: PL300_SKILLS[domain]?.icon || '📚',
          value: Math.round(accuracy),
          description: `Necesita mejorar: ${stats.correct}/${stats.total} correctas`,
          improvement: `Practica ${10 - stats.total} preguntas más en este dominio`
        });
      }
    } else if (stats.total === 0) {
      opportunities.push({
        type: 'domain',
        area: PL300_SKILLS[domain]?.name || domain,
        icon: PL300_SKILLS[domain]?.icon || '📚',
        description: 'Aún no explorado',
        action: 'Comienza con preguntas de nivel principiante'
      });
    }
  });
  
  // Analizar por nivel de dificultad
  Object.entries(levelStats).forEach(([level, stats]) => {
    if (stats.total >= 5) {
      const accuracy = (stats.correct / stats.total) * 100;
      
      if (accuracy >= 80) {
        strengths.push({
          type: 'level',
          area: `Nivel ${level.charAt(0).toUpperCase() + level.slice(1)}`,
          icon: level === 'avanzado' ? '🎯' : level === 'intermedio' ? '📖' : '🌱',
          value: Math.round(accuracy),
          description: `Buen desempeño en preguntas de nivel ${level}`
        });
      } else if (accuracy < 60) {
        weaknesses.push({
          type: 'level',
          area: `Nivel ${level.charAt(0).toUpperCase() + level.slice(1)}`,
          icon: level === 'avanzado' ? '🎯' : level === 'intermedio' ? '📖' : '🌱',
          value: Math.round(accuracy),
          description: `Dificultad con nivel ${level}`,
          improvement: `Revisa conceptos básicos antes de avanzar`
        });
      }
    }
  });
  
  return {
    strengths: strengths.sort((a, b) => b.value - a.value),
    weaknesses: weaknesses.sort((a, b) => a.value - b.value),
    opportunities: opportunities
  };
};

/**
 * Generar recomendaciones personalizadas
 */
const generateRecommendations = (questionTracking, progress) => {
  const recommendations = [];
  const domainStats = progress?.domainStats || {};
  const totalQuestions = progress?.questionsAnswered || 0;
  
  // Recomendación de práctica diaria
  if (totalQuestions < 20) {
    recommendations.push({
      id: 'daily-practice',
      priority: 'high',
      category: 'Hábito',
      icon: '🎯',
      title: 'Establece una rutina diaria',
      description: 'Responde al menos 10 preguntas diarias para construir momentum',
      action: 'Comenzar práctica diaria',
      benefit: '+20% de retención'
    });
  }
  
  // Identificar dominio menos practicado
  const domainsPracticed = Object.entries(domainStats)
    .map(([key, stats]) => ({ key, ...stats }))
    .sort((a, b) => a.total - b.total);
  
  if (domainsPracticed.length > 0 && domainsPracticed[0].total < 10) {
    const domain = domainsPracticed[0].key;
    recommendations.push({
      id: 'explore-domain',
      priority: 'medium',
      category: 'Exploración',
      icon: PL300_SKILLS[domain]?.icon || '📚',
      title: `Explora ${PL300_SKILLS[domain]?.name}`,
      description: `Solo has respondido ${domainsPracticed[0].total} preguntas en este dominio`,
      action: `Practicar ${PL300_SKILLS[domain]?.name}`,
      benefit: 'Cobertura balanceada'
    });
  }
  
  // Recomendación de revisión
  if (questionTracking) {
    const needsReview = Object.values(questionTracking)
      .filter(t => t.status === 'REVIEWING').length;
    
    if (needsReview >= 5) {
      recommendations.push({
        id: 'review-questions',
        priority: 'medium',
        category: 'Revisión',
        icon: '🔄',
        title: 'Repasa preguntas pendientes',
        description: `Tienes ${needsReview} preguntas que necesitan refuerzo`,
        action: 'Modo revisión',
        benefit: 'Consolidar conocimiento'
      });
    }
  }
  
  // Recomendación de nivel avanzado
  const advancedStats = domainStats['avanzado'];
  if (totalQuestions >= 30 && (!advancedStats || advancedStats.total < 5)) {
    recommendations.push({
      id: 'challenge-advanced',
      priority: 'low',
      category: 'Desafío',
      icon: '🚀',
      title: 'Intenta preguntas avanzadas',
      description: 'Estás listo para desafíos de mayor complejidad',
      action: 'Quiz nivel avanzado',
      benefit: 'Preparación completa'
    });
  }
  
  return recommendations;
};

/**
 * Generar ruta de aprendizaje personalizada
 */
const generateLearningPath = (questionTracking, progress) => {
  const path = [];
  
  // Paso 1: Fundamentos (si está comenzando)
  if (!progress || progress.questionsAnswered < 10) {
    path.push({
      step: 1,
      phase: 'Fundamentos',
      icon: '🌱',
      status: 'current',
      description: 'Comienza con preguntas de nivel principiante en todos los dominios',
      goals: [
        'Responder 10 preguntas de cada dominio',
        'Familiarizarte con el formato del examen',
        'Identificar tus áreas de interés'
      ],
      estimatedTime: '1-2 semanas'
    });
  }
  
  // Paso 2: Desarrollo (progreso inicial)
  if (progress && progress.questionsAnswered >= 10 && progress.questionsAnswered < 40) {
    path.push({
      step: 2,
      phase: 'Desarrollo',
      icon: '📚',
      status: progress.questionsAnswered >= 10 ? 'current' : 'locked',
      description: 'Profundiza en cada dominio con preguntas de nivel intermedio',
      goals: [
        'Alcanzar 70% de precisión en todos los dominios',
        'Completar 40+ preguntas totales',
        'Dominar conceptos clave de Power BI'
      ],
      estimatedTime: '2-3 semanas'
    });
  }
  
  // Paso 3: Especialización (progreso medio)
  if (progress && progress.questionsAnswered >= 40 && progress.questionsAnswered < 70) {
    path.push({
      step: 3,
      phase: 'Especialización',
      icon: '⭐',
      status: progress.questionsAnswered >= 40 ? 'current' : 'locked',
      description: 'Enfócate en tus debilidades y desafíate con preguntas avanzadas',
      goals: [
        'Mejorar dominios débiles a 75%+',
        'Responder 20+ preguntas de nivel avanzado',
        'Alcanzar estado MASTERED en 50% de preguntas'
      ],
      estimatedTime: '3-4 semanas'
    });
  }
  
  // Paso 4: Maestría (casi listo)
  if (progress && progress.questionsAnswered >= 70) {
    path.push({
      step: 4,
      phase: 'Maestría',
      icon: '🎯',
      status: progress.questionsAnswered >= 70 ? 'current' : 'locked',
      description: 'Repaso final y preparación para el examen de certificación',
      goals: [
        'Revisar todas las preguntas marcadas',
        '85%+ de precisión global',
        'Estado MASTERED en 70%+ de preguntas'
      ],
      estimatedTime: '1-2 semanas'
    });
  }
  
  // Paso 5: Certificación
  path.push({
    step: 5,
    phase: 'Certificación',
    icon: '🏆',
    status: (progress?.questionsAnswered || 0) >= 80 ? 'current' : 'locked',
    description: '¡Agenda y presenta tu examen PL-300!',
    goals: [
      'Agendar examen en Pearson VUE',
      'Último repaso de áreas clave',
      '¡Obtén tu certificación Microsoft PL-300!'
    ],
    estimatedTime: '1 semana'
  });
  
  return path;
};

const progressAnalyzerUtils = {
  getProgressAnalysis,
  analyzeSkills,
  analyzeTopics,
  analyzeExamReadiness,
  identifyStrengthsAndWeaknesses,
  generateRecommendations,
  generateLearningPath
};

export default progressAnalyzerUtils;
