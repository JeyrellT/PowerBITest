/**
 * acto1Mission1Content.js - Contenido para "Factura Perfecta"
 * Misión: Validar y completar facturas con errores
 * Basado en FASE_3 y FASE_4 especificaciones
 */

export const ACTO1_M1_VALIDATION_CHECKS = [
  {
    id: 'check_customer_info',
    title: 'Información del Cliente Incompleta',
    description: 'Revisar si el cliente tiene todos los datos requeridos (nombre, RFC/Tax ID, dirección)',
    example: 'Cliente "FreshFruits Inc." falta RFC: FRES850101ABC',
    hasIssue: true,
    explanation: 'El campo RFC/Tax ID está vacío. Es obligatorio para facturación fiscal.'
  },
  {
    id: 'check_invoice_format',
    title: 'Formato de Número de Factura Incorrecto',
    description: 'Verificar que el número de factura siga el formato estándar INV-XXXXXX',
    example: 'Factura "100001" debe ser "INV-100001"',
    hasIssue: true,
    explanation: 'El formato debe ser INV-XXXXXX (6 dígitos). Este formato no cumple el estándar.'
  },
  {
    id: 'check_dates',
    title: 'Fecha de Vencimiento Anterior a Fecha de Emisión',
    description: 'Confirmar que la fecha de vencimiento sea posterior a la fecha de emisión',
    example: 'Emisión: 2024-03-15, Vencimiento: 2024-03-01 ❌',
    hasIssue: true,
    explanation: 'La fecha de vencimiento (2024-03-01) es anterior a la fecha de emisión (2024-03-15). Debe corregirse.'
  },
  {
    id: 'check_amounts',
    title: 'Cálculo de Totales Correcto',
    description: 'Verificar que subtotal + impuestos = total',
    example: 'Subtotal: $5000 + IVA (16%): $800 = Total: $5800 ✓',
    hasIssue: false,
    explanation: 'Los cálculos son correctos. Subtotal + (Subtotal × 0.16) = Total'
  }
];

export const ACTO1_M1_FORM_FIELDS = [
  {
    id: 'tax_id',
    type: 'text',
    label: 'RFC / Tax ID del Cliente',
    placeholder: 'ABC123456XYZ',
    required: true,
    pattern: '^[A-Z]{3,4}\\d{6}[A-Z0-9]{3}$',
    patternMessage: 'Formato de RFC mexicano: 3-4 letras + 6 dígitos + 3 caracteres',
    hint: 'Registro Federal de Contribuyentes del cliente',
    minLength: 12,
    maxLength: 13
  },
  {
    id: 'payment_terms',
    type: 'select',
    label: 'Términos de Pago',
    required: true,
    hint: 'Condiciones de pago acordadas',
    options: [
      { value: 'Net 15', label: 'Net 15 - Pago a 15 días' },
      { value: 'Net 30', label: 'Net 30 - Pago a 30 días' },
      { value: 'Net 45', label: 'Net 45 - Pago a 45 días' },
      { value: 'Net 60', label: 'Net 60 - Pago a 60 días' }
    ]
  },
  {
    id: 'shipping_address',
    type: 'textarea',
    label: 'Dirección de Envío',
    placeholder: 'Calle, número, colonia, ciudad, estado, CP',
    required: true,
    rows: 3,
    minLength: 20,
    maxLength: 200,
    hint: 'Dirección completa para envío de mercancía'
  }
];

export const ACTO1_M1_VALIDATION_INSTRUCTIONS = `
Revisa cuidadosamente la factura y marca todos los problemas que encuentres.

**Tu misión:**
- Identificar campos faltantes o incorrectos
- Detectar errores en formatos
- Verificar consistencia de fechas
- Validar cálculos numéricos

No todos los ítems tienen errores. Marca solo los que realmente presenten problemas.
`;

export const ACTO1_M1_FORM_INSTRUCTIONS = `
Completa los campos faltantes de la factura para que esté lista para su emisión.

**Requisitos:**
- RFC debe seguir el formato fiscal mexicano
- Términos de pago según política de la empresa
- Dirección completa y precisa

Una factura perfecta es el primer paso para un cobro exitoso.
`;

// Datos esperados correctos (para referencia)
export const ACTO1_M1_EXPECTED_DATA = {
  tax_id: 'FRES850101ABC',
  payment_terms: 'Net 30',
  shipping_address: 'Av. Reforma 123, Col. Centro, CDMX, México, CP 06000'
};
