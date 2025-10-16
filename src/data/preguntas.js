// Datos alineados con la guía oficial del examen PL-300
// Distribución basada en documentación Microsoft Learn (abril 2025)

export const preguntasEjemplo = {
  'preparar-datos': {
    principiante: [
      {
        id: 'prep_prin_001',
        pregunta: 'Tienes un archivo Excel con datos de ventas que necesitas importar a Power BI Desktop. El archivo contiene valores NULL en la columna "Cantidad". ¿Cuál es la mejor práctica para manejar estos valores antes de crear visualizaciones?',
        opciones: [
          'Mantener los valores NULL ya que Power BI los maneja automáticamente',
          'Reemplazar los NULL con cero (0) para evitar errores en cálculos',
          'Eliminar todas las filas que contengan valores NULL',
          'Reemplazar los NULL con el promedio de la columna'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'Reemplazar NULL con cero es la mejor práctica para datos de cantidad, ya que evita que funciones como AVERAGE ignoren estos valores y produzcan resultados incorrectos. NULL en columnas numéricas causa que AVERAGE divida por el conteo de valores no-null, resultando en un promedio más alto.',
          incorrectas: [
            'Power BI puede manejar NULL, pero esto puede causar resultados inesperados en agregaciones.',
            'Eliminar filas es demasiado agresivo y puede resultar en pérdida de datos importantes.',
            'El promedio no es apropiado para cantidades, donde cero es más lógico que un valor calculado.'
          ]
        },
        dominio: 'preparar-datos',
        subdominio: 'perfilar-limpiar-datos',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'No entender el impacto de NULL en funciones de agregación',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/connect-data/']
      },
      {
        id: 'prep_prin_002',
        pregunta: '¿Para qué se utiliza el Editor de Power Query en Power BI?',
        opciones: [
          'Almacenar datos en la nube de la organización',
          'Dar forma y transformar los datos antes de cargarlos al modelo',
          'Crear relaciones entre tablas',
          'Crear medidas y columnas calculadas con DAX'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'El Editor de Power Query se emplea para conectar, perfilar, limpiar y transformar los datos antes de que formen parte del modelo de Power BI. Aquí se pueden aplicar pasos como quitar columnas, cambiar tipos de datos, combinar tablas, etc., de modo que los datos queden listos para el análisis.',
          incorrectas: [
            'No, el Editor no es un repositorio de datos',
            'Eso se hace en el modelo, no en el Editor de consultas',
            'Eso también se hace en el modelo, no en el Editor'
          ]
        },
        dominio: 'preparar-datos',
        subdominio: 'transformar-cargar-datos',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'Confundir funciones de Power Query con funciones del modelo',
        referencias: ['https://learn.microsoft.com/en-us/power-query/power-query-what-is-power-query']
      },
      {
        id: 'prep_prin_003',
        pregunta: 'En el contexto de Power BI, ¿qué significa el modo de almacenamiento Importar?',
        opciones: [
          'Las tablas se almacenan en memoria y las consultas se satisfacen con datos en caché',
          'Las tablas se consultan directamente en el origen cada vez',
          'Las tablas pueden funcionar de ambas formas según la necesidad',
          'Es un modo deprecated en versiones recientes'
        ],
        respuestaCorrecta: 0,
        explicacion: {
          correcta: 'En el modo Importación, Power BI realiza una copia de los datos desde el origen y los almacena en el modelo en memoria (utilizando el motor VertiPaq). Todas las visualizaciones trabajan contra esa copia interna, haciendo las respuestas muy rápidas.',
          incorrectas: [
            'Eso describe DirectQuery, no Import',
            'Eso describe modo Dual',
            'Import es el modo estándar y activo'
          ]
        },
        dominio: 'preparar-datos',
        subdominio: 'obtener-datos',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'Confundir modos de almacenamiento',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/connect-data/service-dataset-modes-understand']
      },
      {
        id: 'prep_prin_004',
        pregunta: '¿A cuáles de los siguientes orígenes puede conectarse Power BI de forma nativa?',
        opciones: [
          'Solo bases de datos SQL',
          'Solo archivos Excel y CSV',
          'Bases de datos SQL, Google Analytics, y scripts de R/Python',
          'Solo fuentes Microsoft'
        ],
        respuestaCorrecta: 2,
        explicacion: {
          correcta: 'Power BI puede conectarse a prácticamente cualquier tipo de origen de datos. Trae conectores integrados para bases SQL, servicios en la nube (como Google Analytics, Salesforce), archivos Excel/CSV, web services, e incluso puede ejecutar scripts de R o Python para traer datos.',
          incorrectas: [
            'Power BI soporta muchos más orígenes además de SQL',
            'También soporta bases de datos y servicios en la nube',
            'Soporta fuentes de terceros como Google, Salesforce, etc.'
          ]
        },
        dominio: 'preparar-datos',
        subdominio: 'obtener-datos',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'Subestimar la variedad de conectores disponibles',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/connect-data/desktop-data-sources']
      },
      {
        id: 'prep_prin_005',
        pregunta: '¿A cuáles de los siguientes orígenes puede conectarse Power BI de forma nativa?',
        opciones: [
          'Solo bases de datos SQL',
          'Solo archivos Excel y CSV',
          'Bases de datos SQL, Google Analytics, y scripts de R/Python',
          'Solo fuentes Microsoft'
        ],
        respuestaCorrecta: 2,
        explicacion: {
          correcta: 'Power BI puede conectarse a prácticamente cualquier tipo de origen de datos. Trae conectores integrados para bases SQL, servicios en la nube (como Google Analytics, Salesforce), archivos Excel/CSV, web services, e incluso puede ejecutar scripts de R o Python para traer datos.',
          incorrectas: [
            'Power BI soporta muchos más orígenes además de SQL',
            'También soporta bases de datos y servicios en la nube',
            'Soporta fuentes de terceros como Google, Salesforce, etc.'
          ]
        },
        dominio: 'preparar-datos',
        subdominio: 'obtener-datos',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'Subestimar la variedad de conectores disponibles',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/connect-data/desktop-data-sources']
      },
      {
        id: 'prep_prin_006',
        pregunta: '¿En qué escenario es recomendable utilizar DirectQuery en lugar de Importación al conectar con datos en Power BI?',
        opciones: [
          'Cuando los datos de origen cambian con mucha frecuencia y los informes deben reflejar datos casi en tiempo real',
          'Cuando el conjunto de datos es demasiado grande para almacenarse en memoria eficientemente',
          'Cuando la política de la empresa prohíbe almacenar datos fuera del sistema de origen (solo permite acceso directo)',
          'Todas las anteriores'
        ],
        respuestaCorrecta: 3,
        explicacion: {
          correcta: 'DirectQuery es adecuado cuando: el volumen de datos es muy grande para cargarlo completo en el modelo, cuando los datos cambian con frecuencia (necesidad de datos en tiempo casi real) o por requerimientos de seguridad/gobernanza donde los datos no deben residir en Power BI sino consultarse bajo demanda.',
          incorrectas: [
            'Esta es una razón válida, pero no la única',
            'Esta es otra razón válida, pero no la única',
            'Esta es también una razón válida, pero no la única'
          ]
        },
        dominio: 'preparar-datos',
        subdominio: 'obtener-datos',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'No conocer todos los escenarios donde DirectQuery es beneficioso',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/connect-data/desktop-directquery-about']
      },
      {
        id: 'prep_prin_007',
        pregunta: 'Tienes una base de datos de transacciones que se actualiza continuamente durante el día. Necesitas generar reportes donde los datos estén actualizados al menos cada 5 minutos para detectar posibles fraudes. ¿Cómo debes configurar la conexión de datos en Power BI?',
        opciones: [
          'Escribir una consulta SQL personalizada para filtrar solo últimos 5 minutos',
          'Usar DirectQuery como modo de conectividad',
          'Aumentar el tiempo de espera (Command timeout) de la conexión',
          'Usar Importación de datos con actualización programada cada 5 min'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'DirectQuery permite que las visualizaciones consulten los datos directamente en la fuente cada vez, mostrando datos casi en tiempo real. De esta manera, cualquier cambio en la base de datos (por ejemplo, una transacción fraudulenta reciente) se reflejará al interactuar con el reporte, cumpliendo con la necesidad de datos actualizados constantemente.',
          incorrectas: [
            'No resuelve actualizaciones en tiempo real; seguiría requiriendo actualización del conjunto',
            'No guarda relación con la frecuencia de actualización de datos',
            'Las actualizaciones programadas estándar tienen mínimo 30 min en Power BI compartido; además recargar todo el dataset frecuentemente es menos eficiente'
          ]
        },
        dominio: 'preparar-datos',
        subdominio: 'obtener-datos',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'No entender cuándo es apropiado usar DirectQuery para datos en tiempo real',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/connect-data/desktop-directquery-about']
      },
      {
        id: 'prep_prin_008',
        pregunta: 'Planeas publicar en el servicio de Power BI un modelo que se conecta en vivo a un cubo Tabular de SQL Server Analysis Services (SSAS) alojado on-premises. ¿Qué requisito adicional necesitas configurar para que la conexión funcione tras publicar?',
        opciones: [
          'Un gateway de datos local (On-premises Data Gateway) para el servidor SSAS',
          'Un Workspace en modo Premium dedicado',
          'Parámetros para cambiar entre conexiones Live y de Importación',
          'Agregar la cuenta de Power BI como admin del servidor SSAS'
        ],
        respuestaCorrecta: 0,
        explicacion: {
          correcta: 'Para fuentes de datos locales (on-premises) como un servidor SSAS en vivo, se requiere configurar un Gateway de datos en la red local. El gateway actúa como puente seguro entre el servicio Power BI en la nube y la fuente on-premises, permitiendo las consultas en vivo al cubo.',
          incorrectas: [
            'Un workspace Premium no es obligatorio para conexiones Live',
            'Los parámetros no suplen la necesidad de un gateway para fuentes on-premises',
            'Aunque podría ser necesario para permisos, no resuelve la conectividad física entre la nube y la red local'
          ]
        },
        dominio: 'preparar-datos',
        subdominio: 'obtener-datos',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'No entender la necesidad de un gateway para conectar a fuentes on-premises desde el servicio',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/connect-data/service-gateway-onprem']
      },
      {
        id: 'prep_prin_009',
        pregunta: 'Desde el servicio Power BI (app.powerbi.com) puedes crear un dataset importando directamente ciertos tipos de archivo. ¿Cuáles archivos son soportados para importar como dataset en el servicio?',
        opciones: [
          'Solo archivos .pbix de Power BI Desktop',
          'Archivos Excel (.xlsx) y CSV',
          'Archivos XML y JSON directamente',
          'Solo archivos de texto plano (.txt)'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'En el servicio Power BI, bajo "Obtener Datos > Archivos", se pueden subir ciertos tipos de archivo para crear datasets: principalmente Excel (también .xlsm), archivos de texto delimitado como CSV o TSV, y archivos de Power BI Desktop .PBIX. Los límites de tamaño aplican según la capacidad.',
          incorrectas: [
            'También soporta Excel y CSV, no solo .pbix',
            'XML y JSON no se pueden importar directamente al servicio; deben procesarse primero en Desktop',
            'Soporta más formatos además de .txt'
          ]
        },
        dominio: 'preparar-datos',
        subdominio: 'obtener-datos',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'No conocer qué tipos de archivo acepta el servicio directamente',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/connect-data/service-get-data']
      }
    ],
    intermedio: [
      {
        id: 'prep_inter_001',
        pregunta: 'Tienes dos tablas: Productos (ProductID, ProductName, CategoryID) y Categorías (CategoryID, CategoryName). Necesitas combinar estos datos para mostrar el nombre de categoría junto con cada producto. ¿Qué operación de Power Query debes usar?',
        opciones: [
          'Append Queries para combinar verticalmente las tablas',
          'Merge Queries usando Inner Join en CategoryID',
          'Group By en la tabla Productos',
          'Transpose en ambas tablas y luego combinar'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'Merge Queries con Inner Join es correcto porque necesitas unir horizontalmente las tablas basándote en la clave común CategoryID. Esto agregará las columnas de Categorías a cada fila de Productos correspondiente.',
          incorrectas: [
            'Append combina datos verticalmente (apilar), no es para joins horizontales.',
            'Group By agrupa filas, no combina tablas relacionadas.',
            'Transpose cambia filas por columnas, no es relevante para este escenario.'
          ]
        },
        dominio: 'preparar-datos',
        subdominio: 'transformar-cargar-datos',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'Confundir Merge (horizontal) vs Append (vertical)',
        referencias: ['https://learn.microsoft.com/en-us/power-query/']
      },
      {
        id: 'prep_inter_002',
        pregunta: '¿Qué modo de almacenamiento de Power BI deja los datos en el origen de datos en lugar de importarlos al modelo?',
        opciones: [
          'Importación (Import) - Las tablas se cargan en memoria',
          'DirectQuery - Las consultas se envían al origen en tiempo real',
          'Dual - Combina comportamientos de Import y DirectQuery',
          'Live Connection - Solo para conexiones SSAS'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'El modo DirectQuery mantiene los datos en el origen y envía consultas en vivo cada vez que se interactúa con las visualizaciones. En cambio, Importar trae una copia local de los datos al modelo en memoria, y Dual permite que una tabla funcione en modo importado o DirectQuery según cómo se use.',
          incorrectas: [
            'Import copia los datos al modelo en memoria, no los deja en el origen',
            'Dual combina ambos modos pero no es la respuesta más directa para "dejar en origen"',
            'Live Connection es para cubos SSAS/AAS, no es un modo de almacenamiento general'
          ]
        },
        dominio: 'preparar-datos',
        subdominio: 'obtener-datos',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'Confundir DirectQuery con Live Connection',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/connect-data/desktop-directquery-about']
      },
      {
        id: 'prep_inter_003',
        pregunta: '¿Qué tecnología de Power Query mejora el rendimiento al generar una única consulta de origen que combina pasos de transformación?',
        opciones: [
          'Actualización incremental',
          'Query Folding - Combina pasos en una sola instrucción',
          'Columnar storage',
          'Partition switching'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'Query Folding es el proceso por el cual Power Query toma los pasos de transformación aplicados (filtros, agrupaciones, etc.) y los traduce en una sola consulta nativa del origen (por ejemplo, un solo comando SQL). Esto reduce el volumen de datos transferidos y mejora tiempos de carga.',
          incorrectas: [
            'Actualización incremental está relacionada con la carga parcial de datos, no con la optimización de consultas',
            'Columnar storage se refiere al almacenamiento de datos en columnas (propio de VertiPaq), no es una característica de Power Query',
            'Partition switching es una técnica de SQL Server, no de Power Query'
          ]
        },
        dominio: 'preparar-datos',
        subdominio: 'transformar-cargar-datos',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'No entender cómo Query Folding optimiza consultas al origen',
        referencias: ['https://learn.microsoft.com/en-us/power-query/power-query-folding']
      },
      {
        id: 'prep_inter_004',
        pregunta: 'Tienes versiones Desarrollo, Pruebas y Producción de una base de datos Azure SQL. Tu conjunto de datos apunta a Desarrollo. ¿Qué debes hacer para cambiar fácilmente entre entornos al publicar en el servicio?',
        opciones: [
          'Crear un archivo JSON con los nombres de servidor',
          'Crear un parámetro de Power Query para el nombre del servidor',
          'Crear una consulta para cada servidor',
          'Usar Table.ReplaceValue para cambiar el nombre del servidor'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'La forma recomendada es usar parámetros de Power Query para los detalles de conexión (p. ej. el nombre de servidor) y luego utilizarlos en las cadenas de conexión de las consultas. Así, tras publicar, puedes cambiar el valor del parámetro en el servicio Power BI o usar reglas de implementación para apuntar a Prod o Test sin reconfigurar todas las consultas.',
          incorrectas: [
            'Un archivo JSON no es lo óptimo ni soportado directamente para este propósito',
            'Poco práctico y propenso a errores tener consultas separadas por entorno',
            'No aplica para cambiar origen de datos de manera flexible'
          ]
        },
        dominio: 'preparar-datos',
        subdominio: 'obtener-datos',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'No usar parámetros para hacer datasets reutilizables entre entornos',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/connect-data/desktop-dynamic-m-query-parameters']
      },
      {
        id: 'prep_inter_005',
        pregunta: 'Tienes un archivo CSV de quejas con fecha en formato "2018-12-31 at 08:59". Quieres analizar por fecha usando jerarquía automática. ¿Qué debes hacer en Power Query?',
        opciones: [
          'Cambiar el tipo de datos de la columna a Date directamente',
          'Aplicar la transformación Parse de fecha',
          'Dividir la columna usando " at " como delimitador y convertir la parte fecha a tipo Date',
          'Usar DATEVALUE en una columna calculada'
        ],
        respuestaCorrecta: 2,
        explicacion: {
          correcta: 'La cadena "2018-12-31 at 08:59" no es reconocida directamente como fecha. Al dividir por el separador " at ", obtienes "2018-12-31" en una columna y "08:59" en otra. Luego conviertes la primera columna a tipo Fecha (Date). De este modo, Power BI podrá generar una jerarquía de fecha estándar sobre esa columna.',
          incorrectas: [
            'Falla porque el valor contiene texto "at" y hora, no es reconocible directamente',
            'No existe una función exacta "Parse" en el menú estándar que maneje el "at"',
            'DATEVALUE es de Excel/DAX, no de Power Query; además sería después de la transformación'
          ]
        },
        dominio: 'preparar-datos',
        subdominio: 'transformar-cargar-datos',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'Intentar convertir directamente texto con formato no estándar',
        referencias: ['https://learn.microsoft.com/en-us/power-query/split-columns']
      },
      {
        id: 'prep_inter_006',
        pregunta: '¿Cuáles herramientas de perfilado de datos ofrece Power Query para evaluar calidad y distribución?',
        opciones: [
          'Calidad de columna, Distribución de columna y Perfil de columna',
          'Columna por ejemplo, Columna condicional, Columna personalizada',
          'Columna índice y Columna duplicada',
          'Formato, Extraer y Parse'
        ],
        respuestaCorrecta: 0,
        explicacion: {
          correcta: 'En la pestaña Ver del Editor de Power Query se encuentran: Calidad de columna (% válidos, errores, vacíos), Distribución de columna (histograma de valores distintos) y Perfil de columna (estadísticas detalladas e histograma). Estas herramientas ayudan a entender la sanidad e inventario de los datos.',
          incorrectas: [
            'Estas son herramientas de transformación para agregar columnas, no de perfilado',
            'Estas son transformaciones, no herramientas de perfilado',
            'Estas son opciones de transformación de texto, no de perfilado'
          ]
        },
        dominio: 'preparar-datos',
        subdominio: 'perfilar-limpiar-datos',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'Confundir herramientas de perfilado con transformación',
        referencias: ['https://learn.microsoft.com/en-us/power-query/data-profiling-tools']
      },
      {
        id: 'prep_inter_007',
        pregunta: 'Al importar datos a Power BI, ¿qué tipo de error de carga podría provocar que una columna entera aparezca en blanco (blank)?',
        opciones: [
          'Mantener errores (Keep Errors)',
          'Despivotar columnas (Unpivot)',
          'Error de tipo de datos',
          'Filtro avanzado'
        ],
        respuestaCorrecta: 2,
        explicacion: {
          correcta: 'Un error de conversión de tipo de datos (por ejemplo, intentar convertir texto a número sin un formato válido) puede resultar en valores nulos en toda la columna transformada. El editor de Power Query muestra errores con un icono de error, pero al cargar el modelo, esas celdas aparecerán vacías o nulas.',
          incorrectas: [
            'Esta transformación produce una tabla con solo las filas erróneas, no causa directamente columnas en blanco',
            'Reestructura columnas a filas; no genera columnas totalmente en blanco por sí misma',
            'Los filtros eliminan filas, no causan blancos en columnas enteras'
          ]
        },
        dominio: 'preparar-datos',
        subdominio: 'perfilar-limpiar-datos',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'No entender cómo los errores de tipo de datos afectan al modelo final',
        referencias: ['https://learn.microsoft.com/en-us/power-query/handling-errors']
      },
      {
        id: 'prep_inter_008',
        pregunta: 'Dispones de una lista de 1.500 clientes potenciales con campos de Nombre, Apellido, Email, Región/Estado y Teléfono. Importas estos datos en Power Query. Quieres asegurarte de que la lista incluye registros para cada Estado objetivo de tu campaña de marketing. ¿Qué dos acciones en Power Query te ayudarían a verificar esto?',
        opciones: [
          'Abrir el Editor Avanzado y revisar el script M',
          'Seleccionar Calidad de columna en la vista de datos',
          'Habilitar el "Perfilado de columnas para el conjunto de datos completo"',
          'Seleccionar Distribución de columna o Perfil de columna'
        ],
        respuestaCorrecta: 3,
        explicacion: {
          correcta: 'Para comprobar si la lista contiene clientes de cada Estado, es útil usar las herramientas de perfilado de datos del Editor de Power Query. Primero, hay que asegurarse de analizar toda la columna (no solo los primeros 1.000 registros que usa por defecto) habilitando el perfilado en todo el conjunto de datos. Luego, opciones como Perfil de columna o Distribución de columna mostrarán la lista de Estados presentes y cuántas filas pertenecen a cada uno. Así detectas si algún Estado falta o está subrepresentado.',
          incorrectas: [
            'No ayuda para este fin, el código M no resume datos',
            'Muestra porcentaje de valores válidos, errores o vacíos, pero no la distribución de valores',
            'Esta opción es correcta pero incompleta; necesitas también ver la distribución'
          ]
        },
        dominio: 'preparar-datos',
        subdominio: 'perfilar-limpiar-datos',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'No aprovechar las herramientas de perfilado para validar distribución de datos',
        referencias: ['https://learn.microsoft.com/en-us/power-query/data-profiling-tools']
      },
      {
        id: 'prep_inter_009',
        pregunta: 'Desde el servicio Power BI (app.powerbi.com) puedes crear un dataset importando directamente ciertos tipos de archivo. ¿Cuáles archivos son soportados para importar como dataset en el servicio?',
        opciones: [
          'Solo archivos .pbix de Power BI Desktop',
          'Archivos Excel (.xlsx) y CSV',
          'Archivos XML y JSON directamente',
          'Solo archivos de texto plano (.txt)'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'En el servicio Power BI, bajo "Obtener Datos > Archivos", se pueden subir ciertos tipos de archivo para crear datasets: principalmente Excel (también .xlsm), archivos de texto delimitado como CSV o TSV, y archivos de Power BI Desktop .PBIX. Los límites de tamaño aplican según la capacidad.',
          incorrectas: [
            'También soporta Excel y CSV, no solo .pbix',
            'XML y JSON no se pueden importar directamente al servicio; deben procesarse primero en Desktop',
            'Soporta más formatos además de .txt'
          ]
        },
        dominio: 'preparar-datos',
        subdominio: 'obtener-datos',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'No conocer qué tipos de archivo acepta el servicio directamente',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/connect-data/service-get-data']
      }
    ],
    avanzado: [
      {
        id: 'prep_avanz_001',
        pregunta: 'Considera el siguiente paso de transformación aplicado en Power Query Editor: Table.ReplaceValue(SalesLT_Address, "1318", "1319", Replacer.ReplaceText, {"AddressLine1"}). Si una fila originalmente tiene el valor "21318 Lasalle Street" en la columna AddressLine1, ¿qué valor resultará tras aplicar la transformación?',
        opciones: [
          '1318',
          '1319',
          '21318 Lasalle Street',
          '21319 Lasalle Street'
        ],
        respuestaCorrecta: 3,
        explicacion: {
          correcta: 'La función ReplaceValue reemplaza todas las ocurrencias de la cadena "1318" por "1319" en la columna especificada. En "21318 Lasalle Street", la secuencia "1318" aparece como parte del número 21318, por lo que será sustituida, dando "21319 Lasalle Street". No reemplaza solo si es valor exacto, sino cualquier aparición de la subcadena.',
          incorrectas: [
            'No reemplaza toda la cadena, solo la subcadena "1318"',
            'No reemplaza toda la cadena, solo la subcadena "1318"',
            'Este sería el resultado si no se aplicara la transformación'
          ]
        },
        dominio: 'preparar-datos',
        subdominio: 'transformar-cargar-datos',
        nivel: 'avanzado',
        formato: 'opcion-multiple',
        trampaComun: 'Asumir que solo reemplaza valores exactos en lugar de subcadenas',
        referencias: ['https://learn.microsoft.com/en-us/powerquery-m/table-replacevalue']
      },
      {
        id: 'prep_avanz_002',
        pregunta: 'Tienes un archivo CSV de quejas de usuarios. En la columna Logged figura la fecha y hora del reclamo en formato texto, por ejemplo: "2018-12-31 at 08:59". Quieres analizar los reclamos por fecha (día) usando la jerarquía de fechas automática de Power BI. ¿Qué deberías hacer en Power Query?',
        opciones: [
          'Cambiar el tipo de datos de la columna Logged a Date directamente',
          'Aplicar la transformación Parse (Analizar) de fecha sobre la columna Logged',
          'Dividir la columna Logged usando " at " como delimitador, separando en dos columnas (Fecha y Hora), y convertir la nueva columna de fecha a tipo Date',
          'Crear una Columna por ejemplo que extraiga la parte de fecha "YYYY-MM-DD" y convertirla a Date'
        ],
        respuestaCorrecta: 2,
        explicacion: {
          correcta: 'La cadena "2018-12-31 at 08:59" no es reconocida directamente como fecha. Una solución es separar la parte de la fecha y la hora. Al dividir por el separador " at ", obtienes "2018-12-31" en una columna y "08:59" en otra. Luego conviertes la primera columna a tipo Fecha (Date). De este modo, Power BI podrá generar una jerarquía de fecha estándar sobre esa columna.',
          incorrectas: [
            'Falla porque el valor contiene texto "at" y hora, no es reconocible como fecha directamente',
            'No existe una función exacta "Parse" en el menú estándar que maneje el "at"',
            'También funcionaría, pero es menos directo que dividir la columna por el delimitador'
          ]
        },
        dominio: 'preparar-datos',
        subdominio: 'transformar-cargar-datos',
        nivel: 'avanzado',
        formato: 'opcion-multiple',
        trampaComun: 'Intentar convertir directamente texto con formato no estándar a fecha',
        referencias: ['https://learn.microsoft.com/en-us/power-query/split-columns']
      }
    ]
  },
  'modelar-datos': {
    principiante: [
      {
        id: 'model_prin_001',
        pregunta: 'Necesitas crear un cálculo que muestre el precio total por producto (Cantidad × Precio unitario). ¿Cuál es la diferencia principal entre crear esto como columna calculada versus medida?',
        opciones: [
          'No hay diferencia, ambas producen el mismo resultado',
          'La columna calculada se almacena en memoria y se calcula al actualizar datos; la medida se calcula durante las consultas',
          'La medida se almacena en memoria; la columna calculada se calcula en tiempo real',
          'Solo las medidas pueden usar fórmulas DAX'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'Esta es la diferencia fundamental: columnas calculadas se evalúan en contexto de fila, se almacenan en memoria y aumentan el tamaño del modelo. Las medidas se evalúan en contexto de filtro durante las queries y usan CPU en tiempo de consulta.',
          incorrectas: [
            'Hay diferencias significativas en almacenamiento, rendimiento y contexto de evaluación.',
            'Es al revés: columnas calculadas se almacenan, medidas se calculan on-the-fly.',
            'Ambas usan DAX, pero en contextos diferentes (fila vs filtro).'
          ]
        },
        dominio: 'modelar-datos',
        subdominio: 'diseñar-implementar-modelo',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'Confusión #1 del examen: contexto y almacenamiento de columnas vs medidas',
        referencias: ['https://learn.microsoft.com/en-us/dax/']
      },
      {
        id: 'model_prin_002',
        pregunta: 'Tienes una tabla de Clientes y una tabla de Facturas relacionadas por CustomerID. ¿Cómo debes configurar la cardinalidad y dirección de filtro?',
        opciones: [
          'Uno a Uno (1:1), filtro en ambas direcciones',
          'Uno a varios (1:*): Clientes (lado 1) hacia Facturas (lado *), filtro unidireccional',
          'Uno a varios, filtro en ambos sentidos (Both)',
          'Varios a varios (M:N) con relación compuesta'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'La relación apropiada es 1:* (uno a muchos) desde Clientes hacia Facturas, con filtro unidireccional desde el lado uno hacia el lado muchos. Esto significa que los filtros en la tabla de Clientes afectarán las Facturas correspondientes. Un filtro single direction es más eficiente para las consultas.',
          incorrectas: [
            'No es 1:1 porque un cliente puede tener muchas facturas; filtro bidireccional no es necesario',
            'Filtro bidireccional solo se usa en escenarios específicos como slicers sincronizados entre dimensiones',
            'M:N se evita salvo necesidad extrema; esta es una relación simple 1:*'
          ]
        },
        dominio: 'modelar-datos',
        subdominio: 'diseñar-implementar-modelo',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'Usar filtros bidireccionales innecesariamente',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-create-and-manage-relationships']
      },
      {
        id: 'model_prin_003',
        pregunta: '¿Qué convierte a un conjunto de tablas independientes en un modelo de datos relacional en Power BI?',
        opciones: [
          'Conectarlas mediante relaciones definidas en campos comunes',
          'Cargarlas juntas en un único archivo de Power BI Desktop',
          'Unir o combinar todas las tablas en una sola tabla maestra',
          'Ponerles nombres similares a las columnas clave'
        ],
        respuestaCorrecta: 0,
        explicacion: {
          correcta: 'Un modelo de datos implica que las tablas están relacionadas entre sí. En Power BI, esto se logra creando relaciones basadas en campos comunes (por ejemplo, CustomerID en Clientes con CustomerID en Facturas). Así, las tablas dejan de ser islas aisladas y pueden interactuar: se pueden cruzar filtros y agregar medidas correctamente.',
          incorrectas: [
            'Solo tenerlas en el .pbix no las relaciona entre sí',
            'No es necesario ni deseable combinar todo; se prefiere modelo relacional',
            'Los nombres por sí solos no establecen relaciones; hace falta definirlas explícitamente'
          ]
        },
        dominio: 'modelar-datos',
        subdominio: 'diseñar-implementar-modelo',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'Pensar que tener tablas juntas ya crea un modelo relacional',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-relationships-understand']
      },
      {
        id: 'model_prin_004',
        pregunta: '¿Cuál campo típicamente pertenecería a una tabla de hechos (fact table) y no a una dimensión?',
        opciones: [
          'Nombre de producto',
          'Precio de lista (retail price)',
          'Cantidad vendida',
          'Marca de producto'
        ],
        respuestaCorrecta: 2,
        explicacion: {
          correcta: 'Las tablas de hechos contienen métricas o medidas del negocio, generalmente números aditivos como cantidad, monto de venta, número de unidades, etc. que ocurren en eventos (transacciones). "Cantidad vendida" es típica de un hecho (varía en cada transacción).',
          incorrectas: [
            'Es un atributo descriptivo, normalmente en la dimensión Producto',
            'Atributo de un producto; suele ir en la dimensión Producto',
            'Atributo de categoría del producto, va en su dimensión'
          ]
        },
        dominio: 'modelar-datos',
        subdominio: 'diseñar-implementar-modelo',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'Confundir atributos descriptivos con métricas de hechos',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/guidance/star-schema']
      },
      {
        id: 'model_prin_005',
        pregunta: 'En modelado de bases de datos, ¿cómo se llama la columna que identifica de forma única cada fila de una tabla?',
        opciones: [
          'Clave primaria (Primary Key)',
          'Clave externa (Foreign Key)',
          'Clave nativa',
          'Clave única'
        ],
        respuestaCorrecta: 0,
        explicacion: {
          correcta: 'La Clave Primaria de una tabla es el campo (o combinación de campos) cuyos valores son únicos en cada fila y nunca nulos, garantizando la identidad de cada registro. En las relaciones, la clave primaria de la tabla padre es referenciada por la Clave Foránea (Foreign Key) en la tabla relacionada.',
          incorrectas: [
            'Es un campo que referencia la clave primaria de otra tabla, no identifica filas únicas en su propia tabla',
            'Término no estándar en este contexto',
            'El concepto formal es PK para clave principal'
          ]
        },
        dominio: 'modelar-datos',
        subdominio: 'diseñar-implementar-modelo',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'Confundir Primary Key con Foreign Key',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/guidance/star-schema']
      }
    ],
    intermedio: [
      {
        id: 'model_inter_001',
        pregunta: 'Tienes una medida que calcula ventas totales: `Ventas Totales = SUM(Ventas[Monto])`. Necesitas crear otra medida que calcule las ventas del mismo período del año anterior. ¿Cuál fórmula DAX es correcta?',
        opciones: [
          'Ventas Año Anterior = SUM(Ventas[Monto]) - 365',
          'Ventas Año Anterior = CALCULATE([Ventas Totales], DATEADD(Fechas[Date], -1, YEAR))',
          'Ventas Año Anterior = CALCULATE([Ventas Totales], SAMEPERIODLASTYEAR(Fechas[Date]))',
          'Ventas Año Anterior = [Ventas Totales] * YEAR(TODAY()) - 1'
        ],
        respuestaCorrecta: 2,
        explicacion: {
          correcta: 'SAMEPERIODLASTYEAR es la función de time intelligence correcta que modifica el contexto de filtro para obtener el mismo período del año anterior. Requiere una tabla de fechas marcada como Date Table.',
          incorrectas: [
            'Restar 365 no cambia el contexto de tiempo, solo resta un número.',
            'DATEADD con -1 YEAR también funciona, pero SAMEPERIODLASTYEAR es más específico y claro.',
            'Esta sintaxis es incorrecta y no modifica el contexto de filtro apropiadamente.'
          ]
        },
        dominio: 'modelar-datos',
        subdominio: 'crear-calculos-dax',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'Time intelligence requiere tabla de fechas y comprensión de contexto de filtro',
        referencias: ['https://learn.microsoft.com/en-us/dax/time-intelligence-functions-dax']
      },
      {
        id: 'model_inter_002',
        pregunta: '¿Qué ventaja tiene usar un modelo en estrella (star schema) en lugar de un modelo en copo de nieve (snowflake) en Power BI?',
        opciones: [
          'Reduce la cantidad de relaciones y generalmente mejora el rendimiento de las consultas',
          'Permite mayor granularidad de los datos',
          'Usa menos memoria',
          'Elimina la necesidad de tener una tabla de fechas calendario'
        ],
        respuestaCorrecta: 0,
        explicacion: {
          correcta: 'Un esquema en estrella tiene todas las dimensiones directamente relacionadas a la(s) tabla(s) de hechos, evitando cadenas largas de relaciones. Esto típicamente simplifica las relaciones (menos uniones a resolver) y beneficia el rendimiento en Power BI. El esquema en copo de nieve normaliza las dimensiones en subdimensiones (más tablas unidas en cascada).',
          incorrectas: [
            'La granularidad depende del nivel de detalle de los datos, no de la forma del esquema',
            'No necesariamente; depende más de duplicación de datos',
            'Se sigue necesitando tabla de fechas para inteligencia de tiempo'
          ]
        },
        dominio: 'modelar-datos',
        subdominio: 'diseñar-implementar-modelo',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'No entender las ventajas de desnormalizar dimensiones en Power BI',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/guidance/star-schema']
      },
      {
        id: 'model_inter_003',
        pregunta: 'En DAX, ¿qué hace la función RELATEDTABLE()?',
        opciones: [
          'Devuelve valores de otra tabla cuando la relación es de Muchos a Uno (N:1)',
          'Devuelve una tabla filtrada con las filas relacionadas en la tabla de muchos (lado *), asociadas a la fila actual',
          'Devuelve una jerarquía de fechas',
          'Devuelve todos los valores ignorando filtros'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'RELATEDTABLE(Tablename) en DAX, usada en una expresión del lado "uno" de una relación, retorna la tabla de todas las filas relacionadas en la tabla del lado "muchos". Por ejemplo, en DimCustomer, RELATEDTABLE(FactSales) daría todas las ventas de ese cliente. Es útil junto con funciones como COUNTROWS.',
          incorrectas: [
            'Eso describe RELATED(), no RELATEDTABLE()',
            'Eso lo hace CALENDAR o funciones time-intelligence',
            'Eso sería ALL u otras funciones'
          ]
        },
        dominio: 'modelar-datos',
        subdominio: 'crear-calculos-dax',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'Confundir RELATED con RELATEDTABLE',
        referencias: ['https://learn.microsoft.com/en-us/dax/relatedtable-function-dax']
      },
      {
        id: 'model_inter_004',
        pregunta: 'Necesitas calcular las ventas acumuladas en lo que va del año (Year-to-Date). ¿Cuál fórmula DAX sería correcta?',
        opciones: [
          'TOTALYTD( SUM(Ventas[Monto]), DimFecha[Fecha] )',
          'CALCULATE( SUM(Ventas[Monto]), DATESYTD( DimFecha[Fecha] ) )',
          'AVERAGEX( DimFecha, Ventas[Monto] )',
          'Tanto A como B son correctas'
        ],
        respuestaCorrecta: 3,
        explicacion: {
          correcta: 'Tanto TOTALYTD como CALCULATE con DATESYTD son formas válidas de obtener el acumulado anual. TOTALYTD es una envoltura simplificada. CALCULATE con DATESYTD aplica un filtro de fecha desde el comienzo del año hasta la fecha máxima del contexto.',
          incorrectas: [
            'Es correcta, pero no la única opción',
            'Es correcta, pero no la única opción',
            'AVERAGEX no corresponde a un cálculo acumulado YTD'
          ]
        },
        dominio: 'modelar-datos',
        subdominio: 'crear-calculos-dax',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'No conocer las múltiples formas de hacer cálculos de time intelligence',
        referencias: ['https://learn.microsoft.com/en-us/dax/totalytd-function-dax']
      },
      {
        id: 'model_inter_005',
        pregunta: 'Quieres calcular el % que representan las ventas sobre el total ignorando filtros. ¿Qué expresión DAX usarías?',
        opciones: [
          'DIVIDE( SUM(Ventas[Monto]), CALCULATE( SUM(Ventas[Monto]), ALL(Ventas) ) )',
          'DIVIDE( SUM(Ventas[Monto]), CALCULATE( SUM(Ventas[Monto]), ALLSELECTED(Ventas) ) )',
          'SUM(Ventas[Monto]) / SUM(Ventas[Monto])',
          'AVERAGEX(Ventas, Ventas[Monto])'
        ],
        respuestaCorrecta: 0,
        explicacion: {
          correcta: 'Para calcular un porcentaje del total ignorando filtros, se usa CALCULATE con ALL(<tabla>) para obtener el denominador (total global). El numerador es la suma en el contexto actual, y el denominador es la suma sobre All(Ventas) (quitando filtros de Ventas).',
          incorrectas: [
            'ALLSELECTED mantendría filtros exteriores, no da total global sin filtros',
            'Siempre daría 1 (100%), trivialmente incorrecto',
            'No aplica para este cálculo de porcentaje'
          ]
        },
        dominio: 'modelar-datos',
        subdominio: 'crear-calculos-dax',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'No entender cómo ALL y ALLSELECTED modifican el contexto de filtro',
        referencias: ['https://learn.microsoft.com/en-us/dax/all-function-dax']
      },
      {
        id: 'model_inter_006',
        pregunta: '¿Qué tipo de cálculo conviene implementar como Medida DAX en vez de columna calculada?',
        opciones: [
          'La edad de una persona calculada a partir de su fecha de nacimiento',
          'La categoría de un producto según precio',
          'El monto total de ventas filtrado dinámicamente por criterios del reporte',
          'Un identificador único concatenando campos'
        ],
        respuestaCorrecta: 2,
        explicacion: {
          correcta: 'Las Medidas son ideales para cálculos que dependen del contexto de filtros en que se evalúan, ajustándose dinámicamente a selecciones del usuario. Un ejemplo clásico es "Suma de Ventas", cuyo resultado cambia según los filtros aplicados (fecha, región, etc.).',
          incorrectas: [
            'Puede ser columna si se calcula respecto a una fecha fija',
            'Generalmente se puede precomputar como columna, no necesita contexto de filtro actual',
            'Debe ser columna calculada; no varía con filtros'
          ]
        },
        dominio: 'modelar-datos',
        subdominio: 'crear-calculos-dax',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'Usar columnas calculadas cuando medidas son más apropiadas',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-tutorial-create-measures']
      }
    ],
    avanzado: [
      {
        id: 'model_avan_001',
        pregunta: 'Tienes la siguiente fórmula DAX que causa rendimiento lento: `Ventas Filtradas = SUMX(Ventas, IF(Ventas[Región] = "Norte", Ventas[Monto], 0))`. ¿Cuál optimización proporciona el mejor rendimiento?',
        opciones: [
          'Usar SUMX(FILTER(Ventas, Ventas[Región] = "Norte"), Ventas[Monto])',
          'Cambiar a CALCULATE(SUM(Ventas[Monto]), Ventas[Región] = "Norte")',
          'Usar VAR para almacenar el filtro: VAR Filtrado = FILTER(...)',
          'Crear una columna calculada para el filtro'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'CALCULATE con filtro directo es la más eficiente porque aprovecha las optimizaciones internas del motor DAX y evita la iteración fila por fila. El motor puede aplicar el filtro antes de la agregación.',
          incorrectas: [
            'SUMX con FILTER es mejor que IF en cada fila, pero aún requiere iteración.',
            'VAR puede ayudar con legibilidad pero no mejora significativamente el rendimiento aquí.',
            'Columna calculada aumentaría el tamaño del modelo y no es necesaria.'
          ]
        },
        dominio: 'modelar-datos',
        subdominio: 'optimizar-rendimiento',
        nivel: 'avanzado',
        formato: 'opcion-multiple',
        trampaComun: 'No usar CALCULATE para filtros simples, preferir iteración innecesaria',
        referencias: ['https://learn.microsoft.com/en-us/dax/best-practices/']
      }
    ]
  },
  'visualizar-analizar': {
    principiante: [
      {
        id: 'viz_prin_001',
        pregunta: '¿Qué tipo de visualización usarías para comparar un valor actual con un objetivo (target)?',
        opciones: [
          'KPI (Key Performance Indicator)',
          'Tabla',
          'Gráfico de árbol (Treemap)',
          'Q&A'
        ],
        respuestaCorrecta: 0,
        explicacion: {
          correcta: 'El visual KPI está diseñado para resaltar un valor principal en comparación con una meta (target) y su variación. Por ejemplo, "Ventas actuales = $X, objetivo = $Y" y una indicación si se está por encima o debajo de la meta. Incluye generalmente un indicador de tendencia o semáforo.',
          incorrectas: [
            'Listaría datos, pero no destaca fácilmente vs objetivo',
            'Muestra proporciones de partes de un todo, no es específico para vs objetivo',
            'Es una herramienta de preguntas, no un visual comparativo directo'
          ]
        },
        dominio: 'visualizar-analizar',
        subdominio: 'crear-reportes',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'No conocer los visuales específicos para métricas vs objetivos',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualization-kpi']
      },
      {
        id: 'viz_prin_002',
        pregunta: '¿Qué visualización es más apropiada para mostrar datos geográficos (ventas por país)?',
        opciones: [
          'Mapa (Map) o Mapa relleno (Filled Map)',
          'Gráfico de columnas apiladas',
          'Gráfico de dispersión',
          'KPI'
        ],
        respuestaCorrecta: 0,
        explicacion: {
          correcta: 'Power BI provee visualizaciones de Mapas que, al colocar campos geográficos (país, provincia, coordenadas), pueden representar los datos en un mapa integrado. El Mapa estándar muestra burbujas en las ubicaciones, y el Mapa relleno sombrea las áreas geográficas según valores.',
          incorrectas: [
            'No es geográfico',
            'No pone datos en un mapa a menos que uses coordenadas manualmente',
            'No relacionado con ubicación geográfica'
          ]
        },
        dominio: 'visualizar-analizar',
        subdominio: 'crear-reportes',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'No usar visuales geoespaciales para datos de ubicación',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-map-tips-and-tricks']
      },
      {
        id: 'viz_prin_003',
        pregunta: '¿Qué visualización utilizarías para mostrar la participación porcentual de cada categoría en un total?',
        opciones: [
          'Gráfico circular o de anillos (Pie / Donut Chart)',
          'Gráfico de líneas',
          'Tarjeta (Card)',
          'Histograma'
        ],
        respuestaCorrecta: 0,
        explicacion: {
          correcta: 'Un gráfico circular/de anillo representa cada categoría como una porción de un círculo, cuya área es proporcional a su valor respecto al total. Es ideal para visualizar composición porcentual de un total entre categorías.',
          incorrectas: [
            'Adecuado para tendencias, no para partes de un todo',
            'Muestra un solo valor, no distribuciones',
            'Distribución de frecuencias de un campo numérico, no porcentajes de categorías'
          ]
        },
        dominio: 'visualizar-analizar',
        subdominio: 'crear-reportes',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'Usar visuales inadecuados para mostrar composición',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualization-types-for-reports-and-q-and-a']
      }
    ],
    intermedio: [
      {
        id: 'viz_inter_001',
        pregunta: 'Quieres que un gerente pueda navegar desde un resumen a una página de detalle de un proyecto manteniendo filtros. ¿Qué funcionalidad usarías?',
        opciones: [
          'Marcador (Bookmark)',
          'Drill-through (Ir a detalle)',
          'Tooltip personalizado',
          'Gráfico de columnas apiladas'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'La característica Drill-through de Power BI permite configurar una página de destino que recibe un filtro desde una página de origen. El usuario puede clic derecho en un visual (ej. barra de un proyecto) y elegir Ir a la página de detalle, y esa página se filtrará automáticamente a ese proyecto.',
          incorrectas: [
            'Guarda estado de la página, pero no transfiere automáticamente el contexto de un elemento seleccionado',
            'Muestra un pop-up con detalle al pasar el cursor, pero no navega de página',
            'No aplica a navegación'
          ]
        },
        dominio: 'visualizar-analizar',
        subdominio: 'mejorar-usabilidad',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'Confundir drill-through con bookmarks o tooltips',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-drillthrough']
      },
      {
        id: 'viz_inter_002',
        pregunta: '¿Qué funcionalidad permite mostrar un mini informe emergente con información adicional al pasar el ratón sobre un punto de datos?',
        opciones: [
          'Bookmarks',
          'Drill-down',
          'Tooltip personalizado (Report page tooltip)',
          'Q&A'
        ],
        respuestaCorrecta: 2,
        explicacion: {
          correcta: 'Los tooltips personalizados en Power BI permiten crear una página oculta diseñada con visualizaciones adicionales y luego asignarla como tooltip a un visual. Así, al pasar el cursor sobre un punto, aparece un "mini-reporte" emergente con información detallada.',
          incorrectas: [
            'No, estos son para navegaciones o estados guardados',
            'Es diferente: permite profundizar dentro del mismo visual en jerarquías',
            'No, es para preguntar con lenguaje natural'
          ]
        },
        dominio: 'visualizar-analizar',
        subdominio: 'mejorar-usabilidad',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'No aprovechar tooltips personalizados para contexto adicional',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-tooltips']
      },
      {
        id: 'viz_inter_003',
        pregunta: 'Tienes un gráfico de barras y una tabla. Al hacer clic en una barra, se resaltan datos en la tabla. ¿Cómo hacer que la tabla NO se filtre?',
        opciones: [
          'Deshabilitando los filtros cruzados en el panel de campos',
          'Creando una medida que ignore la selección',
          'Usando "Editar interacciones" y desactivando la interacción del gráfico hacia la tabla',
          'No es posible; las interacciones siempre afectan a todos los visuales'
        ],
        respuestaCorrecta: 2,
        explicacion: {
          correcta: 'Power BI permite configurar las interacciones visuales. En Formato > Editar interacciones, seleccionar el gráfico de barras y luego en el visual de la tabla elegir el ícono de ninguna interacción (círculo tachado) hará que la tabla no se filtre ni resalte cuando se selecciona algo en el gráfico.',
          incorrectas: [
            'Los filtros cruzados se controlan a nivel de visualizaciones, no en panel de campos',
            'No resuelve visualmente; es más sencillo usar editar interacciones',
            'Incorrecto, sí es posible configurar interacciones'
          ]
        },
        dominio: 'visualizar-analizar',
        subdominio: 'mejorar-usabilidad',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'No conocer la función Editar interacciones',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/create-reports/service-reports-visual-interactions']
      },
      {
        id: 'viz_inter_004',
        pregunta: '¿Qué visual permite hacer preguntas en lenguaje natural y obtener respuestas visuales automáticamente?',
        opciones: [
          'Visual Q&A (Preguntas y Respuestas)',
          'Visual de Narrativa inteligente',
          'Botón de Libro de Power BI',
          'Power BI Embedded'
        ],
        respuestaCorrecta: 0,
        explicacion: {
          correcta: 'El visual Q&A permite a los usuarios escribir preguntas en lenguaje natural (por ejemplo, "¿Ventas totales por región el mes pasado?") y Power BI devuelve una visualización con la respuesta. Es ideal para auto-servicio.',
          incorrectas: [
            'Este genera resúmenes de texto, no responde preguntas del usuario',
            'No existe tal función',
            'No es una característica de visual dentro del reporte'
          ]
        },
        dominio: 'visualizar-analizar',
        subdominio: 'identificar-patrones',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'No aprovechar Q&A para exploración conversacional',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/create-reports/power-bi-tutorial-q-and-a']
      },
      {
        id: 'viz_inter_005',
        pregunta: 'Tienes cinco Marcadores configurados. Necesitas agregar navegación fácil entre tres marcadores específicos. ¿Qué añadir?',
        opciones: [
          'Tres botones normales asignados cada uno a un marcador',
          'Un elemento de Navigator de marcadores (Bookmark Navigator)',
          'Un slicer con los nombres de los marcadores',
          'Un tooltip con enlaces a marcadores'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'Power BI dispone de un navegador de marcadores (Bookmark Navigator) que, al insertarlo, genera automáticamente botones para cada marcador seleccionado y permite al usuario alternar entre ellos fácilmente. Puedes configurarlo para mostrar solo ciertos marcadores.',
          incorrectas: [
            'Funciona pero es menos eficiente que la opción dedicada',
            'No existe slicer de marcadores',
            'No es lo usual ni cómodo'
          ]
        },
        dominio: 'visualizar-analizar',
        subdominio: 'mejorar-usabilidad',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'No usar el navegador de marcadores dedicado',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-bookmarks']
      }
    ],
    avanzado: [
      {
        id: 'viz_avanz_001',
        pregunta: '¿Para qué sirve el visual de Influyentes clave (Key Influencers)?',
        opciones: [
          'Para descomponer jerárquicamente una métrica',
          'Para identificar qué factores influyen más en un resultado determinado',
          'Para predecir valores futuros de una serie temporal',
          'Para mostrar la correlación entre dos medidas'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'El visual Key Influencers utiliza algoritmos de análisis para evaluar qué características tienen mayor impacto en la variable Y. Muestra qué factores (categorías, rangos) empujan un resultado hacia arriba o hacia abajo. Es una herramienta de AI que ayuda a entender la influencia de distintas columnas en una métrica.',
          incorrectas: [
            'Esto describe más al árbol de descomposición',
            'Eso sería pronóstico, no Key Influencers',
            'Eso sería un scatterplot'
          ]
        },
        dominio: 'visualizar-analizar',
        subdominio: 'identificar-patrones',
        nivel: 'avanzado',
        formato: 'opcion-multiple',
        trampaComun: 'Confundir Key Influencers con Decomposition Tree',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualization-influencers']
      },
      {
        id: 'viz_avanz_002',
        pregunta: '¿Qué visual usarías para desglosar iterativamente una medida por distintas dimensiones de forma jerárquica?',
        opciones: [
          'Gráfico de cascada (Waterfall)',
          'Árbol de descomposición (Decomposition Tree)',
          'Matriz con drill-down',
          'Key Influencers'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'El Árbol de descomposición es un visual de AI que permite al usuario seleccionar dinámicamente campos para desglosar un valor. Puedes empezar con ventas totales y luego descomponer por región, luego por producto, etc., viendo cómo se distribuye el valor paso a paso. Tiene opciones de "High/Low value" automáticas.',
          incorrectas: [
            'Muestra cómo contribuyen componentes a un total, pero no permite elegir categorías dinámicamente',
            'Permite drill-down en jerarquías predefinidas, pero no es tan interactiva ni basada en AI',
            'Este lista factores importantes pero no permite expandir ramas específicas manualmente'
          ]
        },
        dominio: 'visualizar-analizar',
        subdominio: 'identificar-patrones',
        nivel: 'avanzado',
        formato: 'opcion-multiple',
        trampaComun: 'No conocer la diferencia entre visuales de AI',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualization-decomposition-tree']
      },
      {
        id: 'viz_avanz_003',
        pregunta: '¿Qué característica de Power BI te permite detectar automáticamente anomalías o valores atípicos en una serie temporal?',
        opciones: [
          'Formato condicional',
          'La detección de anomalías (Anomaly Detection) integrada en los gráficos de líneas',
          'Un visual de dispersión con cuadrantes',
          'Key Influencers'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'Power BI introdujo la detección de anomalías en visuales de línea. Al activarla, el visual señalará puntos que se desvían del patrón esperado (con un intervalo de confianza) y puede proveer explicaciones posibles basadas en otras series del modelo. Esto facilita identificar puntos inusuales sin inspección manual.',
          incorrectas: [
            'No detecta outliers automáticamente',
            'No marca outliers por sí solo; es visual manual',
            'Eso encuentra factores influyentes, no outliers en una serie'
          ]
        },
        dominio: 'visualizar-analizar',
        subdominio: 'identificar-patrones',
        nivel: 'avanzado',
        formato: 'opcion-multiple',
        trampaComun: 'No conocer las capacidades de AI para detección de anomalías',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualization-anomaly-detection']
      },
      {
        id: 'viz_avanz_004',
        pregunta: '¿Qué es la visualización de Narrativa Inteligente (Smart Narrative) y para qué se utiliza?',
        opciones: [
          'Es un visual que muestra narrativas predefinidas de negocio',
          'Es un visual de AI que genera automáticamente un resumen en texto de los puntos clave de un visual o de toda una página de informe',
          'Es la integración de PowerPoint con Power BI para crear storyboards',
          'Es un editor de notas manual para escribir conclusiones en el reporte'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'La Narrativa Inteligente es un objeto visual de texto que, al insertarlo, analiza las visualizaciones (o datos) de la página y produce automáticamente frases destacando insights: por ejemplo "Las ventas aumentaron un 10% respecto al año anterior, principalmente impulsadas por la región Norte". Proporciona un resumen textual de la información importante del reporte.',
          incorrectas: [
            'No son predefinidas; se generan basadas en datos',
            'No existe tal integración como visual',
            'Aunque puedes editarlo, su poder es autogenerar contenido'
          ]
        },
        dominio: 'visualizar-analizar',
        subdominio: 'identificar-patrones',
        nivel: 'avanzado',
        formato: 'opcion-multiple',
        trampaComun: 'No aprovechar las capacidades de generación automática de narrativas',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualization-smart-narrative']
      }
    ]
  },
  'administrar-asegurar': {
    principiante: [
      {
        id: 'admin_prin_001',
        pregunta: 'Un usuario necesita poder publicar reportes en un workspace pero NO debe poder eliminar contenido ni gestionar permisos. ¿Qué rol asignarle?',
        opciones: [
          'Admin',
          'Member (Miembro)',
          'Contributor (Colaborador)',
          'Viewer (Espectador)'
        ],
        respuestaCorrecta: 2,
        explicacion: {
          correcta: 'El rol Contributor puede crear y editar informes/dashboards/datasets en el workspace, pero no puede publicar Apps ni cambiar permisos mayores. Es ideal para usuarios que necesitan trabajar en contenido sin capacidad de gestión administrativa.',
          incorrectas: [
            'Admin tiene control total incluyendo permisos',
            'Member puede publicar Apps, que es más privilegio del requerido',
            'Viewer solo puede ver el contenido, no puede publicar'
          ]
        },
        dominio: 'administrar-asegurar',
        subdominio: 'crear-gestionar-workspaces',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'Confundir los roles de workspace y sus permisos',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-roles-new-workspaces']
      },
      {
        id: 'admin_prin_002',
        pregunta: '¿Para qué sirve la característica de Workspaces en Power BI Service?',
        opciones: [
          'Para almacenar y administrar datos en el servicio',
          'Para colaborar con otros usuarios en la creación y compartición de informes',
          'Es un área personal privada de cada usuario',
          'Para automatizar la importación de datos'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'Un Workspace en Power BI es un entorno colaborativo donde un equipo puede reunir dashboards, informes, datasets y trabajar conjuntamente. Allí se controlan accesos (miembros con roles), se desarrollan contenidos y luego se pueden publicar como Apps para consumidores finales.',
          incorrectas: [
            'Eso se refiere más a datasets o dataflows, no al concepto de workspace',
            'Eso era "Mi área de trabajo" individual; los Workspaces se usan para colaboración',
            'Eso son dataflows o gateways, el workspace es un contenedor organizativo'
          ]
        },
        dominio: 'administrar-asegurar',
        subdominio: 'crear-gestionar-workspaces',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'Confundir workspace con área personal',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-new-workspaces']
      },
      {
        id: 'admin_prin_003',
        pregunta: 'Un usuario solo necesita ver el contenido de un workspace sin editar. ¿Qué rol asignarle?',
        opciones: [
          'Admin',
          'Member',
          'Contributor',
          'Viewer (Espectador)'
        ],
        respuestaCorrecta: 3,
        explicacion: {
          correcta: 'El rol Viewer permite al usuario acceder al workspace en modo lectura: puede ver y interactuar con los informes y dashboards (incluyendo exportar datos si se habilita), pero no puede editar, eliminar ni crear contenido. Es ideal para consumidores de datos.',
          incorrectas: [
            'Admin tiene control total, excesivo para solo ver',
            'Member puede publicar apps, no es necesario para solo lectura',
            'Contributor ya podría editar, excede lo requerido'
          ]
        },
        dominio: 'administrar-asegurar',
        subdominio: 'crear-gestionar-workspaces',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'Dar más permisos de los necesarios',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-roles-new-workspaces']
      },
      {
        id: 'admin_prin_004',
        pregunta: 'Tienes un dataset con datos locales (SQL Server on-premises). Tras publicar, ¿qué necesitas para actualización programada?',
        opciones: [
          'Habilitar DirectQuery',
          'Subir los datos manualmente',
          'Instalar y configurar un Gateway de datos local',
          'Nada, Power BI Service accede directamente'
        ],
        respuestaCorrecta: 2,
        explicacion: {
          correcta: 'Para que Power BI Service pueda refrescar datos de fuentes on-premises, se requiere un On-premises Data Gateway. Este software, instalado en la red local, actúa como puente seguro: el servicio delega la consulta al gateway, y este la ejecuta en la fuente local.',
          incorrectas: [
            'DirectQuery también requeriría gateway para on-premises',
            'No escalable; hay solución automatizada',
            'Incorrecto, el servicio no puede conectarse a tu red local sin gateway'
          ]
        },
        dominio: 'administrar-asegurar',
        subdominio: 'asegurar-gobernar',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'No entender la necesidad del gateway para datos on-premises',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/connect-data/service-gateway-onprem']
      },
      {
        id: 'admin_prin_005',
        pregunta: '¿Qué permite la función "Publicar en la web" (Publish to Web)?',
        opciones: [
          'Compartir informes con usuarios externos mediante enlace web público',
          'Publicar informes dentro de la organización de forma segura',
          'Exportar el informe a HTML para envío por correo',
          'Crear una copia del informe en SharePoint'
        ],
        respuestaCorrecta: 0,
        explicacion: {
          correcta: 'Publicar en la Web genera una URL pública y un código embed (iframe) para un informe de Power BI, que puede ser accedido por cualquier persona en Internet sin autenticación. Es útil para compartir datos no sensibles en blogs o sitios web. No debe usarse con datos confidenciales.',
          incorrectas: [
            'Para org se usan Apps, compartir, embed interno; Publish to Web es público',
            'No exactamente; genera un enlace iframable',
            'No crea copia en SharePoint'
          ]
        },
        dominio: 'administrar-asegurar',
        subdominio: 'asegurar-gobernar',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'No entender que Publish to Web es público sin autenticación',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-publish-to-web']
      }
    ],
    intermedio: [
      {
        id: 'admin_inter_001',
        pregunta: '¿Qué roles de workspace permiten publicar/actualizar una aplicación (App)?',
        opciones: [
          'Solo Admin',
          'Admin y Member',
          'Admin, Member y Contributor',
          'Todos los roles'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'Admin y Member (Administrador y Miembro) son los roles que tienen permisos para publicar/despublicar y administrar las Apps del workspace. Contributor puede editar contenido pero no publicar Apps. Viewer solo puede ver.',
          incorrectas: [
            'Member también puede publicar apps',
            'Contributor no puede publicar apps',
            'Viewer y Contributor no pueden publicar apps'
          ]
        },
        dominio: 'administrar-asegurar',
        subdominio: 'crear-gestionar-workspaces',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'No conocer exactamente qué puede hacer cada rol',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-roles-new-workspaces']
      },
      {
        id: 'admin_inter_002',
        pregunta: 'Has implementado RLS en Desktop creando roles. Tras publicar, ¿dónde asignas usuarios a esos roles?',
        opciones: [
          'En Power BI Desktop, en "Administrar roles"',
          'En el servicio Power BI, dentro del dataset, usando la opción de Seguridad',
          'En Azure Active Directory',
          'En la pestaña Seguridad del informe'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'Una vez publicado el dataset con RLS, debes ir en el servicio Power BI a la configuración de Seguridad del dataset. Allí verás los roles que definiste y podrás agregar usuarios o grupos de AAD como miembros de cada rol. De ese modo, cuando esos usuarios vean el informe, Power BI sabrá qué filtro aplicar.',
          incorrectas: [
            'En Desktop defines los roles, pero la asignación de usuarios se hace en el servicio',
            'AAD puede almacenar los usuarios, pero la vinculación a roles se hace en el servicio',
            'La seguridad se configura a nivel de dataset, no de informe'
          ]
        },
        dominio: 'administrar-asegurar',
        subdominio: 'asegurar-gobernar',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'No saber dónde se gestionan los usuarios en RLS',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/enterprise/service-admin-rls']
      },
      {
        id: 'admin_inter_003',
        pregunta: '¿Cuál es la forma recomendada de distribuir informes a un grupo amplio de usuarios de solo lectura?',
        opciones: [
          'Dar permisos de Viewer a todos en el workspace',
          'Enviar el archivo .pbix por correo',
          'Publicar una Aplicación (App) del workspace',
          'Compartir individualmente cada informe'
        ],
        respuestaCorrecta: 2,
        explicacion: {
          correcta: 'La mejor práctica para llegar a muchos usuarios es empaquetar los dashboards/informes en una App de Power BI. Desde el workspace, un Miembro/Admin publica la App, eligiendo qué contenidos incluir. Los usuarios finales obtienen la App y pueden ver los informes en modo lectura. Facilita actualizaciones y control de permisos.',
          incorrectas: [
            'Posible pero no óptimo para muchos usuarios',
            'No escalable, pierdes control de actualizaciones',
            'Engorroso y difícil de mantener'
          ]
        },
        dominio: 'administrar-asegurar',
        subdominio: 'crear-gestionar-workspaces',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'No usar Apps para distribución masiva',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-create-distribute-apps']
      },
      {
        id: 'admin_inter_004',
        pregunta: '¿Qué permite la función "Publicar en la web" (Publish to Web)?',
        opciones: [
          'Compartir informes con usuarios externos mediante enlace web público',
          'Publicar informes dentro de la organización de forma segura',
          'Exportar el informe a HTML para envío por correo',
          'Crear una copia del informe en SharePoint'
        ],
        respuestaCorrecta: 0,
        explicacion: {
          correcta: 'Publicar en la Web genera una URL pública y un código embed (iframe) para un informe de Power BI, que puede ser accedido por cualquier persona en Internet sin autenticación. Es útil para compartir datos no sensibles en blogs o sitios web. No debe usarse con datos confidenciales.',
          incorrectas: [
            'Para org se usan Apps, compartir, embed interno; Publish to Web es público',
            'No exactamente; genera un enlace iframable',
            'No crea copia en SharePoint'
          ]
        },
        dominio: 'administrar-asegurar',
        subdominio: 'asegurar-gobernar',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'No entender que Publish to Web es público sin autenticación',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-publish-to-web']
      },
      {
        id: 'admin_inter_005',
        pregunta: 'Un gerente desea recibir cada lunes un resumen del informe de ventas actualizado por email. ¿Qué funcionalidad usar?',
        opciones: [
          'Exportar manualmente cada lunes',
          'Suscripciones por correo electrónico (Email Subscriptions)',
          'Power Automate con trigger manual',
          'Publicar en la web y enviar el enlace'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'Las Suscripciones por correo electrónico permiten que el usuario se suscriba a un informe o dashboard para que el servicio envíe automáticamente un correo con la vista actualizada (imagen y opcionalmente PDF) en un horario recurrente. De ese modo, cada lunes recibirá el snapshot actualizado.',
          incorrectas: [
            'No es automático ni escalable',
            'Más complejo que usar la función nativa de suscripciones',
            'Publish to Web es público; no envía emails automáticos'
          ]
        },
        dominio: 'administrar-asegurar',
        subdominio: 'asegurar-gobernar',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'No conocer la función de suscripciones por email',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/collaborate-share/end-user-subscribe']
      }
    ],
    avanzado: [
      {
        id: 'admin_avanz_001',
        pregunta: 'Quieres que tu dataset solo refresque datos nuevos de los últimos 3 meses en lugar de recargar todo. ¿Qué característica usar?',
        opciones: [
          'Query Folding',
          'Actualización incremental (Incremental Refresh)',
          'DirectQuery',
          'Particiones manuales'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'La Actualización incremental permite definir una política de refresco indicando mantener X años de datos y refrescar solo los últimos Y meses. En Power BI Desktop creas parámetros RangeStart y RangeEnd, filtras por fecha, y defines la política. Así, en cada actualización solo se cargan los datos recientes.',
          incorrectas: [
            'Query Folding optimiza consultas, no maneja refrescos parciales',
            'DirectQuery no importa datos, consulta en vivo',
            'Menos eficiente y escalable que incremental refresh automático'
          ]
        },
        dominio: 'administrar-asegurar',
        subdominio: 'asegurar-gobernar',
        nivel: 'avanzado',
        formato: 'opcion-multiple',
        trampaComun: 'No conocer incremental refresh para datasets grandes',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/connect-data/incremental-refresh-overview']
      },
      {
        id: 'admin_avanz_002',
        pregunta: 'Tienes una tabla de Excel llamada Sales y quieres que aparezca como un tile dinámico en un dashboard de Power BI. ¿Cómo puedes lograrlo de manera directa?',
        opciones: [
          'Importar el archivo Excel al servicio Power BI como dataset y luego crear manualmente una visualización de tabla',
          'Usar Publicar desde Excel (Publisher for Power BI) para anclar (pin) la tabla directamente al dashboard',
          'Copiar y pegar los datos en una tabla en Power BI Desktop',
          'Usar la visualización "Excel" en Power BI'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'Microsoft ofrece un complemento llamado Power BI Publisher for Excel que permite anclar rangos o elementos de Excel directamente a un dashboard en el servicio Power BI. Esto crea un tile que muestra la tabla Excel. Cada vez que actualices los datos en Excel y uses la opción de publicar/actualizar, el tile reflejará los cambios.',
          incorrectas: [
            'Esto funcionaría, pero hay una vía más sencilla con Publisher for Excel',
            'No se reflejará en un tile automáticamente en un dashboard',
            'No existe una visual nativa que incruste Excel con vínculo dinámico directo'
          ]
        },
        dominio: 'administrar-asegurar',
        subdominio: 'asegurar-gobernar',
        nivel: 'avanzado',
        formato: 'opcion-multiple',
        trampaComun: 'No conocer Publisher for Excel para integración directa',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-publish-from-excel']
      },
      {
        id: 'admin_avanz_003',
        pregunta: '¿Qué es Power BI Report Server y cuándo lo usarías?',
        opciones: [
          'Es la versión en la nube del servicio Power BI',
          'Es una plataforma on-premises (local) para hospedar informes de Power BI cuando los datos no pueden estar en la nube',
          'Es un servicio de Microsoft para compartir informes públicamente',
          'Es una herramienta de desarrollo para crear visuales personalizados'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'Power BI Report Server es una plataforma on-premises (local) para hospedar informes de Power BI. Es esencialmente la versión local del servicio Power BI, permitiendo a las organizaciones que no pueden o no desean usar la nube, publicar y distribuir internamente sus informes y dashboards. Se usa en escenarios donde se requiere que los datos y reportes residan dentro de la infraestructura de la empresa (por políticas de seguridad o cumplimiento).',
          incorrectas: [
            'La versión en la nube es el servicio Power BI estándar',
            'No es para compartir públicamente; es para uso interno on-premises',
            'No es una herramienta de desarrollo de visuales'
          ]
        },
        dominio: 'administrar-asegurar',
        subdominio: 'asegurar-gobernar',
        nivel: 'avanzado',
        formato: 'opcion-multiple',
        trampaComun: 'No conocer las opciones on-premises de Power BI',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/report-server/get-started']
      },
      {
        id: 'admin_avanz_004',
        pregunta: '¿Para qué se utilizan los informes paginados en Power BI (Paginated Reports) y en qué se diferencian de los informes interactivos estándar?',
        opciones: [
          'Son informes diseñados específicamente para dispositivos móviles',
          'Son informes optimizados para imprimir o exportar (PDF) con diseño de múltiples páginas, similares a los de SSRS',
          'Son informes que solo funcionan en capacidad Premium',
          'Son informes que usan DirectQuery exclusivamente'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'Los Paginated Reports (informes paginados) en Power BI están diseñados para formato de reporte tradicional tipo tabla o documento, que puede abarcar muchas páginas, optimizados para imprimir o exportar (por ejemplo a PDF) con un diseño predefinido. Usan el motor de SQL Server Reporting Services (SSRS) y son ideales para estados financieros, facturas, listados detallados, etc., donde se listan todos los registros con un formato fijo por página.',
          incorrectas: [
            'No son específicos para móviles; son para documentos paginados',
            'Pueden usarse en capacidad compartida con limitaciones; Premium da más funcionalidad',
            'No requieren DirectQuery; pueden usar cualquier modo de conectividad'
          ]
        },
        dominio: 'administrar-asegurar',
        subdominio: 'asegurar-gobernar',
        nivel: 'avanzado',
        formato: 'opcion-multiple',
        trampaComun: 'Confundir informes paginados con informes interactivos estándar',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/paginated-reports/paginated-reports-report-builder-power-bi']
      },
      {
        id: 'admin_avanz_005',
        pregunta: '¿Qué característica de Power BI permite automatizar la actualización de datos en momentos específicos del día sin intervención manual?',
        opciones: [
          'Power Automate',
          'Actualización programada (Scheduled Refresh)',
          'DirectQuery',
          'Live Connection'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'La Actualización programada (Scheduled Refresh) permite configurar horarios automáticos para que Power BI actualice los datos importados desde los orígenes. Puedes definir hasta 8 actualizaciones diarias en capacidad Pro y hasta 48 en Premium.',
          incorrectas: [
            'Power Automate puede desencadenar flujos, pero no es la característica principal de actualización de datasets',
            'DirectQuery no actualiza datos; consulta en tiempo real',
            'Live Connection se conecta en vivo, no programa actualizaciones'
          ]
        },
        dominio: 'administrar-asegurar',
        subdominio: 'asegurar-gobernar',
        nivel: 'avanzado',
        formato: 'opcion-multiple',
        trampaComun: 'Confundir modos de conectividad con actualización programada',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/connect-data/refresh-scheduled-refresh']
      },
      {
        id: 'prep_prin_010',
        pregunta: 'Al conectar Power BI a una base de datos SQL Server, ¿qué modo de conectividad permite consultar datos en tiempo real sin importarlos al modelo?',
        opciones: [
          'Import',
          'DirectQuery',
          'Dual',
          'Live Connection'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'DirectQuery permite que Power BI consulte directamente la base de datos cada vez que un usuario interactúa con un visual, sin importar los datos al modelo. Esto garantiza que siempre se muestren los datos más actuales pero puede ser más lento que Import.',
          incorrectas: [
            'Import carga los datos en memoria, no consulta en tiempo real',
            'Dual combina Import y DirectQuery, pero DirectQuery es la respuesta más específica',
            'Live Connection es para modelos externos como Analysis Services'
          ]
        },
        dominio: 'preparar-datos',
        subdominio: 'obtener-datos',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'No entender las diferencias entre modos de conectividad',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/connect-data/desktop-directquery-about']
      },
      {
        id: 'model_inter_009',
        pregunta: '¿Cuál es la función DAX correcta para contar el número de filas distintas en una columna?',
        opciones: [
          'COUNT',
          'DISTINCTCOUNT',
          'COUNTROWS',
          'COUNTDISTINCT'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'DISTINCTCOUNT es la función DAX que cuenta valores únicos (distintos) en una columna. Por ejemplo, DISTINCTCOUNT(Clientes[ClienteID]) devuelve el número de clientes únicos.',
          incorrectas: [
            'COUNT cuenta filas con valores no vacíos, pero no distintos',
            'COUNTROWS cuenta todas las filas de una tabla, no valores distintos',
            'COUNTDISTINCT no es una función DAX válida'
          ]
        },
        dominio: 'modelar-datos',
        subdominio: 'crear-calculos-dax',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'Confundir funciones de conteo en DAX',
        referencias: ['https://learn.microsoft.com/en-us/dax/distinctcount-function-dax']
      },
      {
        id: 'viz_inter_006',
        pregunta: 'Necesitas crear un visual que muestre la tendencia de ventas a lo largo del tiempo y permita hacer zoom en períodos específicos. ¿Qué tipo de visual es el más apropiado?',
        opciones: [
          'Gráfico de columnas',
          'Tabla',
          'Gráfico de líneas con eje de fecha',
          'Matriz'
        ],
        respuestaCorrecta: 2,
        explicacion: {
          correcta: 'Un gráfico de líneas con un eje de fecha es ideal para mostrar tendencias temporales. Power BI automáticamente habilita capacidades de drill-down cuando usas jerarquías de fecha (año > trimestre > mes > día), permitiendo zoom en períodos específicos.',
          incorrectas: [
            'Columnas pueden mostrar tendencias pero son menos efectivas para datos continuos temporales',
            'Las tablas muestran datos tabulares, no tendencias visuales',
            'Las matrices son para análisis multidimensional, no específicamente para tendencias temporales'
          ]
        },
        dominio: 'visualizar-analizar',
        subdominio: 'crear-reportes',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'No usar el visual más apropiado para análisis temporal',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-line-chart']
      },
      {
        id: 'prep_inter_013',
        pregunta: 'En Power Query, ¿qué operación usarías para combinar dos tablas basándote en una columna común, similar a un JOIN en SQL?',
        opciones: [
          'Append Queries',
          'Merge Queries',
          'Group By',
          'Pivot Column'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'Merge Queries en Power Query es equivalente a un JOIN en SQL. Te permite combinar dos tablas basándote en una o más columnas comunes, con opciones como Left Outer, Inner, Full Outer, etc.',
          incorrectas: [
            'Append Queries es como UNION en SQL, apila filas de múltiples tablas',
            'Group By agrupa y resume datos, no combina tablas',
            'Pivot Column transforma filas en columnas, no combina tablas'
          ]
        },
        dominio: 'preparar-datos',
        subdominio: 'transformar-cargar-datos',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'Confundir Merge con Append',
        referencias: ['https://learn.microsoft.com/en-us/power-query/merge-queries-overview']
      },
      {
        id: 'model_prin_007',
        pregunta: '¿Qué tipo de relación se recomienda crear entre una tabla de Ventas y una tabla de Calendario?',
        opciones: [
          'Muchos a muchos',
          'Uno a uno',
          'Muchos a uno (Ventas a Calendario)',
          'No crear relación'
        ],
        respuestaCorrecta: 2,
        explicacion: {
          correcta: 'La relación recomendada es Muchos a uno desde Ventas hacia Calendario. Múltiples ventas pueden ocurrir en la misma fecha (muchos), pero cada fecha existe solo una vez en la tabla Calendario (uno). Esta es la estructura estándar de modelo estrella.',
          incorrectas: [
            'Muchos a muchos es complejo y debe evitarse cuando sea posible',
            'Uno a uno no es apropiado ya que múltiples ventas ocurren en cada fecha',
            'Siempre se debe crear una relación con la tabla de calendario para time intelligence'
          ]
        },
        dominio: 'modelar-datos',
        subdominio: 'disenar-modelo',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'No entender las cardinalidades de relación apropiadas',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-create-and-manage-relationships']
      },
      {
        id: 'viz_avanz_005',
        pregunta: '¿Qué característica de Power BI permite a los usuarios finales hacer preguntas en lenguaje natural sobre sus datos?',
        opciones: [
          'DAX Studio',
          'Q&A (Preguntas y Respuestas)',
          'Power Query',
          'Analyze in Excel'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'Q&A (Preguntas y Respuestas) es la característica de Power BI que permite a los usuarios escribir preguntas en lenguaje natural (por ejemplo, "ventas totales por región") y Power BI genera automáticamente visualizaciones apropiadas basadas en el modelo de datos.',
          incorrectas: [
            'DAX Studio es una herramienta externa para escribir y optimizar consultas DAX',
            'Power Query es para transformación de datos, no preguntas en lenguaje natural',
            'Analyze in Excel permite analizar datos de Power BI en Excel, no lenguaje natural'
          ]
        },
        dominio: 'visualizar-analizar',
        subdominio: 'mejorar-usabilidad',
        nivel: 'avanzado',
        formato: 'opcion-multiple',
        trampaComun: 'No conocer las capacidades de análisis en lenguaje natural',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/natural-language/q-and-a-intro']
      },
      {
        id: 'admin_inter_006',
        pregunta: '¿Qué licencia de Power BI necesita un usuario para consumir (ver) un informe publicado en un workspace Premium?',
        opciones: [
          'Power BI Pro',
          'Power BI Premium por usuario',
          'Power BI Free (si el workspace está en capacidad Premium)',
          'No puede ver informes en Premium'
        ],
        respuestaCorrecta: 2,
        explicacion: {
          correcta: 'Una ventaja clave de Power BI Premium es que los usuarios con licencia Free pueden consumir (ver) contenido publicado en workspaces que están en capacidad Premium. Esto reduce costos de licenciamiento para organizaciones grandes con muchos consumidores de reportes.',
          incorrectas: [
            'Pro es necesario si el workspace NO está en Premium',
            'Premium por usuario es una opción, pero Free también funciona en capacidad Premium',
            'Usuarios Free SÍ pueden ver reportes en capacidad Premium'
          ]
        },
        dominio: 'administrar-asegurar',
        subdominio: 'asegurar-gobernar',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'No entender los beneficios de licenciamiento de Premium',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/enterprise/service-premium-what-is']
      },
      {
        id: 'model_avanz_002',
        pregunta: 'Necesitas crear una medida que calcule ventas del año anterior. ¿Qué función DAX de time intelligence usarías?',
        opciones: [
          'PREVIOUSYEAR',
          'SAMEPERIODLASTYEAR',
          'PARALLELPERIOD',
          'DATEADD'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'SAMEPERIODLASTYEAR es la función más directa para calcular el mismo período del año anterior. Por ejemplo, si estás en marzo 2024, devuelve marzo 2023. Se usa típicamente con CALCULATE: CALCULATE(SUM(Ventas[Monto]), SAMEPERIODLASTYEAR(Calendario[Fecha])).',
          incorrectas: [
            'PREVIOUSYEAR devuelve TODO el año anterior completo, no el mismo período',
            'PARALLELPERIOD es más flexible pero requiere más parámetros',
            'DATEADD puede lograr lo mismo pero es menos específico que SAMEPERIODLASTYEAR'
          ]
        },
        dominio: 'modelar-datos',
        subdominio: 'crear-calculos-dax',
        nivel: 'avanzado',
        formato: 'opcion-multiple',
        trampaComun: 'Confundir funciones de time intelligence similares',
        referencias: ['https://learn.microsoft.com/en-us/dax/sameperiodlastyear-function-dax']
      },
      {
        id: 'prep_avanz_003',
        pregunta: '¿Qué lenguaje utiliza Power Query internamente para las transformaciones de datos?',
        opciones: [
          'DAX',
          'SQL',
          'M (Power Query Formula Language)',
          'Python'
        ],
        respuestaCorrecta: 2,
        explicacion: {
          correcta: 'Power Query utiliza M (también conocido como Power Query Formula Language) para definir las transformaciones de datos. Cada paso que agregas en la interfaz de Power Query se traduce a código M. Aunque normalmente trabajas con la interfaz visual, puedes editar el código M directamente en el Editor Avanzado.',
          incorrectas: [
            'DAX se usa para cálculos en el modelo, no para transformaciones en Power Query',
            'SQL puede usarse en pasos de origen de base de datos, pero M es el lenguaje principal',
            'Python puede integrarse pero no es el lenguaje nativo de Power Query'
          ]
        },
        dominio: 'preparar-datos',
        subdominio: 'transformar-cargar-datos',
        nivel: 'avanzado',
        formato: 'opcion-multiple',
        trampaComun: 'Confundir M con DAX',
        referencias: ['https://learn.microsoft.com/en-us/powerquery-m/']
      },
      {
        id: 'viz_prin_004',
        pregunta: '¿Qué visual de Power BI usarías para mostrar un solo valor numérico importante, como "Ventas Totales: $1,000,000"?',
        opciones: [
          'Tabla',
          'Tarjeta (Card)',
          'Gráfico de barras',
          'Mapa'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'El visual Tarjeta (Card) está diseñado específicamente para mostrar un solo valor numérico o métrica clave de manera prominente. Es ideal para KPIs, totales generales o cualquier valor único que quieras destacar en un dashboard.',
          incorrectas: [
            'Las tablas muestran múltiples filas y columnas, no un valor único',
            'Los gráficos de barras comparan valores entre categorías',
            'Los mapas muestran datos geográficos'
          ]
        },
        dominio: 'visualizar-analizar',
        subdominio: 'crear-reportes',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'No usar el visual más simple para valores únicos',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualization-card']
      },
      {
        id: 'model_inter_010',
        pregunta: 'En un modelo de datos, ¿cuál es la diferencia principal entre una columna calculada y una medida?',
        opciones: [
          'No hay diferencia, son lo mismo',
          'Las columnas calculadas se calculan fila por fila y se almacenan; las medidas se calculan dinámicamente según el contexto',
          'Las medidas se calculan fila por fila; las columnas calculadas dinámicamente',
          'Las columnas calculadas solo funcionan en DirectQuery'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'Las columnas calculadas se evalúan fila por fila durante la actualización de datos y se almacenan en el modelo (ocupando memoria). Las medidas se calculan dinámicamente al interactuar con visuales, respondiendo al contexto de filtro actual. Las medidas son más eficientes para agregaciones.',
          incorrectas: [
            'Son conceptos completamente diferentes con usos distintos',
            'Es al revés: columnas calculadas son fila por fila, medidas dinámicas',
            'Ambas funcionan en todos los modos de conectividad'
          ]
        },
        dominio: 'modelar-datos',
        subdominio: 'crear-calculos-dax',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'Esta es la confusión #1 reportada en el examen PL-300',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-calculated-columns']
      },
      {
        id: 'admin_prin_005',
        pregunta: '¿Dónde publicas un informe de Power BI Desktop para compartirlo con otros usuarios en tu organización?',
        opciones: [
          'GitHub',
          'SharePoint',
          'Power BI Service (servicio en la nube)',
          'OneDrive'
        ],
        respuestaCorrecta: 2,
        explicacion: {
          correcta: 'Power BI Service (app.powerbi.com) es la plataforma en la nube donde publicas informes desde Power BI Desktop. Una vez publicados en un workspace, puedes compartirlos con colegas, configurar actualizaciones programadas, crear dashboards y gestionar permisos.',
          incorrectas: [
            'GitHub es para control de código, no para publicar informes de Power BI',
            'Aunque puedes guardar archivos .pbix en SharePoint, no es el método de publicación estándar',
            'OneDrive puede almacenar archivos pero no es la plataforma de publicación de Power BI'
          ]
        },
        dominio: 'administrar-asegurar',
        subdominio: 'crear-gestionar-workspaces',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'No entender el flujo de publicación básico',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-upload-desktop-files']
      },
      {
        id: 'prep_inter_014',
        pregunta: 'Tienes una columna de texto con valores como "Producto A - Categoría 1". Necesitas separar esto en dos columnas. ¿Qué función de Power Query usarías?',
        opciones: [
          'Merge Columns',
          'Split Column by Delimiter',
          'Group By',
          'Pivot Column'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'Split Column by Delimiter divide una columna de texto en múltiples columnas basándose en un delimitador específico (como " - ", coma, espacio, etc.). En este caso, usarías " - " como delimitador para separar "Producto A" y "Categoría 1".',
          incorrectas: [
            'Merge Columns combina columnas, no las separa',
            'Group By agrupa y resume datos',
            'Pivot Column transforma filas en columnas, no divide texto'
          ]
        },
        dominio: 'preparar-datos',
        subdominio: 'transformar-cargar-datos',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'No conocer las operaciones de transformación de texto en Power Query',
        referencias: ['https://learn.microsoft.com/en-us/power-query/split-columns-delimiter']
      },
      {
        id: 'viz_inter_007',
        pregunta: '¿Qué característica de Power BI permite a los usuarios explorar datos haciendo clic para ver niveles más detallados (ej. Año → Trimestre → Mes)?',
        opciones: [
          'Filtros',
          'Drill-down',
          'Bookmarks',
          'Slicers'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'Drill-down permite navegar por jerarquías de datos, yendo de niveles más altos a más detallados. Por ejemplo, hacer clic en un año para ver trimestres, luego meses, luego días. Se habilita automáticamente cuando usas jerarquías de fecha o puedes crear jerarquías personalizadas.',
          incorrectas: [
            'Los filtros limitan datos pero no navegan jerarquías',
            'Los bookmarks guardan estados de página, no navegan jerarquías',
            'Los slicers filtran datos visualmente pero no hacen drill-down automático'
          ]
        },
        dominio: 'visualizar-analizar',
        subdominio: 'mejorar-usabilidad',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'No entender las capacidades de navegación jerárquica',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/consumer/end-user-drill']
      },
      {
        id: 'prep_prin_011',
        pregunta: '¿Qué herramienta de Power BI Desktop te permite ver estadísticas básicas sobre una columna (valores únicos, mínimo, máximo, etc.) antes de cargar los datos?',
        opciones: [
          'DAX Studio',
          'Performance Analyzer',
          'Column Quality/Column Profile en Power Query',
          'Data View'
        ],
        respuestaCorrecta: 2,
        explicacion: {
          correcta: 'Column Quality, Column Distribution y Column Profile en Power Query Editor proporcionan estadísticas detalladas sobre los datos antes de cargarlos al modelo. Muestran valores únicos, nulos, errores, distribución de datos, etc., ayudándote a identificar problemas de calidad de datos tempranamente.',
          incorrectas: [
            'DAX Studio es una herramienta externa para análisis de consultas DAX',
            'Performance Analyzer analiza el rendimiento de visuales, no estadísticas de columnas',
            'Data View muestra datos ya cargados, no antes de cargar'
          ]
        },
        dominio: 'preparar-datos',
        subdominio: 'perfilar-limpiar-datos',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'No usar las herramientas de perfilado de datos disponibles',
        referencias: ['https://learn.microsoft.com/en-us/power-query/data-profiling-tools']
      },
      {
        id: 'model_prin_008',
        pregunta: 'En un modelo de Power BI, ¿qué tipo de tabla contiene solo columnas de texto utilizadas para filtrar y agrupar datos?',
        opciones: [
          'Tabla de hechos (Fact table)',
          'Tabla de dimensiones (Dimension table)',
          'Tabla de parámetros',
          'Tabla calculada'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'Las tablas de dimensiones contienen atributos descriptivos (texto, categorías) como Producto, Cliente, Fecha, Región, etc. Se usan para filtrar, agrupar y proporcionar contexto a las métricas numéricas que residen en las tablas de hechos. Este es un concepto fundamental del modelado dimensional (esquema estrella).',
          incorrectas: [
            'Las tablas de hechos contienen medidas numéricas y claves foráneas',
            'Las tablas de parámetros son para escenarios What-If, no almacenamiento de dimensiones',
            'Las tablas calculadas pueden ser de cualquier tipo, no específicamente dimensionales'
          ]
        },
        dominio: 'modelar-datos',
        subdominio: 'disenar-modelo',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'Confundir tablas de hechos y dimensiones',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/guidance/star-schema']
      },
      {
        id: 'viz_prin_005',
        pregunta: '¿Qué elemento de Power BI permite a los usuarios filtrar múltiples visuales en una página de informe simultáneamente?',
        opciones: [
          'Bookmark',
          'Slicer (Segmentación de datos)',
          'Tooltip',
          'Button'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'Un Slicer (Segmentación de datos) es un visual interactivo de filtrado que afecta a otros visuales en la misma página (o en todas las páginas si se configura). Los usuarios pueden hacer clic en valores del slicer para filtrar todos los visuales relacionados simultáneamente.',
          incorrectas: [
            'Los bookmarks guardan el estado de una página, no filtran',
            'Los tooltips muestran información adicional al pasar el mouse',
            'Los buttons ejecutan acciones pero no son filtros por sí mismos'
          ]
        },
        dominio: 'visualizar-analizar',
        subdominio: 'crear-reportes',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'No usar slicers para mejorar la interactividad',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualization-slicers']
      },
      {
        id: 'admin_prin_006',
        pregunta: '¿Cuál es el tamaño máximo de archivo .pbix que puedes publicar en el servicio Power BI con una licencia Pro?',
        opciones: [
          '500 MB',
          '1 GB',
          '2 GB',
          'Sin límite'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'El tamaño máximo de archivo .pbix que puede publicarse en Power BI Service con una licencia Pro es 1 GB. Sin embargo, se recomienda optimizar los modelos para mantenerlos más pequeños para mejor rendimiento. En capacidad Premium, el límite puede ser mayor dependiendo de la configuración.',
          incorrectas: [
            '500 MB es menor que el límite real',
            '2 GB excede el límite estándar de Pro',
            'Hay límites definidos para el tamaño de archivos'
          ]
        },
        dominio: 'administrar-asegurar',
        subdominio: 'crear-gestionar-workspaces',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'No conocer los límites de capacidad de Power BI',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/admin/service-admin-licensing-organization']
      },
      {
        id: 'prep_inter_015',
        pregunta: 'Tienes una tabla con una columna de fechas en formato de texto "DD/MM/YYYY". ¿Qué debes hacer en Power Query para usar funciones de time intelligence?',
        opciones: [
          'Nada, Power BI detecta automáticamente fechas en texto',
          'Cambiar el tipo de datos de la columna a Date',
          'Crear una medida DAX para convertir',
          'Usar DirectQuery'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'Debes cambiar el tipo de datos de la columna de Text a Date en Power Query. Las funciones de time intelligence de DAX requieren que las columnas de fecha tengan el tipo de datos Date. Power Query puede detectar automáticamente el formato, o puedes especificarlo manualmente usando "Change Type" > "Date".',
          incorrectas: [
            'Power BI puede sugerir el tipo, pero necesitas confirmarlo/aplicarlo',
            'Las conversiones de tipo deben hacerse en Power Query, no en DAX',
            'DirectQuery no resuelve problemas de tipo de datos'
          ]
        },
        dominio: 'preparar-datos',
        subdominio: 'transformar-cargar-datos',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'No convertir tipos de datos correctamente para funciones de tiempo',
        referencias: ['https://learn.microsoft.com/en-us/power-query/data-types']
      },
      {
        id: 'model_inter_011',
        pregunta: '¿Qué función DAX usarías para calcular el total acumulado (running total) de ventas a lo largo del tiempo?',
        opciones: [
          'SUM',
          'CALCULATE con FILTER',
          'CALCULATE con DATESYTD',
          'TOTALYTD'
        ],
        respuestaCorrecta: 2,
        explicacion: {
          correcta: 'CALCULATE con DATESYTD (Dates Year-To-Date) es la forma estándar de calcular totales acumulados en el año. Por ejemplo: CALCULATE(SUM(Ventas[Monto]), DATESYTD(Calendario[Fecha])). TOTALYTD es una alternativa que combina CALCULATE y DATESYTD en una función.',
          incorrectas: [
            'SUM solo suma valores, no calcula acumulados',
            'FILTER solo filtra datos, necesitas funciones de time intelligence',
            'TOTALYTD también funciona, pero CALCULATE con DATESYTD es más explícito y educativo'
          ]
        },
        dominio: 'modelar-datos',
        subdominio: 'crear-calculos-dax',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'No conocer funciones de time intelligence para cálculos acumulados',
        referencias: ['https://learn.microsoft.com/en-us/dax/datesytd-function-dax']
      },
      {
        id: 'viz_inter_008',
        pregunta: '¿Qué característica de Power BI permite crear múltiples vistas guardadas de un mismo informe con diferentes estados de filtros y visuales?',
        opciones: [
          'Slicers',
          'Bookmarks (Marcadores)',
          'Drill-through',
          'Tooltips'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'Los Bookmarks (Marcadores) permiten capturar el estado actual de una página de informe, incluyendo filtros, slicers, visibilidad de objetos y selecciones. Puedes crear múltiples bookmarks y navegar entre ellos, permitiendo storytelling y presentaciones guiadas dentro del mismo informe.',
          incorrectas: [
            'Slicers son filtros interactivos, no guardan estados',
            'Drill-through navega a páginas de detalle, no guarda estados',
            'Tooltips muestran información adicional, no guardan vistas'
          ]
        },
        dominio: 'visualizar-analizar',
        subdominio: 'mejorar-usabilidad',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'No usar bookmarks para mejorar la experiencia de usuario',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-bookmarks']
      },
      {
        id: 'admin_inter_007',
        pregunta: 'Quieres que ciertos usuarios vean solo los datos de su región en un informe. ¿Qué característica de seguridad de Power BI usarías?',
        opciones: [
          'Filtros a nivel de página',
          'Row-Level Security (RLS)',
          'Column-Level Security',
          'Object-Level Security'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'Row-Level Security (RLS) permite definir roles que filtran datos a nivel de fila basándose en reglas DAX. Por ejemplo, puedes crear un rol que filtre la tabla Ventas para que cada usuario solo vea datos donde Region = USERNAME(). RLS se aplica tanto en Power BI Desktop como en el servicio.',
          incorrectas: [
            'Los filtros de página no son dinámicos por usuario',
            'Column-Level Security oculta columnas completas, no filtra filas',
            'Object-Level Security (OLS) oculta tablas/columnas, no filtra filas por usuario'
          ]
        },
        dominio: 'administrar-asegurar',
        subdominio: 'asegurar-gobernar',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'No implementar RLS para seguridad de datos por usuario',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/enterprise/service-admin-rls']
      },
      {
        id: 'prep_avanz_004',
        pregunta: 'Tienes dos consultas en Power Query que quieres combinar verticalmente (apilar una debajo de la otra). ¿Qué operación usarías?',
        opciones: [
          'Merge Queries',
          'Append Queries',
          'Join',
          'Combine Files'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'Append Queries combina múltiples tablas verticalmente, apilando las filas de una debajo de la otra (equivalente a UNION en SQL). Es útil cuando tienes datos de la misma estructura en múltiples fuentes y quieres consolidarlos en una sola tabla.',
          incorrectas: [
            'Merge combina tablas horizontalmente basándose en columnas comunes (JOIN)',
            'Join es el término SQL; en Power Query se llama Merge',
            'Combine Files es para múltiples archivos con estructura similar, pero Append es más general'
          ]
        },
        dominio: 'preparar-datos',
        subdominio: 'transformar-cargar-datos',
        nivel: 'avanzado',
        formato: 'opcion-multiple',
        trampaComun: 'Confundir Append (vertical) con Merge (horizontal)',
        referencias: ['https://learn.microsoft.com/en-us/power-query/append-queries']
      },
      {
        id: 'model_avanz_003',
        pregunta: '¿Cuál es la diferencia entre las funciones ALL y ALLSELECTED en DAX?',
        opciones: [
          'Son exactamente iguales',
          'ALL elimina todos los filtros; ALLSELECTED elimina filtros pero respeta los filtros de nivel de informe/página',
          'ALLSELECTED es más rápida que ALL',
          'ALL solo funciona con tablas, ALLSELECTED solo con columnas'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'ALL elimina completamente todos los filtros de una tabla o columna. ALLSELECTED elimina filtros dentro del contexto de visual, pero respeta los filtros externos (slicers, filtros de página/informe). ALLSELECTED es útil para calcular porcentajes del total visible, mientras ALL calcula del gran total absoluto.',
          incorrectas: [
            'Son funciones diferentes con comportamientos distintos',
            'El rendimiento no es la diferencia principal',
            'Ambas pueden funcionar con tablas o columnas'
          ]
        },
        dominio: 'modelar-datos',
        subdominio: 'crear-calculos-dax',
        nivel: 'avanzado',
        formato: 'opcion-multiple',
        trampaComun: 'No entender las diferencias sutiles entre funciones de manipulación de contexto',
        referencias: ['https://learn.microsoft.com/en-us/dax/allselected-function-dax']
      },
      {
        id: 'viz_avanz_006',
        pregunta: '¿Qué herramienta de Power BI Desktop te permite analizar el tiempo de renderización de cada visual para identificar problemas de rendimiento?',
        opciones: [
          'DAX Studio',
          'Performance Analyzer',
          'Query Diagnostics',
          'Data Profiling'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'Performance Analyzer (en la pestaña View > Performance Analyzer) registra y muestra el tiempo que toma cada visual en renderizarse, incluyendo consultas DAX y tiempo de visualización. Te ayuda a identificar visuales lentos y optimizar el rendimiento del informe.',
          incorrectas: [
            'DAX Studio analiza consultas DAX pero es una herramienta externa',
            'Query Diagnostics analiza pasos de Power Query, no visuales',
            'Data Profiling es para analizar calidad de datos, no rendimiento'
          ]
        },
        dominio: 'visualizar-analizar',
        subdominio: 'identificar-patrones',
        nivel: 'avanzado',
        formato: 'opcion-multiple',
        trampaComun: 'No usar Performance Analyzer para optimización',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-performance-analyzer']
      },
      {
        id: 'admin_avanz_006',
        pregunta: '¿Qué es un Gateway de datos local (On-premises Data Gateway) en Power BI y cuándo lo necesitas?',
        opciones: [
          'Un servidor para almacenar archivos .pbix',
          'Un puente que permite a Power BI Service acceder a datos on-premises detrás de un firewall',
          'Una herramienta para crear informes localmente',
          'Un tipo de licencia Premium'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'Un On-premises Data Gateway actúa como puente entre Power BI Service (en la nube) y fuentes de datos on-premises (como SQL Server local, archivos de red, etc.). El gateway se instala en tu red local y permite que las actualizaciones programadas y consultas DirectQuery/Live Connection funcionen con datos que no están en la nube.',
          incorrectas: [
            'No almacena archivos, solo facilita la conexión a datos',
            'Power BI Desktop es la herramienta local para crear informes',
            'No es una licencia, es un componente de infraestructura'
          ]
        },
        dominio: 'administrar-asegurar',
        subdominio: 'asegurar-gobernar',
        nivel: 'avanzado',
        formato: 'opcion-multiple',
        trampaComun: 'No entender cuándo se necesita un gateway',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/connect-data/service-gateway-onprem']
      },
      {
        id: 'prep_prin_012',
        pregunta: 'Al importar datos desde una carpeta con múltiples archivos Excel del mismo formato, ¿qué característica de Power Query facilita combinarlos automáticamente?',
        opciones: [
          'Merge Queries',
          'Append Queries',
          'Combine Files (desde carpeta)',
          'Group By'
        ],
        respuestaCorrecta: 2,
        explicacion: {
          correcta: 'La función "Combine Files" de Power Query (al conectar a una carpeta) detecta automáticamente archivos del mismo formato y los combina en una sola tabla, aplicando las transformaciones definidas en el archivo de ejemplo a todos los archivos. Es ideal para consolidar datos mensuales, archivos de sucursales, etc.',
          incorrectas: [
            'Merge es para combinar tablas horizontalmente con columnas comunes',
            'Append combina tablas pero requiere selección manual de cada una',
            'Group By agrupa y resume datos, no combina archivos'
          ]
        },
        dominio: 'preparar-datos',
        subdominio: 'obtener-datos',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'No usar Combine Files para múltiples archivos similares',
        referencias: ['https://learn.microsoft.com/en-us/power-query/combine-files-overview']
      },
      {
        id: 'model_prin_009',
        pregunta: '¿Qué función DAX básica usarías para calcular el promedio de una columna numérica?',
        opciones: [
          'AVG',
          'AVERAGE',
          'MEAN',
          'AVERAGEX'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'AVERAGE es la función DAX básica para calcular el promedio de valores en una columna. Por ejemplo: Promedio Ventas = AVERAGE(Ventas[Monto]). Ignora valores en blanco automáticamente. AVERAGEX es la versión iteradora para cálculos más complejos fila por fila.',
          incorrectas: [
            'AVG no es una función DAX válida (es SQL)',
            'MEAN no es una función DAX válida',
            'AVERAGEX es para iteración compleja, no para promedios simples'
          ]
        },
        dominio: 'modelar-datos',
        subdominio: 'crear-calculos-dax',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'Confundir sintaxis de DAX con SQL',
        referencias: ['https://learn.microsoft.com/en-us/dax/average-function-dax']
      },
      {
        id: 'viz_prin_006',
        pregunta: '¿Qué tipo de visual usarías para comparar valores entre categorías con barras horizontales?',
        opciones: [
          'Gráfico de columnas',
          'Gráfico de barras',
          'Gráfico de líneas',
          'Gráfico de áreas'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'Un gráfico de barras muestra barras horizontales, ideal para comparar valores entre categorías. Es especialmente útil cuando los nombres de categorías son largos, ya que hay más espacio horizontal para mostrar las etiquetas. Los gráficos de columnas usan barras verticales.',
          incorrectas: [
            'Los gráficos de columnas tienen barras verticales, no horizontales',
            'Los gráficos de líneas muestran tendencias, no comparaciones categóricas',
            'Los gráficos de áreas muestran volumen a lo largo del tiempo'
          ]
        },
        dominio: 'visualizar-analizar',
        subdominio: 'crear-reportes',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'Confundir barras (horizontal) con columnas (vertical)',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualization-types-for-reports-and-q-and-a']
      },
      {
        id: 'admin_prin_007',
        pregunta: 'En Power BI Service, ¿qué rol de workspace permite a un usuario ver contenido pero no editarlo ni compartirlo?',
        opciones: [
          'Admin',
          'Member',
          'Contributor',
          'Viewer'
        ],
        respuestaCorrecta: 3,
        explicacion: {
          correcta: 'El rol Viewer permite a los usuarios ver contenido e interactuar con informes, pero no pueden editarlos, publicar nuevos contenidos, ni administrar permisos. Es ideal para consumidores finales de reportes. Admin, Member y Contributor tienen permisos progresivamente mayores.',
          incorrectas: [
            'Admin tiene control total del workspace',
            'Member puede editar y publicar contenido',
            'Contributor puede editar y crear contenido pero no gestionar permisos'
          ]
        },
        dominio: 'administrar-asegurar',
        subdominio: 'crear-gestionar-workspaces',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'No conocer los roles de workspace y sus permisos',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-roles-new-workspaces']
      },
      {
        id: 'prep_inter_016',
        pregunta: 'Tienes una columna con valores como "   texto   " (con espacios al inicio y final). ¿Qué transformación de Power Query usarías para limpiar estos espacios?',
        opciones: [
          'Replace Values',
          'Trim',
          'Split Column',
          'Remove Duplicates'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'Trim (o "Clean" en algunas versiones) elimina los espacios en blanco al inicio y final de los valores de texto. Es una operación común de limpieza de datos que asegura consistencia. Puedes encontrarla en Transform > Format > Trim.',
          incorrectas: [
            'Replace Values reemplaza caracteres específicos, pero Trim es más eficiente para espacios',
            'Split Column divide columnas basándose en delimitadores',
            'Remove Duplicates elimina filas duplicadas, no espacios en texto'
          ]
        },
        dominio: 'preparar-datos',
        subdominio: 'perfilar-limpiar-datos',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'No limpiar espacios en blanco que causan problemas de coincidencia',
        referencias: ['https://learn.microsoft.com/en-us/power-query/transform-trim']
      },
      {
        id: 'model_inter_012',
        pregunta: 'Necesitas crear una medida que cuente el número total de pedidos únicos. ¿Qué función DAX usarías?',
        opciones: [
          'COUNT(Pedidos[PedidoID])',
          'COUNTROWS(Pedidos)',
          'DISTINCTCOUNT(Pedidos[PedidoID])',
          'COUNTX(Pedidos, Pedidos[PedidoID])'
        ],
        respuestaCorrecta: 2,
        explicacion: {
          correcta: 'DISTINCTCOUNT cuenta valores únicos en una columna, ideal para contar pedidos únicos ya que puede haber duplicados en la tabla si hay múltiples líneas por pedido. Si cada fila representa un pedido único, COUNTROWS también funcionaría, pero DISTINCTCOUNT garantiza unicidad.',
          incorrectas: [
            'COUNT cuenta valores no vacíos pero no garantiza unicidad',
            'COUNTROWS cuenta todas las filas, puede contar duplicados si hay líneas de pedido',
            'COUNTX es para iteración, innecesariamente complejo aquí'
          ]
        },
        dominio: 'modelar-datos',
        subdominio: 'crear-calculos-dax',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'No usar DISTINCTCOUNT cuando se necesita contar valores únicos',
        referencias: ['https://learn.microsoft.com/en-us/dax/distinctcount-function-dax']
      },
      {
        id: 'viz_inter_009',
        pregunta: '¿Qué característica permite navegar desde un visual resumen a una página de detalles haciendo clic derecho en un valor?',
        opciones: [
          'Bookmark',
          'Drill-through',
          'Drill-down',
          'Filter'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'Drill-through permite navegar desde una página de resumen a una página de detalles filtrada por el valor seleccionado. Por ejemplo, hacer clic derecho en "México" en un visual de ventas por país puede llevarte a una página detallada que muestra todas las ventas de México.',
          incorrectas: [
            'Bookmarks guardan estados de página, no navegan con filtros contextuales',
            'Drill-down navega en jerarquías dentro del mismo visual',
            'Filters filtran datos pero no navegan entre páginas'
          ]
        },
        dominio: 'visualizar-analizar',
        subdominio: 'mejorar-usabilidad',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'Confundir drill-through con drill-down',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-drillthrough']
      },
      {
        id: 'admin_inter_008',
        pregunta: 'En el servicio Power BI, ¿qué es una "App" y para qué se utiliza?',
        opciones: [
          'Una aplicación móvil para ver reportes',
          'Un paquete de contenido distribuible que incluye dashboards e informes para usuarios finales',
          'Una extensión de Power BI Desktop',
          'Un tipo de visual personalizado'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'Una App en Power BI Service es un paquete curado de dashboards e informes que puedes distribuir a un grupo amplio de usuarios. Las Apps simplifican la distribución de contenido, proporcionan una experiencia de navegación organizada y permiten actualizaciones centralizadas sin requerir que los usuarios tengan acceso al workspace subyacente.',
          incorrectas: [
            'La aplicación móvil es Power BI Mobile, no "una App"',
            'Las extensiones de Desktop no se llaman Apps',
            'Los visuales personalizados son Power BI Visuals, no Apps'
          ]
        },
        dominio: 'administrar-asegurar',
        subdominio: 'crear-gestionar-workspaces',
        nivel: 'intermedio',
        formato: 'opcion-multiple',
        trampaComun: 'No entender el concepto de Apps para distribución de contenido',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/consumer/end-user-apps']
      },
      {
        id: 'prep_avanz_005',
        pregunta: '¿Qué es "Query Folding" en Power Query y por qué es importante?',
        opciones: [
          'Una técnica para combinar múltiples consultas',
          'El proceso donde Power Query delega transformaciones al origen de datos para mejor rendimiento',
          'Una forma de ocultar consultas en el Editor',
          'Un método para reducir el tamaño del archivo .pbix'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'Query Folding es cuando Power Query traduce las transformaciones aplicadas a código nativo del origen de datos (ej. SQL) y las ejecuta en el servidor de origen en lugar de traer todos los datos y transformarlos localmente. Esto mejora dramáticamente el rendimiento, especialmente con grandes volúmenes de datos. No todas las transformaciones soportan folding.',
          incorrectas: [
            'Eso se llama Merge o Append',
            'No es sobre visibilidad, es sobre rendimiento',
            'No reduce directamente el tamaño del archivo'
          ]
        },
        dominio: 'preparar-datos',
        subdominio: 'transformar-cargar-datos',
        nivel: 'avanzado',
        formato: 'opcion-multiple',
        trampaComun: 'No entender query folding y romperlo inadvertidamente',
        referencias: ['https://learn.microsoft.com/en-us/power-query/power-query-folding']
      },
      {
        id: 'model_avanz_004',
        pregunta: '¿Cuál es la diferencia principal entre usar una columna calculada vs una medida para calcular un margen de ganancia?',
        opciones: [
          'No hay diferencia en el resultado',
          'Columnas calculadas se evalúan por fila y se almacenan; medidas se calculan dinámicamente según contexto de filtro',
          'Las medidas son más lentas que las columnas calculadas',
          'Solo las columnas calculadas pueden usar DAX'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'Columnas calculadas se evalúan fila por fila durante la actualización de datos y almacenan el resultado (ocupando memoria). Son útiles para valores que se usan en slicers/filtros. Medidas se calculan en tiempo de consulta según el contexto de filtro actual, son más eficientes para agregaciones y métricas que cambian según los filtros aplicados.',
          incorrectas: [
            'El resultado puede ser similar pero el rendimiento e impacto son diferentes',
            'Las medidas generalmente son más eficientes para agregaciones',
            'Ambas usan DAX, la diferencia está en cuándo y cómo se evalúan'
          ]
        },
        dominio: 'modelar-datos',
        subdominio: 'optimizar-rendimiento',
        nivel: 'avanzado',
        formato: 'opcion-multiple',
        trampaComun: 'Esta es LA pregunta trampa #1 del examen PL-300',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-calculated-columns']
      },
      {
        id: 'viz_avanz_007',
        pregunta: '¿Qué es un "tooltip personalizado" en Power BI y cómo mejora la experiencia del usuario?',
        opciones: [
          'Un mensaje de error personalizado',
          'Una página de informe completa que aparece al pasar el mouse sobre un punto de datos',
          'Un filtro especial',
          'Una función de exportación'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'Los tooltips personalizados permiten diseñar una página de informe completa que se muestra como tooltip al pasar el mouse sobre puntos de datos en otros visuales. Esto permite mostrar información contextual rica y múltiples visuales relacionados sin saturar el dashboard principal. Se configuran creando una página con "Tooltip" como tipo de página.',
          incorrectas: [
            'No es para errores, es para información contextual',
            'No son filtros, aunque pueden mostrar datos filtrados',
            'No relacionado con exportación'
          ]
        },
        dominio: 'visualizar-analizar',
        subdominio: 'mejorar-usabilidad',
        nivel: 'avanzado',
        formato: 'opcion-multiple',
        trampaComun: 'No aprovechar tooltips para evitar saturación visual',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-tooltips']
      },
      {
        id: 'admin_avanz_007',
        pregunta: '¿Qué es el "Deployment Pipeline" en Power BI Service y para qué se utiliza?',
        opciones: [
          'Una herramienta para importar datos',
          'Un proceso de CI/CD para mover contenido entre entornos (Desarrollo, Prueba, Producción)',
          'Un tipo de Gateway',
          'Una forma de programar actualizaciones'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'Deployment Pipelines es una característica Premium que permite implementar contenido de Power BI a través de diferentes etapas (típicamente Desarrollo → Prueba → Producción). Facilita el desarrollo colaborativo, pruebas controladas y despliegues ordenados de dashboards e informes, similar a prácticas DevOps/CI/CD en desarrollo de software.',
          incorrectas: [
            'No es para importación de datos',
            'Gateways conectan a datos on-premises, no gestionan despliegues',
            'Scheduled Refresh es para actualización de datos'
          ]
        },
        dominio: 'administrar-asegurar',
        subdominio: 'asegurar-gobernar',
        nivel: 'avanzado',
        formato: 'opcion-multiple',
        trampaComun: 'No conocer herramientas de governance empresarial',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/create-reports/deployment-pipelines-overview']
      },
      {
        id: 'prep_prin_013',
        pregunta: '¿Qué extensión de archivo se utiliza para los informes de Power BI Desktop?',
        opciones: [
          '.xlsx',
          '.pbix',
          '.pbit',
          '.pdf'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: '.pbix es la extensión de archivo para informes de Power BI Desktop que contienen datos, modelo, visuales y configuraciones. .pbit es para plantillas (templates) de Power BI que no incluyen datos. .pbix es lo que publicas al servicio Power BI.',
          incorrectas: [
            '.xlsx es Excel',
            '.pbit es una plantilla de Power BI sin datos',
            '.pdf es un formato de exportación, no el archivo de trabajo'
          ]
        },
        dominio: 'preparar-datos',
        subdominio: 'obtener-datos',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'Confundir .pbix con .pbit',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/fundamentals/desktop-what-is-desktop']
      },
      {
        id: 'model_prin_010',
        pregunta: 'En un modelo de datos, ¿qué indica una línea de relación con "1" en un lado y "*" en el otro?',
        opciones: [
          'Relación uno a uno',
          'Relación muchos a muchos',
          'Relación uno a muchos',
          'No hay relación'
        ],
        respuestaCorrecta: 2,
        explicacion: {
          correcta: 'Una relación con "1" en un lado y "*" (asterisco) en el otro indica una relación uno a muchos. Por ejemplo, una Categoría (1) puede tener muchos Productos (*), o un Cliente (1) puede tener muchos Pedidos (*). Esta es la relación más común en modelos dimensionales.',
          incorrectas: [
            'Uno a uno tendría "1" en ambos lados',
            'Muchos a muchos tendría "*" en ambos lados',
            'La línea sí indica una relación activa'
          ]
        },
        dominio: 'modelar-datos',
        subdominio: 'disenar-modelo',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'No entender la notación de cardinalidad de relaciones',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-create-and-manage-relationships']
      },
      {
        id: 'viz_prin_007',
        pregunta: '¿Qué visual de Power BI es mejor para mostrar la relación entre dos variables numéricas (por ejemplo, Precio vs Cantidad Vendida)?',
        opciones: [
          'Gráfico de líneas',
          'Gráfico de dispersión (Scatter chart)',
          'Gráfico de barras',
          'Tabla'
        ],
        respuestaCorrecta: 1,
        explicacion: {
          correcta: 'El gráfico de dispersión (scatter chart) muestra la relación entre dos variables numéricas en los ejes X e Y, donde cada punto representa una observación. Es ideal para identificar correlaciones, patrones o valores atípicos entre dos métricas numéricas.',
          incorrectas: [
            'Gráficos de líneas muestran tendencias a lo largo del tiempo',
            'Gráficos de barras comparan categorías, no dos variables numéricas',
            'Tablas muestran datos tabulares, no relaciones visuales'
          ]
        },
        dominio: 'visualizar-analizar',
        subdominio: 'crear-reportes',
        nivel: 'principiante',
        formato: 'opcion-multiple',
        trampaComun: 'No usar el visual apropiado para análisis de correlación',
        referencias: ['https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualization-scatter']
      }
    ]
  }
};

export const dominiosInfo = {
  'preparar-datos': {
    titulo: 'Preparar los Datos',
    descripcion: 'Conectar, perfilar, limpiar y transformar datos',
    color: '#2196F3',
    peso: '25-30%',
    preguntasExamen: '13-18',
    preguntasBanco: 96,
    subdominios: [
      'Obtener/conectar datos',
      'Perfilar/limpiar datos', 
      'Transformar/cargar datos'
    ]
  },
  'modelar-datos': {
    titulo: 'Modelar los Datos',
    descripcion: 'Diseño de modelo, DAX y optimización (DOMINIO MÁS PESADO)', 
    color: '#FF5722',
    peso: '30-35%',
    preguntasExamen: '15-21',
    preguntasBanco: 111,
    subdominios: [
      'Diseñar/implementar modelo',
      'Crear cálculos DAX',
      'Optimizar rendimiento'
    ],
    esElMasPesado: true
  },
  'visualizar-analizar': {
    titulo: 'Visualizar y Analizar',
    descripcion: 'Reportes, storytelling y análisis de patrones',
    color: '#9C27B0',
    peso: '25-30%',
    preguntasExamen: '13-18', 
    preguntasBanco: 96,
    subdominios: [
      'Crear reportes',
      'Mejorar usabilidad/storytelling',
      'Identificar patrones/tendencias'
    ]
  },
  'administrar-asegurar': {
    titulo: 'Administrar y Asegurar',
    descripcion: 'Workspaces, seguridad y gobierno (MUY frecuente en examen)',
    color: '#4CAF50',
    peso: '15-20%',
    preguntasExamen: '8-12',
    preguntasBanco: 59,
    subdominios: [
      'Crear/gestionar workspaces',
      'Asegurar/gobernar items'
    ],
    sorpresaComun: true
  }
};

export const nivelesInfo = {
  principiante: {
    nombre: 'Principiante',
    descripcion: 'Operaciones básicas UI, agregaciones DAX simples',
    color: '#4CAF50',
    porcentaje: '30%',
    ejemplos: 'Conectar Excel/CSV, SUM/AVERAGE, relaciones 1:muchos',
    trampasTipicas: 'Confundir terminología básica'
  },
  intermedio: {
    nombre: 'Intermedio', 
    descripcion: 'CALCULATE, time intelligence, Power Query multi-paso',
    color: '#FF9800',
    porcentaje: '50%',
    ejemplos: 'Merge queries, SAMEPERIODLASTYEAR, workspace management',
    trampasTipicas: 'Contexto de fila vs filtro, Import vs DirectQuery'
  },
  avanzado: {
    nombre: 'Avanzado',
    descripcion: 'Iteradores DAX, optimización, RLS dinámico, síntesis compleja',
    color: '#F44336', 
    porcentaje: '20%',
    ejemplos: 'SUMX con variables, Performance Analyzer, many-to-many',
    trampasTipicas: 'Transición de contexto, implicaciones de rendimiento'
  }
};

// Información adicional sobre el examen
export const examenInfo = {
  duracion: '100 minutos',
  preguntas: '50-60 preguntas',
  puntuacionMinima: '700 de 1000 (escalado)',
  idiomas: '10 idiomas incluyendo español',
  tiposFormato: 14,
  tasaAprobacion: 'Notablemente baja en primer intento',
  preparacionTipica: '2-5 meses de estudio dedicado',
  sorpresaNumero1: 'Power BI Service sobrerrepresentado vs expectativas',
  errorNumero1: 'Columnas calculadas vs Medidas'
};

// ============================================================================
// METADATOS DE TAXONOMÍA DE BLOOM
// ============================================================================

const MAPEO_BLOOM = {
  // Preparar Datos
  'prep_prin_001': 'aplicar', 'prep_prin_002': 'recordar', 'prep_prin_003': 'comprender', 
  'prep_prin_004': 'recordar', 'prep_prin_005': 'recordar', 'prep_prin_006': 'comprender',
  'prep_prin_007': 'aplicar', 'prep_prin_008': 'comprender', 'prep_prin_009': 'recordar',
  'prep_prin_010': 'comprender', 'prep_prin_011': 'recordar', 'prep_prin_012': 'aplicar',
  'prep_prin_013': 'recordar',
  'prep_inter_001': 'aplicar', 'prep_inter_002': 'comprender', 'prep_inter_003': 'comprender', 
  'prep_inter_004': 'aplicar', 'prep_inter_005': 'aplicar', 'prep_inter_006': 'recordar', 
  'prep_inter_007': 'comprender', 'prep_inter_008': 'aplicar', 'prep_inter_009': 'aplicar',
  'prep_inter_010': 'recordar', 'prep_inter_011': 'comprender', 'prep_inter_012': 'aplicar',
  'prep_inter_013': 'aplicar', 'prep_inter_014': 'aplicar', 'prep_inter_015': 'aplicar',
  'prep_inter_016': 'aplicar',
  'prep_avanz_001': 'analizar', 'prep_avanz_002': 'aplicar', 'prep_avanz_003': 'comprender',
  'prep_avanz_004': 'aplicar', 'prep_avanz_005': 'comprender',
  
  // Modelar Datos
  'model_prin_001': 'comprender', 'model_prin_002': 'aplicar', 'model_prin_003': 'comprender',
  'model_prin_004': 'comprender', 'model_prin_005': 'recordar', 'model_prin_006': 'analizar',
  'model_prin_007': 'aplicar', 'model_prin_008': 'comprender', 'model_prin_009': 'recordar',
  'model_prin_010': 'comprender',
  'model_inter_001': 'aplicar', 'model_inter_002': 'comprender', 'model_inter_003': 'comprender', 
  'model_inter_004': 'aplicar', 'model_inter_005': 'aplicar', 'model_inter_006': 'comprender',
  'model_inter_007': 'aplicar', 'model_inter_008': 'analizar', 'model_inter_009': 'recordar',
  'model_inter_010': 'comprender', 'model_inter_011': 'aplicar', 'model_inter_012': 'aplicar',
  'model_avan_001': 'analizar', 'model_avanz_002': 'aplicar', 'model_avanz_003': 'analizar',
  'model_avanz_004': 'analizar',
  
  // Visualizar y Analizar
  'viz_prin_001': 'recordar', 'viz_prin_002': 'recordar', 'viz_prin_003': 'recordar',
  'viz_prin_004': 'recordar', 'viz_prin_005': 'aplicar', 'viz_prin_006': 'recordar',
  'viz_prin_007': 'comprender',
  'viz_inter_001': 'aplicar', 'viz_inter_002': 'aplicar', 'viz_inter_003': 'aplicar',
  'viz_inter_004': 'recordar', 'viz_inter_005': 'aplicar', 'viz_inter_006': 'aplicar',
  'viz_inter_007': 'comprender', 'viz_inter_008': 'aplicar', 'viz_inter_009': 'aplicar',
  'viz_avanz_001': 'comprender', 'viz_avanz_002': 'comprender', 'viz_avanz_003': 'comprender',
  'viz_avanz_004': 'comprender', 'viz_avanz_005': 'recordar', 'viz_avanz_006': 'aplicar',
  'viz_avanz_007': 'aplicar',
  
  // Administrar y Asegurar
  'admin_prin_001': 'aplicar', 'admin_prin_002': 'comprender', 'admin_prin_003': 'aplicar',
  'admin_prin_004': 'comprender', 'admin_prin_005': 'recordar', 'admin_prin_006': 'recordar',
  'admin_prin_007': 'comprender',
  'admin_inter_001': 'recordar', 'admin_inter_002': 'aplicar',
  'admin_inter_003': 'aplicar', 'admin_inter_004': 'comprender', 'admin_inter_005': 'aplicar',
  'admin_inter_006': 'comprender', 'admin_inter_007': 'aplicar', 'admin_inter_008': 'comprender',
  'admin_avanz_001': 'aplicar', 'admin_avanz_002': 'aplicar', 'admin_avanz_003': 'comprender',
  'admin_avanz_004': 'comprender', 'admin_avanz_005': 'aplicar', 'admin_avanz_006': 'comprender',
  'admin_avanz_007': 'comprender'
};

// Función helper para filtrar preguntas según criterios
/**
 * ✅ FIX 1: Fisher-Yates shuffle algorithm - distribución uniforme garantizada
 * Más eficiente y verdaderamente aleatorio que sort(() => Math.random() - 0.5)
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Obtiene preguntas filtradas por dominio, nivel y cantidad
 * ✅ MEJORADO: Sistema de exclusión inteligente basado en questionTracking
 * 
 * @param {string|null} dominio - Dominio específico o null para todos
 * @param {string|null} nivel - Nivel específico o null para todos
 * @param {number|null} cantidad - Cantidad de preguntas a devolver
 * @param {Array} preguntasExcluidas - IDs de preguntas a excluir (legacy)
 * @param {Object} options - Opciones adicionales para filtrado inteligente
 * @param {Object} options.questionTracking - Datos de tracking para priorización
 * @param {boolean} options.excludeMasteredOnly - Solo excluir preguntas dominadas (default: false)
 * @param {boolean} options.prioritizeWeak - Priorizar preguntas con baja accuracy (default: false)
 * @returns {Array} Array de preguntas filtradas y mezcladas
 */
export function getFilteredQuestions(dominio = null, nivel = null, cantidad = null, preguntasExcluidas = [], options = {}) {
  let todasLasPreguntas = [];
  
  // Normalizar valores de 'todos' a null para que funcione como "todos"
  const dominioNormalizado = (dominio === 'all' || dominio === 'todos') ? null : dominio;
  const nivelNormalizado = (nivel === 'all' || nivel === 'todos') ? null : nivel;
  
  // Si se especifica dominio y nivel, filtrar por ambos
  if (dominioNormalizado && nivelNormalizado && preguntasEjemplo[dominioNormalizado] && preguntasEjemplo[dominioNormalizado][nivelNormalizado]) {
    todasLasPreguntas = [...preguntasEjemplo[dominioNormalizado][nivelNormalizado]];
  }
  // Si solo se especifica dominio
  else if (dominioNormalizado && preguntasEjemplo[dominioNormalizado]) {
    Object.keys(preguntasEjemplo[dominioNormalizado]).forEach(niv => {
      todasLasPreguntas = [...todasLasPreguntas, ...preguntasEjemplo[dominioNormalizado][niv]];
    });
  }
  // Si solo se especifica nivel
  else if (nivelNormalizado) {
    Object.keys(preguntasEjemplo).forEach(dom => {
      if (preguntasEjemplo[dom][nivelNormalizado]) {
        todasLasPreguntas = [...todasLasPreguntas, ...preguntasEjemplo[dom][nivelNormalizado]];
      }
    });
  }
  // Si no se especifica nada, devolver todas
  else {
    Object.keys(preguntasEjemplo).forEach(dom => {
      Object.keys(preguntasEjemplo[dom]).forEach(niv => {
        todasLasPreguntas = [...todasLasPreguntas, ...preguntasEjemplo[dom][niv]];
      });
    });
  }
  
  // ✅ FIX 2: Sistema de exclusión inteligente
  const questionTracking = options.questionTracking || {};
  const excludeMasteredOnly = options.excludeMasteredOnly || false;
  
  if (excludeMasteredOnly) {
    // Solo excluir preguntas DOMINADAS (mastered/retired)
    todasLasPreguntas = todasLasPreguntas.filter(p => {
      const tracking = questionTracking[p.id];
      if (!tracking) return true; // No respondida, incluir
      
      // Excluir solo si está dominada (3+ correctas consecutivas y 80%+ accuracy)
      const accuracy = tracking.totalAttempts > 0 
        ? (tracking.correctAttempts / tracking.totalAttempts) * 100 
        : 0;
      const isDominated = tracking.consecutiveCorrect >= 3 && accuracy >= 80;
      
      return !isDominated; // Incluir si NO está dominada
    });
  } else if (preguntasExcluidas && preguntasExcluidas.length > 0) {
    // Modo legacy: excluir todas las preguntas respondidas
    todasLasPreguntas = todasLasPreguntas.filter(p => !preguntasExcluidas.includes(p.id));
  }
  
  // Enriquecer preguntas con nivel Bloom
  const preguntasEnriquecidas = todasLasPreguntas.map(pregunta => ({
    ...pregunta,
    nivelBloom: MAPEO_BLOOM[pregunta.id] || 'recordar'
  }));
  
  // ✅ FIX 3: Priorización por rendimiento (opcional)
  let preguntasParaSortear = preguntasEnriquecidas;
  
  if (options.prioritizeWeak && Object.keys(questionTracking).length > 0) {
    // Separar en categorías
    const weak = []; // < 50% accuracy
    const medium = []; // 50-80% accuracy
    const strong = []; // > 80% accuracy
    const unanswered = []; // Sin responder
    
    preguntasEnriquecidas.forEach(p => {
      const tracking = questionTracking[p.id];
      if (!tracking || tracking.totalAttempts === 0) {
        unanswered.push(p);
      } else {
        const accuracy = (tracking.correctAttempts / tracking.totalAttempts) * 100;
        if (accuracy < 50) {
          weak.push(p);
        } else if (accuracy < 80) {
          medium.push(p);
        } else {
          strong.push(p);
        }
      }
    });
    
    // Prioridad: débiles (50%), sin responder (30%), medias (15%), fuertes (5%)
    const weakCount = Math.ceil(preguntasEnriquecidas.length * 0.50);
    const unansCount = Math.ceil(preguntasEnriquecidas.length * 0.30);
    const medCount = Math.ceil(preguntasEnriquecidas.length * 0.15);
    
    preguntasParaSortear = [
      ...shuffleArray(weak).slice(0, weakCount),
      ...shuffleArray(unanswered).slice(0, unansCount),
      ...shuffleArray(medium).slice(0, medCount),
      ...shuffleArray(strong)
    ];
  }
  
  // ✅ FIX 1 APLICADO: Usar Fisher-Yates shuffle en lugar de sort()
  const preguntasMezcladas = shuffleArray(preguntasParaSortear);
  
  // Si se especifica cantidad, devolver solo esa cantidad
  if (cantidad && cantidad > 0) {
    return preguntasMezcladas.slice(0, cantidad);
  }
  
  return preguntasMezcladas;
}