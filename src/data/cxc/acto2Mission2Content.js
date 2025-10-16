/**
 * acto2Mission2Content.js - Contenido para "Aging Report Master"
 * Misión: Analizar y categorizar facturas por antigüedad
 * Basado en FASE_3 y FASE_4 especificaciones
 */

export const ACTO2_M2_INSTRUCTIONS = `
El CFO ha solicitado un análisis detallado del aging de cuentas por cobrar. Necesitas 
clasificar todas las facturas pendientes en buckets de antigüedad y generar insights.

**Tu misión:**
- Clasificar facturas en buckets: 0-30, 31-60, 61-90, 90+ días
- Calcular porcentajes de distribución
- Identificar clientes con mayor antigüedad
- Generar recomendaciones de cobranza por bucket

**Métricas clave:**
1. **Current (0-30 días):** Cuentas al corriente
2. **31-60 días:** Atención preventiva
3. **61-90 días:** Cobranza activa
4. **90+ días:** Alto riesgo / provisión

Un aging report preciso es esencial para gestión de liquidez y riesgo.
`;

export const ACTO2_M2_SCENARIO = {
  title: 'Análisis de Antigüedad de Cartera',
  context: `
Es inicio de mes y necesitas preparar el Aging Report para la junta mensual de finanzas.

**Situación:**
- Total de facturas pendientes: 40 facturas
- Monto total por cobrar: $487,500
- Fecha de corte: Hoy
- Cliente más grande: TechCorp ($85,000 en facturas)

El CFO pregunta: "¿Qué porcentaje de nuestra cartera está en riesgo (90+ días)?"

Gustavo te advierte: "El mes pasado teníamos 15% en 90+. Si subió, tendremos problemas 
con el banco para renovar la línea de crédito."

Tu tarea es generar un análisis preciso y accionable.
  `,
  timeLimit: 25, // minutos
  difficulty: 'medio',
  kpis: {
    classification_accuracy: {
      target: 95,
      description: 'Precisión en clasificación de buckets (%)'
    },
    calculation_accuracy: {
      target: 100,
      description: 'Exactitud en cálculos de montos y %'
    },
    insights_quality: {
      target: 80,
      description: 'Calidad de insights y recomendaciones'
    }
  }
};

export const ACTO2_M2_VALIDATION_CHECKS = [
  {
    id: 'check_bucket_0_30',
    description: 'Bucket 0-30 días: 18 facturas, $195,000 (40%)',
    hasIssue: false, // Verificar que el usuario calcule correctamente
    category: 'calculation',
    importance: 'alta',
    hint: 'Cuenta facturas con días vencidos entre 0 y 30',
    expectedValue: { count: 18, amount: 195000, percentage: 40 },
    errorSeverity: 'none'
  },
  {
    id: 'check_bucket_31_60',
    description: 'Bucket 31-60 días: 12 facturas, $146,250 (30%)',
    hasIssue: false,
    category: 'calculation',
    importance: 'alta',
    hint: 'Facturas vencidas entre 31 y 60 días',
    expectedValue: { count: 12, amount: 146250, percentage: 30 },
    errorSeverity: 'none'
  },
  {
    id: 'check_bucket_61_90',
    description: 'Bucket 61-90 días: 6 facturas, $73,125 (15%)',
    hasIssue: false,
    category: 'calculation',
    importance: 'alta',
    hint: 'Facturas vencidas entre 61 y 90 días',
    expectedValue: { count: 6, amount: 73125, percentage: 15 },
    errorSeverity: 'none'
  },
  {
    id: 'check_bucket_90_plus',
    description: 'Bucket 90+ días: 4 facturas, $73,125 (15%)',
    hasIssue: false,
    category: 'calculation',
    importance: 'crítica',
    hint: 'Facturas vencidas más de 90 días (alto riesgo)',
    expectedValue: { count: 4, amount: 73125, percentage: 15 },
    errorSeverity: 'none'
  },
  {
    id: 'check_total_verification',
    description: 'Verificación: Suma de buckets = Total ($487,500)',
    hasIssue: false,
    category: 'validation',
    importance: 'crítica',
    hint: 'La suma de todos los buckets debe igualar el total',
    expectedValue: 487500,
    errorSeverity: 'none'
  },
  {
    id: 'check_high_risk_client',
    description: 'Cliente de mayor riesgo: TechCorp ($85,000 en bucket 90+)',
    hasIssue: false,
    category: 'analysis',
    importance: 'alta',
    hint: 'Identifica el cliente con mayor monto en 90+ días',
    expectedValue: { client: 'TechCorp', amount: 85000, bucket: '90+' },
    errorSeverity: 'none'
  }
];

export const ACTO2_M2_FORM_FIELDS = [
  {
    name: 'bucket_0_30_count',
    label: 'Facturas en 0-30 días',
    type: 'number',
    required: true,
    min: 0,
    max: 50,
    placeholder: 'Cantidad',
    hint: 'Cuenta facturas al corriente',
    expectedValue: 18
  },
  {
    name: 'bucket_0_30_amount',
    label: 'Monto 0-30 días ($)',
    type: 'number',
    required: true,
    min: 0,
    step: 0.01,
    placeholder: 'Monto en dólares',
    hint: 'Suma de montos en este bucket',
    expectedValue: 195000
  },
  {
    name: 'bucket_31_60_count',
    label: 'Facturas en 31-60 días',
    type: 'number',
    required: true,
    min: 0,
    max: 50,
    placeholder: 'Cantidad',
    expectedValue: 12
  },
  {
    name: 'bucket_31_60_amount',
    label: 'Monto 31-60 días ($)',
    type: 'number',
    required: true,
    min: 0,
    step: 0.01,
    placeholder: 'Monto en dólares',
    expectedValue: 146250
  },
  {
    name: 'bucket_61_90_count',
    label: 'Facturas en 61-90 días',
    type: 'number',
    required: true,
    min: 0,
    max: 50,
    placeholder: 'Cantidad',
    expectedValue: 6
  },
  {
    name: 'bucket_61_90_amount',
    label: 'Monto 61-90 días ($)',
    type: 'number',
    required: true,
    min: 0,
    step: 0.01,
    placeholder: 'Monto en dólares',
    expectedValue: 73125
  },
  {
    name: 'bucket_90_plus_count',
    label: 'Facturas en 90+ días',
    type: 'number',
    required: true,
    min: 0,
    max: 50,
    placeholder: 'Cantidad',
    hint: 'Alto riesgo',
    expectedValue: 4
  },
  {
    name: 'bucket_90_plus_amount',
    label: 'Monto 90+ días ($)',
    type: 'number',
    required: true,
    min: 0,
    step: 0.01,
    placeholder: 'Monto en dólares',
    hint: 'Provisión potencial',
    expectedValue: 73125
  },
  {
    name: 'high_risk_percentage',
    label: 'Porcentaje en Alto Riesgo (90+) (%)',
    type: 'number',
    required: true,
    min: 0,
    max: 100,
    step: 0.1,
    placeholder: '0-100',
    hint: 'Monto 90+ / Total * 100',
    expectedValue: 15 // $73,125 / $487,500 * 100 = 15%
  },
  {
    name: 'provision_recommendation',
    label: 'Provisión Sugerida para 90+ (%)',
    type: 'number',
    required: true,
    min: 0,
    max: 100,
    step: 5,
    placeholder: '0-100',
    hint: 'Estándar industria: 50-100% para 90+',
    expectedValue: 75 // 75% es conservador pero realista
  },
  {
    name: 'collection_priority',
    label: 'Prioridad de Cobranza',
    type: 'select',
    required: true,
    options: [
      { value: '', label: 'Selecciona estrategia...' },
      { value: 'focus_90_plus', label: 'Enfoque total en 90+ (alto riesgo)' },
      { value: 'balance_61_plus', label: 'Balance entre 61-90 y 90+' },
      { value: 'prevent_31_60', label: 'Prevenir que 31-60 pasen a 61+' },
      { value: 'all_buckets', label: 'Atención distribuida en todos' }
    ],
    hint: '15% en 90+ es preocupante, pero también hay 30% en 31-60',
    expectedValue: 'balance_61_plus'
  },
  {
    name: 'aging_insights',
    label: 'Insights y Recomendaciones',
    type: 'textarea',
    required: true,
    minLength: 150,
    maxLength: 600,
    placeholder: 'Analiza la distribución del aging... ¿Qué patrones observas? ¿Qué acciones recomiendas?',
    hint: 'Considera: tendencia vs mes anterior (15% actual vs 15% previo), clientes específicos, estrategia'
  }
];

export const ACTO2_M2_AGING_DATA = {
  buckets: [
    {
      range: '0-30',
      name: 'Current',
      count: 18,
      amount: 195000,
      percentage: 40,
      risk_level: 'low',
      action: 'Monitoreo estándar',
      color: '#10b981' // green
    },
    {
      range: '31-60',
      name: 'Early Alert',
      count: 12,
      amount: 146250,
      percentage: 30,
      risk_level: 'medium',
      action: 'Recordatorio amistoso',
      color: '#f59e0b' // amber
    },
    {
      range: '61-90',
      name: 'Active Collection',
      count: 6,
      amount: 73125,
      percentage: 15,
      risk_level: 'high',
      action: 'Cobranza activa + llamadas',
      color: '#f97316' // orange
    },
    {
      range: '90+',
      name: 'High Risk',
      count: 4,
      amount: 73125,
      percentage: 15,
      risk_level: 'critical',
      action: 'Escalación legal + provisión',
      color: '#ef4444' // red
    }
  ],
  total: {
    count: 40,
    amount: 487500,
    percentage: 100
  },
  topRiskClients: [
    { name: 'TechCorp', amount: 85000, bucket: '90+', invoices: 2 },
    { name: 'MegaRetail', amount: 45000, bucket: '61-90', invoices: 3 },
    { name: 'GlobalDistrib', amount: 38500, bucket: '31-60', invoices: 2 }
  ]
};

export const ACTO2_M2_TIPS = [
  {
    id: 'tip_1',
    title: 'Regla de Oro del Aging',
    content: '70% o más debe estar en 0-30 días. Si tienes menos, tienes problema de cobranza.'
  },
  {
    id: 'tip_2',
    title: 'Provisión Conservadora',
    content: 'Provisiona 25% para 61-90 días, 50-75% para 90+. Mejor provisionar de más que sorpresas negativas.'
  },
  {
    id: 'tip_3',
    title: 'Monitorea Tendencias',
    content: 'El aging de este mes vs mes anterior es más importante que el valor absoluto. ¿Está mejorando o empeorando?'
  },
  {
    id: 'tip_4',
    title: 'Clientes Grandes',
    content: 'Un cliente grande en 90+ puede ser peor que 10 pequeños. Prioriza por monto, no por cantidad.'
  },
  {
    id: 'tip_5',
    title: 'Acción Temprana',
    content: 'Es más fácil cobrar en 31-60 que en 90+. La prevención es más efectiva que la recuperación.'
  }
];

export const ACTO2_M2_PROBLEM_SOLVING = {
  id: 'aging_strategy_decision',
  type: 'problem_solving',
  title: 'Decisión Estratégica: Recursos Limitados',
  description: `
Solo tienes 1 analista (Priya) para gestionar cobranza esta semana.

**Situación actual:**
- 4 clientes en 90+ ($73,125)
- 6 clientes en 61-90 ($73,125)
- 12 clientes en 31-60 ($146,250)

Gustavo: "Enfócate en 90+ para reducir riesgo."
CFO: "Prevenir que 31-60 pase a 61+ es más estratégico."

¿Dónde enfocas los recursos?
  `,
  options: [
    {
      id: 'option_a',
      text: 'Enfoque total en 4 clientes de 90+ (máximo riesgo)',
      correct: false,
      feedback: 'Incorrecto. Recuperar 90+ es difícil (tasa 30-40%). Mientras tanto, 31-60 empeora. No es óptimo.'
    },
    {
      id: 'option_b',
      text: 'Enfoque total en 12 clientes de 31-60 (prevención)',
      correct: false,
      feedback: 'Incorrecto. Ignorar 90+ aumenta provisión y riesgo crediticio. No puedes ignorar el fuego existente.'
    },
    {
      id: 'option_c',
      text: 'Split 70/30: 70% recursos a 61-90 y 90+, 30% a prevención 31-60',
      correct: true,
      feedback: '¡Correcto! Balanceas urgencia (61-90 y 90+) con prevención (31-60). Prioridad por monto e impacto. Los 4 de 90+ y 6 de 61-90 (10 clientes) con seguimiento intenso, y recordatorios automatizados para 31-60.'
    },
    {
      id: 'option_d',
      text: 'Distribuir equitativamente entre todos los buckets',
      correct: false,
      feedback: 'Incorrecto. No todos los buckets requieren igual atención. Diluyes esfuerzos sin resolver ningún problema crítico.'
    }
  ]
};

export const ACTO2_M2_DATASET_CONFIG = {
  datasetName: 'aging_data',
  recordCount: 40,
  totalAmount: 487500,
  distribution: {
    current: { count: 18, amount: 195000, percentage: 40 },
    early: { count: 12, amount: 146250, percentage: 30 },
    active: { count: 6, amount: 73125, percentage: 15 },
    critical: { count: 4, amount: 73125, percentage: 15 }
  },
  cutoffDate: 'today'
};

export const ACTO2_M2_SUCCESS_CRITERIA = {
  classification_accuracy: {
    weight: 30,
    description: 'Clasificación correcta en buckets (tolerancia ±2 días)'
  },
  calculation_precision: {
    weight: 35,
    description: 'Precisión en sumas y porcentajes (tolerancia ±2%)'
  },
  risk_assessment: {
    weight: 20,
    description: 'Identificación correcta de clientes de alto riesgo'
  },
  strategic_insights: {
    weight: 15,
    description: 'Calidad de insights y recomendaciones accionables'
  }
};

export const ACTO2_M2_BENCHMARK_DATA = {
  industry_average: {
    current: 65, // 65% en 0-30 días
    early: 20,   // 20% en 31-60
    active: 10,  // 10% en 61-90
    critical: 5  // 5% en 90+
  },
  your_company: {
    current: 40, // ⚠️ Bajo
    early: 30,   // ⚠️ Alto
    active: 15,  // ⚠️ Alto
    critical: 15 // 🚨 Muy alto
  },
  interpretation: {
    current: 'Por debajo del benchmark. Problemas de cobranza.',
    early: 'Por encima del benchmark. Atención preventiva insuficiente.',
    active: 'Por encima del benchmark. Cobranza activa necesaria.',
    critical: 'Tres veces el benchmark. Situación crítica.'
  }
};
