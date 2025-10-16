/**
 * acto2Mission3Content.js - Contenido para "Global CxC Analyst"
 * Misión: Análisis multi-moneda y conversión de divisas
 * Basado en FASE_3 y FASE_4 especificaciones
 */

export const ACTO2_M3_INSTRUCTIONS = `
La empresa ha expandido operaciones internacionales y ahora maneja facturas en USD, EUR, 
MXN y GBP. Necesitas consolidar el reporte de CxC en una sola moneda.

**Tu misión:**
- Identificar facturas en múltiples monedas
- Aplicar tasas de cambio correctas
- Convertir todo a USD (moneda base)
- Calcular totales consolidados por cliente
- Identificar exposición a riesgo cambiario

**Monedas en el dataset:**
- USD: Moneda base (no requiere conversión)
- EUR: Euro (≈1.10 USD)
- MXN: Peso mexicano (≈0.058 USD)
- GBP: Libra esterlina (≈1.27 USD)

**Riesgo cambiario:** Fluctuaciones pueden impactar el valor real de CxC.
`;

export const ACTO2_M3_SCENARIO = {
  title: 'Consolidación Multi-Moneda',
  context: `
Es cierre trimestral y el CFO necesita el reporte consolidado de CxC global.

**Situación:**
- Facturas en 4 monedas: USD, EUR, MXN, GBP
- Total de facturas: 30 (mix de monedas)
- Cliente internacional más grande: GlobalTech (facturas en EUR y GBP)
- Fecha de corte: Hoy (usar tasas de cambio actuales)

El CFO pregunta: "¿Cuánto tenemos REALMENTE por cobrar en USD? ¿Cuál es nuestra 
exposición cambiaria?"

Priya te advierte: "El mes pasado el EUR cayó 3% y perdimos $15,000 en valor de cartera. 
Necesitamos visibilidad de este riesgo."

Tu tarea es generar un reporte consolidado preciso con análisis de exposición.
  `,
  timeLimit: 30, // minutos
  difficulty: 'alto',
  kpis: {
    conversion_accuracy: {
      target: 98,
      description: 'Precisión en conversiones (tolerancia ±2%)'
    },
    exposure_assessment: {
      target: 90,
      description: 'Correcta identificación de riesgo cambiario'
    },
    consolidation_quality: {
      target: 95,
      description: 'Calidad del reporte consolidado'
    }
  }
};

export const ACTO2_M3_EXCHANGE_RATES = {
  base_currency: 'USD',
  rates: {
    USD: 1.0,
    EUR: 1.10,    // 1 EUR = 1.10 USD
    MXN: 0.058,   // 1 MXN = 0.058 USD
    GBP: 1.27     // 1 GBP = 1.27 USD
  },
  rate_date: '2024-10-15',
  volatility: {
    EUR: 'media',  // Volatilidad moderada
    MXN: 'alta',   // Volatilidad alta (EM currency)
    GBP: 'baja'    // Volatilidad baja (stable)
  }
};

export const ACTO2_M3_VALIDATION_CHECKS = [
  {
    id: 'check_usd_invoices',
    description: 'Facturas en USD: 12 facturas, $180,000 (no requieren conversión)',
    hasIssue: false,
    category: 'identification',
    importance: 'media',
    hint: 'USD es la moneda base',
    expectedValue: { count: 12, amount_usd: 180000 },
    errorSeverity: 'none'
  },
  {
    id: 'check_eur_conversion',
    description: 'Facturas en EUR: 8 facturas, €95,000 → $104,500 USD',
    hasIssue: false,
    category: 'conversion',
    importance: 'alta',
    hint: 'EUR rate = 1.10, entonces €95,000 * 1.10 = $104,500',
    expectedValue: { count: 8, amount_original: 95000, amount_usd: 104500, rate: 1.10 },
    errorSeverity: 'none'
  },
  {
    id: 'check_mxn_conversion',
    description: 'Facturas en MXN: 6 facturas, $2,500,000 MXN → $145,000 USD',
    hasIssue: false,
    category: 'conversion',
    importance: 'alta',
    hint: 'MXN rate = 0.058, entonces 2,500,000 * 0.058 = $145,000',
    expectedValue: { count: 6, amount_original: 2500000, amount_usd: 145000, rate: 0.058 },
    errorSeverity: 'none'
  },
  {
    id: 'check_gbp_conversion',
    description: 'Facturas en GBP: 4 facturas, £32,000 → $40,640 USD',
    hasIssue: false,
    category: 'conversion',
    importance: 'alta',
    hint: 'GBP rate = 1.27, entonces £32,000 * 1.27 = $40,640',
    expectedValue: { count: 4, amount_original: 32000, amount_usd: 40640, rate: 1.27 },
    errorSeverity: 'none'
  },
  {
    id: 'check_total_consolidated',
    description: 'Total consolidado: 30 facturas, $470,140 USD',
    hasIssue: false,
    category: 'consolidation',
    importance: 'crítica',
    hint: 'Suma: $180,000 + $104,500 + $145,000 + $40,640',
    expectedValue: 470140,
    errorSeverity: 'none'
  },
  {
    id: 'check_highest_exposure',
    description: 'Mayor exposición cambiaria: MXN ($145,000 USD = 31% del total)',
    hasIssue: false,
    category: 'risk_analysis',
    importance: 'alta',
    hint: 'MXN tiene alta volatilidad Y mayor monto',
    expectedValue: { currency: 'MXN', amount_usd: 145000, percentage: 31 },
    errorSeverity: 'none'
  }
];

export const ACTO2_M3_FORM_FIELDS = [
  {
    name: 'usd_total',
    label: 'Total en USD (moneda base)',
    type: 'number',
    required: true,
    min: 0,
    step: 0.01,
    placeholder: 'Monto en USD',
    hint: 'Facturas nativas en USD (sin conversión)',
    expectedValue: 180000
  },
  {
    name: 'eur_converted',
    label: 'EUR convertido a USD',
    type: 'number',
    required: true,
    min: 0,
    step: 0.01,
    placeholder: 'Monto convertido',
    hint: '€95,000 * 1.10',
    expectedValue: 104500
  },
  {
    name: 'mxn_converted',
    label: 'MXN convertido a USD',
    type: 'number',
    required: true,
    min: 0,
    step: 0.01,
    placeholder: 'Monto convertido',
    hint: '$2,500,000 MXN * 0.058',
    expectedValue: 145000
  },
  {
    name: 'gbp_converted',
    label: 'GBP convertido a USD',
    type: 'number',
    required: true,
    min: 0,
    step: 0.01,
    placeholder: 'Monto convertido',
    hint: '£32,000 * 1.27',
    expectedValue: 40640
  },
  {
    name: 'total_consolidated_usd',
    label: 'Total Consolidado en USD',
    type: 'number',
    required: true,
    min: 0,
    step: 0.01,
    placeholder: 'Total en USD',
    hint: 'Suma de todos los montos convertidos',
    expectedValue: 470140
  },
  {
    name: 'highest_exposure_currency',
    label: 'Moneda con Mayor Exposición',
    type: 'select',
    required: true,
    options: [
      { value: '', label: 'Selecciona moneda...' },
      { value: 'EUR', label: 'EUR (Euro)' },
      { value: 'MXN', label: 'MXN (Peso Mexicano)' },
      { value: 'GBP', label: 'GBP (Libra Esterlina)' }
    ],
    hint: 'Considera monto Y volatilidad',
    expectedValue: 'MXN'
  },
  {
    name: 'exposure_percentage',
    label: 'Porcentaje de Exposición (%)',
    type: 'number',
    required: true,
    min: 0,
    max: 100,
    step: 0.1,
    placeholder: '0-100',
    hint: '(Monto en moneda extranjera / Total consolidado) * 100',
    expectedValue: 62 // (104500+145000+40640)/470140 * 100 ≈ 62%
  },
  {
    name: 'hedge_recommendation',
    label: 'Estrategia de Cobertura',
    type: 'select',
    required: true,
    options: [
      { value: '', label: 'Selecciona estrategia...' },
      { value: 'no_hedge', label: 'Sin cobertura (aceptar riesgo)' },
      { value: 'natural_hedge', label: 'Cobertura natural (match con AP)' },
      { value: 'forward_contracts', label: 'Contratos forward para MXN' },
      { value: 'full_hedge', label: 'Cobertura completa todas las monedas' }
    ],
    hint: 'MXN = 31% del total con alta volatilidad',
    expectedValue: 'forward_contracts'
  },
  {
    name: 'revaluation_impact',
    label: 'Impacto de Revaluación Potencial (%)',
    type: 'number',
    required: true,
    min: -50,
    max: 50,
    step: 0.5,
    placeholder: '-50 a +50',
    hint: 'Si MXN cae 5% (escenario realista), ¿qué impacto en USD?',
    expectedValue: -1.5 // 5% caída en $145,000 = -$7,250 → -1.5% del total
  },
  {
    name: 'fx_risk_notes',
    label: 'Análisis de Riesgo Cambiario',
    type: 'textarea',
    required: true,
    minLength: 150,
    maxLength: 600,
    placeholder: 'Analiza la exposición actual... ¿Qué riesgos identificas? ¿Cómo mitigarlos?',
    hint: 'Considera: concentración en MXN, volatilidad EM, timing de cobros'
  }
];

export const ACTO2_M3_CURRENCY_BREAKDOWN = {
  currencies: [
    {
      code: 'USD',
      name: 'US Dollar',
      count: 12,
      amount_original: 180000,
      amount_usd: 180000,
      rate: 1.0,
      percentage_of_total: 38,
      volatility: 'none',
      risk_level: 'none'
    },
    {
      code: 'EUR',
      name: 'Euro',
      count: 8,
      amount_original: 95000,
      amount_usd: 104500,
      rate: 1.10,
      percentage_of_total: 22,
      volatility: 'medium',
      risk_level: 'medium'
    },
    {
      code: 'MXN',
      name: 'Mexican Peso',
      count: 6,
      amount_original: 2500000,
      amount_usd: 145000,
      rate: 0.058,
      percentage_of_total: 31,
      volatility: 'high',
      risk_level: 'high'
    },
    {
      code: 'GBP',
      name: 'British Pound',
      count: 4,
      amount_original: 32000,
      amount_usd: 40640,
      rate: 1.27,
      percentage_of_total: 9,
      volatility: 'low',
      risk_level: 'low'
    }
  ],
  total: {
    count: 30,
    amount_usd: 470140,
    foreign_currency_percentage: 62 // 62% está en moneda extranjera
  }
};

export const ACTO2_M3_TIPS = [
  {
    id: 'tip_1',
    title: 'Timing de Conversión',
    content: 'Usa la tasa de cambio del DÍA DE COBRO, no del día de facturación. El riesgo cambiario dura hasta que cobras.'
  },
  {
    id: 'tip_2',
    title: 'Exposición = Monto × Volatilidad',
    content: 'Un monto grande en moneda estable (GBP) puede ser menor riesgo que monto pequeño en moneda volátil (MXN).'
  },
  {
    id: 'tip_3',
    title: 'Cobertura Natural',
    content: 'Si tienes cuentas por pagar en la misma moneda, se cancelan naturalmente. Revisa antes de comprar forwards.'
  },
  {
    id: 'tip_4',
    title: 'Revalúa Mensualmente',
    content: 'El valor de tu cartera cambia con las tasas. Revalúa y registra ganancias/pérdidas cambiarias mensualmente.'
  },
  {
    id: 'tip_5',
    title: 'Forward Contracts',
    content: 'Fija tasas futuras con contratos forward para facturas grandes con cobro a 60+ días. Elimina incertidumbre.'
  }
];

export const ACTO2_M3_PROBLEM_SOLVING = {
  id: 'fx_risk_decision',
  type: 'problem_solving',
  title: 'Decisión: Cobertura Cambiaria',
  description: `
Tienes $145,000 USD en facturas MXN (31% del total). El banco te ofrece:

**Opción A:** Contrato forward a 30 días
- Fija tasa en 0.058 (actual)
- Costo: 0.5% del monto ($725)
- Elimina riesgo cambiario

**Opción B:** Sin cobertura
- Gratis
- Riesgo: MXN puede caer 3-5% (histórico)
- Potencial pérdida: $4,350 - $7,250

El CFO pregunta: "¿Vale la pena pagar $725 por cobertura?"

¿Qué decides?
  `,
  options: [
    {
      id: 'option_a',
      text: 'Comprar forward ($725) - eliminar riesgo completamente',
      correct: true,
      feedback: '¡Correcto! $725 es 0.5% del monto. Con 31% de exposición y alta volatilidad MXN, el costo-beneficio es favorable. Pérdida potencial es 6-10x el costo del forward.'
    },
    {
      id: 'option_b',
      text: 'Sin cobertura - aceptar riesgo para ahorrar $725',
      correct: false,
      feedback: 'Incorrecto. Con exposición del 31% y volatilidad alta, estás apostando. Una caída del 5% te cuesta $7,250 (10x el costo del forward). No es prudente.'
    },
    {
      id: 'option_c',
      text: 'Cobertura parcial - 50% con forward, 50% sin cobertura',
      correct: false,
      feedback: 'Incorrecto. La cobertura parcial solo tiene sentido si tienes opinión fundada sobre dirección del MXN. De lo contrario, introduces complejidad sin beneficio claro.'
    },
    {
      id: 'option_d',
      text: 'Esperar 15 días y decidir según movimiento del mercado',
      correct: false,
      feedback: 'Incorrecto. Timing the market no es gestión de riesgo. Si esperas y el MXN cae, ya es tarde. Las coberturas se contratan ANTES del movimiento.'
    }
  ]
};

export const ACTO2_M3_DATASET_CONFIG = {
  datasetName: 'multi_currency',
  recordCount: 30,
  currencies: ['USD', 'EUR', 'MXN', 'GBP'],
  baseCurrency: 'USD',
  exchangeRates: {
    EUR: 1.10,
    MXN: 0.058,
    GBP: 1.27
  },
  distribution: {
    USD: { count: 12, amount: 180000 },
    EUR: { count: 8, amount: 95000 },
    MXN: { count: 6, amount: 2500000 },
    GBP: { count: 4, amount: 32000 }
  }
};

export const ACTO2_M3_SUCCESS_CRITERIA = {
  conversion_accuracy: {
    weight: 35,
    description: 'Precisión en conversiones a USD (tolerancia ±2%)'
  },
  consolidation: {
    weight: 25,
    description: 'Correcta consolidación y suma de montos'
  },
  risk_identification: {
    weight: 25,
    description: 'Identificación correcta de exposición y riesgos'
  },
  hedge_strategy: {
    weight: 15,
    description: 'Estrategia de cobertura apropiada'
  }
};

export const ACTO2_M3_SCENARIOS = {
  scenario_1: {
    title: 'MXN cae 5%',
    impact: {
      mxn_amount_usd_before: 145000,
      mxn_amount_usd_after: 137750, // 5% menos
      loss: 7250,
      percentage_impact: -1.54 // % del total consolidado
    }
  },
  scenario_2: {
    title: 'EUR cae 3%',
    impact: {
      eur_amount_usd_before: 104500,
      eur_amount_usd_after: 101365,
      loss: 3135,
      percentage_impact: -0.67
    }
  },
  scenario_3: {
    title: 'Todas las monedas caen 2%',
    impact: {
      total_before: 470140,
      total_after: 464337,
      loss: 5803,
      percentage_impact: -1.23
    }
  }
};
