/**
 * acto3Mission3Content.js - Contenido para "Strategic CxC Leader"
 * Misión: Decisiones estratégicas a nivel ejecutivo
 * Basado en FASE_3 y FASE_4 especificaciones
 */

export const ACTO3_M3_INSTRUCTIONS = `
Has sido invitado a la junta ejecutiva trimestral para presentar la estrategia de CxC. 
El CFO, CEO y VP de Ventas esperan tu recomendación sobre políticas críticas.

**Tu misión:**
- Analizar el performance integral de CxC (DSO, cash flow, bad debt, customer satisfaction)
- Evaluar propuestas de cambios de política
- Tomar decisiones estratégicas balanceando múltiples objetivos
- Preparar recomendación ejecutiva con datos de soporte

**Decisiones estratégicas:**
1. **Credit Policy:** ¿Endurecer o mantener términos?
2. **Collection Strategy:** ¿Enfoque agresivo o relacional?
3. **Investment:** ¿Dónde invertir recursos limitados?
4. **Riesgo:** ¿Qué nivel de bad debt es aceptable?

Esta es tu oportunidad de demostrar pensamiento estratégico de nivel C-suite.
`;

export const ACTO3_M3_SCENARIO = {
  title: 'Junta Ejecutiva Trimestral',
  context: `
Estás frente al comité ejecutivo. La empresa está en un punto de inflexión.

**Situación de la empresa:**
- Ventas: $10.8M/año (creciendo 15% anual)
- CxC: $1.35M (DSO 45 días)
- Bad debt: 2.5% de ventas ($270K/año)
- Customer satisfaction: 78/100 (afectado por cobranza agresiva)

**Propuestas sobre la mesa:**

**Propuesta A (CFO):** "Credit Policy Conservadora"
- Reducir términos Net 60 → Net 30
- Credit scoring obligatorio para nuevos clientes
- Provisión agresiva (100% para 90+)
- Impacto: DSO 35 días, bad debt 1.5%, pero riesgo -10% ventas

**Propuesta B (VP Ventas):** "Growth-Oriented Policy"
- Mantener Net 60 (incluso expandir a Net 90 para clientes grandes)
- Aprobar más crédito para ganar market share
- Cobranza suave (evitar llamadas agresivas)
- Impacto: +20% ventas, pero DSO 55 días, bad debt 4%

**Propuesta C (Tu análisis):** "Balanced Approach"
- Segmentar clientes: A (Net 60), B (Net 45), C (Net 30)
- Invertir en automatización ($150K)
- Cobranza profesional pero firme
- Impacto: DSO 38 días, bad debt 2%, ventas estables

El CEO pregunta: "¿Qué recomiendas y por qué?"
  `,
  timeLimit: 45, // minutos
  difficulty: 'experto',
  kpis: {
    strategic_thinking: {
      target: 90,
      description: 'Calidad del análisis multi-criterio',
      unit: 'score'
    },
    data_support: {
      target: 85,
      description: 'Soporte cuantitativo de recomendaciones',
      unit: 'score'
    },
    executive_communication: {
      target: 80,
      description: 'Claridad y persuasión en presentación',
      unit: 'score'
    }
  }
};

export const ACTO3_M3_VALIDATION_CHECKS = [
  {
    id: 'check_balanced_score_card',
    description: 'Análisis balanceado: Financial + Customer + Operational + Risk',
    hasIssue: false,
    category: 'strategic_framework',
    importance: 'crítica',
    hint: 'Decisiones ejecutivas requieren visión 360°',
    expectedValue: 'balanced_scorecard_approach',
    errorSeverity: 'none'
  },
  {
    id: 'check_financial_impact',
    description: 'Impacto financiero Propuesta C: +$180K cash flow anual',
    hasIssue: false,
    category: 'financial_analysis',
    importance: 'crítica',
    hint: 'DSO 45→38 = 7 días × $30K/día = $210K - $30K costo bad debt',
    expectedValue: 180000,
    errorSeverity: 'none'
  },
  {
    id: 'check_customer_impact',
    description: 'Customer sat: Propuesta A baja a 70, Propuesta B sube a 82, Propuesta C mantiene 78',
    hasIssue: false,
    category: 'customer_analysis',
    importance: 'alta',
    hint: 'Balance entre firmeza y relación',
    expectedValue: { propuesta_a: 70, propuesta_b: 82, propuesta_c: 78 },
    errorSeverity: 'none'
  },
  {
    id: 'check_risk_assessment',
    description: 'Riesgo de bad debt: A (1.5%), B (4%), C (2%)',
    hasIssue: false,
    category: 'risk_analysis',
    importance: 'alta',
    hint: 'Trade-off entre crecimiento y riesgo',
    expectedValue: { propuesta_a: 1.5, propuesta_b: 4.0, propuesta_c: 2.0 },
    errorSeverity: 'none'
  },
  {
    id: 'check_implementation_complexity',
    description: 'Complejidad implementación: A (baja), B (baja), C (media-alta)',
    hasIssue: false,
    category: 'operational_feasibility',
    importance: 'media',
    hint: 'Segmentación + automatización requiere esfuerzo',
    expectedValue: { propuesta_a: 'low', propuesta_b: 'low', propuesta_c: 'medium_high' },
    errorSeverity: 'none'
  },
  {
    id: 'check_competitive_position',
    description: 'Posición competitiva: A (desventaja), B (ventaja), C (neutral)',
    hasIssue: false,
    category: 'market_analysis',
    importance: 'alta',
    hint: 'Términos de crédito afectan competitividad',
    expectedValue: { propuesta_a: 'disadvantage', propuesta_b: 'advantage', propuesta_c: 'neutral' },
    errorSeverity: 'none'
  }
];

export const ACTO3_M3_FORM_FIELDS = [
  {
    name: 'recommended_proposal',
    label: 'Propuesta Recomendada',
    type: 'select',
    required: true,
    options: [
      { value: '', label: 'Selecciona propuesta...' },
      { value: 'proposal_a', label: 'Propuesta A - Conservative (CFO)' },
      { value: 'proposal_b', label: 'Propuesta B - Growth-Oriented (VP Sales)' },
      { value: 'proposal_c', label: 'Propuesta C - Balanced Approach (Tu análisis)' },
      { value: 'proposal_hybrid', label: 'Propuesta Híbrida (combina elementos)' }
    ],
    hint: 'Considera todos los stakeholders y objetivos',
    expectedValue: 'proposal_c' // o proposal_hybrid con buena justificación
  },
  {
    name: 'financial_impact_annual',
    label: 'Impacto Financiero Anual ($)',
    type: 'number',
    required: true,
    min: -500000,
    max: 1000000,
    step: 10000,
    placeholder: 'USD (puede ser negativo)',
    hint: 'Cash flow + savings - costos - bad debt',
    expectedValue: 180000 // Propuesta C
  },
  {
    name: 'expected_dso',
    label: 'DSO Esperado (días)',
    type: 'number',
    required: true,
    min: 20,
    max: 70,
    step: 1,
    placeholder: 'Días',
    hint: 'Basado en tu propuesta',
    expectedValue: 38 // Propuesta C
  },
  {
    name: 'expected_bad_debt_percentage',
    label: 'Bad Debt Esperado (%)',
    type: 'number',
    required: true,
    min: 0,
    max: 10,
    step: 0.1,
    placeholder: '0-10%',
    hint: 'Porcentaje de ventas',
    expectedValue: 2.0 // Propuesta C
  },
  {
    name: 'customer_satisfaction_impact',
    label: 'Customer Satisfaction Esperado',
    type: 'number',
    required: true,
    min: 0,
    max: 100,
    step: 1,
    placeholder: '0-100',
    hint: 'Score de satisfacción del cliente',
    expectedValue: 78 // Propuesta C mantiene nivel actual
  },
  {
    name: 'sales_impact_percentage',
    label: 'Impacto en Ventas (%)',
    type: 'number',
    required: true,
    min: -30,
    max: 30,
    step: 1,
    placeholder: '-30 a +30',
    hint: 'Positivo = crecimiento, Negativo = pérdida',
    expectedValue: 0 // Propuesta C: neutral (tolerancia ±5%)
  },
  {
    name: 'investment_required',
    label: 'Inversión Requerida ($)',
    type: 'number',
    required: true,
    min: 0,
    max: 500000,
    step: 10000,
    placeholder: 'USD',
    hint: 'Costos de implementación',
    expectedValue: 150000 // Propuesta C: automatización
  },
  {
    name: 'implementation_timeline',
    label: 'Timeline de Implementación (meses)',
    type: 'number',
    required: true,
    min: 1,
    max: 24,
    step: 1,
    placeholder: 'Meses',
    hint: 'Tiempo realista para ejecutar',
    expectedValue: 6
  },
  {
    name: 'primary_kpi',
    label: 'KPI Primario de Éxito',
    type: 'select',
    required: true,
    options: [
      { value: '', label: 'Selecciona KPI...' },
      { value: 'dso_reduction', label: 'Reducción de DSO' },
      { value: 'cash_flow_improvement', label: 'Mejora en cash flow' },
      { value: 'bad_debt_reduction', label: 'Reducción de bad debt' },
      { value: 'sales_growth', label: 'Crecimiento en ventas' },
      { value: 'customer_retention', label: 'Retención de clientes' }
    ],
    hint: 'El KPI más importante para medir éxito',
    expectedValue: 'cash_flow_improvement'
  },
  {
    name: 'risk_mitigation_strategy',
    label: 'Estrategia de Mitigación de Riesgos',
    type: 'select',
    required: true,
    options: [
      { value: '', label: 'Selecciona estrategia...' },
      { value: 'conservative_provisioning', label: 'Provisión conservadora (100% para 90+)' },
      { value: 'credit_insurance', label: 'Seguro de crédito para clientes grandes' },
      { value: 'customer_segmentation', label: 'Segmentación rigurosa de clientes' },
      { value: 'early_warning_system', label: 'Sistema de alertas tempranas' }
    ],
    hint: 'Cómo proteger contra downside',
    expectedValue: 'customer_segmentation'
  },
  {
    name: 'stakeholder_alignment',
    label: 'Cómo Alinear a Stakeholders',
    type: 'textarea',
    required: true,
    minLength: 150,
    maxLength: 500,
    placeholder: 'Explica cómo manejarás las preocupaciones del CFO (riesgo), VP Sales (ventas), y CEO (balance)...',
    hint: 'Cada stakeholder tiene prioridades diferentes'
  },
  {
    name: 'executive_recommendation',
    label: 'Recomendación Ejecutiva',
    type: 'textarea',
    required: true,
    minLength: 300,
    maxLength: 1200,
    placeholder: 'Tu pitch al comité ejecutivo: situación actual, análisis de opciones, tu recomendación con datos, implementación, riesgos, métricas de éxito...',
    hint: 'Piensa como CFO: datos, ROI, riesgos, timeline'
  }
];

export const ACTO3_M3_PROPOSALS_COMPARISON = {
  proposal_a_conservative: {
    name: 'Conservative Approach (CFO)',
    credit_terms: 'Net 30 default, Net 45 para clientes A+',
    collection_strategy: 'Firme desde día 1',
    investment: 20000,
    expected_dso: 35,
    expected_bad_debt: 1.5,
    customer_satisfaction: 70,
    sales_impact: -10,
    cash_flow_annual: 300000,
    pros: ['Máxima liquidez', 'Mínimo riesgo', 'DSO clase mundial'],
    cons: ['Pérdida de ventas', 'Clientes insatisfechos', 'Desventaja competitiva'],
    stakeholder_support: { cfo: 'high', vp_sales: 'low', ceo: 'medium' }
  },
  proposal_b_growth: {
    name: 'Growth-Oriented (VP Sales)',
    credit_terms: 'Net 60 default, Net 90 para clientes grandes',
    collection_strategy: 'Suave, enfocada en relación',
    investment: 10000,
    expected_dso: 55,
    expected_bad_debt: 4.0,
    customer_satisfaction: 82,
    sales_impact: 20,
    cash_flow_annual: -200000, // Cash tied up
    pros: ['Crecimiento de ventas', 'Clientes felices', 'Market share'],
    cons: ['DSO inaceptable', 'Alto riesgo', 'Cash flow negativo'],
    stakeholder_support: { cfo: 'low', vp_sales: 'high', ceo: 'low' }
  },
  proposal_c_balanced: {
    name: 'Balanced Approach (Recomendado)',
    credit_terms: 'Segmentado: A (Net 60), B (Net 45), C (Net 30)',
    collection_strategy: 'Profesional y firme, basada en datos',
    investment: 150000,
    expected_dso: 38,
    expected_bad_debt: 2.0,
    customer_satisfaction: 78,
    sales_impact: 0, // Neutral
    cash_flow_annual: 180000,
    pros: ['Balance riesgo/retorno', 'Sostenible', 'Basado en datos', 'Automatización'],
    cons: ['Implementación compleja', 'Inversión alta', 'Resultados a 6 meses'],
    stakeholder_support: { cfo: 'medium_high', vp_sales: 'medium', ceo: 'high' }
  }
};

export const ACTO3_M3_TIPS = [
  {
    id: 'tip_1',
    title: 'Pensamiento Multi-Criterio',
    content: 'Decisiones ejecutivas nunca optimizan UN solo objetivo. Siempre es balance: cash flow vs ventas vs customer sat vs riesgo.'
  },
  {
    id: 'tip_2',
    title: 'Datos > Opiniones',
    content: 'En junta ejecutiva, "creo que..." no funciona. "Los datos muestran que..." sí. Cuantifica todo: DSO, cash impact, bad debt %, customer sat.'
  },
  {
    id: 'tip_3',
    title: 'Stakeholder Management',
    content: 'CFO prioriza riesgo/cash, VP Sales prioriza crecimiento, CEO balance todo. Tu propuesta debe tener algo para cada uno.'
  },
  {
    id: 'tip_4',
    title: 'Plan B Siempre',
    content: 'Ejecutivos quieren saber: "¿Qué pasa si falla?" Ten plan de contingencia y métricas de early warning.'
  },
  {
    id: 'tip_5',
    title: 'ROI y Timeline Realistas',
    content: 'No prometas resultados inmediatos. "DSO 38 en 6 meses con inversión $150K" es más creíble que "DSO 30 en 1 mes gratis".'
  }
];

export const ACTO3_M3_PROBLEM_SOLVING = {
  id: 'executive_conflict',
  type: 'problem_solving',
  title: 'Conflicto Ejecutivo: CFO vs VP Sales',
  description: `
Después de tu presentación, el CFO y VP Sales están en desacuerdo directo.

**CFO:** "Tu propuesta C es un compromiso tibio. Necesitamos ser agresivos con cash flow. 
Propuesta A es la correcta. Si Ventas no puede vender con Net 30, el problema es su equipo."

**VP Sales:** "¡Imposible! Todos los competidores ofrecen Net 60 mínimo. Con Net 30 perderemos 
15% de clientes garantizado. Propuesta C es mejor que A, pero aún arriesgada."

**CEO te mira:** "Alex, tú eres el experto en CxC. Necesito que rompas este empate. 
¿Mantenemos Propuesta C o ajustamos?"

¿Cómo respondes?
  `,
  options: [
    {
      id: 'option_a',
      text: 'Defender Propuesta C firmemente - es la más balanceada según los datos',
      correct: true,
      feedback: '¡Correcto! Mantén tu posición con datos. Explica: "Propuesta A sacrifica mucho en ventas (-10%) por ganar poco en DSO (35 vs 38). Propuesta C optimiza el trade-off. Los datos soportan esta conclusión." Liderazgo es tener convicción respaldada por análisis.'
    },
    {
      id: 'option_b',
      text: 'Ceder al CFO - es más senior y controla el presupuesto',
      correct: false,
      feedback: 'Incorrecto. Ceder por jerarquía (no por datos) te desacredita como experto. Si crees en tu análisis, defiéndelo. Si el CFO decide diferente, ese es su derecho, pero tú presentaste la mejor opción.'
    },
    {
      id: 'option_c',
      text: 'Proponer híbrido: Propuesta C para clientes existentes, Propuesta A para nuevos',
      correct: false,
      feedback: 'Razonable pero añade complejidad. Dos políticas paralelas confunden al equipo y clientes. Solo viable si puedes justificar que la complejidad vale la pena.'
    },
    {
      id: 'option_d',
      text: 'Pedir más tiempo para análisis adicional',
      correct: false,
      feedback: 'Incorrecto. Indecisión en junta ejecutiva te hace ver débil. Ya tienes los datos. Toma una posición o serás visto como junior que no puede decidir bajo presión.'
    }
  ]
};

export const ACTO3_M3_SUCCESS_CRITERIA = {
  strategic_analysis: {
    weight: 30,
    description: 'Análisis multi-criterio balanceado (financial, customer, operational, risk)'
  },
  quantitative_support: {
    weight: 25,
    description: 'Soporte cuantitativo de recomendaciones (DSO, cash flow, ROI)'
  },
  stakeholder_alignment: {
    weight: 20,
    description: 'Estrategia para alinear intereses de CFO, VP Sales, CEO'
  },
  executive_communication: {
    weight: 15,
    description: 'Claridad, concisión y persuasión en presentación'
  },
  risk_management: {
    weight: 10,
    description: 'Identificación de riesgos y plan de mitigación'
  }
};
