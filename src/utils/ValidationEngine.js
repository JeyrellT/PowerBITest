/**
 * ValidationEngine.js - Motor de validación de respuestas
 * Valida datasets, formularios, y respuestas del usuario
 * Basado en FASE_4 validaciones y KPIs
 */

/**
 * Valida un dataset de facturas
 */
export const validateInvoiceData = (invoice) => {
  const errors = [];

  // Validar campos requeridos
  if (!invoice.invoice_number || invoice.invoice_number.trim() === '') {
    errors.push({ field: 'invoice_number', message: 'Número de factura requerido' });
  }

  if (!invoice.customer_name || invoice.customer_name.trim() === '') {
    errors.push({ field: 'customer_name', message: 'Nombre de cliente requerido' });
  }

  if (!invoice.amount || invoice.amount <= 0) {
    errors.push({ field: 'amount', message: 'Monto debe ser mayor a 0' });
  }

  // Validar formatos
  if (invoice.invoice_number && !/^INV-\d{6}$/.test(invoice.invoice_number)) {
    errors.push({ field: 'invoice_number', message: 'Formato inválido. Use: INV-XXXXXX' });
  }

  if (invoice.due_date) {
    const dueDate = new Date(invoice.due_date);
    const issueDate = new Date(invoice.issue_date);
    
    if (dueDate < issueDate) {
      errors.push({ field: 'due_date', message: 'Fecha de vencimiento no puede ser anterior a la emisión' });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    score: errors.length === 0 ? 100 : Math.max(0, 100 - (errors.length * 20))
  };
};

/**
 * Valida emparejamiento de pagos
 */
export const validatePaymentMatching = (matches, correctMatches) => {
  let correctCount = 0;
  const results = [];

  Object.entries(matches).forEach(([paymentId, invoiceId]) => {
    const isCorrect = correctMatches[paymentId] === invoiceId;
    if (isCorrect) correctCount++;
    
    results.push({
      paymentId,
      invoiceId,
      correct: isCorrect
    });
  });

  const total = Object.keys(correctMatches).length;
  const score = (correctCount / total) * 100;

  return {
    valid: score >= 70,
    score: Math.round(score),
    correct: correctCount,
    total,
    results,
    matchRate: score / 100
  };
};

/**
 * Valida limpieza de datos
 */
export const validateDataCleaning = (originalData, cleanedData) => {
  const metrics = {
    duplicatesRemoved: 0,
    datesFixed: 0,
    formatsStandardized: 0,
    missingValuesFilled: 0
  };

  // Detectar duplicados removidos
  const originalIds = new Set(originalData.map(row => row.id));
  const cleanedIds = new Set(cleanedData.map(row => row.id));
  const duplicatesInOriginal = originalData.length - originalIds.size;
  const duplicatesInCleaned = cleanedData.length - cleanedIds.size;
  metrics.duplicatesRemoved = duplicatesInOriginal - duplicatesInCleaned;

  // Validar formatos de fecha
  cleanedData.forEach(row => {
    if (row.date && /^\d{2}\/\d{2}\/\d{4}$/.test(row.date)) {
      metrics.datesFixed++;
    }
    if (row.amount && /^\$\d+\.\d{2}$/.test(row.amount.toString())) {
      metrics.formatsStandardized++;
    }
  });

  const totalErrors = duplicatesInOriginal + 
                      originalData.filter(r => !r.date || !r.amount).length;
  const errorsRemaining = duplicatesInCleaned + 
                          cleanedData.filter(r => !r.date || !r.amount).length;
  
  const errorReduction = totalErrors > 0 ? (totalErrors - errorsRemaining) / totalErrors : 1;

  return {
    valid: errorReduction >= 0.80,
    score: Math.round(errorReduction * 100),
    metrics,
    errorReduction,
    totalErrors,
    errorsRemaining
  };
};

/**
 * Valida cálculo de DSO (Days Sales Outstanding)
 */
export const validateDSOCalculation = (userDSO, accountsReceivable, revenue, days = 30) => {
  const correctDSO = (accountsReceivable / revenue) * days;
  const difference = Math.abs(userDSO - correctDSO);
  const tolerance = correctDSO * 0.05; // 5% de tolerancia

  return {
    valid: difference <= tolerance,
    score: difference <= tolerance ? 100 : Math.max(0, 100 - (difference / tolerance) * 50),
    userDSO: Math.round(userDSO * 100) / 100,
    correctDSO: Math.round(correctDSO * 100) / 100,
    difference: Math.round(difference * 100) / 100
  };
};

/**
 * Valida buckets de aging
 */
export const validateAgingBuckets = (userBuckets, invoices) => {
  const correctBuckets = calculateAgingBuckets(invoices);
  let errors = 0;

  const bucketRanges = ['0-30', '31-60', '61-90', '90+'];
  
  bucketRanges.forEach(range => {
    const userAmount = userBuckets[range] || 0;
    const correctAmount = correctBuckets[range] || 0;
    const diff = Math.abs(userAmount - correctAmount);
    
    if (diff > correctAmount * 0.1) { // 10% de tolerancia
      errors++;
    }
  });

  return {
    valid: errors === 0,
    score: Math.max(0, 100 - (errors * 25)),
    userBuckets,
    correctBuckets,
    errors
  };
};

/**
 * Calcula buckets de aging correctamente
 */
export const calculateAgingBuckets = (invoices) => {
  const buckets = {
    '0-30': 0,
    '31-60': 0,
    '61-90': 0,
    '90+': 0
  };

  const today = new Date();

  invoices.forEach(invoice => {
    if (invoice.status === 'paid') return;

    const dueDate = new Date(invoice.due_date);
    const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));

    if (daysOverdue <= 30) {
      buckets['0-30'] += invoice.amount;
    } else if (daysOverdue <= 60) {
      buckets['31-60'] += invoice.amount;
    } else if (daysOverdue <= 90) {
      buckets['61-90'] += invoice.amount;
    } else {
      buckets['90+'] += invoice.amount;
    }
  });

  return buckets;
};

/**
 * Valida conversión de monedas
 */
export const validateCurrencyConversion = (userResult, amount, fromCurrency, toCurrency, exchangeRates) => {
  const rate = exchangeRates[`${fromCurrency}_${toCurrency}`];
  if (!rate) {
    return { valid: false, score: 0, error: 'Par de monedas no encontrado' };
  }

  const correctResult = amount * rate;
  const difference = Math.abs(userResult - correctResult);
  const tolerance = correctResult * 0.02; // 2% de tolerancia

  return {
    valid: difference <= tolerance,
    score: difference <= tolerance ? 100 : Math.max(0, 100 - (difference / tolerance) * 50),
    userResult: Math.round(userResult * 100) / 100,
    correctResult: Math.round(correctResult * 100) / 100,
    rate,
    difference: Math.round(difference * 100) / 100
  };
};

/**
 * Valida KPIs generales
 */
export const validateKPIs = (userKPIs, expectedKPIs, tolerances = {}) => {
  const results = {};
  let totalScore = 0;
  let validCount = 0;

  Object.keys(expectedKPIs).forEach(kpi => {
    const userValue = userKPIs[kpi];
    const expectedValue = expectedKPIs[kpi];
    const tolerance = tolerances[kpi] || 0.05; // 5% por defecto

    const difference = Math.abs(userValue - expectedValue);
    const maxDiff = expectedValue * tolerance;
    const isValid = difference <= maxDiff;

    if (isValid) validCount++;

    results[kpi] = {
      valid: isValid,
      userValue,
      expectedValue,
      difference,
      tolerance: tolerance * 100 + '%'
    };

    totalScore += isValid ? 100 : Math.max(0, 100 - (difference / maxDiff) * 100);
  });

  const avgScore = Object.keys(expectedKPIs).length > 0 
    ? totalScore / Object.keys(expectedKPIs).length 
    : 0;

  return {
    valid: validCount === Object.keys(expectedKPIs).length,
    score: Math.round(avgScore),
    results,
    validCount,
    total: Object.keys(expectedKPIs).length
  };
};

/**
 * Valida formato de datos
 */
export const validateDataFormat = (data, schema) => {
  const errors = [];

  Object.keys(schema).forEach(field => {
    const value = data[field];
    const rules = schema[field];

    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push({ field, message: `${field} es requerido` });
      return;
    }

    if (value && rules.type) {
      const actualType = typeof value;
      if (actualType !== rules.type) {
        errors.push({ field, message: `${field} debe ser de tipo ${rules.type}` });
      }
    }

    if (value && rules.pattern) {
      if (!rules.pattern.test(value.toString())) {
        errors.push({ field, message: rules.message || `${field} tiene formato inválido` });
      }
    }

    if (value !== undefined && rules.min !== undefined && value < rules.min) {
      errors.push({ field, message: `${field} debe ser mayor o igual a ${rules.min}` });
    }

    if (value !== undefined && rules.max !== undefined && value > rules.max) {
      errors.push({ field, message: `${field} debe ser menor o igual a ${rules.max}` });
    }
  });

  return {
    valid: errors.length === 0,
    score: errors.length === 0 ? 100 : Math.max(0, 100 - (errors.length * 10)),
    errors
  };
};

const ValidationEngine = {
  validateInvoiceData,
  validatePaymentMatching,
  validateDataCleaning,
  validateDSOCalculation,
  validateAgingBuckets,
  calculateAgingBuckets,
  validateCurrencyConversion,
  validateKPIs,
  validateDataFormat
};

export default ValidationEngine;
