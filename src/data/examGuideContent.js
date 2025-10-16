export const examGuideContent = {
  title: 'Guia completa del examen PL-300',
  lastUpdated: 'Documentacion Microsoft Learn (21 abril 2025)',
  description:
    'Resumen ejecutivo para disenar bancos diagnosticos y rutas de estudio alineadas con el examen Microsoft Power BI Data Analyst (PL-300).',
  keyStats: [
    { label: 'Duracion del examen', value: '100 minutos' },
    { label: 'Numero de preguntas', value: '50-60 (segun dificultad)' },
    { label: 'Puntaje minimo aprobatorio', value: '700 / 1000 (escalado)' },
    { label: 'Dominios con mayor peso', value: 'Modelar datos 30-35%' },
    { label: 'Idiomas disponibles', value: '10 (incluye espanol)' }
  ],
  preparationTimeline: [
    {
      title: 'Linea base',
      details: 'Evaluacion diagnostica rapida para medir brechas en los cuatro dominios.'
    },
    {
      title: 'Estudio estructurado (2-3 meses)',
      details:
        'Practica intensiva en Power BI Desktop y Service, repasando rutas Microsoft Learn y ejercitando DAX.'
    },
    {
      title: 'Pruebas de simulacion (2-3 semanas)',
      details:
        'Examenes de practica (MeasureUp u otros) y lectura completa de explicaciones para cada reactivo.'
    },
    {
      title: 'Cierre (1-2 semanas)',
      details:
        'Repaso de notas, escenarios empresariales complejos, ajustes en temas criticos como RLS y administracion del servicio.'
    }
  ],
  sections: [
    {
      id: 'estructura-oficial',
      title: '1. Estructura oficial del examen',
      intro:
        'El examen valida dominio practico del ciclo completo de Power BI. Microsoft actualizo la guia de habilidades el 21 de abril de 2025.',
      highlights: [
        'Evaluacion escalada: 700 puntos no equivale a 70% de aciertos.',
        'Los escenarios empresariales dominan la narrativa de las preguntas.',
        'La documentacion oficial marca el ritmo: rutas Learn, sandbox y evaluaciones gratuitas.'
      ],
      subSections: [
        {
          title: 'Formato general',
          items: [
            '50-60 preguntas en 100 minutos con tiempo justo para lectura y analisis.',
            'Sistema de puntuacion escalado que pondera dificultad y peso de cada dominio.',
            'Soporta multiple choice, seleccion multiple, drag-and-drop, hotspot, estudios de caso y verdadero/falso.',
            'Disponible en 10 idiomas; la interfaz replica examenes de Pearson VUE.'
          ]
        },
        {
          title: 'Distribucion de dominios segun Microsoft',
          items: [
            'Preparar los datos: 25-30%.',
            'Modelar los datos: 30-35% (mayor peso).',
            'Visualizar y analizar: 25-30%.',
            'Administrar y asegurar Power BI: 15-20%.'
          ]
        },
        {
          title: 'Recursos oficiales imprescindibles',
          items: [
            'Cinco rutas Microsoft Learn (Get Started, Prepare, Model, Build, Manage).',
            'Evaluacion de practica gratuita en Learn con reportes detallados.',
            'Sandbox de examen para familiarizarse con navegacion y bloqueos de seccion.',
            'Serie Exam Readiness Zone (Aravind Sridharan) con estrategias por dominio.'
          ]
        }
      ]
    },
    {
      id: 'experiencias-comunidad',
      title: '2. Experiencias reales y sorpresas reportadas',
      intro:
        'Testimonios de comunidades (Reddit r/PowerBI, Microsoft Tech Community, blogs especializados) coinciden en que el examen es mas dificil de lo previsto.',
      highlights: [
        'Muchos usuarios requieren 2-3 intentos; los exitos en primer intento invierten 2-5 meses en estudio practico.',
        'Power BI Service y administracion aparecen con frecuencia mayor a la esperada.',
        'El modelado de datos y DAX concentran la mayor complejidad tecnica.'
      ],
      subSections: [
        {
          title: 'Hallazgos clave',
          items: [
            'Modelar datos representa la mayor parte del examen y exige diseno de modelos solidos.',
            'DAX se evalua con CALCULATE, contexto de filtro, inteligencia temporal y medidas semi-aditivas.',
            'Power BI Service: RLS, gateways, permisos, actualizaciones y roles de workspace son recurrentes.',
            'Integracion con SharePoint, OneDrive, Azure y APIs de Power BI agrega preguntas de arquitectura.'
          ]
        },
        {
          title: 'Brechas de estudio recurrentes',
          items: [
            'Confusion en seguridad y gobernanza en Power BI Service.',
            'Implementacion de RLS y pruebas dinamicas con USERNAME().',
            'Power Query avanzado: merge vs append, query folding, parametros.',
            'Modos de almacenamiento y estrategias de rendimiento (Import, DirectQuery, Dual, incremental refresh).'            
          ]
        },
        {
          title: 'Linea de tiempo realista',
          items: [
            '2-3 meses: ruta DataCamp u otras academias para base solida.',
            '2-3 semanas: Microsoft Learn y repasos dirigidos.',
            '2 semanas: examenes de practica (MeasureUp, Whizlabs) con analisis de cada respuesta.',
            '1 semana final: laboratorios, ajustes de DAX, repasos de administracion y notas propias.'
          ]
        }
      ]
    },
    {
      id: 'formatos',
      title: '3. Formatos de pregunta frecuentes',
      intro:
        'El examen emplea alrededor de catorce formatos distintos enfocados en aplicacion practica.',
      highlights: [
        'Los estudios de caso iniciales son bloqueados una vez que se avanza: conviene tomar notas.',
        'Las preguntas arrastrar-soltar y construccion de formulas enfatizan pasos secuenciales en Power Query y DAX.',
        'Las preguntas de escenarios empresariales requieren evaluar restricciones reales de rendimiento y gobernanza.'
      ],
      subSections: [
        {
          title: 'Formatos destacados',
          items: [
            'Estudios de caso con multiples preguntas vinculadas y navegacion bloqueada.',
            'Opcion unica y seleccion multiple sin credito parcial.',
            'Drag-and-drop para pasos de transformacion y merges.',
            'Hotspot sobre diagramas y pantallas del servicio.',
            'Completar formulas DAX/M con bloques predefinidos.',
            'Preguntas Yes/No por afirmacion.',
            'Escenarios empresariales con decisiones arquitectonicas (DirectQuery, Premium, gateways).'
          ]
        },
        {
          title: 'Consejos operativos',
          items: [
            'Leer todo el escenario antes de responder, identificando palabras como "mejor", "mas eficiente" o "primero".',
            'Tomar notas breves durante el caso inicial para retener requisitos clave.',
            'Practicar escritorios en Power BI Desktop para familiarizarse con menus y paneles mencionados.',
            'Reforzar construccion de formulas iterando SUMX, FILTER, CALCULATE y funciones de tiempo.'
          ]
        }
      ]
    },
    {
      id: 'trampas',
      title: '4. Trampas comunes y conceptos que se confunden',
      intro:
        'Los errores frecuentes se repiten en los cuatro dominios y deben abordarse al crear reactivos diagnosticos.',
      highlights: [
        'Diferenciar medidas vs columnas calculadas es el punto ciego numero uno.',
        'La direccion del filtro y cardinalidad definen la validez del modelo.',
        'Roles de workspace y gateways generan errores de configuracion en escenario real.'
      ],
      subSections: [
        {
          title: 'Preparar datos',
          items: [
            'Medidas no pueden referenciar columnas sin agregacion; usar SUMX para calculos fila a fila.',
            'Import vs DirectQuery vs Dual: seleccionar segun rendimiento, latencia y funcionalidades disponibles.',
            'Merge (join horizontal) vs Append (combinacion vertical).',
            'Seleccion correcta de tipo de join (Left Outer, Inner) y manejo de NULL.',
            'Query folding y reemplazo de valores nulos antes de agregaciones.'
          ]
        },
        {
          title: 'Modelar datos y DAX',
          items: [
            'Contexto de fila vs contexto de filtro; entender transiciones con CALCULATE.',
            'Evitar relaciones bidireccionales innecesarias y adoptar esquema estrella.',
            'Implementar RLS en roles (Modeling > Manage roles) y probar con View As.',
            'Eleccion de modificadores ALL, ALLEXCEPT, REMOVEFILTERS segun escenario.',
            'Uso correcto de RELATED vs RELATEDTABLE y funciones iteradoras (SUMX, AVERAGEX, RANKX).'          
          ]
        },
        {
          title: 'Visualizacion y analitica',
          items: [
            'Seleccion de visual segun historia: barra/columna para comparaciones, linea para series temporales, scatter para correlaciones.',
            'Diferenciar drill-down (jerarquia en el mismo visual) vs drill-through (navegacion a paginas de detalle).',
            'Uso de bookmarks, tooltips personalizados y slicers sincronizados para storytelling.',
            'Aprovechar visuales impulsados por IA (Key Influencers, Decomposition Tree, Anomaly detection).'          
          ]
        },
        {
          title: 'Deployment y mantenimiento',
          items: [
            'Roles de workspace: Viewer, Contributor, Member, Admin y permisos minimos para publicar.',
            'Necesidad de gateways para orígenes on-premises y efecto en actualizaciones programadas.',
            'Diferenciar dataset vs report y reutilizacion de modelos.',
            'Comprender actualizacion incremental y limites de frecuencia por modo de almacenamiento.'
          ]
        }
      ]
    },
    {
      id: 'distribucion',
      title: '5. Distribucion de preguntas por tema',
      intro:
        'Recrear proporcionalidad oficial garantiza que el banco diagnostico refleje el examen real.',
      highlights: [
        'Cada dominio representa entre 13 y 18 preguntas en un examen de 55 items.',
        'DAX aparece en multiples dominios: modelado, visualizacion e incluso preparacion.',
        'Power BI Service y gobierno abarcan seguridad, actualizaciones, endorsement y lineage.'
      ],
      subSections: [
        {
          title: 'Preparar datos (25-30%)',
          items: [
            'Obtener/conectar datos, configurar credenciales y privacidad.',
            'Perfilar y limpiar datos: estadisticas, nulls, errores de importacion.',
            'Transformar y cargar: tipos de columna, merges, append, tablas de hechos/dimensiones, configuracion de carga.'
          ]
        },
        {
          title: 'Modelar datos (30-35%)',
          items: [
            'Propiedades de tablas y columnas, dimensiones role-playing, cardinalidad y filtro cruzado.',
            'DAX: CALCULATE, inteligencia temporal, medidas semi-aditivas, columnas/tablas calculadas, grupos de calculo.',
            'Optimizar rendimiento: Performance Analyzer, eliminar columnas innecesarias, ajustar granularidad.'
          ]
        },
        {
          title: 'Visualizar y analizar (25-30%)',
          items: [
            'Seleccion y formato de visuales, temas, formato condicional, slicers, reportes paginados.',
            'Usabilidad: bookmarks, tooltips, interacciones, navegacion, accesibilidad, visuales personalizados.',
            'Patrones y tendencias: Analyze, grouping, binning, clustering, visuales AI, forecasting, deteccion de outliers.'
          ]
        },
        {
          title: 'Administrar y asegurar (15-20%)',
          items: [
            'Gestion de workspaces, apps, distribucion, subscripciones, alertas, gateways.',
            'Seguridad: roles de workspace, acceso a items y modelos, RLS, etiquetas de sensibilidad.'
          ]
        }
      ]
    },
    {
      id: 'niveles',
      title: '6. Diferenciacion por niveles de dificultad',
      intro:
        'Clasificar las preguntas por nivel garantiza progresion pedagogica y permite un banco adaptativo.',
      highlights: [
        'Principiante: 30% del contenido, enfocado en fundamentos y tareas de interfaz.',
        'Intermedio: 50% del contenido, cubre transformaciones multi-paso, CALCULATE y administracion del servicio.',
        'Avanzado: 20% del contenido, demanda modelos complejos, iteradores DAX, optimizacion y RLS dinamico.'
      ],
      subSections: [
        {
          title: 'Principiante',
          items: [
            'Conectar a Excel/CSV, configurar tipos de datos, transformaciones basicas UI.',
            'Relaciones uno-a-muchos, medidas SUM/AVERAGE, visuales estandar.',
            'Tareas basicas de Power BI Service: publicar, crear dashboards, alertas simples.'
          ]
        },
        {
          title: 'Intermedio',
          items: [
            'Parametros, niveles de privacidad, agrupaciones, merges y append.',
            'CALCULATE, FILTER, inteligencia temporal, RELATED, dimensiones role-playing.',
            'Bookmarks, tooltips personalizados, sync slicers, roles de workspace, RLS basico.'
          ]
        },
        {
          title: 'Avanzado',
          items: [
            'Funciones M personalizadas, datos semi-estructurados, query folding avanzado.',
            'Relaciones many-to-many, grupos de calculo, iteradores complejos, variables VAR.',
            'Performance Analyzer, incremental refresh, RLS dinamico, visuales AI, integracion con servicios de Azure.'
          ]
        }
      ]
    },
    {
      id: 'recursos',
      title: '7. Recursos oficiales y terceros recomendados',
      intro:
        'Seleccion curada de materiales confiables para practica, refuerzo teorico y simulacion.',
      highlights: [
        'Complementar Microsoft Learn con laboratorios y evaluaciones pagadas acelera el dominio.',
        'Leer todas las explicaciones, incluso cuando se acierta, evita huecos de conocimiento.',
        'Los proveedores oficiales (MeasureUp) replican mejor el estilo del examen real.'
      ],
      subSections: [
        {
          title: 'Recursos Microsoft',
          items: [
            'Microsoft Learn Practice Assessment (gratuito, multiples intentos, reportes con enlaces).',
            'Exam Readiness Zone (videos en Learn) con tips de cada dominio.',
            'Microsoft Power BI Analyst Professional Certificate en Coursera (incluye mock exam oficial).'          
          ]
        },
        {
          title: 'Socios y plataformas externas',
          items: [
            'MeasureUp: partner oficial con garantia Test Pass y 14 tipos de preguntas.',
            'Whizlabs: paquetes de practica con laboratorios y sandbox Power BI.',
            'LinkedIn Learning: ruta "Prepare for the Power BI Data Analyst Associate".',
            'Pluralsight: evaluaciones de habilidad, labs y proyectos guiados.',
            'Udemy: cursos con 150-450 preguntas unicas, escenarios descargables.',
            'DataCamp Track Power BI: recorrido intensivo con descuento de 50% en el examen.',
            'Maven Analytics y blogs como Data With Sarah para planes de estudio probados.'
          ]
        }
      ]
    }
  ],
  closing: {
    keyInsights: [
      'Priorizar escenarios empresariales en lugar de memorizar definiciones.',
      'Sobrerrepresentar Modelar Datos, DAX y Power BI Service en el banco diagnostico.',
      'Disenar preguntas que obliguen a analizar, aplicar y sintetizar, no solo recordar.',
      'Actualizar preguntas con cada revision de la guia oficial; Power BI evoluciona rapidamente.'
    ],
    nextSteps: [
      'Usar esta guia como referencia para etiquetar preguntas por dominio, nivel y formato.',
      'Introducir explicaciones completas con enlaces a fuentes verificables.',
      'Incorporar escenarios de rendimiento, seguridad y governance en cada diagnostico.',
      'Programar revisiones periodicas del banco para reflejar nuevas caracteristicas GA.'
    ]
  }
};
