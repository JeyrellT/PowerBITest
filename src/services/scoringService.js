/**
 * Servicio de Scoring
 * Calcula puntuaciones, rangos y penalizaciones
 */

// Definición de rangos
export const RANKS = [
  { key: 'BRONCE', name: 'Bronce', min: 0, max: 60, color: '#CD7F32', icon: '🥉', description: 'Estás dando los primeros pasos.' },
  { key: 'PLATA', name: 'Plata', min: 61, max: 80, color: '#C0C0C0', icon: '🥈', description: 'Buen avance, sigue practicando.' },
  { key: 'ORO', name: 'Oro', min: 81, max: 90, color: '#FFD700', icon: '🥇', description: 'Excelente desempeño, casi perfecto.' },
  { key: 'PLATINO', name: 'Platino', min: 91, max: 100, color: '#E5E4E2', icon: '💎', description: 'Dominio absoluto del contenido.' }
];

// Configuración de puntos base por misión
export const MISSION_BASE_POINTS = {
  'acto0_tutorial': 50,
  'acto1_m1_factura': 100,
  'acto1_m2_cash': 100,
  'acto1_m3_aging': 100,
  'acto2_m1_cleaning': 120,
  'acto2_m2_fuzzy': 120,
  'acto2_m3_dashboard': 120,
  'acto3_m1_fx': 150,
  'acto3_m2_kpi': 150,
  'acto3_m3_decision': 150,
  'epilogo_plan': 100
};

// Configuración de tiempos objetivo (minutos)
export const TIME_OBJECTIVES = {
  'acto0_tutorial': 20,
  'acto1_m1_factura': 50,
  'acto1_m2_cash': 55,
  'acto1_m3_aging': 60,
  'acto2_m1_cleaning': 60,
  'acto2_m2_fuzzy': 60,
  'acto2_m3_dashboard': 60,
  'acto3_m1_fx': 60,
  'acto3_m2_kpi': 60,
  'acto3_m3_decision': 60,
  'epilogo_plan': 45
};

class ScoringService {
  /**
   * Calcular puntuación de una misión
   * @param {string} missionId - ID de la misión
   * @param {Object} results - Resultados de la misión
   * @param {Array} helpUsed - Ayudas utilizadas
   * @param {number} timeSpent - Tiempo empleado en minutos
   * @returns {Object} - Score, grade y breakdown
   */
  calculateMissionScore(missionId, results = {}, helpUsed = [], timeSpent = 0) {
    const basePoints = MISSION_BASE_POINTS[missionId] || 100;
    let score = basePoints;
    const breakdown = {
      base: basePoints,
      accuracy: 0,
      timeBonus: 0,
      noHelpBonus: 0,
      helpPenalty: 0,
      partialResolutionPenalty: 0,
      final: 0
    };

    // Bonus por precisión (0-10 puntos)
    if (results.accuracy !== undefined) {
      const accuracyBonus = Math.round(10 * results.accuracy);
      breakdown.accuracy = accuracyBonus;
      score += accuracyBonus;
    }

    // Bonus por tiempo (5% si está dentro del objetivo)
    const timeObjective = TIME_OBJECTIVES[missionId] || 60;
    if (timeSpent > 0 && timeSpent <= timeObjective) {
      const timeBonus = Math.round(score * 0.05);
      breakdown.timeBonus = timeBonus;
      score += timeBonus;
    }

    // Penalizaciones por ayudas
    let helpPenalty = 0;
    let hasPartialResolution = false;

    helpUsed.forEach(help => {
      helpPenalty += help.cost || 0;
      if (help.type === 'resolution') {
        hasPartialResolution = true;
      }
    });

    breakdown.helpPenalty = -helpPenalty;
    score -= helpPenalty;

    // Bonus sin ayudas (10%)
    if (helpUsed.length === 0) {
      const noHelpBonus = Math.round(score * 0.10);
      breakdown.noHelpBonus = noHelpBonus;
      score += noHelpBonus;
    }

    // Penalización por resolución parcial (15%)
    if (hasPartialResolution) {
      const penalty = Math.round(score * 0.15);
      breakdown.partialResolutionPenalty = -penalty;
      score -= penalty;
    }

    // Calcular score final
    breakdown.final = Math.max(0, Math.min(100, Math.round(score)));
    const grade = this.getGradeFromScore(breakdown.final);
    const rank = this.getRankFromScore(breakdown.final);

    return {
      score: breakdown.final,
      grade,
      breakdown,
      rank
    };
  }

  /**
   * Obtener grado basado en puntuación
   */
  getGradeFromScore(score) {
    if (score >= 91) return 'Platino';
    if (score >= 81) return 'Oro';
    if (score >= 61) return 'Plata';
    return 'Bronce';
  }

  /**
   * Obtener rango basado en puntuación
   */
  getRankFromScore(score) {
    const rank = RANKS.find((item) => score >= item.min && score <= item.max);
    return rank ? rank : RANKS[0];
  }

  /**
   * Calcular puntuación promedio del usuario
   */
  calculateAverageScore(missions) {
    const completedMissions = Object.values(missions).filter(
      m => m.status === 'completed' && m.score !== undefined
    );

    if (completedMissions.length === 0) return 0;

    const totalScore = completedMissions.reduce((sum, m) => sum + m.score, 0);
    return Math.round(totalScore / completedMissions.length);
  }

  /**
   * Calcular progreso por acto
   */
  calculateActProgress(missions, actNumber) {
    const actMissions = Object.entries(missions).filter(([id]) => 
      id.startsWith(`acto${actNumber}_`)
    );

    const total = actMissions.length;
    const completed = actMissions.filter(([, m]) => m.status === 'completed').length;
    const avgScore = this.calculateAverageScore(
      Object.fromEntries(actMissions.filter(([, m]) => m.status === 'completed'))
    );

    return {
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      avgScore
    };
  }

  /**
   * Verificar si cumple criterios para badge específico
   */
  checkBadgeCriteria(badgeId, missionData, allMissions) {
    switch (badgeId) {
      case 'factura_impecable':
        return (
          missionData.missionId === 'acto1_m1_factura' &&
          missionData.grade === 'Platino' &&
          (!missionData.helpUsed || missionData.helpUsed.length === 0)
        );

      case 'conciliador_ninja':
        return (
          missionData.missionId === 'acto2_m2_fuzzy' &&
          missionData.results?.matchRate >= 0.80
        );

      case 'maestro_datasets':
        return (
          missionData.missionId === 'acto2_m1_cleaning' &&
          missionData.results?.errorReduction >= 0.90
        );

      case 'embajador_global':
        return (
          missionData.missionId === 'acto3_m3_decision' &&
          missionData.grade === 'Platino'
        );

      case 'cfo_ready':
        return (
          missionData.missionId === 'acto3_m3_decision' &&
          missionData.results?.qaScore >= 0.90
        );

      case 'sin_ayuda_acto1':
        const acto1Missions = ['acto1_m1_factura', 'acto1_m2_cash', 'acto1_m3_aging'];
        return acto1Missions.every(mId => {
          const mission = allMissions[mId];
          return (
            mission?.status === 'completed' &&
            (!mission.helpUsed || mission.helpUsed.length === 0)
          );
        });

      case 'speed_runner':
        const timeObjective = TIME_OBJECTIVES[missionData.missionId];
        return (
          missionData.timeSpent <= timeObjective &&
          missionData.score >= 90
        );

      default:
        return false;
    }
  }

  /**
   * Generar feedback personalizado
   */
  generateFeedback(score, grade, breakdown, missionId) {
    const feedback = [];

    // Feedback principal basado en grado
    if (grade === 'Platino') {
      feedback.push('¡Excelente trabajo! Rendimiento excepcional.');
    } else if (grade === 'Oro') {
      feedback.push('Muy buen trabajo. Estás dominando estos conceptos.');
    } else if (grade === 'Plata') {
      feedback.push('Buen trabajo. Hay oportunidades de mejora.');
    } else {
      feedback.push('Sigue practicando. Revisa los conceptos clave.');
    }

    // Feedback específico
    if (breakdown.helpPenalty < 0) {
      const helpCost = Math.abs(breakdown.helpPenalty);
      feedback.push(`Las ayudas utilizadas restaron ${helpCost} puntos. Intenta resolver más por tu cuenta.`);
    }

    if (breakdown.noHelpBonus > 0) {
      feedback.push('¡Bonus por autonomía! Completaste sin ayudas.');
    }

    if (breakdown.timeBonus > 0) {
      feedback.push('¡Bonus por eficiencia! Completaste en tiempo óptimo.');
    }

    if (breakdown.partialResolutionPenalty < 0) {
      feedback.push('La resolución parcial redujo tu puntuación. Desarrolla tus habilidades analíticas.');
    }

    return feedback;
  }

  /**
   * Calcular DSO (Days Sales Outstanding) simulado
   */
  calculateDSO(receivables, salesPerDay) {
    if (salesPerDay <= 0) return 0;
    return Math.round(receivables / salesPerDay);
  }

  /**
   * Calcular aging buckets
   */
  calculateAgingBuckets(invoices) {
    const buckets = {
      current: 0,      // 0-30 días
      bucket30: 0,     // 31-60 días
      bucket60: 0,     // 61-90 días
      bucket90: 0      // >90 días
    };

    const now = new Date();

    invoices.forEach(invoice => {
      const dueDate = new Date(invoice.dueDate);
      const daysOverdue = Math.floor((now - dueDate) / (1000 * 60 * 60 * 24));

      if (daysOverdue <= 0) {
        buckets.current += invoice.amount;
      } else if (daysOverdue <= 30) {
        buckets.current += invoice.amount;
      } else if (daysOverdue <= 60) {
        buckets.bucket30 += invoice.amount;
      } else if (daysOverdue <= 90) {
        buckets.bucket60 += invoice.amount;
      } else {
        buckets.bucket90 += invoice.amount;
      }
    });

    return buckets;
  }
}

export const scoringService = new ScoringService();
