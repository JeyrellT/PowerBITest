/**
 * epilogueContent.js - Contenido para "Assessment Final Ejecutivo"
 * Epílogo: Integración total de aprendizajes de CxC
 * Basado en FASE_3, FASE_4 y entregables de FASE_5
 */

export const EPILOGUE_INSTRUCTIONS = `
Has llegado al momento decisivo. Después de meses de implementación, el comité
executivo exige un cierre impecable: resultados, decisiones estratégicas y un plan
de 12 meses que consolide la transformación de Cuentas por Cobrar.

**Tu misión en el Epílogo:**
1. Integrar los aprendizajes de los 3 actos en un Scorecard Ejecutivo
2. Validar los resultados financieros, operativos y de satisfacción del cliente
3. Seleccionar prioridades de inversión para el próximo año fiscal
4. Presentar un mensaje final que convenza a la junta directiva

**Datos clave disponibles (POST-IMPLEMENTACIÓN):**
- DSO actual: 38 días (↓7 vs baseline 45)
- Cash liberado: $210,000 (DSO) + $80,000 (automatización) = $290,000
- Bad debt: 2.0% de ventas (↓0.5 pp vs baseline 2.5%)
- Collection Effectiveness Index (CEI): 85% (↑10 pp)
- Satisfacción de clientes B2B: 82/100 (↑4 puntos)
- Equipo CxC: 40% menos tareas manuales, +60% tareas de análisis estratégico

**Expectativa de la junta:** "Necesitamos un plan de 12 meses que mantenga el
momentum, capture beneficios adicionales y minimice riesgos. Tu recomendación
definirá la estructura del departamento." 
`;

export const EPILOGUE_SCENARIO = {
  title: 'Assessment Final Ejecutivo',
  context: `
El CEO ha convocado una sesión extraordinaria del comité ejecutivo. Están presentes
el CFO, VP Sales, Director de Operaciones y la CEO. Buscan tres cosas:

1. **Resultados cuantificados:** ¿Valió la pena la inversión?
2. **Sostenibilidad:** ¿Cómo mantenemos (o mejoramos) estos indicadores?
3. **Direccionamiento estratégico:** ¿Cuál será el enfoque del equipo CxC en 12 meses?

**Datos adicionales proporcionados:**
- Benchmark industria retail DSO: 34 días
- Benchmark bad debt: 1.8%
- Competencia principal (MegaRetail): DSO 37 días, CEI 83%
- Presupuesto disponible FY26: $180,000 (inversión discrecional)
- Recursos humanos: 6 analistas, 1 gerente, 1 especialista BI compartido

Debes presentar una recomendación integral respaldada por datos y lista para ejecución.
  `,
  timeLimit: 60,
  difficulty: 'experto',
  kpis: {
    financial_impact: {
      target: 250000,
      description: 'Cash neto incremental proyectado ($)',
      unit: 'USD'
    },
    risk_mitigation: {
      target: 3,
      description: 'Riesgos críticos mitigados',
      unit: 'count'
    },
    stakeholder_alignment: {
      target: 90,
      description: 'Índice de alineación con stakeholders (%)',
      unit: 'score'
    }
  }
};

export const EPILOGUE_VALIDATION_CHECKS = [
  {
    id: 'check_dso_improvement',
    description: 'Confirmar reducción de DSO: 45 → 38 días (-7, -15.6%)',
    hasIssue: false,
    category: 'financial_performance',
    importance: 'crítica',
    hint: 'DSO baseline 45 días; cada día vale $30,000',
    expectedValue: { baseline: 45, current: 38, delta_days: -7, delta_percent: -15.6 },
    errorSeverity: 'none'
  },
  {
    id: 'check_cash_impact_total',
    description: 'Cash liberado total: $210K (DSO) + $80K (automatización) = $290K',
    hasIssue: false,
    category: 'cash_flow',
    importance: 'crítica',
    hint: 'Revisa cálculo de savings recurrentes vs one-off',
    expectedValue: 290000,
    errorSeverity: 'none'
  },
  {
    id: 'check_automation_roi',
    description: 'ROI automatización: $80K / $150K = 53% (payback 23 meses)',
    hasIssue: false,
    category: 'investment_analysis',
    importance: 'alta',
    hint: 'ROI = (Savings - Investment) / Investment',
    expectedValue: { roi_percentage: 53, payback_months: 23 },
    errorSeverity: 'none'
  },
  {
    id: 'check_bad_debt',
    description: 'Bad debt post-implementación: 2.0% (meta siguiente: 1.8%)',
    hasIssue: true,
    category: 'risk',
    importance: 'alta',
    hint: 'Queda gap de 0.2 pp vs benchmark 1.8%',
    expectedValue: { current: 2.0, target: 1.8, improvement_needed: 0.2 },
    errorSeverity: 'medium'
  },
  {
    id: 'check_customer_sat',
    description: 'Customer satisfaction B2B: 82/100 (↑4 puntos vs 78)',
    hasIssue: false,
    category: 'customer',
    importance: 'media',
    hint: 'Encuesta semestral a 120 clientes clave',
    expectedValue: { baseline: 78, current: 82, change: +4 },
    errorSeverity: 'none'
  },
  {
    id: 'check_cei',
    description: 'Collection Effectiveness Index (CEI): 85% (↑10 pp)',
    hasIssue: false,
    category: 'operational',
    importance: 'alta',
    hint: 'CEI baseline 75%, target 85%',
    expectedValue: { baseline: 75, current: 85, delta: +10 },
    errorSeverity: 'none'
  },
  {
    id: 'check_resource_shift',
    description: 'Redistribución del tiempo del equipo: 40% tareas manuales → 24%',
    hasIssue: false,
    category: 'people',
    importance: 'media',
    hint: 'Reducción de 40% (32 hrs) a 24% (19 hrs) promedio semanal',
    expectedValue: { baseline_manual: 40, current_manual: 24, strategic_focus: 60 },
    errorSeverity: 'none'
  },
  {
    id: 'check_next_steps_gap',
    description: 'Identificar 3 brechas críticas para 12 meses: Credit AI, Collections Playbook, Customer Council',
    hasIssue: true,
    category: 'strategy',
    importance: 'crítica',
    hint: 'Selecciona al menos 3 iniciativas con dueño y métrica',
    expectedValue: ['credit_scoring_ai', 'collections_playbook', 'customer_experience_council'],
    errorSeverity: 'medium'
  }
];

export const EPILOGUE_FORM_FIELDS = [
  {
    name: 'current_dso_days',
    label: 'DSO Actual Post-Implementación (días)',
    type: 'number',
    required: true,
    min: 0,
    max: 120,
    step: 0.1,
    placeholder: 'Ej. 38.0',
    hint: 'Baseline 45 días',
    expectedValue: 38
  },
  {
    name: 'next_quarter_dso_target',
    label: 'Meta DSO Q1 FY26 (días)',
    type: 'number',
    required: true,
    min: 30,
    max: 45,
    step: 0.1,
    placeholder: 'Ej. 35.0',
    hint: 'Benchmark industria 34 días',
    expectedValue: 35
  },
  {
    name: 'total_cash_impact',
    label: 'Impacto Total en Cash ($)',
    type: 'number',
    required: true,
    min: 0,
    max: 1000000,
    step: 5000,
    placeholder: 'Incluye savings recurrentes',
    hint: 'DSO + automatización - inversiones adicionales',
    expectedValue: 290000
  },
  {
    name: 'automation_roi_percentage',
    label: 'ROI Automatización (%)',
    type: 'number',
    required: true,
    min: 0,
    max: 200,
    step: 1,
    placeholder: 'Ej. 53',
    hint: 'Savings $80K / Inversión $150K',
    expectedValue: 53
  },
  {
    name: 'bad_debt_current',
    label: 'Bad Debt Actual (% de ventas)',
    type: 'number',
    required: true,
    min: 0,
    max: 10,
    step: 0.1,
    placeholder: 'Ej. 2.0',
    hint: 'Benchmark 1.8%',
    expectedValue: 2.0
  },
  {
    name: 'bad_debt_target',
    label: 'Meta Bad Debt FY26 (% de ventas)',
    type: 'number',
    required: true,
    min: 0,
    max: 10,
    step: 0.1,
    placeholder: 'Ej. 1.8',
    hint: 'CFO quiere ≤1.8%',
    expectedValue: 1.8
  },
  {
    name: 'customer_satisfaction_score',
    label: 'Satisfacción Cliente B2B (0-100)',
    type: 'number',
    required: true,
    min: 0,
    max: 100,
    step: 1,
    placeholder: 'Ej. 82',
    hint: 'Promedio encuesta 2025',
    expectedValue: 82
  },
  {
    name: 'investment_priority',
    label: 'Prioridad de Inversión FY26',
    type: 'select',
    required: true,
    options: [
      { value: '', label: 'Selecciona opción...' },
      { value: 'credit_scoring_ai', label: '1) Motor de credit scoring + IA ($120K)' },
      { value: 'collections_playbook', label: '2) Playbook de cobranza global ($80K)' },
      { value: 'customer_council', label: '3) Customer Experience Council ($60K)' },
      { value: 'talent_upskilling', label: '4) Upskilling analistas (Power BI + Python) ($45K)' }
    ],
    hint: 'El presupuesto permite combinar hasta 2 iniciativas',
    expectedValue: 'credit_scoring_ai'
  },
  {
    name: 'secondary_investment',
    label: 'Iniciativa Secundaria',
    type: 'select',
    required: true,
    options: [
      { value: '', label: 'Selecciona opción...' },
      { value: 'collections_playbook', label: 'Playbook global + entrenamiento ($80K)' },
      { value: 'customer_council', label: 'Customer Council trimestral ($60K)' },
      { value: 'talent_upskilling', label: 'Upskilling analistas ($45K)' },
      { value: 'automation_phase2', label: 'Automatización Fase 2 (Cash App + AI) ($90K)' }
    ],
    hint: 'Prioriza impacto + factibilidad',
    expectedValue: 'collections_playbook'
  },
  {
    name: 'risk_register',
    label: 'Principales Riesgos Identificados',
    type: 'textarea',
    required: true,
    minLength: 150,
    maxLength: 600,
    placeholder: 'Describe al menos 3 riesgos con probabilidad, impacto y plan de mitigación...',
    hint: 'Ejemplos: resistencia comercial, fallas en datos, dependencia de talento clave'
  },
  {
    name: 'stakeholder_alignment_plan',
    label: 'Plan de Alineación con Stakeholders',
    type: 'textarea',
    required: true,
    minLength: 200,
    maxLength: 700,
    placeholder: 'Explica cómo obtendrás buy-in de CFO, VP Sales, COO, CEO...',
    hint: 'CFO = cash/risks; VP Sales = clientes; COO = procesos; CEO = visión'
  },
  {
    name: 'twelve_month_roadmap',
    label: 'Roadmap 12 Meses (30-60-90-180-360)',
    type: 'textarea',
    required: true,
    minLength: 250,
    maxLength: 900,
    placeholder: 'Detalle hitos clave por trimestre: iniciativas, owners, métricas...',
    hint: 'Incluye quick wins (30 días) y proyectos estratégicos (180-360 días)'
  },
  {
    name: 'executive_message',
    label: 'Mensaje Final para la Junta (150-300 palabras)',
    type: 'textarea',
    required: true,
    minLength: 150,
    maxLength: 600,
    placeholder: 'Cierra con impacto: resultados, visión y call-to-action',
    hint: 'Estructura: resultados → aprendizajes → decisión → pedido final'
  }
];

export const EPILOGUE_SCORECARD = {
  financial: {
    headline: 'Liquidez reforzada y cash sostenible',
    metrics: [
      { name: 'DSO', baseline: 45, current: 38, target: 35, unit: 'días' },
      { name: 'Cash liberado', baseline: 0, current: 290000, target: 450000, unit: 'USD' },
      { name: 'Bad debt %', baseline: 2.5, current: 2.0, target: 1.8, unit: '%' }
    ],
    commentary: 'El impacto financiero anualizado proyecta +$290K hoy y +$450K con iniciativas FY26.'
  },
  operational: {
    headline: 'Procesos escalables y equipo orientado a análisis',
    metrics: [
      { name: 'CEI', baseline: 75, current: 85, target: 88, unit: '%' },
      { name: 'Horas manuales', baseline: 80, current: 48, target: 40, unit: 'hrs/semana' },
      { name: 'Automatización cobertura', baseline: 20, current: 60, target: 80, unit: '%' }
    ],
    commentary: 'Fase 1 completada. Fase 2 enfocada en inteligencia predictiva y automation AI.'
  },
  customer: {
    headline: 'Experiencia cliente B2B fortalecida',
    metrics: [
      { name: 'Customer SAT', baseline: 78, current: 82, target: 85, unit: 'score' },
      { name: 'Disputas abiertas', baseline: 42, current: 18, target: 10, unit: 'casos' },
      { name: 'Retención top clientes', baseline: 88, current: 93, target: 95, unit: '%' }
    ],
    commentary: 'Cobranza profesional, segmentada y con foco en relaciones clave.'
  }
};

export const EPILOGUE_FINAL_PRESENTATION = {
  slideStructure: [
    { id: 1, title: 'Resumen Ejecutivo', content: ['Contexto inicial', 'Resultados clave', 'Decisión requerida'] },
    { id: 2, title: 'Impacto Financiero', content: ['DSO & cash flow', 'ROI automatización', 'Proyección FY26'] },
    { id: 3, title: 'Scorecard Integral', content: ['Finanzas', 'Operaciones', 'Clientes'] },
    { id: 4, title: 'Plan 12 Meses', content: ['Prioridades', 'Hitos 30-60-90-180-360', 'KPIs'] },
    { id: 5, title: 'Riesgos & Mitigación', content: ['Top 3 riesgos', 'Planes de contingencia', 'Gobernanza'] },
    { id: 6, title: 'Solicitud a la Junta', content: ['Invertir en IA crédito + Playbook', 'Patrocinio ejecutivo', 'Métricas de seguimiento'] }
  ],
  qnaPreparation: [
    {
      stakeholder: 'CFO',
      likelyQuestion: '¿Qué pasa si el DSO vuelve a 42 días?',
      recommendedAnswer: 'Tenemos alertas tempranas y segmentación activa. Si el DSO sube >40, activamos plan intensivo de seguimiento y renegociamos términos.'
    },
    {
      stakeholder: 'VP Sales',
      likelyQuestion: '¿Esto afectará relaciones con clientes?',
      recommendedAnswer: 'El Customer Council trimestral y el playbook consultivo garantizan equilibrio entre cobranza firme y relación.'
    },
    {
      stakeholder: 'COO',
      likelyQuestion: '¿El equipo soporta más automatización?',
      recommendedAnswer: 'Con la reducción de tareas manuales (80→48 hrs) tenemos capacidad para entrenar y manejar nuevas herramientas.'
    }
  ]
};

export const EPILOGUE_PROBLEM_SOLVING = {
  id: 'board_final_question',
  type: 'problem_solving',
  title: 'Pregunta Final de la Junta',
  description: `
Tras tu presentación, la CEO hace una última pregunta:

"Tenemos $180K listos para invertir. ¿Cuál es la combinación exacta de iniciativas
que garantiza ventaja competitiva sin sacrificar liquidez?"

Selecciona la respuesta que mejor alinea resultados, riesgo y experiencia cliente.
  `,
  options: [
    {
      id: 'option_a',
      text: 'Invertir $120K en credit scoring IA y reservar $60K para contingencias',
      correct: false,
      feedback: 'Conservador, pero desaprovecha mejorar la experiencia cliente y las prácticas de cobranza global.'
    },
    {
      id: 'option_b',
      text: 'Dividir $90K en automatización fase 2 y $90K en talento analítico',
      correct: false,
      feedback: 'Mejora procesos pero descuida riesgo crediticio y relacionamiento con clientes clave.'
    },
    {
      id: 'option_c',
      text: 'Asignar $120K a credit scoring IA y $60K al playbook global de cobranza',
      correct: true,
      feedback: 'Opción óptima: reduce riesgo (IA), estandariza procesos (playbook) y sostiene mejoras de DSO y CEI.'
    },
    {
      id: 'option_d',
      text: 'Invertir $60K en customer council, $60K en talento y $60K en playbook',
      correct: false,
      feedback: 'Balanceado en people/experiencia, pero deja sin financiamiento la analítica de riesgo crítico.'
    }
  ]
};

export const EPILOGUE_SUCCESS_CRITERIA = {
  strategic_alignment: {
    weight: 25,
    description: 'Recomendación alinea objetivos de CFO, VP Sales, COO y CEO'
  },
  quantitative_rigor: {
    weight: 25,
    description: 'Todos los indicadores clave cuantificados con exactitud'
  },
  execution_readiness: {
    weight: 20,
    description: 'Roadmap 12 meses con hitos, owners y métricas'
  },
  risk_management: {
    weight: 15,
    description: 'Identificación y mitigación de riesgos críticos'
  },
  communication_effectiveness: {
    weight: 15,
    description: 'Mensaje final persuasivo con claro call-to-action'
  }
};

export const EPILOGUE_ACTION_MATRIX = [
  {
    initiative: 'Credit Scoring IA',
    owner: 'Analista BI + Equipo CxC',
    budget: 120000,
    benefit: 'Reducción bad debt a 1.6%, alertas tempranas de riesgo',
    timeline: 'Kick-off 30 días, despliegue 120 días'
  },
  {
    initiative: 'Playbook Global de Cobranza',
    owner: 'Supervisor CxC',
    budget: 80000,
    benefit: 'CEI 88%, estandarización en 6 países, entrenamiento staff',
    timeline: 'Diseño 60 días, entrenamiento 120 días'
  },
  {
    initiative: 'Customer Experience Council',
    owner: 'VP Sales + CxC',
    budget: 60000,
    benefit: 'SAT 85, disputas ↓40%, retención top clientes 95%',
    timeline: 'Piloto 90 días, expansión 180 días'
  },
  {
    initiative: 'Upskilling Analistas',
    owner: 'RH + Priya',
    budget: 45000,
    benefit: 'Equipo domina Power BI avanzado y Python, +20% productividad',
    timeline: 'Cohorte 1 (90 días), Cohorte 2 (180 días)'
  }
];
