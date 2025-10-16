/**
 * tutorialContent.js - Contenido específico para la misión Tutorial
 * Basado en FASE_2 y FASE_4 especificaciones
 */

export const TUTORIAL_QUIZ = [
  {
    id: 'q1',
    question: '¿Qué significa CxC en términos contables?',
    category: 'Conceptos Básicos',
    difficulty: 'easy',
    context: 'CxC es uno de los departamentos más importantes en la gestión financiera de una empresa.',
    answers: [
      { id: 'a', text: 'Cuentas por Cobrar' },
      { id: 'b', text: 'Cuentas por Pagar' },
      { id: 'c', text: 'Caja y Bancos' },
      { id: 'd', text: 'Contabilidad Corporativa' }
    ],
    correctAnswer: 'a',
    explanation: 'CxC significa Cuentas por Cobrar (Accounts Receivable). Es el dinero que los clientes deben a la empresa por ventas a crédito.'
  },
  {
    id: 'q2',
    question: '¿Cuál es el propósito principal del proceso de Cash Application?',
    category: 'Procesos',
    difficulty: 'medium',
    context: 'Cash Application es un proceso crítico en el ciclo de CxC que requiere precisión y eficiencia.',
    answers: [
      { id: 'a', text: 'Generar nuevas facturas' },
      { id: 'b', text: 'Emparejar pagos recibidos con facturas pendientes' },
      { id: 'c', text: 'Calcular impuestos' },
      { id: 'd', text: 'Enviar estados de cuenta' }
    ],
    correctAnswer: 'b',
    explanation: 'Cash Application es el proceso de emparejar los pagos recibidos de clientes con las facturas correspondientes, reduciendo el saldo pendiente de cobro.'
  },
  {
    id: 'q3',
    question: '¿Qué indica el KPI "DSO" (Days Sales Outstanding)?',
    category: 'KPIs',
    difficulty: 'medium',
    context: 'Los KPIs son fundamentales para medir la eficiencia del departamento de CxC.',
    answers: [
      { id: 'a', text: 'El número de ventas diarias' },
      { id: 'b', text: 'El tiempo promedio que tarda la empresa en cobrar sus cuentas' },
      { id: 'c', text: 'El descuento ofrecido a clientes' },
      { id: 'd', text: 'Los días hábiles del mes' }
    ],
    correctAnswer: 'b',
    explanation: 'DSO (Days Sales Outstanding) mide el número promedio de días que tarda una empresa en cobrar el pago después de una venta. Un DSO más bajo indica mejor gestión de cobros.'
  }
];

export const TUTORIAL_FORM_FIELDS = [
  {
    id: 'invoice_number',
    type: 'text',
    label: 'Número de Factura',
    placeholder: 'INV-XXXXXX',
    required: true,
    pattern: '^INV-\\d{6}$',
    patternMessage: 'El formato debe ser INV-XXXXXX (ejemplo: INV-100001)',
    hint: 'Identificador único de la factura en formato estándar'
  },
  {
    id: 'customer_id',
    type: 'text',
    label: 'ID del Cliente',
    placeholder: 'CUST-XXXX',
    required: true,
    pattern: '^CUST-\\d{4}$',
    patternMessage: 'El formato debe ser CUST-XXXX (ejemplo: CUST-1001)',
    hint: 'Código de identificación del cliente'
  },
  {
    id: 'amount',
    type: 'number',
    label: 'Monto Total',
    placeholder: '0.00',
    required: true,
    min: 0.01,
    step: 0.01,
    hint: 'Monto total de la factura en dólares'
  },
  {
    id: 'due_date',
    type: 'date',
    label: 'Fecha de Vencimiento',
    required: true,
    hint: 'Fecha límite de pago (formato: YYYY-MM-DD)',
    validator: (value, formData) => {
      if (!value) return null;
      const dueDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        return 'La fecha de vencimiento no puede ser anterior a hoy';
      }
      return null;
    }
  },
  {
    id: 'payment_terms',
    type: 'select',
    label: 'Términos de Pago',
    required: true,
    hint: 'Condiciones de pago acordadas con el cliente',
    options: [
      { value: 'Net 15', label: 'Net 15 - Pago a 15 días' },
      { value: 'Net 30', label: 'Net 30 - Pago a 30 días' },
      { value: 'Net 45', label: 'Net 45 - Pago a 45 días' },
      { value: 'Net 60', label: 'Net 60 - Pago a 60 días' },
      { value: 'Due on Receipt', label: 'Due on Receipt - Pago inmediato' }
    ]
  },
  {
    id: 'notes',
    type: 'textarea',
    label: 'Notas Adicionales (opcional)',
    placeholder: 'Ingresa cualquier observación relevante...',
    required: false,
    rows: 3,
    maxLength: 500,
    hint: 'Información adicional sobre la factura o el cliente'
  }
];

export const TUTORIAL_FORM_INSTRUCTIONS = `
Completa el siguiente formulario de factura con información precisa. 
Este formulario simula la creación de una nueva factura en el sistema de CxC.

Asegúrate de seguir los formatos indicados para cada campo.
`;

export const TUTORIAL_FORM_INITIAL_DATA = {
  invoice_number: '',
  customer_id: '',
  amount: '',
  due_date: '',
  payment_terms: '',
  notes: ''
};

// Datos de validación esperados para el formulario
export const TUTORIAL_FORM_EXPECTED = {
  invoice_number: 'INV-100001',
  customer_id: 'CUST-1001',
  amount: 5000,
  due_date: '2025-11-15',
  payment_terms: 'Net 30',
  notes: ''
};
