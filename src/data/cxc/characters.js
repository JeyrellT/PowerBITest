/**
 * Personajes del sistema CxC
 * Basado en FASE_1_GUION_MAESTRO.md
 */

export const CHARACTERS = {
  tess: {
    id: 'tess',
    name: 'Tess Saldo',
    role: 'Mentora Senior de CxC',
    icon: '👩‍💼',
    tone: 'práctico y directo',
    description: 'Tu mentora senior. Con 15 años en Cuentas por Cobrar, te guía con consejos prácticos y feedback constructivo.',
    avatar: '/assets/avatars/tess.svg'
  },

  gustavo: {
    id: 'gustavo',
    name: 'Gustavo Cashman',
    role: 'Gerente de CxC',
    icon: '👨‍💼',
    tone: 'exigente pero justo',
    description: 'El gerente del departamento. Establece metas claras y espera resultados, pero reconoce el buen trabajo.',
    avatar: '/assets/avatars/gustavo.svg'
  },

  priya: {
    id: 'priya',
    name: 'Priya Metrics',
    role: 'Analista de Datos Global',
    icon: '👩‍💻',
    tone: 'técnico y colaborativo',
    description: 'Experta en análisis de datos y Power BI. Aparece desde el Acto 2 para apoyarte con datos complejos.',
    avatar: '/assets/avatars/priya.svg'
  },

  alex: {
    id: 'alex',
    name: 'Alex Ledger',
    role: 'Analista Junior (Tú)',
    icon: '🧑',
    tone: 'reflexivo y en aprendizaje',
    description: 'Protagonista de la historia. Tu viaje desde auxiliar hasta analista senior.',
    avatar: '/assets/avatars/alex.svg'
  },

  cfo: {
    id: 'cfo',
    name: 'Director Financiero',
    role: 'CFO',
    icon: '👔',
    tone: 'estratégico y directo',
    description: 'El CFO de SuperMercado Global. Aparece en momentos clave del Acto 3.',
    avatar: '/assets/avatars/cfo.svg'
  }
};

/**
 * Clientes/Proveedores NPC
 */
export const VENDORS = {
  freshfruits: {
    id: 'freshfruits',
    name: 'FreshFruits Inc.',
    type: 'Anaquel',
    country: 'USA',
    icon: '🍎',
    description: 'Proveedor de frutas frescas. Cliente del caso tutorial.'
  },

  agrofoods: {
    id: 'agrofoods',
    name: 'Agro Foods Ltd.',
    type: 'Publicidad',
    country: 'MX',
    icon: '🌾',
    description: 'Proveedor de alimentos orgánicos con historial de pagos complejos.'
  },

  bebidasmundiales: {
    id: 'bebidasmundiales',
    name: 'Bebidas Mundiales Co.',
    type: 'Anaquel',
    country: 'CO',
    icon: '🥤',
    description: 'Uno de los mayores deudores en el Acto 3.'
  },

  lacteosdelValle: {
    id: 'lacteosdelValle',
    name: 'Lácteos Del Valle',
    type: 'Anaquel',
    country: 'CR',
    icon: '🥛',
    description: 'Proveedor regional con disputas ocasionales.'
  },

  organicos: {
    id: 'organicos',
    name: 'Productos Orgánicos S.A.',
    type: 'Publicidad',
    country: 'MX',
    icon: '🥗',
    description: 'Caso de disputa en el Acto 2.'
  }
};

/**
 * Diálogos pre-definidos por personaje y contexto
 */
export const DIALOGUES = {
  onboarding_tess: [
    "¡Bienvenido al equipo de Cuentas por Cobrar de SuperMercado Global! Soy Tess, tu mentora.",
    "Aquí no solo vendemos productos, también cobramos a nuestros proveedores por servicios como alquiler de espacio en anaqueles y publicidad en tiendas.",
    "Tu trabajo será crucial para mantener el flujo de efectivo de la empresa. Vamos a empezar con lo básico.",
    "Recuerda: cada factura que emites y cada pago que aplicas impacta directamente en la liquidez de SuperMercado Global."
  ],

  tutorial_intro_gustavo: [
    "Hola, soy Gustavo Cashman, gerente de este departamento.",
    "Vas a aprender rápido o vas a aprender rápido. No hay opción tres.",
    "Pero no te preocupes, si prestas atención y eres meticuloso, te irá bien.",
    "Tess te guiará en tu primera factura. Presta atención a cada detalle."
  ],

  acto1_start_tess: [
    "Ahora que completaste el tutorial, vamos con tu primer caso real.",
    "FreshFruits Inc. necesita una factura por el alquiler de anaquel del mes pasado.",
    "Tienes todos los datos, pero algunos campos están incompletos. Tu trabajo es completarlos y validar que todo esté correcto.",
    "Recuerda: una factura mal emitida puede causar problemas de cobro más adelante."
  ],

  acto2_cliffhanger_priya: [
    "Hola, soy Priya del equipo de Analytics Global. Tess me pidió que te contactara.",
    "Tenemos un problema: los datos del cierre mensual están... digamos, 'desordenados'.",
    "Fechas en formatos diferentes, duplicados, nombres de proveedores inconsistentes. El caos completo.",
    "Necesitamos que uses tus nuevas habilidades para limpiar estos datos antes del reporte ejecutivo. ¿Estás listo?"
  ],

  acto3_intro_cfo: [
    "Buen trabajo hasta ahora. He estado siguiendo tu progreso.",
    "Ahora necesitamos algo más grande: un dashboard consolidado de todas nuestras operaciones globales.",
    "Múltiples países, múltiples monedas, múltiples ERPs. Es complejo, pero confío en que puedes manejarlo.",
    "Este reporte irá directamente a la junta directiva. Nada de errores."
  ],

  finale_supervisor: [
    "Has demostrado habilidades excepcionales tanto en análisis como en liderazgo.",
    "Me gustaría ofrecerte la posición de Supervisor de Cuentas por Cobrar.",
    "Liderarás un equipo y serás responsable de la estrategia de cobranza global.",
    "¿Estás listo para dar este paso?"
  ],

  finale_analyst: [
    "Tu dominio técnico y analítico ha sido impresionante.",
    "Tengo una propuesta: Analista Senior enfocado en automatización y Business Intelligence.",
    "Trabajarías directamente con Priya desarrollando herramientas de análisis avanzado.",
    "Serías el experto técnico del departamento. ¿Te interesa?"
  ]
};

/**
 * Emails in-app del sistema
 */
export const EMAILS = {
  welcome: {
    from: CHARACTERS.gustavo,
    subject: 'Bienvenido al equipo de CxC',
    body: 'Tu primer día comienza ahora. Completa el tutorial y familiarízate con nuestros procesos.',
    timestamp: '2025-10-15T08:00:00Z',
    read: false
  },

  act1_complete: {
    from: CHARACTERS.tess,
    subject: '¡Felicidades por completar el Acto 1!',
    body: 'Has dominado los fundamentos. Ahora vienen los retos reales. Prepárate.',
    timestamp: '2025-10-15T10:30:00Z',
    read: false
  },

  data_crisis: {
    from: CHARACTERS.priya,
    subject: 'URGENTE: Datos sucios - necesito tu ayuda',
    body: 'Los datos del cierre están en mal estado. Necesito que los limpies antes de las 5 PM.',
    timestamp: '2025-10-15T13:00:00Z',
    read: false,
    urgent: true
  },

  global_expansion: {
    from: CHARACTERS.cfo,
    subject: 'Proyecto Global - Dashboard Consolidado',
    body: 'Necesitamos visibilidad completa de CxC en todas las regiones. Tú estás a cargo.',
    timestamp: '2025-10-16T09:00:00Z',
    read: false
  }
};

const charactersData = {
  CHARACTERS,
  VENDORS,
  DIALOGUES,
  EMAILS
};

export default charactersData;
