/**
 * 📊 CONTADOR DE PREGUNTAS DISPONIBLES
 * 
 * Sistema inteligente para contar preguntas disponibles en tiempo real
 * según filtros de dominio, nivel y preguntas ya respondidas
 * 
 * ✅ REFACTORIZADO: Ya no depende de progressManager
 * Las preguntas respondidas se pasan como parámetro
 */

import { preguntasEjemplo } from '../data/preguntas';

export class QuestionCounter {
  /**
   * Cuenta preguntas disponibles según filtros
   * @param {string} domain - Dominio de preguntas ('all' o específico)
   * @param {string} level - Nivel de dificultad ('all' o específico)
   * @param {boolean} excludeAnswered - Si debe excluir preguntas respondidas
   * @param {Array<string>} answeredQuestionIds - IDs de preguntas ya respondidas (opcional)
   */
  static countAvailable(domain = 'all', level = 'all', excludeAnswered = false, answeredQuestionIds = []) {
    let preguntas = [];
    
    // Normalizar valores
    const dominioNormalizado = (domain === 'all' || domain === 'todos') ? null : domain;
    const nivelNormalizado = (level === 'all' || level === 'todos') ? null : level;
    
    // Recolectar preguntas según filtros
    if (!dominioNormalizado) {
      // Todas las preguntas de todos los dominios
      Object.keys(preguntasEjemplo).forEach(dom => {
        if (!nivelNormalizado) {
          // Todos los niveles
          Object.keys(preguntasEjemplo[dom]).forEach(niv => {
            preguntas = [...preguntas, ...preguntasEjemplo[dom][niv]];
          });
        } else {
          // Nivel específico
          if (preguntasEjemplo[dom][nivelNormalizado]) {
            preguntas = [...preguntas, ...preguntasEjemplo[dom][nivelNormalizado]];
          }
        }
      });
    } else {
      // Dominio específico
      if (preguntasEjemplo[dominioNormalizado]) {
        if (!nivelNormalizado) {
          // Todos los niveles de ese dominio
          Object.keys(preguntasEjemplo[dominioNormalizado]).forEach(niv => {
            preguntas = [...preguntas, ...preguntasEjemplo[dominioNormalizado][niv]];
          });
        } else {
          // Dominio y nivel específicos
          if (preguntasEjemplo[dominioNormalizado][nivelNormalizado]) {
            preguntas = [...preguntas, ...preguntasEjemplo[dominioNormalizado][nivelNormalizado]];
          }
        }
      }
    }
    
    // Excluir preguntas ya respondidas si se solicita
    if (excludeAnswered && answeredQuestionIds.length > 0) {
      preguntas = preguntas.filter(p => !answeredQuestionIds.includes(p.id));
    }
    
    return preguntas.length;
  }

  /**
   * Obtiene estadísticas completas de preguntas disponibles
   * @param {string} domain - Dominio de preguntas
   * @param {string} level - Nivel de dificultad
   * @param {Array<string>} answeredQuestionIds - IDs de preguntas ya respondidas (opcional)
   */
  static getDetailedStats(domain = 'all', level = 'all', answeredQuestionIds = []) {
    const total = this.countAvailable(domain, level, false, answeredQuestionIds);
    const available = this.countAvailable(domain, level, true, answeredQuestionIds);
    const answered = total - available;
    const percentage = total > 0 ? ((answered / total) * 100).toFixed(1) : 0;

    return {
      total,           // Total de preguntas en banco
      available,       // Preguntas disponibles (no respondidas)
      answered,        // Preguntas ya respondidas
      percentage,      // % completado
      canStartQuiz: available > 0
    };
  }

  /**
   * Obtiene resumen completo del banco de preguntas
   */
  static getBankSummary() {
    const summary = {
      total: 0,
      byDomain: {},
      byLevel: {},
      byDomainLevel: {}
    };

    // Contar por dominio y nivel
    Object.keys(preguntasEjemplo).forEach(domain => {
      summary.byDomain[domain] = 0;
      summary.byDomainLevel[domain] = {};

      Object.keys(preguntasEjemplo[domain]).forEach(level => {
        const count = preguntasEjemplo[domain][level].length;
        summary.total += count;
        summary.byDomain[domain] += count;
        summary.byDomainLevel[domain][level] = count;

        if (!summary.byLevel[level]) {
          summary.byLevel[level] = 0;
        }
        summary.byLevel[level] += count;
      });
    });

    return summary;
  }

  /**
   * Verifica si hay suficientes preguntas para el quiz configurado
   */
  static canStartQuiz(domain, level, requestedCount) {
    const available = this.countAvailable(domain, level, true);
    return {
      canStart: available >= requestedCount,
      available,
      requested: requestedCount,
      missing: Math.max(0, requestedCount - available)
    };
  }

  /**
   * Obtiene recomendación de cantidad máxima de preguntas
   */
  static getRecommendedCount(domain, level) {
    const available = this.countAvailable(domain, level, true);
    
    // Recomendar máximo 80% de las disponibles
    const recommended = Math.floor(available * 0.8);
    
    return {
      available,
      recommended: Math.max(1, recommended),
      max: available
    };
  }

  /**
   * ✅ NUEVO: Obtiene el total de preguntas por dominio específico
   * Útil para calcular cobertura correctamente
   * @param {string} domain - Dominio específico
   * @returns {number} - Total de preguntas en ese dominio
   */
  static getTotalByDomain(domain) {
    if (!domain || domain === 'all' || domain === 'todos') {
      return this.getBankSummary().total;
    }
    
    const summary = this.getBankSummary();
    return summary.byDomain[domain] || 0;
  }

  /**
   * ✅ NUEVO: Obtiene el total de preguntas por nivel específico
   * @param {string} level - Nivel específico
   * @returns {number} - Total de preguntas en ese nivel
   */
  static getTotalByLevel(level) {
    if (!level || level === 'all' || level === 'todos') {
      return this.getBankSummary().total;
    }
    
    const summary = this.getBankSummary();
    return summary.byLevel[level] || 0;
  }

  /**
   * Formatea números con separadores de miles
   */
  static formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  /**
   * Obtiene mensaje descriptivo del estado
   */
  static getStatusMessage(domain, level, requestedCount) {
    const stats = this.getDetailedStats(domain, level);
    
    if (stats.available === 0) {
      return {
        type: 'warning',
        icon: '⚠️',
        message: '¡Has respondido todas las preguntas disponibles con esta configuración!',
        suggestion: 'Intenta cambiar el dominio o nivel para acceder a más preguntas.'
      };
    }

    if (requestedCount > stats.available) {
      return {
        type: 'info',
        icon: 'ℹ️',
        message: `Solo hay ${stats.available} preguntas disponibles de las ${requestedCount} solicitadas.`,
        suggestion: 'Se usarán todas las preguntas disponibles.'
      };
    }

    return {
      type: 'success',
      icon: '✅',
      message: `${stats.available} preguntas disponibles de ${stats.total} totales.`,
      suggestion: `Has completado el ${stats.percentage}% de este conjunto.`
    };
  }
}

// Exportar instancia singleton
export const questionCounter = QuestionCounter;
