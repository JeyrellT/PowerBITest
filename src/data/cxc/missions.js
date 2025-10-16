/**
 * Configuración de misiones
 * Basado en FASE_1_GUION_MAESTRO.md y FASE_3_ARQUITECTURA_CONTENIDO.md
 */

export const MISSIONS = {
  // ACTO 0: Onboarding
  acto0_tutorial: {
    id: 'acto0_tutorial',
    acto: 0,
    orden: 1,
    title: 'Tutorial: Bienvenido a CxC',
    subtitle: 'Tu primer día en SuperMercado Global',
    icon: '🎓',
    duration: 20,
    dificultad: 'tutorial',
    description: 'Aprende los conceptos básicos del departamento de Cuentas por Cobrar y completa tu primera factura guiada.',
    objectives: [
      'Conocer el flujo O2C (Order to Cash)',
      'Entender roles del departamento CxC',
      'Crear una factura demo correctamente'
    ],
    dataset: 'demo_clean',
    kpis: {
      quizScore: { min: 0.80, description: 'Quiz 3 ítems ≥80%' },
      facturaCompleta: { required: true, description: 'Completar factura sin errores' }
    },
    prerequisite: null
  },

  // ACTO 1: Fundamentos Operativos
  acto1_m1_factura: {
    id: 'acto1_m1_factura',
    acto: 1,
    orden: 1,
    title: 'Factura Perfecta',
    subtitle: 'Caso FreshFruits Inc.',
    icon: '📄',
    duration: 50,
    dificultad: 'facil',
    description: 'Tu primer caso real: emitir una factura completa para FreshFruits Inc. validando todos los campos obligatorios.',
    objectives: [
      'Completar campos faltantes de la factura',
      'Validar montos y fechas',
      'Asegurar 100% de validaciones correctas'
    ],
    dataset: 'invoices_clean_v1',
    kpis: {
      validaciones: { min: 1.0, description: 'Validaciones 100%' },
      discrepancias: { max: 0, description: 'Sin discrepancias' },
      tiempo: { max: 15, description: 'Tiempo ≤15 min' }
    },
    prerequisite: 'acto0_tutorial'
  },

  acto1_m2_cash: {
    id: 'acto1_m2_cash',
    acto: 1,
    orden: 2,
    title: 'Cash Application Zen',
    subtitle: 'Conciliación 1:1',
    icon: '💰',
    duration: 55,
    dificultad: 'facil',
    description: 'Identifica pagos recibidos y aplícalos a las facturas correspondientes usando drag & drop.',
    objectives: [
      'Emparejar pagos con facturas',
      'Lograr match rate ≥90%',
      'Resolver todos los pagos pendientes'
    ],
    dataset: 'payments_clear_v1',
    kpis: {
      matchRate: { min: 0.90, description: 'Match rate ≥90%' },
      unresolvedPayments: { max: 0, description: 'Sin pagos sin resolver' }
    },
    prerequisite: 'acto1_m1_factura'
  },

  acto1_m3_aging: {
    id: 'acto1_m3_aging',
    acto: 1,
    orden: 3,
    title: 'Radar de Vencimientos',
    subtitle: 'Reporte Aging',
    icon: '📊',
    duration: 60,
    dificultad: 'facil',
    description: 'Construye un reporte de envejecimiento (aging) y prioriza los top-5 deudores para seguimiento.',
    objectives: [
      'Clasificar facturas por buckets de antigüedad',
      'Calcular DSO básico',
      'Priorizar top-5 con justificación'
    ],
    dataset: 'aging_clean_v1',
    kpis: {
      agingCorrect: { required: true, description: 'Aging buckets correctos' },
      priorizacion: { required: true, description: 'Top-5 con justificación' }
    },
    prerequisite: 'acto1_m2_cash'
  },

  // ACTO 2: Optimizar o Fallar
  acto2_m1_cleaning: {
    id: 'acto2_m1_cleaning',
    acto: 2,
    orden: 1,
    title: 'Limpieza o Caos',
    subtitle: 'Datos sucios amenazan el cierre',
    icon: '🧹',
    duration: 60,
    dificultad: 'medio',
    description: 'El cierre mensual está en riesgo. Limpia datos sucios: fechas incorrectas, duplicados y formatos inconsistentes.',
    objectives: [
      'Estandarizar formatos de fecha y montos',
      'Eliminar duplicados',
      'Reducir errores ≥80%'
    ],
    dataset: 'invoices_dirty_v2',
    kpis: {
      errorReduction: { min: 0.80, description: 'Errores de formato ↓≥80%' },
      duplicates: { max: 0, description: 'Duplicados=0' },
      standardNaming: { required: true, description: 'Nombres estandarizados' }
    },
    prerequisite: 'acto1_m3_aging'
  },

  acto2_m2_fuzzy: {
    id: 'acto2_m2_fuzzy',
    acto: 2,
    orden: 2,
    title: 'Duelos de Conciliación',
    subtitle: 'Matching difuso',
    icon: '🎯',
    duration: 60,
    dificultad: 'medio',
    description: 'Pagos sin referencia clara. Usa búsqueda aproximada y reglas de negocio para emparejarlos.',
    objectives: [
      'Aplicar matching difuso (trigram)',
      'Lograr ≥70% de matches',
      'Documentar reglas aplicadas'
    ],
    dataset: 'payments_fuzzy_v2',
    kpis: {
      fuzzyMatchRate: { min: 0.70, description: 'Match difuso ≥70%' },
      rulesDocumented: { required: true, description: 'Reglas documentadas' }
    },
    prerequisite: 'acto2_m1_cleaning'
  },

  acto2_m3_dashboard: {
    id: 'acto2_m3_dashboard',
    acto: 2,
    orden: 3,
    title: 'Dashboard Express',
    subtitle: 'Tu primer informe automatizado',
    icon: '📈',
    duration: 60,
    dificultad: 'medio',
    description: 'Construye un dashboard automatizado seleccionando las visualizaciones correctas y generando insights.',
    objectives: [
      'Seleccionar visuales apropiados',
      'Generar ≥2 insights accionables',
      'Documentar hallazgos clave'
    ],
    dataset: 'dashboard_proto_v2',
    kpis: {
      visualMetricaCoherent: { required: true, description: 'Visual-métrica coherente' },
      insights: { min: 2, description: 'Insights accionables ≥2' }
    },
    prerequisite: 'acto2_m2_fuzzy'
  },

  // ACTO 3: Visión Global
  acto3_m1_fx: {
    id: 'acto3_m1_fx',
    acto: 3,
    orden: 1,
    title: 'DSO Optimization Specialist',
    subtitle: 'Liquidez al milímetro',
    icon: '📉',
    duration: 60,
    dificultad: 'dificil',
    description: 'Diagnostica los drivers del DSO, cuantifica impacto en cash flow y construye un plan de reducción sostenible.',
    objectives: [
      'Calcular DSO actual y meta trimestral',
      'Identificar drivers clave y quick wins',
      'Diseñar roadmap de optimización con métricas'
    ],
    dataset: 'dso_case_study',
    kpis: {
      dsoReduction: { min: 7, description: 'Reducir ≥7 días en 90 días' },
      cashImpact: { min: 200000, description: 'Liberar ≥$200K en cash flow' }
    },
    prerequisite: 'acto2_m3_dashboard'
  },

  acto3_m2_kpi: {
    id: 'acto3_m2_kpi',
    acto: 3,
    orden: 2,
    title: 'Process Automation Architect',
    subtitle: 'Cash Application 4.0',
    icon: '🤖',
    duration: 60,
    dificultad: 'dificil',
    description: 'Rediseña el proceso Order-to-Cash identificando cuellos de botella, priorizando automatización y gestionando el cambio del equipo.',
    objectives: [
      'Mapear proceso actual y detectar desperdicios',
      'Construir business case con ROI y payback',
      'Desarrollar plan de adopción y gestión del cambio'
    ],
    dataset: 'automation_pipeline',
    kpis: {
      roiTarget: { min: 0.50, description: 'ROI esperado ≥50%' },
      manualReduction: { min: 0.40, description: 'Reducir tareas manuales ≥40%' }
    },
    prerequisite: 'acto3_m1_fx'
  },

  acto3_m3_decision: {
    id: 'acto3_m3_decision',
    acto: 3,
    orden: 3,
    title: 'Strategic CxC Leader',
    subtitle: 'Presentación al Comité Ejecutivo',
    icon: '�️',
    duration: 60,
    dificultad: 'dificil',
    description: 'Integra finanzas, clientes y operaciones para recomendar la política de crédito definitiva frente a CFO y VP Sales.',
    objectives: [
      'Construir scorecard balanceado 360°',
      'Cuantificar impacto financiero de cada propuesta',
      'Defender la recomendación ante stakeholders críticos'
    ],
    dataset: 'executive_briefing',
    kpis: {
      stakeholderAlignment: { min: 0.85, description: 'Alineación de stakeholders ≥85%' },
      cashProjection: { min: 150000, description: 'Proyección cash positivo ≥$150K' }
    },
    prerequisite: 'acto3_m2_kpi'
  },

  // EPÍLOGO
  epilogo_plan: {
    id: 'epilogo_plan',
    acto: 4,
    orden: 1,
    title: 'Assessment Final Ejecutivo',
    subtitle: 'Scorecard 360° + Roadmap 12M',
    icon: '🎯',
    duration: 45,
    dificultad: 'experto',
    description: 'Cierra la historia con un assessment integral: valida resultados, selecciona inversiones estratégicas y presenta un plan 12 meses.',
    objectives: [
      'Construir scorecard financiero-operativo-cliente',
      'Priorizar inversiones FY26 con ROI y riesgos',
      'Definir roadmap 30-60-90-180-360 días'
    ],
    dataset: 'final_assessment',
    kpis: {
      cashProjection: { min: 250000, description: 'Cash incremental proyectado ≥$250K' },
      riskMitigation: { min: 3, description: 'Mitigar 3 riesgos críticos' }
    },
    prerequisite: 'acto3_m3_decision'
  }
};

/**
 * Helper: Obtener misiones por acto
 */
export const getMissionsByAct = (actNumber) => {
  return Object.values(MISSIONS).filter(m => m.acto === actNumber);
};

/**
 * Helper: Obtener siguiente misión
 */
export const getNextMission = (currentMissionId) => {
  const allMissions = Object.values(MISSIONS).sort((a, b) => {
    if (a.acto !== b.acto) return a.acto - b.acto;
    return a.orden - b.orden;
  });

  const currentIndex = allMissions.findIndex(m => m.id === currentMissionId);
  return currentIndex >= 0 && currentIndex < allMissions.length - 1
    ? allMissions[currentIndex + 1]
    : null;
};

/**
 * Helper: Verificar si misión está desbloqueada
 */
export const isMissionUnlocked = (missionId, completedMissions = []) => {
  const mission = MISSIONS[missionId];
  if (!mission) return false;
  if (!mission.prerequisite) return true;
  
  return completedMissions.includes(mission.prerequisite);
};

const missionsData = {
  MISSIONS,
  getMissionsByAct,
  getNextMission,
  isMissionUnlocked
};

export default missionsData;
