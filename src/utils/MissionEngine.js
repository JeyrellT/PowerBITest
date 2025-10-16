/**
 * MissionEngine.js - Motor principal de ejecución de misiones
 * Interpreta configuraciones JSON y orquesta el flujo de misiones
 * Basado en FASE_3_ARQUITECTURA_CONTENIDO.md
 */

import { MISSIONS } from '../data/cxc/missions';
import { DIALOGUES } from '../data/cxc/characters';
import { TUTORIAL_QUIZ, TUTORIAL_FORM_FIELDS, TUTORIAL_FORM_INSTRUCTIONS } from '../data/cxc/tutorialContent';
import { 
  ACTO1_M1_VALIDATION_CHECKS, 
  ACTO1_M1_FORM_FIELDS, 
  ACTO1_M1_VALIDATION_INSTRUCTIONS,
  ACTO1_M1_FORM_INSTRUCTIONS 
} from '../data/cxc/acto1Mission1Content';
import { 
  ACTO1_M2_INSTRUCTIONS, 
  ACTO1_M2_PROBLEM_SOLVING 
} from '../data/cxc/acto1Mission2Content';
import { 
  ACTO1_M3_VALIDATION_CHECKS,
  ACTO1_M3_FORM_FIELDS, 
  ACTO1_M3_INSTRUCTIONS,
  ACTO1_M3_EMAIL_TEMPLATE,
  ACTO1_M3_PROBLEM_SOLVING 
} from '../data/cxc/acto1Mission3Content';
import {
  ACTO2_M1_VALIDATION_CHECKS,
  ACTO2_M1_FORM_FIELDS,
  ACTO2_M1_INSTRUCTIONS,
  ACTO2_M1_PROBLEM_SOLVING
} from '../data/cxc/acto2Mission1Content';
import {
  ACTO2_M2_VALIDATION_CHECKS,
  ACTO2_M2_FORM_FIELDS,
  ACTO2_M2_INSTRUCTIONS,
  ACTO2_M2_PROBLEM_SOLVING
} from '../data/cxc/acto2Mission2Content';
import {
  ACTO2_M3_VALIDATION_CHECKS,
  ACTO2_M3_FORM_FIELDS,
  ACTO2_M3_INSTRUCTIONS,
  ACTO2_M3_PROBLEM_SOLVING
} from '../data/cxc/acto2Mission3Content';
import {
  ACTO3_M1_INSTRUCTIONS,
  ACTO3_M1_VALIDATION_CHECKS,
  ACTO3_M1_FORM_FIELDS,
  ACTO3_M1_PROBLEM_SOLVING
} from '../data/cxc/acto3Mission1Content';
import {
  ACTO3_M2_INSTRUCTIONS,
  ACTO3_M2_VALIDATION_CHECKS,
  ACTO3_M2_FORM_FIELDS,
  ACTO3_M2_PROBLEM_SOLVING
} from '../data/cxc/acto3Mission2Content';
import {
  ACTO3_M3_INSTRUCTIONS,
  ACTO3_M3_VALIDATION_CHECKS,
  ACTO3_M3_FORM_FIELDS,
  ACTO3_M3_PROBLEM_SOLVING
} from '../data/cxc/acto3Mission3Content';
import {
  EPILOGUE_INSTRUCTIONS,
  EPILOGUE_VALIDATION_CHECKS,
  EPILOGUE_FORM_FIELDS,
  EPILOGUE_PROBLEM_SOLVING
} from '../data/cxc/epilogueContent';

/**
 * Clase principal del motor de misiones
 */
export class MissionEngine {
  constructor(missionId, callbacks = {}) {
    this.missionId = missionId;
    this.mission = MISSIONS[missionId];
    this.callbacks = callbacks;
    this.currentStep = 0;
    this.userData = {};
    this.validationResults = {};
    this.startTime = Date.now();
    
    if (!this.mission) {
      throw new Error(`Mission ${missionId} not found`);
    }
  }

  /**
   * Obtiene la configuración de la misión
   */
  getMissionConfig() {
    return {
      id: this.mission.id,
      title: this.mission.title,
      subtitle: this.mission.subtitle,
      description: this.mission.description,
      objectives: this.mission.objectives,
      kpis: this.mission.kpis,
      duration: this.mission.duration,
      dificultad: this.mission.dificultad,
      dataset: this.mission.dataset
    };
  }

  /**
   * Obtiene los diálogos intro según el acto
   */
  getIntroDialogues() {
    // Mapeo de misiones a diálogos
    const dialogueMap = {
      'acto0_tutorial': DIALOGUES.tutorial_welcome,
      'acto1_m1_factura': DIALOGUES.acto1_inicio,
      'acto1_m2_cash': DIALOGUES.acto1_cash_app,
      'acto2_m1_cleaning': DIALOGUES.acto2_crisis,
      'acto3_m1_fx': DIALOGUES.acto3_global
    };

    return dialogueMap[this.missionId] || [
      `Bienvenido a la misión: ${this.mission.title}`,
      this.mission.description,
      '¡Vamos a comenzar!'
    ];
  }

  /**
   * Obtiene los diálogos de feedback según el rendimiento
   */
  getFeedbackDialogues(score, grade) {
    if (score >= 90) {
      return [
        '¡Increíble trabajo!',
        `Has obtenido ${score} puntos - calificación ${grade}.`,
        'Tu desempeño fue excepcional. Sigue así.'
      ];
    } else if (score >= 70) {
      return [
        '¡Buen trabajo!',
        `Has obtenido ${score} puntos - calificación ${grade}.`,
        'Hay algunos aspectos que puedes mejorar, pero vas por buen camino.'
      ];
    } else {
      return [
        'Misión completada.',
        `Has obtenido ${score} puntos - calificación ${grade}.`,
        'Te recomiendo revisar los conceptos y volver a intentarlo para mejorar tu puntuación.'
      ];
    }
  }

  /**
   * Obtiene las actividades/pasos de la misión
   */
  getActivities() {
    // Aquí se cargarían las actividades específicas de cada misión
    // Por ahora, generamos actividades base según el tipo de misión
    
    const baseActivities = this.generateActivitiesForMission();
    return Array.isArray(baseActivities) ? baseActivities : [];
  }

  /**
   * Genera actividades según el tipo de misión
   */
  generateActivitiesForMission() {
    const { acto } = this.mission;

    // Tutorial
    if (acto === 0) {
      return [
        {
          id: 'intro_quiz',
          type: 'quiz',
          title: 'Conceptos Básicos de CxC',
          questions: TUTORIAL_QUIZ
        },
        {
          id: 'demo_invoice_form',
          type: 'form',
          title: 'Completar Factura de Demostración',
          fields: TUTORIAL_FORM_FIELDS,
          instructions: TUTORIAL_FORM_INSTRUCTIONS,
          initialData: {},
          datasetName: 'incomplete_invoice'
        }
      ];
    }

    // Acto 1 - Factura Perfecta
    if (this.missionId === 'acto1_m1_factura') {
      return [
        {
          id: 'validate_invoice',
          type: 'validation',
          title: 'Validar Campos de la Factura',
          validationChecks: ACTO1_M1_VALIDATION_CHECKS,
          instructions: ACTO1_M1_VALIDATION_INSTRUCTIONS,
          dataset: 'incomplete_invoice',
          datasetName: 'incomplete_invoice'
        },
        {
          id: 'complete_fields',
          type: 'form',
          title: 'Completar Campos Faltantes',
          fields: ACTO1_M1_FORM_FIELDS,
          instructions: ACTO1_M1_FORM_INSTRUCTIONS,
          initialData: {},
          datasetName: 'incomplete_invoice'
        }
      ];
    }

    // Acto 1 - Cash Application
    if (this.missionId === 'acto1_m2_cash') {
      return [
        {
          id: 'match_payments',
          type: 'drag_drop',
          title: 'Emparejar Pagos con Facturas',
          instructions: ACTO1_M2_INSTRUCTIONS,
          datasetName: 'payments_invoices',
          // El DragDropActivity generará items/targets desde el dataset
          items: [], // Se carga desde DatasetLoader
          targets: [],
          correctMatches: {}
        },
        {
          id: 'resolve_discrepancies',
          type: 'quiz',
          title: 'Resolver Caso Especial',
          questions: [ACTO1_M2_PROBLEM_SOLVING]
        }
      ];
    }

    // Acto 1 - Cobro Efectivo
    if (this.missionId === 'acto1_m3_cobro') {
      return [
        {
          id: 'validate_collection',
          type: 'validation',
          title: 'Revisar Borrador de Email',
          validationChecks: ACTO1_M3_VALIDATION_CHECKS,
          instructions: ACTO1_M3_INSTRUCTIONS,
          dataset: ACTO1_M3_EMAIL_TEMPLATE,
          datasetName: 'collection_email'
        },
        {
          id: 'collection_strategy',
          type: 'form',
          title: 'Definir Estrategia de Cobranza',
          fields: ACTO1_M3_FORM_FIELDS,
          instructions: 'Completa tu plan de acción basado en el análisis del cliente',
          initialData: {},
          datasetName: 'customer_aging'
        },
        {
          id: 'collection_dilemma',
          type: 'quiz',
          title: 'Resolver Dilema Estratégico',
          questions: [ACTO1_M3_PROBLEM_SOLVING]
        }
      ];
    }

    // Acto 2 - Data Cleaning
    if (this.missionId === 'acto2_m1_cleaning') {
      return [
        {
          id: 'identify_errors',
          type: 'validation',
          title: 'Auditoría de Calidad de Datos',
          validationChecks: ACTO2_M1_VALIDATION_CHECKS,
          instructions: ACTO2_M1_INSTRUCTIONS,
          datasetName: 'dirty_invoices'
        },
        {
          id: 'calculate_metrics',
          type: 'form',
          title: 'Métricas y Plan de Limpieza',
          fields: ACTO2_M1_FORM_FIELDS,
          instructions: 'Calcula métricas de calidad y define tu plan de acción',
          initialData: {},
          datasetName: 'dirty_invoices'
        },
        {
          id: 'quality_dilemma',
          type: 'quiz',
          title: 'Dilema: Deadline vs Calidad',
          questions: [ACTO2_M1_PROBLEM_SOLVING]
        }
      ];
    }

    // Acto 2 - Aging Report
    if (this.missionId === 'acto2_m2_aging') {
      return [
        {
          id: 'classify_aging',
          type: 'validation',
          title: 'Clasificar por Buckets de Antigüedad',
          validationChecks: ACTO2_M2_VALIDATION_CHECKS,
          instructions: ACTO2_M2_INSTRUCTIONS,
          datasetName: 'aging_data'
        },
        {
          id: 'aging_analysis',
          type: 'form',
          title: 'Análisis de Aging Report',
          fields: ACTO2_M2_FORM_FIELDS,
          instructions: 'Completa el análisis de distribución y riesgo',
          initialData: {},
          datasetName: 'aging_data'
        },
        {
          id: 'resource_allocation',
          type: 'quiz',
          title: 'Decisión: Recursos Limitados',
          questions: [ACTO2_M2_PROBLEM_SOLVING]
        }
      ];
    }

    // Acto 2 - Global Analysis (Multi-Currency)
    if (this.missionId === 'acto2_m3_global') {
      return [
        {
          id: 'currency_conversion',
          type: 'validation',
          title: 'Validar Conversiones Multi-Moneda',
          validationChecks: ACTO2_M3_VALIDATION_CHECKS,
          instructions: ACTO2_M3_INSTRUCTIONS,
          datasetName: 'multi_currency'
        },
        {
          id: 'consolidation_form',
          type: 'form',
          title: 'Consolidación y Análisis de Exposición',
          fields: ACTO2_M3_FORM_FIELDS,
          instructions: 'Consolida a USD y analiza riesgo cambiario',
          initialData: {},
          datasetName: 'multi_currency'
        },
        {
          id: 'fx_hedge_decision',
          type: 'quiz',
          title: 'Decisión: Cobertura Cambiaria',
          questions: [ACTO2_M3_PROBLEM_SOLVING]
        }
      ];
    }

    // Acto 3 - DSO Optimization Specialist
    if (this.missionId === 'acto3_m1_fx') {
      return [
        {
          id: 'dso_validation',
          type: 'validation',
          title: 'Auditoría de DSO y Drivers Clave',
          validationChecks: ACTO3_M1_VALIDATION_CHECKS,
          instructions: ACTO3_M1_INSTRUCTIONS,
          datasetName: 'dso_case_study'
        },
        {
          id: 'dso_action_plan',
          type: 'form',
          title: 'Plan Integral de Optimización DSO',
          fields: ACTO3_M1_FORM_FIELDS,
          instructions: 'Completa cálculos, prioriza drivers y define acciones tácticas.',
          initialData: {},
          datasetName: 'dso_case_study'
        },
        {
          id: 'dso_strategy_conflict',
          type: 'quiz',
          title: 'Dilema Ejecutivo: CFO vs VP Sales',
          questions: [ACTO3_M1_PROBLEM_SOLVING]
        }
      ];
    }

    // Acto 3 - Process Automation Architect
    if (this.missionId === 'acto3_m2_kpi') {
      return [
        {
          id: 'automation_bottlenecks',
          type: 'validation',
          title: 'Detección de Cuellos de Botella y ROI',
          validationChecks: ACTO3_M2_VALIDATION_CHECKS,
          instructions: ACTO3_M2_INSTRUCTIONS,
          datasetName: 'automation_pipeline'
        },
        {
          id: 'automation_roadmap',
          type: 'form',
          title: 'Diseño de Estrategia de Automatización',
          fields: ACTO3_M2_FORM_FIELDS,
          instructions: 'Distribuye presupuesto, calcula ROI y define timeline de adopción.',
          initialData: {},
          datasetName: 'automation_pipeline'
        },
        {
          id: 'automation_change_management',
          type: 'quiz',
          title: 'Gestión del Cambio ante Automatización',
          questions: [ACTO3_M2_PROBLEM_SOLVING]
        }
      ];
    }

    // Acto 3 - Strategic CxC Leader
    if (this.missionId === 'acto3_m3_decision') {
      return [
        {
          id: 'executive_scorecard_validation',
          type: 'validation',
          title: 'Validar Scorecard Ejecutivo 360°',
          validationChecks: ACTO3_M3_VALIDATION_CHECKS,
          instructions: ACTO3_M3_INSTRUCTIONS,
          datasetName: 'executive_briefing'
        },
        {
          id: 'executive_alignment_form',
          type: 'form',
          title: 'Plan Estratégico para Junta Ejecutiva',
          fields: ACTO3_M3_FORM_FIELDS,
          instructions: 'Define recomendación, impacto financiero y plan de alineación de stakeholders.',
          initialData: {},
          datasetName: 'executive_briefing'
        },
        {
          id: 'executive_conflict_resolution',
          type: 'quiz',
          title: 'Resolver Conflicto CFO vs VP Sales',
          questions: [ACTO3_M3_PROBLEM_SOLVING]
        }
      ];
    }

    // Epílogo - Assessment Final Ejecutivo
    if (this.missionId === 'epilogo_plan') {
      return [
        {
          id: 'epilogue_scorecard_validation',
          type: 'validation',
          title: 'Validar Resultados Integrales de Transformación',
          validationChecks: EPILOGUE_VALIDATION_CHECKS,
          instructions: EPILOGUE_INSTRUCTIONS,
          datasetName: 'final_assessment'
        },
        {
          id: 'epilogue_master_plan',
          type: 'form',
          title: 'Diseñar Roadmap 12 Meses y Plan Ejecutivo',
          fields: EPILOGUE_FORM_FIELDS,
          instructions: 'Integra métricas, riesgos y roadmap integral para presentar a la junta.',
          initialData: {},
          datasetName: 'final_assessment'
        },
        {
          id: 'epilogue_board_decision',
          type: 'quiz',
          title: 'Pregunta Final de la Junta',
          questions: [EPILOGUE_PROBLEM_SOLVING]
        }
      ];
    }

    // Default: actividad genérica
    return [
      {
        id: 'generic_task',
        type: 'interactive',
        title: `Actividades de ${this.mission.title}`,
        description: this.mission.description
      }
    ];
  }

  /**
   * Valida la respuesta del usuario para una actividad
   */
  validateActivity(activityId, userData) {
    const activity = this.getActivities().find(a => a.id === activityId);
    if (!activity) {
      return { valid: false, score: 0, feedback: 'Actividad no encontrada' };
    }

    let result;

    switch (activity.type) {
      case 'quiz':
        result = this.validateQuiz(activity, userData);
        break;
      case 'form':
        result = this.validateForm(activity, userData);
        break;
      case 'validation':
        result = this.validateValidationTask(activity, userData);
        break;
      case 'drag_drop':
        result = this.validateDragDrop(activity, userData);
        break;
      default:
        result = { valid: true, score: 100 };
        break;
    }

    if (result && typeof result === 'object') {
      this.recordActivityResult(activityId, result);
    }

    return result;
  }

  /**
   * Valida un quiz
   */
  validateQuiz(activity, userData) {
    const quizQuestions = Array.isArray(activity.questions) ? activity.questions : [];
    const responses = userData && typeof userData === 'object' ? userData : {};

    if (quizQuestions.length === 0) {
      return {
        valid: false,
        score: 0,
        correct: 0,
        total: 0,
        feedback: 'No hay preguntas disponibles'
      };
    }

    let correct = 0;

    quizQuestions.forEach((question) => {
      if (!question?.id) return;
      if (responses[question.id] === question.correctAnswer) {
        correct++;
      }
    });

    const score = quizQuestions.length > 0 ? (correct / quizQuestions.length) * 100 : 0;
    return {
      valid: score >= 60,
      score,
      correct,
      total: quizQuestions.length,
      feedback: `${correct} de ${quizQuestions.length} respuestas correctas`
    };
  }

  /**
   * Valida un formulario
   */
  validateForm(activity, userData) {
    const { validations = {} } = activity;
    const fields = Array.isArray(activity.fields) ? activity.fields : [];
    const responses = userData && typeof userData === 'object' ? userData : {};
    const errors = [];
    let validFields = 0;

    if (fields.length === 0) {
      return {
        valid: true,
        score: 100,
        errors: [],
        feedback: 'No hay campos para completar'
      };
    }

    fields.forEach(field => {
      if (!field?.id) return;
      const value = responses[field.id];
      
      // Required validation
      if (field.required && (!value || value.toString().trim() === '')) {
        errors.push({ field: field.id, message: `${field.label} es requerido` });
        return;
      }

      // Custom validations
      if (validations[field.id]) {
        const validation = validations[field.id];
        
        if (validation.pattern && !validation.pattern.test(value)) {
          errors.push({ field: field.id, message: validation.message });
          return;
        }

        if (validation.min !== undefined && parseFloat(value) < validation.min) {
          errors.push({ field: field.id, message: validation.message });
          return;
        }
      }

      validFields++;
    });

    const score = fields.length > 0 ? (validFields / fields.length) * 100 : 0;
    return {
      valid: errors.length === 0,
      score,
      errors,
      feedback: errors.length === 0 ? 'Formulario completado correctamente' : 'Hay errores en el formulario'
    };
  }

  /**
   * Valida una tarea de validación
   */
  validateValidationTask(activity, userData) {
    // Soporte para ambos formatos: validationChecks y tasks
    const checks = activity.validationChecks || activity.checks || activity.tasks || [];
    
    if (checks.length === 0) {
      console.warn('No validation checks found in activity:', activity);
      return {
        valid: false,
        score: 0,
        completed: 0,
        total: 0,
        feedback: 'No hay validaciones disponibles'
      };
    }

    const selectedIssues = Array.isArray(userData?.selectedIssues)
      ? userData.selectedIssues
      : [];
    
    // Calcular cuántos están correctamente marcados
    let correctCount = 0;
    checks.forEach(check => {
      const isSelected = selectedIssues.includes(check.id);
      const shouldBeSelected = check.hasIssue === true;
      
      if (isSelected === shouldBeSelected) {
        correctCount++;
      }
    });
    
    const score = (correctCount / checks.length) * 100;

    return {
      valid: score >= 70,
      score,
      completed: correctCount,
      total: checks.length,
      feedback: `${correctCount} de ${checks.length} validaciones correctas`
    };
  }

  /**
   * Valida drag & drop
   */
  validateDragDrop(activity, userData) {
    // Aquí se validaría el emparejamiento correcto
    // Por ahora, validación simplificada
    const matches = userData && typeof userData === 'object'
      ? Object.keys(userData).length
      : 0;
    const totalTargets = Array.isArray(activity.targets)
      ? activity.targets.length
      : Number(activity.targets) || 0;

    if (totalTargets === 0) {
      return {
        valid: matches === 0,
        score: matches === 0 ? 100 : 0,
        matches,
        total: 0,
        feedback: matches === 0
          ? 'No hay emparejamientos pendientes'
          : `${matches} emparejamientos realizados`
      };
    }

    const score = (matches / totalTargets) * 100;

    return {
      valid: score >= 70,
      score,
      matches,
      total: totalTargets,
      feedback: `${matches} de ${totalTargets} emparejamientos correctos`
    };
  }

  /**
   * Calcula el progreso total de la misión
   */
  calculateProgress(resultsOverride) {
    const activities = this.getActivities();
    const totalActivities = Array.isArray(activities) ? activities.length : 0;

    if (totalActivities === 0) {
      return 0;
    }

    const completedActivities = Array.isArray(resultsOverride)
      ? resultsOverride.length
      : Object.keys(this.validationResults).length;

    const boundedCompleted = Math.min(completedActivities, totalActivities);
    return Math.round((boundedCompleted / totalActivities) * 100);
  }

  /**
   * Registra el resultado de una actividad
   */
  recordActivityResult(activityId, result) {
    if (!activityId) return;
    this.validationResults[activityId] = result;
    
    if (this.callbacks.onProgressUpdate) {
      this.callbacks.onProgressUpdate(this.calculateProgress());
    }
  }

  /**
   * Calcula la puntuación final de la misión
   */
  calculateFinalScore(resultsOverride, timeSpentSecondsOverride) {
    const results = Array.isArray(resultsOverride) && resultsOverride.length > 0
      ? resultsOverride
      : Object.values(this.validationResults);

    if (results.length === 0) {
      return 0;
    }

    const avgScore = results.reduce((sum, r) => sum + (Number(r.score) || 0), 0) / results.length;
    const timeSpentSeconds = typeof timeSpentSecondsOverride === 'number' && timeSpentSecondsOverride >= 0
      ? timeSpentSecondsOverride
      : (Date.now() - this.startTime) / 1000;

    const missionDurationMinutes = Number(this.mission?.duration);
    const timeObjectiveSeconds = Number.isFinite(missionDurationMinutes)
      ? missionDurationMinutes * 60
      : null;

    let timeBonus = 0;
    if (timeObjectiveSeconds && timeSpentSeconds <= timeObjectiveSeconds) {
      timeBonus = 5;
    }

    // Bonus por no usar ayudas (se puede pasar como parámetro)
    const helpBonus = 0; // Se calculará externamente

    const rawScore = avgScore + timeBonus + helpBonus;
    return Math.max(0, Math.min(100, Math.round(rawScore)));
  }

  /**
   * Obtiene un resumen de resultados
   */
  getSummary() {
    return {
      missionId: this.missionId,
      activities: this.getActivities().length,
      completed: Object.keys(this.validationResults).length,
      progress: this.calculateProgress(),
      score: this.calculateFinalScore(),
      timeSpent: Math.round((Date.now() - this.startTime) / 1000),
      results: this.validationResults
    };
  }
}

export default MissionEngine;
