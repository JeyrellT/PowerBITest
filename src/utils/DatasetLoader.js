/**
 * DatasetLoader.js - Cargador de datasets sintéticos
 * Genera y carga datos para las misiones
 * Basado en FASE_4_DATOS_POWERBI.md
 */

/**
 * Genera facturas de ejemplo (clean dataset)
 */
export const generateCleanInvoices = (count = 10) => {
  const customers = [
    'FreshFruits Inc.',
    'EcoPackaging Ltd.',
    'DairyFresh Co.',
    'GrainMasters LLC',
    'BeveragePlus Int.'
  ];

  const invoices = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const issueDate = new Date(today);
    issueDate.setDate(issueDate.getDate() - Math.floor(Math.random() * 90));
    
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + 30);

    invoices.push({
      id: `INV-${String(100000 + i).padStart(6, '0')}`,
      invoice_number: `INV-${String(100000 + i).padStart(6, '0')}`,
      customer_name: customers[i % customers.length],
      customer_id: `CUST-${String(1000 + (i % customers.length)).padStart(4, '0')}`,
      issue_date: issueDate.toISOString().split('T')[0],
      due_date: dueDate.toISOString().split('T')[0],
      amount: Math.round((Math.random() * 9000 + 1000) * 100) / 100,
      tax: 0.16,
      status: Math.random() > 0.3 ? 'pending' : 'paid',
      payment_terms: 'Net 30',
      currency: 'USD'
    });
  }

  return invoices;
};

/**
 * Genera facturas con errores (dirty dataset)
 */
export const generateDirtyInvoices = (count = 15) => {
  const invoices = generateCleanInvoices(count);

  // Introducir errores intencionalmente
  invoices.forEach((invoice, index) => {
    // 20% duplicados
    if (index % 5 === 0 && index > 0) {
      invoice.id = invoices[index - 1].id;
    }

    // 30% fechas incorrectas
    if (index % 3 === 0) {
      invoice.due_date = '15/12/2024'; // Formato incorrecto
    }

    // 20% montos sin formato
    if (index % 5 === 1) {
      invoice.amount = String(invoice.amount).replace('.', ',');
    }

    // 15% nombres inconsistentes
    if (index % 7 === 0) {
      invoice.customer_name = invoice.customer_name.toUpperCase();
    }

    // 10% valores faltantes
    if (index % 10 === 0) {
      delete invoice.payment_terms;
    }
  });

  return invoices;
};

/**
 * Genera pagos para Cash Application
 */
export const generatePayments = (invoices) => {
  const payments = invoices.slice(0, 5).map((invoice, index) => {
    // 80% pagos exactos, 20% parciales
    const isPartial = Math.random() > 0.8;
    const amount = isPartial 
      ? Math.round(invoice.amount * 0.5 * 100) / 100
      : invoice.amount;

    return {
      id: `PAY-${String(20000 + index).padStart(6, '0')}`,
      payment_number: `PAY-${String(20000 + index).padStart(6, '0')}`,
      customer_name: invoice.customer_name,
      amount,
      payment_date: new Date().toISOString().split('T')[0],
      reference: Math.random() > 0.5 ? invoice.invoice_number : '', // 50% sin referencia
      method: ['Bank Transfer', 'Check', 'Credit Card'][Math.floor(Math.random() * 3)]
    };
  });

  return payments;
};

/**
 * Genera dataset de aging report
 */
export const generateAgingData = () => {
  const invoices = generateCleanInvoices(20);
  const today = new Date();

  // Ajustar fechas para tener distribución en buckets
  invoices.forEach((invoice, index) => {
    const dueDate = new Date(today);
    
    if (index < 5) {
      // 0-30 días
      dueDate.setDate(dueDate.getDate() - Math.floor(Math.random() * 30));
    } else if (index < 10) {
      // 31-60 días
      dueDate.setDate(dueDate.getDate() - (31 + Math.floor(Math.random() * 30)));
    } else if (index < 15) {
      // 61-90 días
      dueDate.setDate(dueDate.getDate() - (61 + Math.floor(Math.random() * 30)));
    } else {
      // 90+ días
      dueDate.setDate(dueDate.getDate() - (91 + Math.floor(Math.random() * 60)));
    }

    invoice.due_date = dueDate.toISOString().split('T')[0];
    invoice.status = 'pending'; // Solo facturas pendientes en aging
  });

  return invoices;
};

/**
 * Genera dataset multicurrency
 */
export const generateMultiCurrencyData = () => {
  const currencies = ['USD', 'EUR', 'GBP', 'MXN', 'CAD'];
  const invoices = generateCleanInvoices(15);

  invoices.forEach((invoice, index) => {
    invoice.currency = currencies[index % currencies.length];
    invoice.original_amount = invoice.amount;
    
    // Convertir a USD base (se asume)
    const rates = {
      'USD': 1,
      'EUR': 1.10,
      'GBP': 1.27,
      'MXN': 0.059,
      'CAD': 0.74
    };
    
    invoice.usd_amount = Math.round(invoice.amount * rates[invoice.currency] * 100) / 100;
  });

  return {
    invoices,
    exchangeRates: {
      'EUR_USD': 1.10,
      'GBP_USD': 1.27,
      'MXN_USD': 0.059,
      'CAD_USD': 0.74,
      'USD_EUR': 0.91,
      'USD_GBP': 0.79,
      'USD_MXN': 16.95,
      'USD_CAD': 1.35
    }
  };
};

/**
 * Genera KPIs dashboard data
 */
export const generateKPIData = () => {
  const invoices = generateCleanInvoices(50);
  
  const totalAR = invoices
    .filter(i => i.status === 'pending')
    .reduce((sum, i) => sum + i.amount, 0);
  
  const totalRevenue = invoices.reduce((sum, i) => sum + i.amount, 0);
  
  const dso = (totalAR / (totalRevenue / 30)) || 0;
  
  const collections = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.amount, 0);
  
  const collectionRate = totalRevenue > 0 ? (collections / totalRevenue) * 100 : 0;

  return {
    invoices,
    metrics: {
      totalAR: Math.round(totalAR * 100) / 100,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      dso: Math.round(dso * 10) / 10,
      collectionRate: Math.round(collectionRate * 10) / 10,
      invoiceCount: invoices.length,
      pendingCount: invoices.filter(i => i.status === 'pending').length,
      paidCount: invoices.filter(i => i.status === 'paid').length
    }
  };
};

/**
 * Genera respuestas correctas para matching
 */
export const generateCorrectMatches = (invoices, payments) => {
  const matches = {};
  
  payments.forEach((payment, index) => {
    if (index < invoices.length) {
      matches[payment.id] = invoices[index].id;
    }
  });

  return matches;
};

/**
 * Carga dataset según el nombre
 */
export const loadDataset = (datasetName) => {
  switch (datasetName) {
    case 'demo_clean':
    case 'invoices_clean_v1':
      return { invoices: generateCleanInvoices(10) };
    
    case 'invoices_dirty_v2':
    case 'dirty_invoices':
      return { invoices: generateDirtyInvoices(15) };
    
    case 'payments_clear_v1':
    case 'payments_invoices': {
      const invoices = generateCleanInvoices(5);
      const payments = generatePayments(invoices);
      const correctMatches = generateCorrectMatches(invoices, payments);
      return { invoices, payments, correctMatches };
    }
    
    case 'aging_clean_v1':
      return { invoices: generateAgingData() };
    
    case 'global_currency_v3':
      return generateMultiCurrencyData();
    
    case 'global_kpi_v3':
    case 'dashboard_proto_v2':
      return generateKPIData();
    
    case 'incomplete_invoice':
      return {
        invoice: {
          invoice_number: 'INV-100001',
          customer_name: 'FreshFruits Inc.',
          customer_id: '',
          issue_date: '2024-01-15',
          due_date: '',
          amount: 5000,
          tax: '',
          payment_terms: '',
          shipping_address: ''
        }
      };
    
    default:
      return { invoices: generateCleanInvoices(10) };
  }
};

/**
 * Obtiene estadísticas de un dataset
 */
export const getDatasetStats = (dataset) => {
  if (!dataset.invoices) return {};

  const invoices = dataset.invoices;
  
  return {
    count: invoices.length,
    totalAmount: invoices.reduce((sum, i) => sum + (i.amount || 0), 0),
    avgAmount: invoices.reduce((sum, i) => sum + (i.amount || 0), 0) / invoices.length,
    pendingCount: invoices.filter(i => i.status === 'pending').length,
    paidCount: invoices.filter(i => i.status === 'paid').length,
    currencies: [...new Set(invoices.map(i => i.currency))],
    dateRange: {
      earliest: Math.min(...invoices.map(i => new Date(i.issue_date).getTime())),
      latest: Math.max(...invoices.map(i => new Date(i.issue_date).getTime()))
    }
  };
};

const DatasetLoader = {
  generateCleanInvoices,
  generateDirtyInvoices,
  generatePayments,
  generateAgingData,
  generateMultiCurrencyData,
  generateKPIData,
  generateCorrectMatches,
  loadDataset,
  getDatasetStats
};

export default DatasetLoader;
