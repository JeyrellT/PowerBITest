/**
 * acto3Mission2Content.js - Contenido para "Process Automation Architect"
 * Misión: Diseñar automatización del proceso de CxC
 * Basado en FASE_3 y FASE_4 especificaciones
 */

export const ACTO3_M2_INSTRUCTIONS = `
El CFO ha aprobado presupuesto de $150,000 para automatizar procesos de CxC. Necesitas 
analizar el workflow actual, identificar cuellos de botella y diseñar el proceso optimizado.

**Tu misión:**
- Mapear el proceso actual de Order-to-Cash (O2C)
- Identificar tareas manuales repetitivas (candidatas a automatización)
- Calcular ROI de automatización por área
- Diseñar proceso futuro con automatización

**Áreas de automatización:**
1. **Generación de facturas:** Manual → Automática
2. **Recordatorios de pago:** Email manual → Automatizado
3. **Aplicación de pagos:** Manual → OCR + matching automático
4. **Escalación de casos:** Manual → Rule-based

**ROI esperado:** Reducir 40% tiempo manual, ahorro $80K/año en costos laborales
`;

export const ACTO3_M2_SCENARIO = {
  title: 'Proyecto de Automatización O2C',
  context: `
El equipo de CxC está saturado. Priya (analista) trabaja 60 horas/semana haciendo 
tareas manuales repetitivas. La calidad está bajando y los errores aumentando.

**Situación actual:**
- Equipo: 2 personas (Priya + 1 asistente)
- Tiempo semanal: 80 horas/semana en tareas manuales
- Costo laboral: $80,000/año
- Errores mensuales: 15-20 (aplicación incorrecta de pagos, facturas tardías)

**Proceso actual (manual):**
1. Ventas cierra orden → envía email a facturación
2. Facturación crea factura en Excel → envía a aprobación
3. Manager aprueba → Facturación sube a ERP
4. Email manual de factura al cliente
5. Tracking manual de aging en Excel
6. Recordatorios manuales cada semana
7. Aplicación manual de pagos (revisar email bancario)
8. Reconciliación manual fin de mes

**Presupuesto aprobado:** $150,000
**Timeline:** 6 meses para implementar

Tu tarea es diseñar el sistema automatizado óptimo.
  `,
  timeLimit: 40, // minutos
  difficulty: 'alto',
  kpis: {
    time_reduction: {
      target: 40,
      description: 'Reducción de tiempo manual (%)',
      unit: '%'
    },
    error_reduction: {
      target: 80,
      description: 'Reducción de errores (%)',
      unit: '%'
    },
    roi_period: {
      target: 24,
      description: 'Período de recuperación',
      unit: 'meses'
    }
  }
};

export const ACTO3_M2_VALIDATION_CHECKS = [
  {
    id: 'check_bottleneck_1',
    description: 'Cuello de botella principal: Aplicación manual de pagos (20 hrs/semana)',
    hasIssue: true,
    category: 'process_analysis',
    importance: 'crítica',
    hint: 'La actividad que consume más tiempo y genera más errores',
    expectedValue: 'manual_payment_application',
    errorSeverity: 'high'
  },
  {
    id: 'check_bottleneck_2',
    description: 'Segundo cuello: Recordatorios manuales (12 hrs/semana)',
    hasIssue: true,
    category: 'process_analysis',
    importance: 'alta',
    hint: 'Trabajo repetitivo sin valor agregado',
    expectedValue: 'manual_reminders',
    errorSeverity: 'high'
  },
  {
    id: 'check_high_roi_area',
    description: 'Mayor ROI: Automatizar aplicación de pagos (ROI 250%)',
    hasIssue: false,
    category: 'roi_analysis',
    importance: 'crítica',
    hint: 'Ahorro $50K/año con inversión $20K = 250% ROI',
    expectedValue: { area: 'payment_application', roi: 250, payback_months: 5 },
    errorSeverity: 'none'
  },
  {
    id: 'check_quick_win',
    description: 'Quick win: Recordatorios automáticos (inversión $5K, ahorro $15K/año)',
    hasIssue: false,
    category: 'prioritization',
    importance: 'media',
    hint: 'Bajo costo, alto impacto, rápida implementación',
    expectedValue: { area: 'automated_reminders', cost: 5000, annual_savings: 15000 },
    errorSeverity: 'none'
  },
  {
    id: 'check_total_investment',
    description: 'Inversión total recomendada: $150,000 (todo el presupuesto)',
    hasIssue: false,
    category: 'budget',
    importance: 'alta',
    hint: 'Usar todo el presupuesto maximiza impacto',
    expectedValue: 150000,
    errorSeverity: 'none'
  },
  {
    id: 'check_annual_savings',
    description: 'Ahorros anuales proyectados: $80,000 (ROI 53%)',
    hasIssue: false,
    category: 'roi_analysis',
    importance: 'crítica',
    hint: '($80,000 / $150,000) × 100 = 53% annual ROI',
    expectedValue: { savings: 80000, roi_percentage: 53, payback_months: 23 },
    errorSeverity: 'none'
  }
];

export const ACTO3_M2_FORM_FIELDS = [
  {
    name: 'primary_bottleneck',
    label: 'Cuello de Botella Principal',
    type: 'select',
    required: true,
    options: [
      { value: '', label: 'Selecciona cuello de botella...' },
      { value: 'manual_invoicing', label: 'Generación manual de facturas (8 hrs/semana)' },
      { value: 'manual_payment_application', label: 'Aplicación manual de pagos (20 hrs/semana)' },
      { value: 'manual_reminders', label: 'Recordatorios manuales (12 hrs/semana)' },
      { value: 'manual_reconciliation', label: 'Reconciliación manual (10 hrs/semana)' }
    ],
    hint: 'La actividad que consume más tiempo',
    expectedValue: 'manual_payment_application'
  },
  {
    name: 'automation_priority_1',
    label: 'Prioridad 1 de Automatización',
    type: 'select',
    required: true,
    options: [
      { value: '', label: 'Selecciona área...' },
      { value: 'payment_application', label: 'Aplicación de pagos (OCR + AI matching)' },
      { value: 'invoice_generation', label: 'Generación automática de facturas' },
      { value: 'automated_reminders', label: 'Recordatorios automáticos' },
      { value: 'credit_scoring', label: 'Credit scoring automático' }
    ],
    hint: 'Mayor ROI: Payment application (250%)',
    expectedValue: 'payment_application'
  },
  {
    name: 'automation_priority_2',
    label: 'Prioridad 2 de Automatización',
    type: 'select',
    required: true,
    options: [
      { value: '', label: 'Selecciona área...' },
      { value: 'payment_application', label: 'Aplicación de pagos' },
      { value: 'invoice_generation', label: 'Generación automática de facturas' },
      { value: 'automated_reminders', label: 'Recordatorios automáticos' },
      { value: 'workflow_automation', label: 'Workflow de aprobaciones' }
    ],
    hint: 'Quick win: Automated reminders (bajo costo, alto impacto)',
    expectedValue: 'automated_reminders'
  },
  {
    name: 'total_investment',
    label: 'Inversión Total Recomendada ($)',
    type: 'number',
    required: true,
    min: 0,
    max: 200000,
    step: 5000,
    placeholder: 'USD',
    hint: 'Presupuesto disponible: $150,000',
    expectedValue: 150000
  },
  {
    name: 'payment_app_investment',
    label: 'Inversión en Payment Application ($)',
    type: 'number',
    required: true,
    min: 0,
    step: 1000,
    placeholder: 'USD',
    hint: 'Software OCR + AI: ~$80K, integración: ~$20K',
    expectedValue: 100000 // Tolerancia ±20K
  },
  {
    name: 'reminders_investment',
    label: 'Inversión en Automated Reminders ($)',
    type: 'number',
    required: true,
    min: 0,
    step: 1000,
    placeholder: 'USD',
    hint: 'Email automation platform',
    expectedValue: 5000
  },
  {
    name: 'other_automation_investment',
    label: 'Otras Automatizaciones ($)',
    type: 'number',
    required: true,
    min: 0,
    step: 1000,
    placeholder: 'USD',
    hint: 'Invoice generation, workflows, etc.',
    expectedValue: 45000 // 150K - 100K - 5K = 45K
  },
  {
    name: 'annual_savings',
    label: 'Ahorros Anuales Proyectados ($)',
    type: 'number',
    required: true,
    min: 0,
    step: 5000,
    placeholder: 'USD',
    hint: 'Payment app: $50K, Reminders: $15K, Otros: $15K',
    expectedValue: 80000
  },
  {
    name: 'roi_percentage',
    label: 'ROI Anual (%)',
    type: 'number',
    required: true,
    min: 0,
    max: 500,
    step: 1,
    placeholder: '%',
    hint: '(Savings / Investment) × 100',
    expectedValue: 53 // 80K / 150K ≈ 53%
  },
  {
    name: 'payback_period_months',
    label: 'Período de Recuperación (meses)',
    type: 'number',
    required: true,
    min: 1,
    max: 60,
    step: 1,
    placeholder: 'Meses',
    hint: '(Investment / Monthly Savings)',
    expectedValue: 23 // 150K / (80K/12) ≈ 22.5 meses
  },
  {
    name: 'time_reduction_percentage',
    label: 'Reducción de Tiempo Manual (%)',
    type: 'number',
    required: true,
    min: 0,
    max: 100,
    step: 5,
    placeholder: '0-100',
    hint: 'De 80 hrs/semana a ~48 hrs/semana',
    expectedValue: 40
  },
  {
    name: 'error_reduction_percentage',
    label: 'Reducción de Errores (%)',
    type: 'number',
    required: true,
    min: 0,
    max: 100,
    step: 5,
    placeholder: '0-100',
    hint: 'Automatización reduce errores humanos significativamente',
    expectedValue: 80
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
    hint: 'Phased approach: Quick wins primero, integración compleja después',
    expectedValue: 6
  },
  {
    name: 'automation_plan',
    label: 'Plan de Automatización Detallado',
    type: 'textarea',
    required: true,
    minLength: 250,
    maxLength: 1000,
    placeholder: 'Describe tu estrategia de automatización: áreas prioritarias, fases de implementación, ROI esperado, riesgos, métricas de éxito...',
    hint: 'Incluye: justificación de prioridades, phasing, change management'
  }
];

export const ACTO3_M2_AUTOMATION_AREAS = {
  payment_application: {
    name: 'Aplicación de Pagos',
    current_time_weekly: 20, // horas
    manual_errors_monthly: 8,
    automation_technologies: ['OCR', 'AI Matching', 'RPA'],
    investment: 100000,
    annual_savings: 50000,
    roi_percentage: 250, // (50K - 20K depreciation) / 100K × 100
    payback_months: 5,
    implementation_time: '4-6 meses',
    complexity: 'high',
    priority: 1
  },
  automated_reminders: {
    name: 'Recordatorios Automáticos',
    current_time_weekly: 12,
    manual_errors_monthly: 3,
    automation_technologies: ['Email automation', 'CRM integration'],
    investment: 5000,
    annual_savings: 15000,
    roi_percentage: 300,
    payback_months: 4,
    implementation_time: '1-2 meses',
    complexity: 'low',
    priority: 2
  },
  invoice_generation: {
    name: 'Generación de Facturas',
    current_time_weekly: 8,
    manual_errors_monthly: 4,
    automation_technologies: ['ERP integration', 'Templates'],
    investment: 30000,
    annual_savings: 10000,
    roi_percentage: 33,
    payback_months: 36,
    implementation_time: '3-4 meses',
    complexity: 'medium',
    priority: 3
  },
  workflow_automation: {
    name: 'Workflows de Aprobación',
    current_time_weekly: 5,
    manual_errors_monthly: 2,
    automation_technologies: ['BPM software', 'Digital signatures'],
    investment: 15000,
    annual_savings: 5000,
    roi_percentage: 33,
    payback_months: 36,
    implementation_time: '2-3 meses',
    complexity: 'medium',
    priority: 4
  }
};

export const ACTO3_M2_PROCESS_COMPARISON = {
  current_state: {
    total_weekly_hours: 80,
    activities: [
      { name: 'Invoice generation', hours: 8, automated: false },
      { name: 'Payment application', hours: 20, automated: false },
      { name: 'Reminders', hours: 12, automated: false },
      { name: 'Reconciliation', hours: 10, automated: false },
      { name: 'Escalations', hours: 5, automated: false },
      { name: 'Reporting', hours: 15, automated: false },
      { name: 'Ad-hoc queries', hours: 10, automated: false }
    ],
    monthly_errors: 18,
    cost_per_year: 80000
  },
  future_state: {
    total_weekly_hours: 48,
    activities: [
      { name: 'Invoice generation', hours: 2, automated: true },
      { name: 'Payment application', hours: 5, automated: true },
      { name: 'Reminders', hours: 1, automated: true },
      { name: 'Reconciliation', hours: 3, automated: true },
      { name: 'Escalations', hours: 2, automated: true },
      { name: 'Reporting', hours: 5, automated: true },
      { name: 'Strategic analysis', hours: 20, automated: false },
      { name: 'Exception handling', hours: 10, automated: false }
    ],
    monthly_errors: 3,
    cost_per_year: 80000, // Mismo costo, pero mayor valor agregado
    value_add_percentage: 60 // 60% tiempo en estratégico vs 20% actual
  }
};

export const ACTO3_M2_TIPS = [
  {
    id: 'tip_1',
    title: 'ROI vs Payback',
    content: 'ROI alto no siempre significa payback rápido. Automated reminders tiene 300% ROI pero inversión pequeña. Payment app tiene 250% ROI con inversión grande.'
  },
  {
    id: 'tip_2',
    title: 'Quick Wins Primero',
    content: 'Implementa automatizaciones de bajo costo/alta visibilidad primero. Genera momentum y credibilidad para proyectos complejos.'
  },
  {
    id: 'tip_3',
    title: 'Automatizar ≠ Eliminar Trabajo',
    content: 'El objetivo es liberar tiempo para trabajo estratégico (análisis, mejora continua), no despedir gente. Redeployment es clave.'
  },
  {
    id: 'tip_4',
    title: 'Change Management',
    content: '70% de proyectos de automatización fallan por resistencia al cambio, no por tecnología. Incluye training y comunicación en el plan.'
  },
  {
    id: 'tip_5',
    title: 'Mide Todo',
    content: 'Establece baseline metrics ANTES de automatizar. Sin datos pre-implementación, no puedes probar el ROI. Track: tiempo, errores, costo.'
  }
];

export const ACTO3_M2_PROBLEM_SOLVING = {
  id: 'automation_resistance',
  type: 'problem_solving',
  title: 'Dilema: Resistencia del Equipo',
  description: `
Has presentado el plan de automatización. Priya (analista senior) está preocupada.

**Preocupación de Priya:**
"Si automatizamos 40% de mi trabajo, ¿me van a despedir? He trabajado aquí 5 años. 
El equipo está nervioso. Algunos ya están buscando otros trabajos."

**Respuesta de RRHH:**
"No hay planes de reducción de personal. Queremos que el equipo haga trabajo más 
estratégico, no tareas repetitivas."

**Realidad que observas:**
- Priya es excelente en tareas manuales, pero no tiene skills analíticos avanzados
- El equipo tiene miedo al cambio
- Sin su cooperación, la implementación fracasará

¿Cómo manejas esta situación?
  `,
  options: [
    {
      id: 'option_a',
      text: 'Implementar la automatización de todas formas - es decisión de management',
      correct: false,
      feedback: 'Incorrecto. Sin buy-in del equipo, sabotearán la implementación (consciente o inconscientemente). Change management es crítico.'
    },
    {
      id: 'option_b',
      text: 'Cancelar el proyecto para evitar conflicto con el equipo',
      correct: false,
      feedback: 'Incorrecto. Ceder ante la resistencia al cambio condena a la empresa al status quo. Necesitas liderar el cambio, no evitarlo.'
    },
    {
      id: 'option_c',
      text: 'Plan de transición: Automatizar gradualmente + upskilling para Priya en análisis',
      correct: true,
      feedback: '¡Correcto! Phased approach con training. Priya se convierte en "automation champion" y aprende analytics/reporting. El equipo ve que automatización = crecimiento profesional, no despidos. Win-win.'
    },
    {
      id: 'option_d',
      text: 'Ofrecer a Priya reubicación a otro departamento',
      correct: false,
      feedback: 'Incorrecto. Pierdes el knowledge institucional de Priya. Mejor invertir en su desarrollo que transferirla. Upskilling es más barato que recruiting.'
    }
  ]
};

export const ACTO3_M2_SUCCESS_CRITERIA = {
  process_analysis: {
    weight: 25,
    description: 'Identificación correcta de cuellos de botella'
  },
  roi_calculation: {
    weight: 25,
    description: 'Cálculo preciso de ROI y payback por área'
  },
  prioritization: {
    weight: 20,
    description: 'Priorización lógica basada en ROI e implementabilidad'
  },
  implementation_plan: {
    weight: 20,
    description: 'Plan de implementación realista con phasing'
  },
  change_management: {
    weight: 10,
    description: 'Consideración de factores humanos y adopción'
  }
};
