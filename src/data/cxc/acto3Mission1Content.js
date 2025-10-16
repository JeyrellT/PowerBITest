/**
 * acto3Mission1Content.js - Contenido para "DSO Optimization Specialist"
 * Misión: Optimizar Days Sales Outstanding (DSO)
 * Basado en FASE_3 y FASE_4 especificaciones
 */

export const ACTO3_M1_INSTRUCTIONS = `
El CFO te ha desafiado a reducir el DSO (Days Sales Outstanding) de 45 días a 35 días 
en el próximo trimestre. Necesitas analizar los drivers del DSO y diseñar un plan de acción.

**Tu misión:**
- Calcular el DSO actual y entender su composición
- Identificar los factores que contribuyen al DSO elevado
- Analizar el impacto de cada driver (credit policy, aging, collection efficiency)
- Diseñar plan de optimización con objetivos medibles

**Fórmula DSO:**
DSO = (Cuentas por Cobrar / Ventas Totales) × Días del Período

**Meta:** Reducir de 45 días → 35 días = 22% de mejora
**Impacto:** Liberar ~$450,000 en cash flow

Un DSO optimizado mejora liquidez, reduce riesgo crediticio y fortalece el balance.
`;

export const ACTO3_M1_SCENARIO = {
  title: 'Desafío de Optimización DSO',
  context: `
El CFO acaba de salir de una junta con el banco. La línea de crédito está en riesgo 
debido al DSO elevado de la empresa.

**Situación actual:**
- DSO actual: 45 días (benchmark industria: 30-35 días)
- Cuentas por cobrar: $1,350,000
- Ventas mensuales: $900,000
- Meta: DSO 35 días en 90 días

**Declaración del CFO:**
"Cada día de DSO que reducimos libera $30,000 en cash. Necesitamos $300,000 
para un proyecto estratégico. ¿Puedes conseguir 10 días de reducción?"

**Datos de contexto:**
- 40% de clientes pagan a tiempo (0-30 días)
- 35% pagan tarde (31-60 días)
- 25% pagan muy tarde (60+ días)

Tu tarea es diagnosticar las causas raíz y diseñar el plan de optimización.
  `,
  timeLimit: 35, // minutos
  difficulty: 'alto',
  kpis: {
    dso_reduction: {
      target: 10,
      description: 'Días de reducción objetivo',
      unit: 'días'
    },
    cash_flow_impact: {
      target: 300000,
      description: 'Cash liberado ($)',
      unit: 'USD'
    },
    implementation_timeline: {
      target: 90,
      description: 'Días para implementar',
      unit: 'días'
    }
  }
};

export const ACTO3_M1_VALIDATION_CHECKS = [
  {
    id: 'check_current_dso',
    description: 'DSO actual: ($1,350,000 / $900,000) × 30 días = 45 días',
    hasIssue: false,
    category: 'calculation',
    importance: 'crítica',
    hint: 'DSO = (AR / Monthly Sales) × 30',
    expectedValue: 45,
    errorSeverity: 'none'
  },
  {
    id: 'check_target_dso',
    description: 'DSO objetivo: 35 días (reducción de 10 días = 22%)',
    hasIssue: false,
    category: 'goal_setting',
    importance: 'crítica',
    hint: '45 → 35 = 10 días de reducción',
    expectedValue: { current: 45, target: 35, reduction: 10, percentage: 22 },
    errorSeverity: 'none'
  },
  {
    id: 'check_cash_impact',
    description: 'Cash liberado: 10 días × $30,000/día = $300,000',
    hasIssue: false,
    category: 'financial_impact',
    importance: 'alta',
    hint: 'Ventas diarias = $900,000 / 30 = $30,000',
    expectedValue: 300000,
    errorSeverity: 'none'
  },
  {
    id: 'check_primary_driver',
    description: 'Driver principal: 25% clientes pagan 60+ días (aging problem)',
    hasIssue: false,
    category: 'root_cause',
    importance: 'crítica',
    hint: '25% en bucket 60+ es el mayor contribuyente al DSO alto',
    expectedValue: 'late_payers_60_plus',
    errorSeverity: 'none'
  },
  {
    id: 'check_quick_wins',
    description: 'Quick win identificado: Acelerar facturación (reduce 3-5 días)',
    hasIssue: false,
    category: 'optimization',
    importance: 'alta',
    hint: 'Facturar mismo día de entrega vs 5 días después',
    expectedValue: { action: 'faster_invoicing', impact_days: 4 },
    errorSeverity: 'none'
  },
  {
    id: 'check_medium_term',
    description: 'Acción mediano plazo: Mejorar credit policy (reduce 3-4 días)',
    hasIssue: false,
    category: 'optimization',
    importance: 'alta',
    hint: 'Reducir términos de Net 60 a Net 45',
    expectedValue: { action: 'tighter_credit_terms', impact_days: 3 },
    errorSeverity: 'none'
  },
  {
    id: 'check_collection_efficiency',
    description: 'Eficiencia de cobranza: CEI actual 75% (target 85%)',
    hasIssue: true, // Hay oportunidad de mejora
    category: 'performance_metric',
    importance: 'alta',
    hint: 'CEI = (Beginning AR - Ending AR + Sales) / (Beginning AR + Sales) × 100',
    expectedValue: { current: 75, target: 85, gap: 10 },
    errorSeverity: 'medium'
  }
];

export const ACTO3_M1_FORM_FIELDS = [
  {
    name: 'current_dso',
    label: 'DSO Actual (días)',
    type: 'number',
    required: true,
    min: 0,
    max: 180,
    step: 0.1,
    placeholder: 'Días',
    hint: '($1,350,000 / $900,000) × 30',
    expectedValue: 45
  },
  {
    name: 'target_dso',
    label: 'DSO Objetivo (días)',
    type: 'number',
    required: true,
    min: 0,
    max: 180,
    step: 0.1,
    placeholder: 'Días',
    hint: 'Meta establecida por CFO',
    expectedValue: 35
  },
  {
    name: 'dso_reduction',
    label: 'Reducción Requerida (días)',
    type: 'number',
    required: true,
    min: 0,
    max: 50,
    step: 0.1,
    placeholder: 'Días',
    hint: 'Current - Target',
    expectedValue: 10
  },
  {
    name: 'cash_flow_impact',
    label: 'Cash Flow Liberado ($)',
    type: 'number',
    required: true,
    min: 0,
    step: 1000,
    placeholder: 'USD',
    hint: 'Reducción × Sales/Day',
    expectedValue: 300000
  },
  {
    name: 'primary_driver',
    label: 'Driver Principal del DSO Alto',
    type: 'select',
    required: true,
    options: [
      { value: '', label: 'Selecciona driver...' },
      { value: 'slow_invoicing', label: 'Facturación lenta (5+ días post-entrega)' },
      { value: 'loose_credit_policy', label: 'Política de crédito laxa (Net 60-90)' },
      { value: 'late_payers_60_plus', label: 'Clientes morosos (25% pagan 60+ días)' },
      { value: 'poor_collection', label: 'Cobranza ineficiente (CEI bajo)' }
    ],
    hint: '25% de clientes en 60+ días es el mayor problema',
    expectedValue: 'late_payers_60_plus'
  },
  {
    name: 'quick_win_action',
    label: 'Quick Win (implementar en 30 días)',
    type: 'select',
    required: true,
    options: [
      { value: '', label: 'Selecciona acción...' },
      { value: 'faster_invoicing', label: 'Facturación same-day (impacto: 3-5 días)' },
      { value: 'payment_incentives', label: 'Descuentos 2/10 Net 30 (impacto: 2-3 días)' },
      { value: 'automated_reminders', label: 'Recordatorios automáticos (impacto: 1-2 días)' },
      { value: 'credit_card_option', label: 'Pago con tarjeta (impacto: 2-4 días)' }
    ],
    hint: 'Mayor impacto con implementación rápida',
    expectedValue: 'faster_invoicing'
  },
  {
    name: 'medium_term_action',
    label: 'Acción Mediano Plazo (60-90 días)',
    type: 'select',
    required: true,
    options: [
      { value: '', label: 'Selecciona acción...' },
      { value: 'tighter_credit_terms', label: 'Reducir términos Net 60 → Net 45 (impacto: 3-4 días)' },
      { value: 'credit_scoring', label: 'Credit scoring pre-aprobación (impacto: 2-3 días)' },
      { value: 'dedicated_collector', label: 'Collector dedicado para 60+ (impacto: 3-5 días)' },
      { value: 'early_payment_program', label: 'Programa early payment (impacto: 4-6 días)' }
    ],
    hint: 'Reducir términos de crédito tiene impacto sostenible',
    expectedValue: 'tighter_credit_terms'
  },
  {
    name: 'cei_improvement',
    label: 'Mejora de CEI (Collection Effectiveness Index)',
    type: 'number',
    required: true,
    min: 0,
    max: 100,
    step: 1,
    placeholder: '0-100',
    hint: 'De 75% actual a meta',
    expectedValue: 85
  },
  {
    name: 'total_impact_days',
    label: 'Impacto Total Estimado (días)',
    type: 'number',
    required: true,
    min: 0,
    max: 50,
    step: 0.5,
    placeholder: 'Días',
    hint: 'Quick win (4) + Medium term (3) + CEI improvement (~3)',
    expectedValue: 10 // Tolerancia ±2 días
  },
  {
    name: 'implementation_timeline',
    label: 'Timeline de Implementación (días)',
    type: 'number',
    required: true,
    min: 30,
    max: 180,
    step: 15,
    placeholder: 'Días',
    hint: 'Realista considerando cambios en procesos y cultura',
    expectedValue: 90
  },
  {
    name: 'optimization_plan',
    label: 'Plan de Optimización Detallado',
    type: 'textarea',
    required: true,
    minLength: 200,
    maxLength: 800,
    placeholder: 'Describe tu plan: Quick wins, acciones mediano plazo, métricas de seguimiento, riesgos...',
    hint: 'Incluye: acciones específicas, responsables, timeline, KPIs'
  }
];

export const ACTO3_M1_DSO_DRIVERS = {
  invoicing_delay: {
    name: 'Retraso en Facturación',
    current_impact_days: 5,
    optimization_potential: 4, // Puede reducir hasta 4 días
    difficulty: 'low',
    cost: 'low',
    timeline: '30 días',
    actions: [
      'Facturar same-day post-entrega',
      'Automatizar generación de facturas',
      'Integración ERP-CRM'
    ]
  },
  credit_terms: {
    name: 'Términos de Crédito',
    current_impact_days: 8,
    optimization_potential: 3,
    difficulty: 'medium',
    cost: 'medium',
    timeline: '60-90 días',
    actions: [
      'Reducir Net 60 → Net 45 para nuevos clientes',
      'Renegociar términos con clientes existentes',
      'Credit scoring para aprobaciones'
    ]
  },
  collection_efficiency: {
    name: 'Eficiencia de Cobranza',
    current_impact_days: 12,
    optimization_potential: 5,
    difficulty: 'high',
    cost: 'medium',
    timeline: '90 días',
    actions: [
      'Contratar collector dedicado para 60+',
      'Automatizar recordatorios',
      'Escalar casos problemáticos a legal'
    ]
  },
  payment_methods: {
    name: 'Métodos de Pago',
    current_impact_days: 3,
    optimization_potential: 2,
    difficulty: 'low',
    cost: 'low',
    timeline: '30 días',
    actions: [
      'Habilitar pago con tarjeta',
      'ACH automático',
      'Portal de pago online'
    ]
  }
};

export const ACTO3_M1_TIPS = [
  {
    id: 'tip_1',
    title: 'DSO es un KPI Compuesto',
    content: 'No es un solo problema, son múltiples drivers. Ataca los 3 más grandes: invoicing, credit terms, collection.'
  },
  {
    id: 'tip_2',
    title: 'Cash Flow Impact',
    content: 'Cada día de DSO = Sales/30. Si vendes $900K/mes, 1 día DSO = $30K en cash. 10 días = $300K liberados.'
  },
  {
    id: 'tip_3',
    title: 'Quick Wins Primero',
    content: 'Consigue victorias rápidas (facturación same-day, recordatorios) para ganar credibilidad antes de cambios culturales.'
  },
  {
    id: 'tip_4',
    title: 'CEI es tu Métrica de Ejecución',
    content: 'Collection Effectiveness Index mide qué tan bien cobras. 85%+ es clase mundial. Menos de 75% indica problemas serios.'
  },
  {
    id: 'tip_5',
    title: 'Monitorea Tendencias',
    content: 'DSO fluctúa con estacionalidad. Calcula rolling 3-month average para ver tendencia real vs ruido mensual.'
  }
];

export const ACTO3_M1_PROBLEM_SOLVING = {
  id: 'dso_tradeoff_decision',
  type: 'problem_solving',
  title: 'Dilema: Credit Terms vs Sales',
  description: `
El VP de Ventas se opone a tu plan de reducir términos de Net 60 a Net 45.

**Argumento de Ventas:**
"Nuestros competidores ofrecen Net 60. Si reducimos a Net 45, perderemos el 15% 
de clientes (~$135K/mes en ventas). Eso es peor que el DSO alto."

**Argumento del CFO:**
"Clientes que necesitan Net 60 son alto riesgo. Mejor perderlos que tener más 
cuentas incobrables. El DSO 45 está matando nuestro cash flow."

**Tu análisis:**
- Perder 15% de clientes = -$135K ventas/mes
- Reducir DSO 10 días = +$300K cash one-time
- Bad debt actual: 2% de ventas ($18K/mes)

¿Qué decides?
  `,
  options: [
    {
      id: 'option_a',
      text: 'Mantener Net 60 para todos - priorizar ventas',
      correct: false,
      feedback: 'Incorrecto. Priorizar volumen sobre calidad de cartera es insostenible. El cash flow y bad debt empeorarán.'
    },
    {
      id: 'option_b',
      text: 'Reducir a Net 45 para todos - priorizar cash flow',
      correct: false,
      feedback: 'Incorrecto. Enfoque blanco/negro arriesga ventas innecesariamente. Hay una solución más estratégica.'
    },
    {
      id: 'option_c',
      text: 'Segmentar: Net 45 default, Net 60 solo para clientes A+ con credit scoring',
      correct: true,
      feedback: '¡Correcto! Diferenciación basada en riesgo. Clientes buenos obtienen mejores términos, clientes riesgosos pagan más rápido. Reduces DSO sin sacrificar buenos clientes. Best practice de la industria.'
    },
    {
      id: 'option_d',
      text: 'Net 45 con descuento 2% si pagan en 10 días (2/10 Net 45)',
      correct: false,
      feedback: 'Buena idea, pero no resuelve el conflicto. Los clientes que quieren Net 60 no tomarán el descuento. Úsalo como complemento a segmentación.'
    }
  ]
};

export const ACTO3_M1_CEI_CALCULATION = {
  formula: 'CEI = [(Beginning AR - Ending AR + Sales) / (Beginning AR + Sales)] × 100',
  example: {
    beginning_ar: 1200000,
    ending_ar: 1350000,
    monthly_sales: 900000,
    calculation: '[(1,200,000 - 1,350,000 + 900,000) / (1,200,000 + 900,000)] × 100',
    result: 75.7,
    interpretation: 'Por debajo del 85% target. Oportunidad de mejora en cobranza.'
  },
  benchmarks: {
    excellent: '85-100%',
    good: '75-84%',
    fair: '65-74%',
    poor: 'below 65%'
  }
};

export const ACTO3_M1_SUCCESS_CRITERIA = {
  dso_calculation: {
    weight: 20,
    description: 'Cálculo correcto de DSO actual y objetivo'
  },
  root_cause_analysis: {
    weight: 25,
    description: 'Identificación correcta de drivers principales'
  },
  action_plan: {
    weight: 30,
    description: 'Plan de optimización realista y priorizado'
  },
  financial_impact: {
    weight: 15,
    description: 'Cálculo de impacto en cash flow'
  },
  strategic_thinking: {
    weight: 10,
    description: 'Balance entre DSO, ventas y riesgo crediticio'
  }
};
