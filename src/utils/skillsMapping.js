/**
 * 🎯 SISTEMA DE MAPEO DE HABILIDADES PL-300
 * 
 * Define todas las habilidades específicas del examen PL-300
 * basadas en la guía oficial de Microsoft Learn
 */

export const PL300_SKILLS = {
  // ============================================================================
  // PREPARAR DATOS (23-27%)
  // ============================================================================
  'preparar-datos': {
    name: 'Preparar Datos',
    icon: '📥',
    weight: 0.25,
    subdomains: {
      'obtener-datos': {
        name: 'Obtener Datos de Orígenes',
        icon: '🔌',
        skills: [
          { id: 'connect-data-sources', name: 'Conectar a orígenes de datos', level: 1 },
          { id: 'import-modes', name: 'Modos de importación (Import, DirectQuery, Dual)', level: 2 },
          { id: 'storage-modes', name: 'Modos de almacenamiento', level: 2 },
          { id: 'data-gateway', name: 'Configurar Data Gateway', level: 3 },
          { id: 'parameters', name: 'Usar parámetros para cambiar orígenes', level: 3 }
        ]
      },
      'perfilar-limpiar-datos': {
        name: 'Perfilar y Limpiar Datos',
        icon: '🧹',
        skills: [
          { id: 'data-profiling', name: 'Herramientas de perfilado de datos', level: 1 },
          { id: 'handle-nulls', name: 'Manejo de valores NULL y errores', level: 1 },
          { id: 'data-quality', name: 'Identificar anomalías en calidad de datos', level: 2 },
          { id: 'data-types', name: 'Configurar tipos de datos correctos', level: 1 },
          { id: 'column-distribution', name: 'Evaluar distribución de columnas', level: 2 }
        ]
      },
      'transformar-datos': {
        name: 'Transformar y Estructurar Datos',
        icon: '⚙️',
        skills: [
          { id: 'power-query', name: 'Editor de Power Query', level: 1 },
          { id: 'merge-append', name: 'Combinar consultas (Merge/Append)', level: 2 },
          { id: 'query-folding', name: 'Query Folding', level: 3 },
          { id: 'unpivot-pivot', name: 'Transformar (Unpivot/Pivot)', level: 2 },
          { id: 'custom-columns', name: 'Crear columnas personalizadas', level: 2 }
        ]
      }
    }
  },

  // ============================================================================
  // MODELAR DATOS (24-31%)
  // ============================================================================
  'modelar-datos': {
    name: 'Modelar Datos',
    icon: '🗂️',
    weight: 0.27,
    subdomains: {
      'disenar-modelo': {
        name: 'Diseñar Modelo de Datos',
        icon: '📐',
        skills: [
          { id: 'star-schema', name: 'Esquema en estrella', level: 2 },
          { id: 'relationships', name: 'Crear y configurar relaciones', level: 2 },
          { id: 'cardinality', name: 'Cardinalidad de relaciones', level: 2 },
          { id: 'filter-direction', name: 'Dirección de filtros cruzados', level: 3 },
          { id: 'dimension-tables', name: 'Tablas de dimensiones vs hechos', level: 2 }
        ]
      },
      'crear-calculos': {
        name: 'Crear Cálculos con DAX',
        icon: '🧮',
        skills: [
          { id: 'dax-basics', name: 'Fundamentos de DAX', level: 1 },
          { id: 'calculated-columns', name: 'Columnas calculadas', level: 2 },
          { id: 'measures', name: 'Medidas (Measures)', level: 2 },
          { id: 'time-intelligence', name: 'Funciones de inteligencia temporal', level: 3 },
          { id: 'filter-context', name: 'Contexto de filtro y fila', level: 3 },
          { id: 'iterator-functions', name: 'Funciones iteradoras (SUMX, AVERAGEX)', level: 3 },
          { id: 'calculate-filter', name: 'CALCULATE y modificadores de filtro', level: 3 }
        ]
      },
      'optimizar-modelo': {
        name: 'Optimizar Rendimiento del Modelo',
        icon: '⚡',
        skills: [
          { id: 'performance-analyzer', name: 'Performance Analyzer', level: 2 },
          { id: 'reduce-cardinality', name: 'Reducir cardinalidad', level: 3 },
          { id: 'aggregations', name: 'Usar agregaciones', level: 3 },
          { id: 'incremental-refresh', name: 'Actualización incremental', level: 3 }
        ]
      }
    }
  },

  // ============================================================================
  // VISUALIZAR Y ANALIZAR (23-30%)
  // ============================================================================
  'visualizar-analizar': {
    name: 'Visualizar y Analizar Datos',
    icon: '📊',
    weight: 0.26,
    subdomains: {
      'crear-reportes': {
        name: 'Crear Reportes',
        icon: '📄',
        skills: [
          { id: 'visual-types', name: 'Tipos de visualizaciones', level: 1 },
          { id: 'format-visuals', name: 'Formatear visualizaciones', level: 1 },
          { id: 'custom-visuals', name: 'Visualizaciones personalizadas', level: 2 },
          { id: 'tooltips', name: 'Información sobre herramientas (tooltips)', level: 2 },
          { id: 'drillthrough', name: 'Páginas de obtención de detalles', level: 2 },
          { id: 'bookmarks', name: 'Marcadores (Bookmarks)', level: 2 }
        ]
      },
      'crear-dashboards': {
        name: 'Crear Dashboards',
        icon: '📈',
        skills: [
          { id: 'pin-visuals', name: 'Anclar visualizaciones', level: 1 },
          { id: 'dashboard-themes', name: 'Temas de dashboard', level: 1 },
          { id: 'dashboard-tiles', name: 'Configurar mosaicos', level: 2 },
          { id: 'real-time-dashboards', name: 'Dashboards en tiempo real', level: 3 }
        ]
      },
      'enriquecer-reportes': {
        name: 'Enriquecer Reportes con Análisis',
        icon: '🔍',
        skills: [
          { id: 'ai-insights', name: 'Información de IA', level: 2 },
          { id: 'quick-insights', name: 'Información rápida', level: 2 },
          { id: 'analyze-feature', name: 'Característica Analizar', level: 2 },
          { id: 'what-if-parameters', name: 'Parámetros What-If', level: 3 },
          { id: 'grouping-binning', name: 'Agrupación y creación de intervalos', level: 2 }
        ]
      }
    }
  },

  // ============================================================================
  // IMPLEMENTAR Y MANTENER (22-28%)
  // ============================================================================
  'administrar-asegurar': {
    name: 'Implementar y Mantener Soluciones',
    icon: '🛡️',
    weight: 0.25,
    subdomains: {
      'administrar-datasets': {
        name: 'Administrar Datasets',
        icon: '🗄️',
        skills: [
          { id: 'publish-datasets', name: 'Publicar datasets', level: 1 },
          { id: 'scheduled-refresh', name: 'Configurar actualización programada', level: 2 },
          { id: 'dataset-settings', name: 'Configuración de datasets', level: 2 },
          { id: 'endorsement', name: 'Promoción y certificación de contenido', level: 2 }
        ]
      },
      'implementar-rls': {
        name: 'Seguridad a Nivel de Fila',
        icon: '🔒',
        skills: [
          { id: 'rls-static', name: 'RLS estática', level: 2 },
          { id: 'rls-dynamic', name: 'RLS dinámica', level: 3 },
          { id: 'test-rls', name: 'Probar roles de RLS', level: 2 }
        ]
      },
      'proporcionar-acceso': {
        name: 'Proporcionar Acceso a Contenido',
        icon: '👥',
        skills: [
          { id: 'workspaces', name: 'Administrar áreas de trabajo', level: 2 },
          { id: 'workspace-roles', name: 'Roles de área de trabajo', level: 2 },
          { id: 'share-reports', name: 'Compartir reportes y dashboards', level: 1 },
          { id: 'apps', name: 'Crear y distribuir aplicaciones', level: 2 },
          { id: 'sensitivity-labels', name: 'Etiquetas de confidencialidad', level: 2 }
        ]
      }
    }
  }
};

/**
 * Obtener todas las habilidades en formato plano
 */
export const getAllSkills = () => {
  const skills = [];
  
  Object.entries(PL300_SKILLS).forEach(([domainKey, domain]) => {
    Object.entries(domain.subdomains).forEach(([subdomainKey, subdomain]) => {
      subdomain.skills.forEach(skill => {
        skills.push({
          ...skill,
          domain: domainKey,
          domainName: domain.name,
          subdomain: subdomainKey,
          subdomainName: subdomain.name,
          subdomainIcon: subdomain.icon
        });
      });
    });
  });
  
  return skills;
};

/**
 * Obtener habilidades por dominio
 */
export const getSkillsByDomain = (domain) => {
  if (!PL300_SKILLS[domain]) return [];
  
  const skills = [];
  Object.entries(PL300_SKILLS[domain].subdomains).forEach(([subdomainKey, subdomain]) => {
    subdomain.skills.forEach(skill => {
      skills.push({
        ...skill,
        subdomain: subdomainKey,
        subdomainName: subdomain.name
      });
    });
  });
  
  return skills;
};

/**
 * Obtener habilidades por nivel de dificultad
 */
export const getSkillsByLevel = (level) => {
  const levelMap = {
    'principiante': 1,
    'intermedio': 2,
    'avanzado': 3
  };
  
  const targetLevel = levelMap[level] || 1;
  return getAllSkills().filter(skill => skill.level === targetLevel);
};

/**
 * Calcular progreso de habilidades basado en preguntas respondidas
 */
export const calculateSkillProgress = (questionTracking) => {
  const skillProgress = {};
  
  // Inicializar todas las habilidades
  getAllSkills().forEach(skill => {
    skillProgress[skill.id] = {
      ...skill,
      attempted: 0,
      correct: 0,
      mastered: 0,
      total: 0,
      progress: 0
    };
  });
  
  // Por ahora, calculamos progreso basado en subdominios
  // En el futuro podríamos mapear preguntas específicas a habilidades
  
  return skillProgress;
};

export default PL300_SKILLS;
