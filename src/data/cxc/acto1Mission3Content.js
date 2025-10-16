/**
 * acto1Mission3Content.js - Contenido para "Cobro Efectivo"
 * Misión: Gestionar estrategia de cobranza con cliente moroso
 * Basado en FASE_3 y FASE_4 especificaciones
 */

export const ACTO1_M3_INSTRUCTIONS = `
Tienes un cliente con facturas vencidas por más de 60 días. Debes evaluar su 
situación y ejecutar una estrategia de cobranza efectiva.

**Tu misión:**
- Analizar el historial de pagos del cliente
- Identificar facturas vencidas y calcular monto total
- Redactar comunicación de cobranza apropiada
- Proponer plan de acción según severidad

**Factores a considerar:**
1. Días de retraso (30, 60, 90+ días)
2. Monto total pendiente
3. Historial de pagos previos
4. Relación comercial (cliente nuevo vs recurrente)

Una cobranza efectiva balancea firmeza con mantener la relación comercial.
`;

export const ACTO1_M3_SCENARIO = {
  title: 'Cliente con Facturas Vencidas',
  context: `
**Cliente:** TechSupply SA de CV
**Facturas pendientes:** 3 facturas
- Factura INV-2024-001: $15,000 (65 días vencida)
- Factura INV-2024-015: $8,500 (42 días vencida)
- Factura INV-2024-023: $12,300 (28 días vencida)

**Total adeudado:** $35,800

**Historial:** Cliente activo desde hace 2 años, usualmente paga a tiempo. 
Los últimos 3 meses han mostrado retrasos crecientes.

Priya (analista) te informa que este cliente representa el 8% de las ventas anuales.
  `,
  timeLimit: 25,
  difficulty: 'medio-alto',
  kpis: {
    recovery_rate: {
      target: 70,
      description: 'Tasa de recuperación esperada (%)'
    },
    relationship_impact: {
      target: 'positive',
      description: 'Impacto en relación comercial'
    }
  }
};

export const ACTO1_M3_VALIDATION_CHECKS = [
  {
    id: 'check_1',
    description: 'Cálculo del total adeudado ($35,800)',
    hasIssue: false, // Verificar que el usuario calcule correctamente
    category: 'calculation',
    importance: 'alta',
    hint: 'Suma todas las facturas vencidas'
  },
  {
    id: 'check_2',
    description: 'Identificación de factura más antigua (INV-2024-001)',
    hasIssue: false,
    category: 'prioritization',
    importance: 'alta',
    hint: 'La factura más vencida debe ser prioridad'
  },
  {
    id: 'check_3',
    description: 'Tono del mensaje: demasiado agresivo',
    hasIssue: true, // El borrador inicial es muy agresivo
    category: 'communication',
    importance: 'crítica',
    hint: 'Revisa el tono del mensaje borrador'
  },
  {
    id: 'check_4',
    description: 'Inclusión de plan de pagos alternativo',
    hasIssue: true, // Falta oferta de plan de pagos
    category: 'strategy',
    importance: 'media',
    hint: '¿Has considerado ofrecer un plan de pagos?'
  }
];

export const ACTO1_M3_EMAIL_TEMPLATE = {
  id: 'collection_email_draft',
  from: 'Alex Rivera (tú)',
  to: 'TechSupply SA de CV - Cuentas por Pagar',
  subject: '[BORRADOR] Recordatorio de Pagos Pendientes',
  body: `
Estimado cliente,

Le escribimos para informarle que su cuenta presenta un saldo vencido de $35,800.

Las siguientes facturas están pendientes de pago:
- INV-2024-001: $15,000 (vencida hace 65 días)
- INV-2024-015: $8,500 (vencida hace 42 días)
- INV-2024-023: $12,300 (vencida hace 28 días)

DEBE REALIZAR EL PAGO DE INMEDIATO para evitar acciones legales y suspensión de servicios.

Esperamos su pago completo en las próximas 48 horas.

Atentamente,
Alex Rivera
  `,
  issues: [
    {
      type: 'tone',
      severity: 'alta',
      description: 'Tono demasiado agresivo para cliente valioso con buen historial'
    },
    {
      type: 'missing_info',
      severity: 'media',
      description: 'Falta información de contacto y métodos de pago'
    },
    {
      type: 'strategy',
      severity: 'alta',
      description: 'No ofrece alternativas (plan de pagos, descuento por pronto pago)'
    }
  ]
};

export const ACTO1_M3_IMPROVED_EMAIL = {
  id: 'collection_email_improved',
  subject: 'Recordatorio Amistoso - Facturas Pendientes | TechSupply',
  body: `
Estimado equipo de TechSupply,

Esperamos que se encuentren bien. Le escribimos como seguimiento a nuestras facturas pendientes.

**Resumen de cuenta:**
- Total pendiente: $35,800
- Factura más antigua: INV-2024-001 ($15,000) - vencida hace 65 días

Valoramos nuestra relación comercial de 2 años y entendemos que pueden surgir situaciones imprevistas.

**Opciones disponibles:**

1. **Pago completo:** Transferencia bancaria antes del [fecha]
   
2. **Plan de pagos:** 3 pagos quincenales de $11,933.33
   - Primer pago: [fecha inmediata]
   - Siguientes: cada 15 días

3. **Descuento por pronto pago:** 3% de descuento si paga antes de 7 días

**Información de pago:**
- Banco: BBVA Bancomer
- Cuenta: 0123456789
- CLABE: 012180001234567890

¿Podríamos agendar una llamada esta semana para discutir la mejor opción?

Quedo atento a su respuesta.

Cordialmente,
Alex Rivera
Cuentas por Cobrar
Tel: (55) 1234-5678
alex.rivera@empresa.com
  `,
  improvements: [
    'Tono profesional y empático',
    'Reconoce la relación de largo plazo',
    'Ofrece 3 alternativas de pago',
    'Incluye información completa de contacto',
    'Propone diálogo (llamada)',
    'Incentivo (descuento por pronto pago)'
  ]
};

export const ACTO1_M3_FORM_FIELDS = [
  {
    name: 'collection_strategy',
    label: 'Estrategia de Cobranza',
    type: 'select',
    required: true,
    options: [
      { value: '', label: 'Selecciona una estrategia...' },
      { value: 'friendly_reminder', label: 'Recordatorio amistoso (cliente valioso, primera vez)' },
      { value: 'firm_notice', label: 'Aviso firme (cliente recurrente en mora)' },
      { value: 'legal_warning', label: 'Advertencia legal (cliente habitual moroso)' },
      { value: 'account_suspension', label: 'Suspensión de cuenta (cliente de alto riesgo)' }
    ],
    hint: 'Considera historial del cliente y monto adeudado',
    expectedValue: 'friendly_reminder'
  },
  {
    name: 'payment_plan_offered',
    label: '¿Ofreces plan de pagos?',
    type: 'select',
    required: true,
    options: [
      { value: '', label: 'Selecciona...' },
      { value: 'yes', label: 'Sí, ofrecer plan de pagos' },
      { value: 'no', label: 'No, exigir pago completo' }
    ],
    hint: 'Cliente valioso con buen historial previo',
    expectedValue: 'yes'
  },
  {
    name: 'follow_up_method',
    label: 'Método de Seguimiento',
    type: 'select',
    required: true,
    options: [
      { value: '', label: 'Selecciona método...' },
      { value: 'email', label: 'Solo email' },
      { value: 'phone_call', label: 'Llamada telefónica' },
      { value: 'email_and_call', label: 'Email + llamada' },
      { value: 'in_person', label: 'Visita en persona' }
    ],
    hint: 'Monto alto ($35K) y cliente importante (8% de ventas)',
    expectedValue: 'email_and_call'
  },
  {
    name: 'escalation_timeline',
    label: 'Tiempo antes de escalar',
    type: 'number',
    required: true,
    min: 1,
    max: 30,
    placeholder: 'Días',
    hint: 'Balance entre urgencia y relación comercial',
    expectedValue: 7
  },
  {
    name: 'discount_incentive',
    label: 'Descuento por pronto pago (%)',
    type: 'number',
    required: false,
    min: 0,
    max: 10,
    step: 0.5,
    placeholder: '0-10%',
    hint: 'Incentivo para motivar pago rápido',
    expectedValue: 3
  },
  {
    name: 'action_notes',
    label: 'Notas de Acción',
    type: 'textarea',
    required: true,
    minLength: 50,
    maxLength: 500,
    placeholder: 'Documenta tu estrategia y razonamiento...',
    hint: 'Explica por qué elegiste esta estrategia'
  }
];

export const ACTO1_M3_TIPS = [
  {
    id: 'tip_1',
    title: 'Regla 30-60-90',
    content: 'Las facturas se gestionan diferente según días vencidos: 30 días (recordatorio amistoso), 60 días (seguimiento firme), 90+ días (acción legal).'
  },
  {
    id: 'tip_2',
    title: 'Historial del Cliente',
    content: 'Clientes con buen historial merecen trato más flexible. Una situación aislada no debe destruir una relación de años.'
  },
  {
    id: 'tip_3',
    title: 'Planes de Pago',
    content: 'Ofrecer plan de pagos aumenta tasa de recuperación hasta 40% vs exigir pago completo inmediato.'
  },
  {
    id: 'tip_4',
    title: 'Documentación',
    content: 'Documenta TODAS las comunicaciones: fecha, método, respuesta del cliente. Es crucial para escalaciones futuras.'
  }
];

export const ACTO1_M3_PROBLEM_SOLVING = {
  id: 'collection_dilemma',
  type: 'problem_solving',
  title: 'Dilema: Cliente vs Cash Flow',
  description: `
El CFO te presiona para cobrar inmediatamente (necesita el cash para nómina). 
Pero Gustavo te advierte que este cliente es estratégico para el Q4.

¿Qué haces?
  `,
  options: [
    {
      id: 'option_a',
      text: 'Priorizar cash flow: exigir pago inmediato aunque arriesgue la relación',
      correct: false,
      feedback: 'Incorrecto. Perder un cliente que representa 8% de ventas anuales cuesta más que una crisis temporal de cash flow. Hay alternativas.'
    },
    {
      id: 'option_b',
      text: 'Ofrecer plan de pagos con primer pago inmediato (50%) y resto en 2 pagos',
      correct: true,
      feedback: '¡Correcto! Esto resuelve la urgencia del CFO (obtienes 50% = $17,900 inmediato) mientras mantienes la relación. Balance perfecto.'
    },
    {
      id: 'option_c',
      text: 'Extender plazo completo 30 días más sin condiciones',
      correct: false,
      feedback: 'Incorrecto. Esto no resuelve la urgencia del CFO y establece mal precedente de flexibilidad sin consecuencias.'
    },
    {
      id: 'option_d',
      text: 'Transferir la decisión a Gustavo para evitar responsabilidad',
      correct: false,
      feedback: 'Incorrecto. Como profesional de CxC, debes tomar decisiones balanceadas. Transferir responsabilidad muestra falta de criterio.'
    }
  ]
};

export const ACTO1_M3_SUCCESS_CRITERIA = {
  calculation_accuracy: {
    weight: 20,
    description: 'Precisión en cálculos de montos y días vencidos'
  },
  strategy_appropriateness: {
    weight: 30,
    description: 'Estrategia adecuada para el perfil del cliente'
  },
  communication_tone: {
    weight: 25,
    description: 'Tono profesional y empático en comunicación'
  },
  action_plan: {
    weight: 25,
    description: 'Plan de acción detallado y ejecutable'
  }
};
