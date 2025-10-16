/**
 * acto2Mission1Content.js - Contenido para "Data Cleaning Detective"
 * Misión: Identificar y corregir errores en dataset de facturas
 * Basado en FASE_3 y FASE_4 especificaciones
 */

export const ACTO2_M1_INSTRUCTIONS = `
Has recibido un archivo con 50 registros de facturas que presentan múltiples problemas 
de calidad de datos. Necesitas identificar y corregir estos errores antes del cierre mensual.

**Tu misión:**
- Identificar errores en el dataset (duplicados, fechas inválidas, formatos incorrectos)
- Clasificar errores por tipo y severidad
- Documentar cada problema encontrado
- Calcular métricas de calidad de datos

**Tipos de errores a buscar:**
1. **Duplicados:** Facturas repetidas con mismo ID
2. **Fechas inválidas:** Fechas futuras o formato incorrecto
3. **Formatos inconsistentes:** Montos, nombres, códigos
4. **Valores faltantes:** Campos obligatorios vacíos
5. **Lógica de negocio:** Due date antes de issue date

Un dataset limpio es fundamental para análisis confiables.
`;

export const ACTO2_M1_SCENARIO = {
  title: 'Crisis de Calidad de Datos',
  context: `
Es fin de mes y necesitas preparar el reporte de CxC para el CFO. Al revisar el 
archivo que te envió el sistema ERP, notas múltiples inconsistencias.

**Situación:**
- Dataset: 50 facturas del mes actual
- Fuente: Importación automática desde sistema legacy
- Deadline: Reporte ejecutivo mañana 9 AM
- Stakeholder: CFO espera números precisos

Priya te advierte: "El mes pasado tuvimos errores de $50,000 por datos sucios. 
No podemos repetir ese error."

Tu tarea es realizar una auditoría completa de calidad de datos.
  `,
  timeLimit: 30, // minutos
  difficulty: 'medio-alto',
  kpis: {
    error_detection_rate: {
      target: 90,
      description: 'Tasa de detección de errores (%)'
    },
    false_positives: {
      target: 5,
      description: 'Falsos positivos máximos (%)'
    },
    data_quality_score: {
      target: 85,
      description: 'Score de calidad final (%)'
    }
  }
};

export const ACTO2_M1_VALIDATION_CHECKS = [
  {
    id: 'check_duplicates',
    description: 'Identificar facturas duplicadas (mismo invoice_id)',
    hasIssue: true, // Hay 3 pares de duplicados en el dataset
    category: 'duplicates',
    importance: 'crítica',
    hint: 'Busca registros con el mismo número de factura',
    expectedCount: 6, // 3 pares = 6 registros duplicados
    errorSeverity: 'high'
  },
  {
    id: 'check_future_dates',
    description: 'Detectar fechas de emisión en el futuro',
    hasIssue: true, // Hay 2 facturas con fechas futuras
    category: 'invalid_dates',
    importance: 'alta',
    hint: 'Compara issue_date con la fecha actual',
    expectedCount: 2,
    errorSeverity: 'high'
  },
  {
    id: 'check_date_logic',
    description: 'Validar que due_date > issue_date',
    hasIssue: true, // 4 facturas tienen due_date antes de issue_date
    category: 'business_logic',
    importance: 'crítica',
    hint: 'La fecha de vencimiento debe ser posterior a la emisión',
    expectedCount: 4,
    errorSeverity: 'high'
  },
  {
    id: 'check_amount_format',
    description: 'Verificar formato de montos (números positivos, 2 decimales)',
    hasIssue: true, // 5 facturas con formato incorrecto
    category: 'format_issues',
    importance: 'media',
    hint: 'Busca montos negativos, con más de 2 decimales, o texto',
    expectedCount: 5,
    errorSeverity: 'medium'
  },
  {
    id: 'check_missing_customer',
    description: 'Detectar campos customer_name vacíos o nulos',
    hasIssue: true, // 3 facturas sin nombre de cliente
    category: 'missing_values',
    importance: 'alta',
    hint: 'Cliente es un campo obligatorio',
    expectedCount: 3,
    errorSeverity: 'high'
  },
  {
    id: 'check_invoice_format',
    description: 'Validar formato de invoice_id (debe ser INV-YYYY-####)',
    hasIssue: true, // 4 facturas con formato incorrecto
    category: 'format_issues',
    importance: 'media',
    hint: 'Formato esperado: INV-2024-0001',
    expectedCount: 4,
    errorSeverity: 'medium'
  },
  {
    id: 'check_zero_amounts',
    description: 'Identificar facturas con monto = 0 o negativo',
    hasIssue: true, // 2 facturas con monto 0 o negativo
    category: 'business_logic',
    importance: 'alta',
    hint: 'Una factura siempre debe tener monto positivo',
    expectedCount: 2,
    errorSeverity: 'high'
  },
  {
    id: 'check_status_valid',
    description: 'Verificar que status sea "pending", "paid" o "overdue"',
    hasIssue: true, // 3 facturas con status inválido
    category: 'format_issues',
    importance: 'media',
    hint: 'Solo 3 valores son permitidos',
    expectedCount: 3,
    errorSeverity: 'medium'
  }
];

export const ACTO2_M1_FORM_FIELDS = [
  {
    name: 'total_errors_found',
    label: 'Total de Errores Detectados',
    type: 'number',
    required: true,
    min: 0,
    max: 100,
    placeholder: 'Número total de errores',
    hint: 'Suma todos los errores de todas las categorías',
    expectedValue: 26 // 6+2+4+5+3+4+2+3 = 29 (tolerancia ±3)
  },
  {
    name: 'critical_errors',
    label: 'Errores Críticos',
    type: 'number',
    required: true,
    min: 0,
    max: 50,
    placeholder: 'Errores de alta severidad',
    hint: 'Duplicados, fechas inválidas, lógica de negocio',
    expectedValue: 15 // 6+2+4+3 = 15 (duplicados + fechas futuras + lógica fechas + missing customer)
  },
  {
    name: 'data_quality_percentage',
    label: 'Porcentaje de Calidad (%)',
    type: 'number',
    required: true,
    min: 0,
    max: 100,
    step: 0.1,
    placeholder: '0-100',
    hint: 'Registros válidos / total de registros * 100',
    expectedValue: 42 // (50 registros - 29 errores) / 50 * 100 = 42% (tolerancia ±5%)
  },
  {
    name: 'recommended_action',
    label: 'Acción Recomendada',
    type: 'select',
    required: true,
    options: [
      { value: '', label: 'Selecciona una acción...' },
      { value: 'use_as_is', label: 'Usar datos como están (no recomendado)' },
      { value: 'clean_and_use', label: 'Limpiar errores críticos y usar' },
      { value: 'full_cleaning', label: 'Limpieza completa antes de usar' },
      { value: 'reject_dataset', label: 'Rechazar dataset y solicitar nuevo' }
    ],
    hint: 'Con 42% de calidad, ¿qué harías?',
    expectedValue: 'full_cleaning'
  },
  {
    name: 'cleaning_priority',
    label: 'Prioridad de Limpieza',
    type: 'select',
    required: true,
    options: [
      { value: '', label: 'Selecciona prioridad...' },
      { value: 'duplicates_first', label: '1. Duplicados, 2. Fechas, 3. Formatos' },
      { value: 'dates_first', label: '1. Fechas, 2. Duplicados, 3. Formatos' },
      { value: 'missing_first', label: '1. Faltantes, 2. Duplicados, 3. Formatos' },
      { value: 'all_parallel', label: 'Todos en paralelo (no recomendado)' }
    ],
    hint: 'Orden óptimo según impacto en análisis',
    expectedValue: 'duplicates_first'
  },
  {
    name: 'estimated_time',
    label: 'Tiempo Estimado de Limpieza (horas)',
    type: 'number',
    required: true,
    min: 0.5,
    max: 24,
    step: 0.5,
    placeholder: 'Horas',
    hint: 'Sé realista considerando 29 errores en 50 registros',
    expectedValue: 3 // Tolerancia ±1 hora
  },
  {
    name: 'automation_notes',
    label: 'Notas sobre Automatización',
    type: 'textarea',
    required: true,
    minLength: 100,
    maxLength: 500,
    placeholder: '¿Qué partes del proceso podrían automatizarse? ¿Cómo prevenirías estos errores en el futuro?',
    hint: 'Piensa en validaciones en origen, scripts de limpieza, alertas'
  }
];

export const ACTO2_M1_ERROR_TYPES = {
  duplicates: {
    name: 'Duplicados',
    severity: 'high',
    impact: 'Infla métricas de facturación y cuentas por cobrar',
    solution: 'Mantener solo la versión más reciente o completa',
    prevention: 'Constraint UNIQUE en base de datos'
  },
  invalid_dates: {
    name: 'Fechas Inválidas',
    severity: 'high',
    impact: 'Imposibilita cálculo de aging y DSO',
    solution: 'Corregir manualmente o rechazar registro',
    prevention: 'Validación en captura + rango permitido'
  },
  business_logic: {
    name: 'Lógica de Negocio',
    severity: 'high',
    impact: 'Datos ilógicos causan decisiones incorrectas',
    solution: 'Revisar y corregir según reglas de negocio',
    prevention: 'Validaciones complejas en formularios'
  },
  format_issues: {
    name: 'Problemas de Formato',
    severity: 'medium',
    impact: 'Dificulta integración y análisis automatizado',
    solution: 'Estandarizar formatos con scripts',
    prevention: 'Catálogos y listas de valores permitidos'
  },
  missing_values: {
    name: 'Valores Faltantes',
    severity: 'high',
    impact: 'Registros incompletos no utilizables',
    solution: 'Solicitar información o rechazar registro',
    prevention: 'Campos obligatorios en captura'
  }
};

export const ACTO2_M1_TIPS = [
  {
    id: 'tip_1',
    title: 'Regla 80/20 de Errores',
    content: '80% de los errores vienen de 20% de las fuentes. Identifica esas fuentes y corrígelas en origen.'
  },
  {
    id: 'tip_2',
    title: 'Prioriza por Impacto',
    content: 'No todos los errores son iguales. Duplicados y fechas inválidas tienen mayor impacto que formatos inconsistentes.'
  },
  {
    id: 'tip_3',
    title: 'Documenta Todo',
    content: 'Cada error corregido debe documentarse: qué, cuándo, quién, por qué. Es tu auditoría.'
  },
  {
    id: 'tip_4',
    title: 'Automatiza lo Repetitivo',
    content: 'Si corriges el mismo error 3+ veces, crea un script. La automatización previene errores futuros.'
  },
  {
    id: 'tip_5',
    title: 'Calidad desde el Origen',
    content: 'Es 10x más barato prevenir errores en captura que corregirlos después. Invierte en validaciones.'
  }
];

export const ACTO2_M1_PROBLEM_SOLVING = {
  id: 'data_quality_dilemma',
  type: 'problem_solving',
  title: 'Dilema: Deadline vs Calidad',
  description: `
El CFO necesita el reporte mañana a primera hora para una junta con inversionistas. 
Has encontrado 29 errores en 50 registros (42% de calidad).

Gustavo te dice: "No hay tiempo para limpieza completa. Usa lo que tengas."

¿Qué haces?
  `,
  options: [
    {
      id: 'option_a',
      text: 'Usar datos como están y advertir al CFO de posibles inconsistencias',
      correct: false,
      feedback: 'Incorrecto. 42% de calidad es inaceptable para decisiones de inversionistas. Podrías dañar la credibilidad de la empresa.'
    },
    {
      id: 'option_b',
      text: 'Trabajar toda la noche para limpieza completa y entregar reporte perfecto',
      correct: false,
      feedback: 'Incorrecto. El burnout no es sostenible. Además, hay una opción más estratégica.'
    },
    {
      id: 'option_c',
      text: 'Limpiar solo errores críticos (duplicados, fechas, missing), marcar registros dudosos',
      correct: true,
      feedback: '¡Correcto! Priorizar errores críticos asegura métricas principales confiables. Marcar registros dudosos da transparencia. Puedes entregar a tiempo con calidad aceptable.'
    },
    {
      id: 'option_d',
      text: 'Delegar la limpieza a Priya y enfocarte en el reporte',
      correct: false,
      feedback: 'Incorrecto. Es tu responsabilidad asegurar la calidad. Priya puede ayudar, pero tú lideras.'
    }
  ]
};

export const ACTO2_M1_DATASET_CONFIG = {
  datasetName: 'dirty_invoices',
  recordCount: 50,
  errorRate: 0.58, // 58% de registros tienen al menos 1 error
  errorDistribution: {
    duplicates: 6,
    invalid_dates: 2,
    business_logic: 6, // 4 date logic + 2 zero amounts
    format_issues: 12, // 5 amounts + 4 invoice_id + 3 status
    missing_values: 3
  },
  cleanRecords: 21 // 50 - 29 = 21 registros completamente limpios
};

export const ACTO2_M1_SUCCESS_CRITERIA = {
  error_detection: {
    weight: 35,
    description: 'Precisión en detección de errores (recall + precision)'
  },
  categorization: {
    weight: 20,
    description: 'Clasificación correcta por tipo y severidad'
  },
  metrics_accuracy: {
    weight: 25,
    description: 'Cálculo correcto de métricas de calidad'
  },
  action_plan: {
    weight: 20,
    description: 'Plan de acción apropiado y realista'
  }
};
