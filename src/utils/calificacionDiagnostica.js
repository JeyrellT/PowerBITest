// Sistema de Calificación Diagnóstica Moderno
// Basado en mejores prácticas de evaluación formativa y taxonomía de Bloom

// ============================================================================
// 1. CONFIGURACIÓN DE PESOS Y NIVELES
// ============================================================================

export const PESOS_DIFICULTAD = {
  principiante: 1,
  intermedio: 2,
  avanzado: 3
};

export const NIVELES_BLOOM = {
  recordar: { orden: 1, nombre: 'Recordar', descripcion: 'Memoria y reconocimiento de información' },
  comprender: { orden: 2, nombre: 'Comprender', descripcion: 'Entender el significado de la información' },
  aplicar: { orden: 3, nombre: 'Aplicar', descripcion: 'Usar información en situaciones nuevas' },
  analizar: { orden: 4, nombre: 'Analizar', descripcion: 'Descomponer y examinar relaciones entre elementos' }
};

export const UMBRALES_NIVEL = {
  principiante: { min: 0, max: 50 },
  intermedio: { min: 51, max: 80 },
  avanzado: { min: 81, max: 100 }
};

// Mapeo de subdominios a categorías temáticas principales
export const CATEGORIAS_TEMATICAS = {
  'obtener-datos': 'Conexión y Obtención de Datos',
  'perfilar-limpiar-datos': 'Limpieza y Perfilado de Datos',
  'transformar-cargar-datos': 'Transformación de Datos',
  'diseñar-implementar-modelo': 'Diseño de Modelo de Datos',
  'crear-calculos-dax': 'DAX y Cálculos',
  'optimizar-rendimiento': 'Optimización y Rendimiento',
  'crear-reportes': 'Creación de Visualizaciones',
  'mejorar-usabilidad': 'UX y Storytelling',
  'identificar-patrones': 'Análisis de Patrones',
  'crear-gestionar-workspaces': 'Workspaces y Colaboración',
  'asegurar-gobernar': 'Seguridad y Gobierno'
};

// ============================================================================
// 2. FUNCIÓN PRINCIPAL: CALCULAR PUNTUACIÓN GLOBAL PONDERADA
// ============================================================================

export function calcularPuntuacionGlobal(respuestas) {
  let puntosTotales = 0;
  let puntosMaximos = 0;
  let aciertosPorNivel = {
    principiante: { correctas: 0, total: 0 },
    intermedio: { correctas: 0, total: 0 },
    avanzado: { correctas: 0, total: 0 }
  };

  respuestas.forEach(respuesta => {
    const peso = PESOS_DIFICULTAD[respuesta.nivel] || 1;
    puntosMaximos += peso;
    
    // Contabilizar por nivel
    aciertosPorNivel[respuesta.nivel].total += 1;
    
    if (respuesta.correcta) {
      puntosTotales += peso;
      aciertosPorNivel[respuesta.nivel].correctas += 1;
    }
  });

  const porcentajeGlobal = puntosMaximos > 0 ? (puntosTotales / puntosMaximos) * 100 : 0;
  const nivelAlcanzado = determinarNivel(porcentajeGlobal);

  // Calcular porcentajes por nivel
  Object.keys(aciertosPorNivel).forEach(nivel => {
    const data = aciertosPorNivel[nivel];
    data.porcentaje = data.total > 0 ? (data.correctas / data.total) * 100 : 0;
  });

  return {
    puntosTotales,
    puntosMaximos,
    porcentajeGlobal: Math.round(porcentajeGlobal * 100) / 100,
    nivelAlcanzado,
    aciertosPorNivel
  };
}

// ============================================================================
// 3. ANÁLISIS POR CATEGORÍAS TEMÁTICAS
// ============================================================================

export function analizarPorCategorias(respuestas) {
  const resultadosPorCategoria = {};

  respuestas.forEach(respuesta => {
    const categoria = CATEGORIAS_TEMATICAS[respuesta.subdominio] || respuesta.subdominio;
    
    if (!resultadosPorCategoria[categoria]) {
      resultadosPorCategoria[categoria] = {
        correctas: 0,
        total: 0,
        porDificultad: {
          principiante: { correctas: 0, total: 0 },
          intermedio: { correctas: 0, total: 0 },
          avanzado: { correctas: 0, total: 0 }
        }
      };
    }

    resultadosPorCategoria[categoria].total += 1;
    resultadosPorCategoria[categoria].porDificultad[respuesta.nivel].total += 1;
    
    if (respuesta.correcta) {
      resultadosPorCategoria[categoria].correctas += 1;
      resultadosPorCategoria[categoria].porDificultad[respuesta.nivel].correctas += 1;
    }
  });

  // Calcular porcentajes y niveles de rendimiento
  Object.keys(resultadosPorCategoria).forEach(categoria => {
    const data = resultadosPorCategoria[categoria];
    data.porcentaje = (data.correctas / data.total) * 100;
    data.nivelRendimiento = determinarNivelRendimiento(data.porcentaje);
    
    // Calcular porcentajes por dificultad
    Object.keys(data.porDificultad).forEach(dif => {
      const difData = data.porDificultad[dif];
      difData.porcentaje = difData.total > 0 ? (difData.correctas / difData.total) * 100 : 0;
    });
  });

  return resultadosPorCategoria;
}

// ============================================================================
// 4. EVALUACIÓN DE NIVEL COGNITIVO (TAXONOMÍA DE BLOOM)
// ============================================================================

export function evaluarNivelBloomPorCategoria(respuestas) {
  const bloomPorCategoria = {};

  respuestas.forEach(respuesta => {
    const categoria = CATEGORIAS_TEMATICAS[respuesta.subdominio] || respuesta.subdominio;
    const nivelBloom = respuesta.nivelBloom || 'recordar';
    
    if (!bloomPorCategoria[categoria]) {
      bloomPorCategoria[categoria] = {
        recordar: { correctas: 0, total: 0 },
        comprender: { correctas: 0, total: 0 },
        aplicar: { correctas: 0, total: 0 },
        analizar: { correctas: 0, total: 0 }
      };
    }

    bloomPorCategoria[categoria][nivelBloom].total += 1;
    
    if (respuesta.correcta) {
      bloomPorCategoria[categoria][nivelBloom].correctas += 1;
    }
  });

  // Determinar el nivel máximo alcanzado por categoría
  const nivelMaximoPorCategoria = {};
  
  Object.keys(bloomPorCategoria).forEach(categoria => {
    const niveles = bloomPorCategoria[categoria];
    
    // Calcular porcentajes
    Object.keys(niveles).forEach(nivel => {
      const data = niveles[nivel];
      data.porcentaje = data.total > 0 ? (data.correctas / data.total) * 100 : 0;
    });

    // Determinar nivel máximo alcanzado (con al menos 60% de acierto)
    let nivelMaximo = 'recordar';
    const ordenNiveles = ['recordar', 'comprender', 'aplicar', 'analizar'];
    
    for (let i = ordenNiveles.length - 1; i >= 0; i--) {
      const nivel = ordenNiveles[i];
      if (niveles[nivel].total > 0 && niveles[nivel].porcentaje >= 60) {
        nivelMaximo = nivel;
        break;
      }
    }

    nivelMaximoPorCategoria[categoria] = {
      nivelAlcanzado: nivelMaximo,
      detallesPorNivel: niveles,
      descripcion: NIVELES_BLOOM[nivelMaximo].descripcion
    };
  });

  return nivelMaximoPorCategoria;
}

// ============================================================================
// 5. GENERACIÓN DE RUTAS DE ESTUDIO PERSONALIZADAS
// ============================================================================

export function generarRutasDeEstudio(resultadosCategorias, nivelBloom, puntuacionGlobal) {
  const recomendaciones = [];
  const fortalezas = [];
  const debilidades = [];

  // Identificar fortalezas y debilidades
  Object.entries(resultadosCategorias).forEach(([categoria, datos]) => {
    if (datos.porcentaje >= 80) {
      fortalezas.push({
        categoria,
        porcentaje: datos.porcentaje,
        tipo: 'fortaleza'
      });
    } else if (datos.porcentaje < 60) {
      debilidades.push({
        categoria,
        porcentaje: datos.porcentaje,
        tipo: 'debilidad'
      });
    }
  });

  // Ordenar debilidades por prioridad (más bajo primero)
  debilidades.sort((a, b) => a.porcentaje - b.porcentaje);

  // Generar recomendaciones para debilidades
  debilidades.forEach((debilidad, index) => {
    const nivel = debilidad.porcentaje < 30 ? 'critico' : 
                  debilidad.porcentaje < 50 ? 'bajo' : 'medio';
    
    recomendaciones.push({
      prioridad: index + 1,
      tipo: 'reforzar',
      categoria: debilidad.categoria,
      nivelActual: debilidad.porcentaje,
      nivel,
      mensaje: generarMensajeRefuerzo(debilidad.categoria, nivel, nivelBloom[debilidad.categoria]),
      recursos: obtenerRecursos(debilidad.categoria, nivel),
      accionSugerida: obtenerAccionSugerida(debilidad.categoria, nivel)
    });
  });

  // Generar recomendaciones para fortalezas
  fortalezas.forEach(fortaleza => {
    recomendaciones.push({
      prioridad: debilidades.length + 1,
      tipo: 'potenciar',
      categoria: fortaleza.categoria,
      nivelActual: fortaleza.porcentaje,
      mensaje: generarMensajePotenciacion(fortaleza.categoria, nivelBloom[fortaleza.categoria]),
      recursos: obtenerRecursosAvanzados(fortaleza.categoria),
      accionSugerida: obtenerAccionAvanzada(fortaleza.categoria)
    });
  });

  // Recomendaciones para cerrar brechas cognitivas
  Object.entries(nivelBloom).forEach(([categoria, datos]) => {
    const nivelActual = datos.nivelAlcanzado;
    const ordenNiveles = ['recordar', 'comprender', 'aplicar', 'analizar'];
    const indiceActual = ordenNiveles.indexOf(nivelActual);
    
    if (indiceActual < ordenNiveles.length - 1) {
      const siguienteNivel = ordenNiveles[indiceActual + 1];
      recomendaciones.push({
        prioridad: recomendaciones.length + 1,
        tipo: 'avanzar-bloom',
        categoria,
        nivelBloomActual: nivelActual,
        siguienteNivelBloom: siguienteNivel,
        mensaje: `Para avanzar en ${categoria}, enfócate en actividades de nivel "${NIVELES_BLOOM[siguienteNivel].nombre}": ${NIVELES_BLOOM[siguienteNivel].descripcion}`,
        recursos: obtenerRecursosBloom(categoria, siguienteNivel)
      });
    }
  });

  return {
    recomendaciones: recomendaciones.slice(0, 10), // Top 10 recomendaciones
    fortalezas,
    debilidades,
    resumenEjecutivo: generarResumenEjecutivo(puntuacionGlobal, fortalezas.length, debilidades.length)
  };
}

// ============================================================================
// 6. FUNCIONES AUXILIARES
// ============================================================================

function determinarNivel(porcentaje) {
  if (porcentaje >= UMBRALES_NIVEL.avanzado.min) return 'avanzado';
  if (porcentaje >= UMBRALES_NIVEL.intermedio.min) return 'intermedio';
  return 'principiante';
}

function determinarNivelRendimiento(porcentaje) {
  if (porcentaje >= 80) return 'alto';
  if (porcentaje >= 50) return 'medio';
  return 'bajo';
}

function generarMensajeRefuerzo(categoria, nivel, datosBloom) {
  const mensajes = {
    critico: `📚 ${categoria} necesita atención urgente. Tu rendimiento actual sugiere que debes comenzar con los fundamentos. No te preocupes, ¡todos empezamos desde algún lugar!`,
    bajo: `💡 ${categoria} es un área clave para mejorar. Con estudio enfocado y práctica, puedes alcanzar un buen nivel. Te recomendamos dedicar tiempo a repasar los conceptos básicos.`,
    medio: `⚡ Vas por buen camino en ${categoria}. Con un poco más de práctica y profundización, podrás dominar esta área completamente.`
  };

  let mensaje = mensajes[nivel];
  
  if (datosBloom && datosBloom.nivelAlcanzado) {
    mensaje += ` Actualmente te encuentras en el nivel cognitivo "${NIVELES_BLOOM[datosBloom.nivelAlcanzado].nombre}".`;
  }

  return mensaje;
}

function generarMensajePotenciacion(categoria, datosBloom) {
  let mensaje = `🌟 ¡Excelente trabajo en ${categoria}! Has demostrado un dominio sólido de este tema.`;
  
  if (datosBloom && datosBloom.nivelAlcanzado) {
    mensaje += ` Has alcanzado el nivel cognitivo "${NIVELES_BLOOM[datosBloom.nivelAlcanzado].nombre}".`;
  }
  
  mensaje += ` Te sugerimos explorar casos avanzados o convertirte en mentor de otros en esta área.`;
  
  return mensaje;
}

function generarResumenEjecutivo(puntuacion, numFortalezas, numDebilidades) {
  const nivel = puntuacion.nivelAlcanzado;
  let mensaje = `Tu nivel general es **${nivel.toUpperCase()}** con un ${puntuacion.porcentajeGlobal.toFixed(1)}% de rendimiento ponderado. `;
  
  if (numFortalezas > 0) {
    mensaje += `Tienes ${numFortalezas} área(s) de fortaleza. `;
  }
  
  if (numDebilidades > 0) {
    mensaje += `Identificamos ${numDebilidades} área(s) clave para mejorar. `;
  } else {
    mensaje += `¡No identificamos debilidades significativas! `;
  }
  
  mensaje += `Sigue las recomendaciones personalizadas a continuación para optimizar tu aprendizaje.`;
  
  return mensaje;
}

function obtenerRecursos(categoria, nivel) {
  // Base de datos de recursos por categoría y nivel
  const recursos = {
    'DAX y Cálculos': {
      critico: [
        { tipo: 'curso', nombre: 'Introducción a DAX - Microsoft Learn', url: 'https://learn.microsoft.com/es-es/dax/' },
        { tipo: 'video', nombre: 'DAX Básico - YouTube', url: '#' }
      ],
      bajo: [
        { tipo: 'curso', nombre: 'DAX Intermedio - SQLBI', url: 'https://www.sqlbi.com/' },
        { tipo: 'libro', nombre: 'The Definitive Guide to DAX', url: '#' }
      ],
      medio: [
        { tipo: 'ejercicios', nombre: 'Ejercicios prácticos de DAX', url: '#' },
        { tipo: 'curso', nombre: 'DAX Avanzado', url: '#' }
      ]
    },
    'Creación de Visualizaciones': {
      critico: [
        { tipo: 'curso', nombre: 'Fundamentos de Visualización en Power BI', url: 'https://learn.microsoft.com/es-es/power-bi/visuals/' }
      ],
      bajo: [
        { tipo: 'curso', nombre: 'Visualizaciones Efectivas', url: '#' }
      ],
      medio: [
        { tipo: 'proyecto', nombre: 'Crea un Dashboard Interactivo', url: '#' }
      ]
    }
    // Agregar más categorías según necesidad
  };

  return recursos[categoria]?.[nivel] || [
    { tipo: 'documentación', nombre: `Documentación de ${categoria}`, url: 'https://learn.microsoft.com/es-es/power-bi/' }
  ];
}

function obtenerRecursosAvanzados(categoria) {
  return [
    { tipo: 'proyecto', nombre: `Proyecto Avanzado de ${categoria}`, descripcion: 'Aplica tus conocimientos en un caso real' },
    { tipo: 'certificacion', nombre: 'Preparación para PL-300', descripcion: 'Profundiza para la certificación oficial' }
  ];
}

function obtenerRecursosBloom(categoria, nivelBloom) {
  const recursos = {
    aplicar: [
      { tipo: 'ejercicio', nombre: 'Casos prácticos', descripcion: 'Resuelve problemas reales aplicando los conceptos' }
    ],
    analizar: [
      { tipo: 'proyecto', nombre: 'Análisis de casos complejos', descripcion: 'Descompón y examina escenarios avanzados' }
    ]
  };

  return recursos[nivelBloom] || [];
}

function obtenerAccionSugerida(categoria, nivel) {
  const acciones = {
    critico: `Comienza con el módulo introductorio de ${categoria} y dedica al menos 3 horas de estudio esta semana.`,
    bajo: `Repasa los conceptos clave de ${categoria} y realiza los ejercicios prácticos sugeridos.`,
    medio: `Profundiza en los aspectos avanzados de ${categoria} con los recursos intermedios.`
  };

  return acciones[nivel];
}

function obtenerAccionAvanzada(categoria) {
  return `Busca proyectos desafiantes o mentoría en ${categoria} para consolidar tu maestría.`;
}

// ============================================================================
// 7. BADGES Y GAMIFICACIÓN
// ============================================================================

export function otorgarBadges(resultadosCategorias, nivelBloom, puntuacionGlobal) {
  const badges = [];

  // Badge por nivel global
  if (puntuacionGlobal.porcentajeGlobal >= 90) {
    badges.push({
      id: 'maestro-powerbi',
      nombre: 'Maestro Power BI',
      descripcion: '¡Has alcanzado un nivel excepcional en todas las áreas!',
      icono: '🏆',
      rareza: 'legendario'
    });
  } else if (puntuacionGlobal.porcentajeGlobal >= 80) {
    badges.push({
      id: 'experto-powerbi',
      nombre: 'Experto Power BI',
      descripcion: 'Dominas ampliamente Power BI',
      icono: '🥇',
      rareza: 'epico'
    });
  }

  // Badges por categoría
  Object.entries(resultadosCategorias).forEach(([categoria, datos]) => {
    if (datos.porcentaje >= 85) {
      badges.push({
        id: `especialista-${categoria.toLowerCase().replace(/\s/g, '-')}`,
        nombre: `Especialista en ${categoria}`,
        descripcion: `Has demostrado excelencia en ${categoria}`,
        icono: '⭐',
        rareza: 'raro'
      });
    }
  });

  // Badge por nivel Bloom avanzado
  Object.entries(nivelBloom).forEach(([categoria, datos]) => {
    if (datos.nivelAlcanzado === 'analizar') {
      badges.push({
        id: `analista-${categoria.toLowerCase().replace(/\s/g, '-')}`,
        nombre: `Analista ${categoria}`,
        descripcion: `Has alcanzado el nivel de análisis en ${categoria}`,
        icono: '🔬',
        rareza: 'raro'
      });
    }
  });

  return badges;
}

// ============================================================================
// 8. FUNCIÓN INTEGRAL DE EVALUACIÓN
// ============================================================================

export function evaluarQuizCompleto(respuestas) {
  // 1. Puntuación global
  const puntuacionGlobal = calcularPuntuacionGlobal(respuestas);

  // 2. Análisis por categorías
  const resultadosCategorias = analizarPorCategorias(respuestas);

  // 3. Evaluación Bloom
  const nivelBloom = evaluarNivelBloomPorCategoria(respuestas);

  // 4. Rutas de estudio
  const rutasEstudio = generarRutasDeEstudio(resultadosCategorias, nivelBloom, puntuacionGlobal);

  // 5. Badges
  const badges = otorgarBadges(resultadosCategorias, nivelBloom, puntuacionGlobal);

  // 6. Datos para visualización
  const datosVisualizacion = prepararDatosVisualizacion(resultadosCategorias, nivelBloom);

  return {
    puntuacionGlobal,
    resultadosCategorias,
    nivelBloom,
    rutasEstudio,
    badges,
    datosVisualizacion,
    timestamp: new Date().toISOString()
  };
}

function prepararDatosVisualizacion(resultadosCategorias, nivelBloom) {
  // Datos para gráfico de barras por categoría
  const datosCategorias = Object.entries(resultadosCategorias).map(([nombre, datos]) => ({
    nombre: nombre.length > 20 ? nombre.substring(0, 20) + '...' : nombre,
    nombreCompleto: nombre,
    porcentaje: Math.round(datos.porcentaje),
    nivel: datos.nivelRendimiento,
    color: datos.nivelRendimiento === 'alto' ? '#4CAF50' : 
           datos.nivelRendimiento === 'medio' ? '#FF9800' : '#F44336'
  }));

  // Datos para gráfico de dona (distribución por nivel de dificultad)
  const totalPorNivel = {};
  Object.values(resultadosCategorias).forEach(cat => {
    Object.entries(cat.porDificultad).forEach(([nivel, datos]) => {
      if (!totalPorNivel[nivel]) {
        totalPorNivel[nivel] = { correctas: 0, total: 0 };
      }
      totalPorNivel[nivel].correctas += datos.correctas;
      totalPorNivel[nivel].total += datos.total;
    });
  });

  const datosDona = Object.entries(totalPorNivel).map(([nivel, datos]) => ({
    nombre: nivel.charAt(0).toUpperCase() + nivel.slice(1),
    valor: datos.total > 0 ? Math.round((datos.correctas / datos.total) * 100) : 0,
    color: nivel === 'principiante' ? '#4CAF50' :
           nivel === 'intermedio' ? '#FF9800' : '#F44336'
  }));

  // Datos para radar (nivel Bloom por categoría - top 6)
  const datosRadar = Object.entries(nivelBloom)
    .slice(0, 6)
    .map(([categoria, datos]) => {
      const ordenNiveles = ['recordar', 'comprender', 'aplicar', 'analizar'];
      return {
        categoria: categoria.length > 15 ? categoria.substring(0, 15) + '...' : categoria,
        nivel: ordenNiveles.indexOf(datos.nivelAlcanzado) + 1,
        max: 4
      };
    });

  return {
    datosCategorias,
    datosDona,
    datosRadar
  };
}
