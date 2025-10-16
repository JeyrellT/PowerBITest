/**
 * acto1Mission2Content.js - Contenido para "Cash Application Maestro"
 * Misión: Emparejar pagos con facturas pendientes
 * Basado en FASE_3 y FASE_4 especificaciones
 */

export const ACTO1_M2_INSTRUCTIONS = `
Has recibido 5 pagos de clientes que necesitas aplicar a sus facturas correspondientes.

**Tu misión:**
- Analizar cada pago recibido (monto, cliente, referencia)
- Revisar las facturas pendientes
- Emparejar correctamente cada pago con su factura
- Verificar que los montos coincidan

**Pistas para emparejar:**
1. Verifica el nombre del cliente
2. Compara los montos (deben coincidir)
3. Revisa el campo "referencia" si está disponible
4. Considera la fecha del pago vs fecha de vencimiento

Un emparejamiento correcto reduce el DSO y mejora el flujo de caja.
`;

export const ACTO1_M2_SCENARIO = {
  title: 'Escenario de Cash Application',
  context: `
Es lunes por la mañana y has llegado a la oficina. El banco ha procesado 5 pagos 
durante el fin de semana. Tu jefe, Gustavo, necesita que los apliques antes del 
cierre contable de hoy a las 5 PM.

Algunos clientes incluyen la referencia de factura en sus pagos, otros no. 
Deberás usar tu criterio para emparejar correctamente.
  `,
  timeLimit: 20, // minutos
  difficulty: 'medio',
  kpis: {
    accuracy: {
      target: 80,
      description: 'Emparejamientos correctos (%)'
    },
    time: {
      target: 15,
      description: 'Tiempo de completado (minutos)'
    }
  }
};

export const ACTO1_M2_TIPS = [
  {
    id: 'tip_1',
    title: 'Verifica el Cliente',
    content: 'El primer paso es confirmar que el nombre del cliente coincida entre el pago y la factura.'
  },
  {
    id: 'tip_2',
    title: 'Compara Montos',
    content: 'Los montos deben coincidir exactamente. Si no coinciden, puede ser un pago parcial o error.'
  },
  {
    id: 'tip_3',
    title: 'Usa las Referencias',
    content: 'Si el pago incluye un número de factura en la referencia, úsalo como guía principal.'
  },
  {
    id: 'tip_4',
    title: 'Orden Cronológico',
    content: 'En caso de duda, aplica primero a las facturas más antiguas (FIFO - First In, First Out).'
  }
];

export const ACTO1_M2_PROBLEM_SOLVING = {
  id: 'partial_payment_scenario',
  type: 'problem_solving',
  title: 'Caso Especial: Pago Parcial',
  description: `
Un cliente ha enviado un pago de $2,500, pero su factura pendiente es de $5,000.

¿Qué debes hacer?
  `,
  options: [
    {
      id: 'option_a',
      text: 'Aplicar el pago parcial y dejar saldo pendiente de $2,500',
      correct: true,
      feedback: '¡Correcto! Los pagos parciales se aplican y el saldo restante queda pendiente. Esto se registra en el sistema y se envía estado de cuenta al cliente.'
    },
    {
      id: 'option_b',
      text: 'Rechazar el pago y devolverlo al cliente',
      correct: false,
      feedback: 'Incorrecto. Rechazar pagos parciales afecta negativamente la relación con el cliente y el flujo de caja.'
    },
    {
      id: 'option_c',
      text: 'Esperar a que el cliente complete el pago total',
      correct: false,
      feedback: 'Incorrecto. No se debe esperar. El pago parcial debe aplicarse de inmediato para reducir el saldo pendiente.'
    },
    {
      id: 'option_d',
      text: 'Aplicar el pago a otra factura del mismo cliente',
      correct: false,
      feedback: 'Incorrecto. Los pagos deben aplicarse a la factura específica que el cliente está pagando, no a otras facturas.'
    }
  ]
};

// Dataset configuration (ya existe en DatasetLoader)
export const ACTO1_M2_DATASET_CONFIG = {
  datasetName: 'payments_invoices',
  invoiceCount: 5,
  paymentCount: 5,
  // El dataset incluye:
  // - 4 pagos con monto exacto + referencia
  // - 1 pago sin referencia (requiere análisis manual)
};
