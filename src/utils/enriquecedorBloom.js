// Enriquecedor de preguntas con metadatos de Bloom
// Este archivo agrega los niveles de Bloom a cada pregunta según su naturaleza cognitiva

export const MAPEO_BLOOM = {
  // Preparar Datos
  'prep_prin_001': 'aplicar',      // Manejo de NULL requiere aplicar buenas prácticas
  'prep_prin_002': 'recordar',     // Definición de Power Query
  'prep_prin_003': 'comprender',   // Entender modo Import
  'prep_prin_004': 'recordar',     // Conocer conectores disponibles
  'prep_inter_001': 'aplicar',     // Merge queries es aplicar técnica
  'prep_inter_002': 'comprender',  // Entender DirectQuery
  'prep_inter_003': 'comprender',  // Entender Query Folding
  'prep_inter_004': 'aplicar',     // Usar parámetros para entornos
  'prep_inter_005': 'aplicar',     // Transformar formato de fecha
  'prep_inter_006': 'recordar',    // Conocer herramientas de perfilado
  'prep_avanz_001': 'analizar',    // Analizar impacto de ReplaceValue

  // Modelar Datos
  'model_prin_001': 'comprender',  // Entender diferencia columna vs medida
  'model_prin_002': 'aplicar',     // Configurar relaciones
  'model_prin_003': 'comprender',  // Entender modelo relacional
  'model_prin_004': 'comprender',  // Distinguir fact vs dimension
  'model_prin_005': 'recordar',    // Definición de PK
  'model_inter_001': 'aplicar',    // Usar time intelligence
  'model_inter_002': 'comprender', // Entender star vs snowflake
  'model_inter_003': 'comprender', // Entender RELATEDTABLE
  'model_inter_004': 'aplicar',    // Implementar YTD
  'model_inter_005': 'aplicar',    // Calcular porcentajes con ALL
  'model_inter_006': 'comprender', // Cuándo usar medidas
  'model_avan_001': 'analizar',    // Optimizar DAX

  // Visualizar y Analizar
  'viz_prin_001': 'recordar',      // Conocer visual KPI
  'viz_prin_002': 'recordar',      // Conocer visuales geográficos
  'viz_prin_003': 'recordar',      // Conocer gráfico circular
  'viz_inter_001': 'aplicar',      // Usar drill-through
  'viz_inter_002': 'aplicar',      // Configurar tooltips
  'viz_inter_003': 'aplicar',      // Editar interacciones
  'viz_inter_004': 'recordar',     // Conocer Q&A
  'viz_inter_005': 'aplicar',      // Usar bookmark navigator
  'viz_avanz_001': 'comprender',   // Entender Key Influencers
  'viz_avanz_002': 'comprender',   // Entender Decomposition Tree

  // Administrar y Asegurar
  'admin_prin_001': 'aplicar',     // Asignar roles apropiados
  'admin_prin_002': 'comprender',  // Entender workspaces
  'admin_prin_003': 'aplicar',     // Asignar rol Viewer
  'admin_prin_004': 'comprender',  // Entender gateway
  'admin_inter_001': 'recordar',   // Conocer permisos de roles
  'admin_inter_002': 'aplicar',    // Asignar usuarios a RLS
  'admin_inter_003': 'aplicar',    // Distribuir con Apps
  'admin_inter_004': 'comprender', // Entender Publish to Web
  'admin_inter_005': 'aplicar',    // Configurar suscripciones
  'admin_avanz_001': 'aplicar'     // Configurar incremental refresh
};

// Función para agregar nivel Bloom a una pregunta
export function enriquecerPreguntaConBloom(pregunta) {
  const nivelBloom = MAPEO_BLOOM[pregunta.id] || 'recordar';
  return {
    ...pregunta,
    nivelBloom
  };
}

// Función para enriquecer todo el banco de preguntas
export function enriquecerBancoPreguntas(preguntasEjemplo) {
  const preguntasEnriquecidas = {};

  Object.keys(preguntasEjemplo).forEach(dominio => {
    preguntasEnriquecidas[dominio] = {};
    
    Object.keys(preguntasEjemplo[dominio]).forEach(nivel => {
      preguntasEnriquecidas[dominio][nivel] = preguntasEjemplo[dominio][nivel].map(
        pregunta => enriquecerPreguntaConBloom(pregunta)
      );
    });
  });

  return preguntasEnriquecidas;
}
