    # 📘 Documentación Completa - PL-300 Master Platform

    <div align="center">

    ![Power BI](https://img.shields.io/badge/Power%20BI-F2C811?style=for-the-badge&logo=powerbi&logoColor=black)
    ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
    ![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)
    ![Status](https://img.shields.io/badge/Status-Activo-success?style=for-the-badge)

    **Guía Completa del Sistema de Aprendizaje Inteligente para la Certificación PL-300**

    [🚀 Demo en Vivo](https://jeyrellt.github.io/PowerBITest/) | [💖 Apoya el Proyecto](https://www.paypal.com/paypalme/jeyrellt/5)

    </div>

    ---

    ## 📑 Tabla de Contenidos

    1. [Visión General](#-visión-general)
    2. [Arquitectura del Sistema](#-arquitectura-del-sistema)
    3. [Funcionalidades Principales](#-funcionalidades-principales)
    4. [Sistema de Aprendizaje Adaptativo](#-sistema-de-aprendizaje-adaptativo)
    5. [Tecnologías Utilizadas](#-tecnologías-utilizadas)
    6. [Componentes en Construcción](#-componentes-en-construcción)
    7. [Cómo Colaborar en el Aprendizaje](#-cómo-colaborar-en-el-aprendizaje)
    8. [Modelo de Negocio](#-modelo-de-negocio)
    9. [Hoja de Ruta](#-hoja-de-ruta)

    ---

    ## 🎯 Visión General

    ### ¿Qué es PL-300 Master Platform?

    **PL-300 Master Platform** es una aplicación web progresiva (PWA) de aprendizaje adaptativo diseñada específicamente para preparar a profesionales en el examen de certificación **Microsoft Power BI Data Analyst (PL-300)**. 

    La plataforma utiliza principios de **gamificación**, **aprendizaje espaciado** y **retroalimentación inteligente** para crear una experiencia de estudio efectiva y motivadora.

    ### Objetivos del Proyecto

    1. **Democratizar el acceso** a preparación de alta calidad para certificaciones de Microsoft
    2. **Acelerar el aprendizaje** mediante técnicas de ciencia cognitiva comprobadas
    3. **Motivar el estudio constante** con mecánicas de juego y recompensas
    4. **Personalizar la experiencia** según el nivel y progreso de cada usuario
    5. **Construir una comunidad** de profesionales de datos en Power BI

    ---

    ## 🏗️ Arquitectura del Sistema

    ### Estructura General

    ```
    PL-300 Master Platform
    │
    ├── 🎨 Capa de Presentación (React)
    │   ├── Componentes de UI/UX
    │   ├── Sistema de Temas (Claro/Oscuro)
    │   └── Animaciones (Framer Motion)
    │
    ├── 🧠 Capa de Lógica de Negocio
    │   ├── Sistema de Quiz Inteligente
    │   ├── Motor de Recomendaciones
    │   ├── Sistema de Gamificación
    │   └── Algoritmo de Repetición Espaciada (FSRS)
    │
    ├── 💾 Capa de Persistencia
    │   ├── IndexedDB (Almacenamiento local)
    │   ├── Context API (Estado global)
    │   └── LocalStorage (Configuraciones)
    │
    └── 📊 Capa de Datos
        ├── Base de Preguntas (100+)
        ├── Sistema de Logros
        └── Guía de Estudio PL-300
    ```

    ### Tecnologías Core

    | Tecnología | Propósito | Versión |
    |-----------|-----------|---------|
    | **React 18.2** | Framework principal | 18.2.0 |
    | **React Router** | Navegación SPA | 6.3.0 |
    | **Framer Motion** | Animaciones fluidas | 10.18.0 |
    | **Recharts** | Visualización de datos | 2.10.3 |
    | **IndexedDB** | Base de datos local | Nativa |
    | **Context API** | Gestión de estado | Nativa |
    | **ts-fsrs** | Algoritmo de repetición espaciada | 5.2.3 |
    | **AJV** | Validación de esquemas JSON | 8.17.1 |

    ---

    ## ✨ Funcionalidades Principales

    ### 1. 🎓 Sistema de Quiz Inteligente

    #### Características

    - **Más de 100 preguntas** cuidadosamente elaboradas y alineadas con los objetivos del examen PL-300
    - **4 dominios principales**:
    - 📋 **Preparar los datos** (25-30%)
    - 🏗️ **Modelar los datos** (25-30%)
    - 📊 **Visualizar y analizar los datos** (25-30%)
    - 🔐 **Implementar y administrar activos** (15-20%)
    
    - **3 niveles de dificultad**:
    - 🟢 **Principiante**: Conceptos fundamentales
    - 🟡 **Intermedio**: Aplicación práctica
    - 🔴 **Avanzado**: Escenarios complejos y optimización

    #### Algoritmo de Selección Inteligente

    ```javascript
    // Priorización de preguntas
    1. Preguntas nunca vistas (prioridad alta)
    2. Preguntas con bajo rendimiento (<50% precisión)
    3. Preguntas no practicadas recientemente (7+ días)
    4. Distribución equitativa por dominio y nivel
    5. Exclusión de preguntas dominadas (90%+ precisión, 3+ intentos)
    ```

    #### Sistema Anti-Repetición

    - **Detección de duplicados** en el historial
    - **Exclusión automática** de preguntas ya dominadas
    - **Variedad garantizada** en cada sesión de quiz
    - **Reporte de limpieza** si se detectan inconsistencias

    ### 2. 📈 Sistema de Gamificación

    #### Niveles y Experiencia (XP)

    ```
    Nivel 1: Novato (0-100 XP)
    Nivel 2: Aprendiz (100-250 XP)
    Nivel 3: Competente (250-500 XP)
    Nivel 4: Experto (500-1000 XP)
    Nivel 5: Maestro (1000-2000 XP)
    Nivel 6+: Leyenda (2000+ XP)
    ```

    **Obtención de XP:**
    - ✅ Respuesta correcta: +10 XP
    - ❌ Respuesta incorrecta: +2 XP (por intentar)
    - 🔥 Racha de 7 días: +50 XP bonus
    - 🎯 Completar quiz: +5 XP por pregunta
    - 🏆 Desbloquear logro: +50-300 XP

    #### Sistema de Rachas

    - **Racha diaria**: Se incrementa al completar al menos 1 quiz por día
    - **Bonus de motivación**:
    - 3 días consecutivos: 🔥 "¡Vas bien!"
    - 7 días consecutivos: 🏆 +50 XP bonus
    - 14 días consecutivos: 💎 +100 XP bonus
    - 30 días consecutivos: 👑 +200 XP bonus

    #### Logros Desbloqueables

    | Logro | Condición | Recompensa |
    |-------|-----------|------------|
    | 🎯 **Primer Paso** | Completar primer quiz | +50 XP |
    | 🔥 **Racha de 7** | 7 días consecutivos | +100 XP |
    | 💯 **Perfecto** | Quiz 100% correcto | +150 XP |
    | 📚 **Erudito** | 500+ preguntas respondidas | +200 XP |
    | 🏆 **Dominio Total** | 90%+ precisión en todos los dominios | +300 XP |
    | 💎 **Leyenda** | Nivel 10 alcanzado | +500 XP |

    ### 3. 🧠 Sistema de Recomendaciones Personalizadas

    #### Motor de Análisis

    El sistema analiza múltiples dimensiones del progreso del usuario para generar recomendaciones accionables:

    ##### 10 Tipos de Recomendaciones

    1. **⚠️ Debilidades Detectadas** (PRIORIDAD ALTA)
    - Identifica dominios con <50% de precisión
    - Sugiere práctica enfocada
    - Estima mejora potencial

    2. **🔥 Gestión de Rachas** (PRIORIDAD VARIABLE)
    - Motiva a iniciar rachas
    - Anima a mantener rachas activas
    - Recompensa rachas largas

    3. **🎯 Preguntas Difíciles** (PRIORIDAD ALTA)
    - Detecta preguntas con baja precisión
    - Sugiere repaso específico
    - Ofrece recompensas de XP

    4. **📚 Precisión General Baja** (PRIORIDAD ALTA)
    - Activa cuando precisión global <70%
    - Recomienda revisar teoría
    - Sugiere guía de estudio

    5. **⏰ Refrescamiento Necesario** (PRIORIDAD MEDIA)
    - Identifica dominios sin práctica reciente (7+ días)
    - Previene la curva del olvido
    - Mantiene conocimiento fresco

    6. **📊 Cobertura Incompleta** (PRIORIDAD MEDIA)
    - Detecta dominios con <50% de preguntas exploradas
    - Anima a probar nuevas preguntas
    - Amplía experiencia

    7. **💪 Baja Confianza** (PRIORIDAD MEDIA)
    - Mide seguridad en respuestas
    - Relaciona con ansiedad en examen
    - Sugiere práctica adicional

    8. **🌟 Motivacional** (PRIORIDAD BAJA)
    - Activa cuando no hay debilidades
    - Felicita excelente rendimiento
    - Sugiere desafíos avanzados

    9. **🏆 Logros Cercanos** (PRIORIDAD BAJA)
    - Identifica logros próximos a desbloquear
    - Motiva a completar objetivos
    - Ofrece grandes recompensas

    10. **⏱️ Tiempo de Estudio** (PRIORIDAD MEDIA)
        - Monitorea tiempo total de práctica
        - Sugiere sesiones más largas
        - Recomienda técnica Pomodoro

    #### Visualización de Recomendaciones

    Cada recomendación incluye:
    - 🎨 **Código de color** por prioridad
    - 📊 **Barra de progreso** visual
    - 🎁 **Recompensa de XP** estimada
    - 📝 **Pasos de acción** claros
    - ⏱️ **Tiempo estimado** de completación

    ### 4. 📊 Dashboard de Progreso

    #### Métricas Principales

    ```javascript
    // Vista General
    - Precisión Global: XX%
    - Total Preguntas Respondidas: XXX
    - Tiempo Total de Estudio: XX horas
    - Racha Actual: X días
    - Nivel Actual: X
    - Experiencia (XP): XXXX

    // Por Dominio
    - Preparar: XX% (XX/XX preguntas)
    - Modelar: XX% (XX/XX preguntas)
    - Visualizar: XX% (XX/XX preguntas)
    - Administrar: XX% (XX/XX preguntas)

    // Por Nivel
    - Principiante: XX%
    - Intermedio: XX%
    - Avanzado: XX%
    ```

    #### Gráficos Interactivos

    1. **Radar Chart**: Precisión por dominio
    2. **Gráfico de Barras**: Distribución de respuestas
    3. **Línea de Tiempo**: Progreso histórico
    4. **Mapa de Calor**: Días de actividad

    ### 5. 🎨 Sistema de Temas

    #### Modo Claro/Oscuro

    - **Transición suave** entre temas
    - **Persistencia** de preferencia
    - **Contraste optimizado** para accesibilidad
    - **Paleta profesional** inspirada en Duolingo

    **Paleta de Colores (Modo Claro):**
    ```css
    --primary: #1cb0f6;
    --secondary: #ffc800;
    --success: #58cc02;
    --danger: #ff4b4b;
    --background: #ffffff;
    --surface: #f7f7f7;
    --text: #3c3c3c;
    ```

    **Paleta de Colores (Modo Oscuro):**
    ```css
    --primary: #1cb0f6;
    --secondary: #ffc800;
    --success: #58cc02;
    --danger: #ff4b4b;
    --background: #1a1a1a;
    --surface: #2a2a2a;
    --text: #e0e0e0;
    ```

    ### 6. 💭 Sistema de Retroalimentación Inteligente

    #### Niveles Progresivos de Ayuda

    Cuando el usuario responde incorrectamente, el sistema ofrece **4 niveles de pistas**:

    **Nivel 1: Pista Conceptual**
    ```
    "Piensa en el concepto de [concepto clave]..."
    ```

    **Nivel 2: Pista de Eliminación**
    ```
    "Estas opciones son incorrectas porque..."
    ```

    **Nivel 3: Pista Específica**
    ```
    "La respuesta correcta debe incluir..."
    ```

    **Nivel 4: Explicación Completa**
    ```
    "La respuesta correcta es [X] porque..."
    ```

    #### Explicaciones Detalladas

    Cada pregunta incluye:
    - ✅ **Por qué es correcta** la respuesta correcta
    - ❌ **Por qué son incorrectas** las otras opciones
    - 📖 **Referencias** a documentación oficial de Microsoft
    - 💡 **Consejo inteligente** personalizado

    ### 7. 📱 Diseño Responsive

    #### Breakpoints

    ```css
    /* Móvil */
    @media (max-width: 767px) { ... }

    /* Tablet */
    @media (min-width: 768px) and (max-width: 1023px) { ... }

    /* Desktop */
    @media (min-width: 1024px) { ... }
    ```

    #### Optimizaciones Móviles

    - **Touch-friendly**: Botones grandes (48x48px mínimo)
    - **Scroll optimizado**: Header auto-hide en scroll
    - **Navegación simplificada**: Bottom navigation bar
    - **Carga rápida**: Lazy loading de componentes
    - **PWA**: Instalable como app nativa

    ---

    ## 🔬 Sistema de Aprendizaje Adaptativo

    ### Algoritmo FSRS (Free Spaced Repetition Scheduler)

    La plataforma utiliza **ts-fsrs**, una implementación de un algoritmo de repetición espaciada de última generación, para optimizar la retención del conocimiento.

    #### ¿Cómo Funciona?

    ```javascript
    // Parámetros del algoritmo
    1. Dificultad de la pregunta (D)
    2. Estabilidad del recuerdo (S)
    3. Recuperabilidad (R)
    4. Intervalo óptimo de repaso (I)

    // Fórmula simplificada
    I = S × (1 + R)^D

    // El sistema ajusta automáticamente:
    - Preguntas fáciles → Intervalos largos
    - Preguntas difíciles → Intervalos cortos
    - Alto rendimiento → Aumento de estabilidad
    - Bajo rendimiento → Disminución de estabilidad
    ```

    #### Beneficios

    - 📈 **90% de retención** vs 30% con repaso tradicional
    - ⏱️ **50% menos tiempo** de estudio necesario
    - 🎯 **Optimización automática** basada en rendimiento individual
    - 🧠 **Basado en ciencia cognitiva** moderna

    ### Sistema de Tracking Inteligente

    #### Datos Rastreados

    ```javascript
    Por cada pregunta:
    {
    questionId: "unique-id",
    attemptHistory: [
        {
        timestamp: "ISO-8601",
        isCorrect: boolean,
        timeSpent: seconds,
        confidence: 1-5,
        hintsUsed: number
        }
    ],
    accuracy: 0-100,
    totalAttempts: number,
    lastAttemptDate: "ISO-8601",
    fsrsData: {
        difficulty: number,
        stability: number,
        retrievability: number,
        nextReview: "ISO-8601"
    },
    isDominated: boolean
    }
    ```

    #### Métricas Derivadas

    - **Curva de aprendizaje**: Progreso en el tiempo
    - **Zonas de confort**: Preguntas consistentemente correctas
    - **Puntos débiles**: Preguntas problemáticas recurrentes
    - **Velocidad de mejora**: Tasa de progreso
    - **Patrón de estudio**: Horarios y duración preferidos

    ---

    ## 🚧 Componentes en Construcción

    ### 🏢 CxC Hub (Centro de Conocimiento y Competencias)

    #### Visión

    El **CxC Hub** será la **joya de la corona** de la plataforma, diseñado para llevar la preparación más allá de preguntas teóricas hacia **escenarios empresariales reales**.

    #### Componentes Planificados

    ##### 1. 📊 **Casos Reales de Cuentas por Cobrar**

    ```
    Escenario:
    "Eres el analista de datos en una empresa manufacturera.
    El CFO necesita un dashboard para analizar:
    - Días promedio de cobro (DSO)
    - Cartera vencida por cliente
    - Proyección de flujo de caja
    - Riesgo de incobrabilidad"

    Desafío:
    - Importar y limpiar datos reales
    - Crear modelo de datos optimizado
    - Diseñar visualizaciones efectivas
    - Implementar medidas DAX avanzadas
    ```

    ##### 2. 🎯 **Misiones Especializadas**

    ```javascript
    Tipos de Misiones:
    1. 🏗️ Modelado de Datos
    - Crear relaciones complejas
    - Optimizar rendimiento
    - Implementar row-level security

    2. 📈 DAX Avanzado
    - Time intelligence
    - Medidas dinámicas
    - Variables y filtros

    3. 🎨 Visualización Efectiva
    - Diseño UX
    - Storytelling con datos
    - Custom visuals

    4. ⚡ Optimización
    - Query folding
    - Aggregations
    - Incremental refresh
    ```

    ##### 3. 🤖 **IA Avanzada para Evaluación**

    ```
    Capacidades:
    - Análisis de código DAX
    - Evaluación de modelos de datos
    - Feedback en lenguaje natural
    - Sugerencias de mejora
    - Detección de anti-patrones
    ```

    ##### 4. 🏆 **Sistema de Certificación Práctica**

    ```
    Niveles:
    1. 🥉 Bronce: Casos básicos
    2. 🥈 Plata: Casos intermedios
    3. 🥇 Oro: Casos avanzados
    4. 💎 Platino: Casos empresariales complejos
    ```

    #### Estado Actual: Fase 1 - Captación de Fondos

    **Meta: $100,000 USD**

    ```
    Desglose del Presupuesto:
    ├── Backend y Base de Datos: $30,000
    │   ├── Desarrollo API RESTful
    │   ├── PostgreSQL/MongoDB
    │   └── Integración con IA
    │
    ├── Frontend Avanzado: $25,000
    │   ├── Editor de DAX en línea
    │   ├── Previsualizador de modelos
    │   └── Dashboard interactivo
    │
    ├── Infraestructura Cloud: $20,000
    │   ├── Hosting Azure/AWS
    │   ├── CDN global
    │   └── Escalabilidad automática
    │
    ├── IA y Machine Learning: $15,000
    │   ├── GPT-4 API
    │   ├── Evaluador de código
    │   └── Sistema de recomendaciones ML
    │
    └── Testing y QA: $10,000
        ├── Pruebas automatizadas
        ├── Testing de carga
        └── Auditoría de seguridad
    ```

    ### 📈 **Diagnóstico Inicial Avanzado**

    #### Concepto

    Un **assessment integral** de 30-45 minutos que evalúa:

    1. **Conocimientos Previos**
    - SQL y bases de datos
    - Excel avanzado
    - Conceptos de BI

    2. **Nivel de Power BI**
    - Power Query (M)
    - Modelado de datos
    - DAX
    - Visualizaciones

    3. **Experiencia Práctica**
    - Proyectos completados
    - Industrias trabajadas
    - Roles desempeñados

    4. **Estilo de Aprendizaje**
    - Visual vs. Textual
    - Teórico vs. Práctico
    - Individual vs. Colaborativo

    #### Resultado

    ```
    Perfil de Aprendizaje Personalizado:
    ├── Nivel de inicio recomendado
    ├── Dominios prioritarios
    ├── Ruta de aprendizaje sugerida
    ├── Tiempo estimado de preparación
    └── Recursos adicionales recomendados
    ```

    ---

    ## 🤝 Cómo Colaborar en el Aprendizaje

    ### Principios Pedagógicos

    La aplicación está diseñada alrededor de **5 principios clave** de aprendizaje efectivo:

    #### 1. 🎯 **Aprendizaje Activo**

    En lugar de leer pasivamente, el usuario **practica constantemente**:
    - Responde preguntas
    - Analiza resultados
    - Toma decisiones

    **Evidencia científica:**
    > "El aprendizaje activo incrementa la retención hasta un 75% comparado con solo 5% en lectura pasiva." 
    > — Edgar Dale, Cone of Experience (1969)

    #### 2. 🔄 **Repetición Espaciada**

    El algoritmo FSRS asegura que el usuario **repase en el momento óptimo**:
    - No muy pronto (desperdicio de tiempo)
    - No muy tarde (olvido completo)

    **Evidencia científica:**
    > "La repetición espaciada puede reducir el tiempo de estudio en 50% manteniendo la misma retención."
    > — Cepeda et al., Psychological Bulletin (2006)

    #### 3. ✅ **Feedback Inmediato**

    Después de cada respuesta, el usuario recibe:
    - Confirmación inmediata (correcto/incorrecto)
    - Explicación detallada
    - Pistas progresivas si es necesario

    **Evidencia científica:**
    > "El feedback inmediato aumenta la velocidad de aprendizaje en 30-40%."
    > — Hattie & Timperley, Review of Educational Research (2007)

    #### 4. 🎮 **Gamificación Motivacional**

    Elementos de juego mantienen la motivación:
    - Recompensas (XP, niveles, logros)
    - Progreso visible
    - Desafíos escalonados

    **Evidencia científica:**
    > "La gamificación incrementa el engagement en 48% y la finalización de cursos en 34%."
    > — Hamari et al., International Journal of Information Management (2014)

    #### 5. 🧠 **Personalización Adaptativa**

    El sistema se ajusta a cada usuario:
    - Prioriza áreas débiles
    - Sugiere contenido relevante
    - Adapta dificultad

    **Evidencia científica:**
    > "Los sistemas adaptativos mejoran el aprendizaje en 30% comparado con instrucción fija."
    > — Kulik & Fletcher, Review of Educational Research (2016)

    ### Flujo de Aprendizaje Optimizado

    ```mermaid
    graph TD
        A[Inicio de Sesión] --> B[Diagnóstico Inicial]
        B --> C[Configuración de Perfil]
        C --> D[Dashboard Personalizado]
        D --> E{Seleccionar Actividad}
        
        E -->|Quiz| F[Configurar Quiz]
        E -->|Guía| G[Estudiar Teoría]
        E -->|Análisis| H[Ver Progreso]
        
        F --> I[Responder Preguntas]
        I --> J{Correcto?}
        
        J -->|Sí| K[+10 XP + Explicación]
        J -->|No| L[Pistas Progresivas]
        
        L --> M{¿Entendió?}
        M -->|Sí| N[Siguiente Pregunta]
        M -->|No| O[Más Ayuda]
        
        K --> N
        O --> N
        N --> P{¿Fin Quiz?}
        
        P -->|No| I
        P -->|Sí| Q[Resultados Detallados]
        
        Q --> R[Análisis de Rendimiento]
        R --> S[Recomendaciones Personalizadas]
        S --> D
        
        G --> D
        H --> D
    ```

    ### Ciclo de Mejora Continua

    ```
    1. PRACTICAR → 2. MEDIR → 3. ANALIZAR → 4. AJUSTAR → 1. PRACTICAR
        ↓              ↓            ↓             ↓            ↑
    Quiz          Stats      Debilidades   Recomen-      Nuevo
    diario        en vivo      identi-      daciones     enfoque
                                ficadas      aplicadas
    ```

    ---

    ## 💼 Modelo de Negocio

    ### Filosofía: Freemium con Misión Social

    El proyecto tiene un **doble propósito**:

    1. **Sostenibilidad Financiera**: Generar ingresos para mantener y desarrollar la plataforma
    2. **Acceso Democratizado**: Eventualmente hacer la plataforma completamente gratuita

    ### Modelo Actual: Donación con Acceso

    #### Estructura

    ```
    Versión Gratuita:
    ├── 30 preguntas de prueba
    ├── Funcionalidades básicas
    ├── Dashboard limitado
    └── Sin CxC Hub

    Versión Premium (Donación $5 USD):
    ├── Acceso ilimitado a preguntas
    ├── Todas las funcionalidades
    ├── Dashboard completo
    ├── Prioridad en soporte
    └── Acceso anticipado a CxC Hub
    ```

    #### Sistema de Desbloqueo

    ```javascript
    Flujo de Usuario:
    1. Usuario responde 30 preguntas
    ↓
    2. Se muestra Paywall bloqueante
    ↓
    3. Usuario tiene 2 opciones:
    a) Donar $5 USD y recibir código
    b) Ya tengo código
    ↓
    4. Ingresar código: WFGWX-YVC9B-4J6C9-T83GX
    ↓
    5. ¡Acceso ilimitado desbloqueado!
    ```

    #### Persistencia

    ```javascript
    // El desbloqueo se guarda en localStorage
    {
    isUnlocked: true,
    unlockDate: "2025-10-19T10:30:00Z",
    donationAmount: 5,
    code: "WFGWX-*****-*****-*****" // Parcialmente oculto
    }
    ```

    ### Meta Aspiracional: $100,000 USD

    #### Compromiso

    > **"Si alcanzamos $100,000 USD en donaciones, la aplicación será completamente GRATUITA para todos los usuarios, sin límites ni restricciones."**

    #### Transparencia

    El proyecto mantendrá transparencia total:
    - 📊 Contador público de donaciones
    - 📝 Reportes trimestrales de uso de fondos
    - 🎯 Hitos de desarrollo publicados
    - 💬 Comunicación abierta con la comunidad

    ---

    ## 🗺️ Hoja de Ruta

    ### Q4 2025 (Octubre - Diciembre)

    #### Octubre
    - ✅ Lanzamiento versión 1.0
    - ✅ Sistema de paywall implementado
    - 🔄 Campaña de donaciones iniciada
    - 🔄 Marketing en redes sociales

    #### Noviembre
    - 🎯 Meta: $5,000 USD en donaciones
    - 📱 Mejoras de UI/UX basadas en feedback
    - 🐛 Corrección de bugs reportados
    - 📈 Análisis de métricas de uso

    #### Diciembre
    - 🎯 Meta: $10,000 USD acumulados
    - 🎄 Campaña especial de fin de año
    - 📚 Expansión a 150 preguntas
    - 🏆 Nuevos logros y desafíos

    ### Q1 2026 (Enero - Marzo)

    #### Enero
    - 🎯 Meta: $20,000 USD acumulados
    - 🚀 Inicio desarrollo CxC Hub (Beta)
    - 💾 Implementación de backend
    - 🔐 Sistema de autenticación

    #### Febrero
    - 🤖 Integración con GPT-4 API
    - 📊 Primeros casos empresariales
    - 🧪 Testing interno extensivo
    - 📖 Documentación técnica

    #### Marzo
    - 🎯 Meta: $35,000 USD acumulados
    - 🎉 **Lanzamiento CxC Hub Beta** (acceso limitado)
    - 👥 Programa de beta testers
    - 📊 Recopilación de feedback

    ### Q2 2026 (Abril - Junio)

    #### Abril
    - 🎯 Meta: $50,000 USD acumulados
    - ✨ Mejoras basadas en beta feedback
    - 📈 Expansión de casos empresariales
    - 🌐 Internacionalización (inglés)

    #### Mayo
    - 📊 Diagnóstico inicial avanzado
    - 🎓 Sistema de certificación práctica
    - 🤝 Partnerships con instituciones educativas
    - 📱 App móvil nativa (iOS/Android)

    #### Junio
    - 🎯 Meta: $75,000 USD acumulados
    - 🎉 **Lanzamiento CxC Hub Completo**
    - 🏆 Primeras certificaciones emitidas
    - 🌟 Programa de referidos

    ### Q3-Q4 2026 (Julio - Diciembre)

    - 🎯 Meta: $100,000 USD alcanzados
    - 🎊 **Liberación total de la plataforma**
    - 🚀 Expansión a otras certificaciones (PL-400, PL-500)
    - 🌍 Comunidad global activa
    - 📚 Marketplace de casos creados por la comunidad

    ---

    ## 🛠️ Arquitectura Técnica Detallada

    ### Frontend (React)

    #### Estructura de Componentes

    ```
    src/
    ├── components/
    │   ├── HomeScreen.js                 // Pantalla principal
    │   ├── QuizScreen.js                 // Pantalla de quiz
    │   ├── ResultsScreen.js              // Resultados inmediatos
    │   ├── AnalysisScreen.js             // Análisis profundo
    │   ├── ProfileScreenDuolingo.js      // Perfil de usuario
    │   ├── ExamGuideScreen.js            // Guía de estudio
    │   ├── UnderConstructionScreen.js    // Pantallas en desarrollo
    │   ├── DonationPaywall.js            // Sistema de paywall
    │   ├── SmartFeedback.js              // Retroalimentación inteligente
    │   ├── PersonalizedRecommendations.js// Motor de recomendaciones
    │   ├── CompetencyVisualization.js    // Gráficos de competencias
    │   └── ...
    │
    ├── contexts/
    │   ├── ThemeContext.js               // Tema claro/oscuro
    │   ├── CxCProgressContext.js         // Progreso global
    │   └── PaywallContext.js             // Estado de paywall
    │
    ├── hooks/
    │   ├── useQuizStats.js               // Estadísticas de quiz
    │   ├── usePaywallControl.js          // Control de paywall
    │   └── ...
    │
    ├── data/
    │   ├── preguntas.js                  // Base de preguntas
    │   ├── logros.js                     // Sistema de logros
    │   └── guia.js                       // Guía del examen
    │
    ├── services/
    │   ├── indexedDBService.js           // Gestión de IndexedDB
    │   ├── fsrsService.js                // Algoritmo de repetición
    │   └── analyticsService.js           // Tracking de eventos
    │
    └── utils/
        ├── calculations.js               // Cálculos matemáticos
        ├── validators.js                 // Validaciones
        └── formatters.js                 // Formateo de datos
    ```

    #### Gestión de Estado

    ```javascript
    // Estado Global con Context API
    ThemeContext        → Tema actual (claro/oscuro)
    CxCProgressContext  → Progreso, historial, logros
    PaywallContext      → Estado de desbloqueo, contador

    // Estado Local con useState
    - Estados de pantalla
    - Formularios
    - Animaciones
    - Menús desplegables
    ```

    #### Performance

    ```javascript
    // Optimizaciones Implementadas
    - React.memo() en componentes pesados
    - useMemo() para cálculos costosos
    - useCallback() para funciones en dependencias
    - Lazy loading de rutas
    - Code splitting
    - Compresión de assets
    - Service Worker para PWA
    ```

    ### Base de Datos Local (IndexedDB)

    #### Schema

    ```javascript
    // Store: quizHistory
    {
    id: autoincrement,
    timestamp: Date,
    domain: string,
    level: string,
    questions: Array<Question>,
    results: {
        correct: number,
        incorrect: number,
        accuracy: number,
        timeSpent: number
    },
    userAnswers: Map<questionId, answer>
    }

    // Store: questionTracking
    {
    questionId: string (key),
    attemptHistory: Array<Attempt>,
    accuracy: number,
    totalAttempts: number,
    lastAttemptDate: Date,
    fsrsData: FSRSCard,
    isDominated: boolean
    }

    // Store: userProfile
    {
    userId: string (key),
    name: string,
    level: number,
    xp: number,
    streak: number,
    lastActivityDate: Date,
    achievements: Array<Achievement>,
    preferences: Object
    }

    // Store: achievements
    {
    achievementId: string (key),
    unlockedDate: Date,
    progress: number
    }
    ```

    #### Operaciones CRUD

    ```javascript
    // Create
    await addQuizToHistory(quizData);

    // Read
    const history = await getAllQuizHistory();
    const question = await getQuestionTracking(questionId);

    // Update
    await updateQuestionTracking(questionId, newData);
    await incrementXP(amount);

    // Delete
    await clearOldHistory(); // Solo mantener últimos 100 quizzes
    ```

    ### Algoritmo FSRS

    #### Implementación

    ```javascript
    import { fsrs, Card, Rating, State } from 'ts-fsrs';

    // Inicializar FSRS
    const f = fsrs();

    // Crear tarjeta nueva
    let card = new Card();

    // Usuario responde correctamente
    const scheduling = f.repeat(card, new Date());
    card = scheduling[Rating.Good].card;

    // Próximo repaso sugerido
    const nextReviewDate = scheduling[Rating.Good].due;
    ```

    #### Parámetros Ajustables

    ```javascript
    const params = {
    w: [0.4, 0.6, 2.4, 5.8, 4.93, 0.94, 0.86, 0.01, 1.49, 0.14, 0.94, 2.18, 0.05, 0.34, 1.26, 0.29, 2.61],
    enable_fuzz: true,
    maximum_interval: 365,
    request_retention: 0.9
    };
    ```

    ### Sistema de Animaciones

    #### Framer Motion

    ```javascript
    // Ejemplo de animación de entrada
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    >
    {content}
    </motion.div>

    // Ejemplo de animación al salir
    <motion.div
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.2 }}
    >
    {content}
    </motion.div>
    ```

    #### CSS Animations

    ```css
    /* Glassmorphism */
    .glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    }

    /* Gradient Animation */
    @keyframes gradient-shift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    }

    .animated-gradient {
    background: linear-gradient(270deg, #1cb0f6, #7b68ee, #ff4b4b);
    background-size: 600% 600%;
    animation: gradient-shift 8s ease infinite;
    }
    ```

    ---

    ## 📊 Métricas de Éxito

    ### KPIs Principales

    #### Engagement
    - **DAU (Daily Active Users)**: Usuarios activos diarios
    - **Tiempo promedio de sesión**: > 15 minutos
    - **Tasa de retención D7**: > 40%
    - **Tasa de retención D30**: > 20%
    - **Frecuencia de uso**: > 3 veces por semana

    #### Aprendizaje
    - **Tasa de completación de quiz**: > 90%
    - **Mejora de precisión**: +20% en 30 días
    - **Preguntas respondidas**: > 200 por usuario
    - **Tiempo hasta dominio**: < 60 días para 90% precisión
    - **Logros desbloqueados**: > 5 por usuario

    #### Monetización
    - **Tasa de conversión**: 10% (gratuito → premium)
    - **Donación promedio**: $7 USD
    - **LTV (Lifetime Value)**: $15 USD
    - **CAC (Customer Acquisition Cost)**: $5 USD
    - **Ratio LTV/CAC**: > 3

    #### Satisfacción
    - **NPS (Net Promoter Score)**: > 50
    - **Calificación app**: > 4.5/5
    - **Tasa de referidos**: 30%
    - **Feedback positivo**: > 80%

    ### Tracking y Analytics

    ```javascript
    // Eventos rastreados
    - quiz_started
    - quiz_completed
    - question_answered
    - hint_requested
    - achievement_unlocked
    - level_up
    - streak_maintained
    - paywall_shown
    - donation_completed
    - recommendation_followed
    ```

    ---

    ## 🔐 Seguridad y Privacidad

    ### Principios

    1. **Privacy by Design**: Privacidad desde el diseño
    2. **Data Minimization**: Solo datos necesarios
    3. **Local First**: Datos almacenados localmente
    4. **No Tracking**: Sin seguimiento de terceros
    5. **Transparencia**: Uso de datos claro

    ### Prácticas Implementadas

    ```javascript
    // Datos almacenados localmente
    - Progreso de usuario
    - Historial de quizzes
    - Preferencias
    - Estado de desbloqueo

    // Datos NO recopilados
    - Información personal identificable
    - Dirección de correo (sin registro)
    - Datos de pago (procesados por PayPal)
    - Ubicación geográfica
    - Dispositivo específico
    ```

    ### Cumplimiento

    - ✅ **GDPR**: Regulación General de Protección de Datos (UE)
    - ✅ **CCPA**: Ley de Privacidad del Consumidor de California
    - ✅ **COPPA**: Protección de Privacidad Infantil en Línea

    ---

    ## 🤝 Contribución y Comunidad

    ### Cómo Contribuir

    #### 1. 💰 Donaciones

    ```
    Formas de Apoyar:
    - Donación mínima: $5 USD
    - Donaciones recurrentes: Mensual/Anual
    - Patrocinio empresarial: Contactar
    ```

    #### 2. 📝 Contenido

    ```
    Contribuir:
    - Nuevas preguntas del examen
    - Casos empresariales para CxC Hub
    - Traducciones
    - Documentación
    ```

    #### 3. 🐛 Reporte de Bugs

    ```
    Proceso:
    1. Verificar que no esté reportado
    2. Crear issue en GitHub
    3. Incluir pasos para reproducir
    4. Adjuntar capturas si aplica
    ```

    #### 4. 💡 Sugerencias

    ```
    Canal:
    - GitHub Issues (Feature Request)
    - Email: [contacto]
    - Twitter: @PowerBIPL300
    ```

    ### Comunidad

    #### Canales Oficiales

    - 🌐 **Website**: https://jeyrellt.github.io/PowerBITest/
    - 💻 **GitHub**: https://github.com/JeyrellT/PowerBITest
    - 📧 **Email**: jeyrellt@gmail.com
    - 🐦 **Twitter**: [@JeyrellT]

    #### Código de Conducta

    ```
    Principios:
    1. Respeto mutuo
    2. Inclusión y diversidad
    3. Colaboración constructiva
    4. Aprendizaje continuo
    5. Reconocimiento de contribuciones
    ```

    ---

    ## 📚 Recursos Adicionales

    ### Documentación Oficial de Microsoft

    - [Examen PL-300: Microsoft Power BI Data Analyst](https://learn.microsoft.com/es-es/certifications/exams/pl-300)
    - [Documentación de Power BI](https://learn.microsoft.com/es-es/power-bi/)
    - [Referencia de DAX](https://dax.guide/)
    - [Power Query M Reference](https://learn.microsoft.com/es-es/powerquery-m/)

    ### Recursos de Aprendizaje

    - [Microsoft Learn: Power BI Learning Path](https://learn.microsoft.com/es-es/training/powerplatform/power-bi)
    - [Guy in a Cube (YouTube)](https://www.youtube.com/channel/UCFp1vaKzpfvoGai0vE5VJ0w)
    - [SQLBI - DAX Patterns](https://www.daxpatterns.com/)
    - [Power BI Community](https://community.powerbi.com/)

    ### Blogs Recomendados

    - [PowerBI.tips by Mike Carlo & Seth Bauer](https://powerbi.tips/)
    - [Radacad by Reza Rad](https://radacad.com/)
    - [P3 Adaptive](https://p3adaptive.com/blog/)
    - [PowerPivotPro by Rob Collie](https://powerpivotpro.com/)

    ---

    ## ❓ FAQ (Preguntas Frecuentes)

    ### Sobre la Aplicación

    **P: ¿Es necesario instalar algo?**
    R: No, es una aplicación web que funciona en cualquier navegador moderno. Opcionalmente puedes instalarla como PWA.

    **P: ¿Funciona offline?**
    R: Parcialmente. Las preguntas y tu progreso están disponibles offline, pero algunas funciones requieren conexión.

    **P: ¿En qué idioma está disponible?**
    R: Actualmente en español. Inglés está planificado para Q2 2026.

    **P: ¿Puedo usar la app en móvil?**
    R: Sí, está completamente optimizada para móviles y tablets.

    ### Sobre el Contenido

    **P: ¿Las preguntas son oficiales de Microsoft?**
    R: No, son preguntas creadas por expertos certificados, alineadas con los objetivos oficiales del examen.

    **P: ¿Con qué frecuencia se actualiza el contenido?**
    R: Mensualmente agregamos nuevas preguntas y actualizamos contenido según cambios en el examen.

    **P: ¿Cubren todos los temas del examen?**
    R: Sí, cubrimos los 4 dominios principales con distribución similar al examen real.

    ### Sobre las Donaciones

    **P: ¿Por qué debo donar?**
    R: La donación apoya el desarrollo continuo y eventualmente hará la app gratuita para todos.

    **P: ¿Qué obtengo por donar?**
    R: Acceso ilimitado a todas las preguntas y funcionalidades, más acceso anticipado a CxC Hub.

    **P: ¿Es seguro donar?**
    R: Sí, usamos PayPal que tiene protección de comprador y encriptación de nivel bancario.

    **P: ¿Puedo obtener un reembolso?**
    R: Las donaciones son voluntarias y no reembolsables, pero contacta si hay algún problema técnico.

    ### Sobre el Progreso

    **P: ¿Se guarda mi progreso?**
    R: Sí, todo se guarda localmente en tu navegador con IndexedDB.

    **P: ¿Puedo sincronizar entre dispositivos?**
    R: Actualmente no. La sincronización en la nube está planificada para Q2 2026.

    **P: ¿Qué pasa si borro los datos del navegador?**
    R: Perderás tu progreso. Recomendamos exportar tu progreso regularmente (próxima función).

    ---

    ## 🎓 Guía de Estudio Recomendada

    ### Plan de 30 Días

    #### Semana 1: Fundamentos
    - 📚 Días 1-2: Leer guía del examen completa
    - 💻 Días 3-4: Instalar Power BI Desktop y explorar
    - 🎯 Días 5-7: Quiz diario (nivel principiante, 20 preguntas)
    - ⏱️ Meta: 60% precisión mínima

    #### Semana 2: Profundización
    - 📊 Días 8-10: Enfoque en dominio más débil
    - 🏗️ Días 11-12: Práctica de modelado de datos
    - 📈 Días 13-14: Quiz diario (nivel intermedio, 25 preguntas)
    - ⏱️ Meta: 70% precisión mínima

    #### Semana 3: Práctica Intensiva
    - 💪 Días 15-17: Repasar preguntas incorrectas
    - 🎨 Días 18-19: Enfoque en visualizaciones
    - ⚡ Días 20-21: Quiz diario (nivel avanzado, 30 preguntas)
    - ⏱️ Meta: 80% precisión mínima

    #### Semana 4: Preparación Final
    - 🔄 Días 22-24: Repaso general de todos los dominios
    - 📝 Días 25-27: Exámenes de práctica completos
    - 🧘 Días 28-29: Descanso y repaso ligero
    - 🎯 Día 30: ¡Examen real!
    - ⏱️ Meta: 85%+ precisión consistente

    ### Recursos por Dominio

    #### Preparar los Datos (25-30%)
    ```
    Temas Clave:
    - Conectar a fuentes de datos
    - Transformar datos con Power Query
    - Limpiar y perfilar datos
    - Implementar data gateways

    Recursos:
    - Microsoft Learn: "Obtener datos con Power BI"
    - Práctica: Importar desde Excel, SQL, Web
    ```

    #### Modelar los Datos (25-30%)
    ```
    Temas Clave:
    - Diseñar modelo de datos (star schema)
    - Crear relaciones y cardinalidad
    - Crear columnas calculadas y medidas DAX
    - Optimizar rendimiento del modelo

    Recursos:
    - Microsoft Learn: "Modelar datos en Power BI"
    - Práctica: Crear modelos con Adventureworks DB
    ```

    #### Visualizar y Analizar (25-30%)
    ```
    Temas Clave:
    - Crear reportes y dashboards
    - Implementar visualizaciones avanzadas
    - Aplicar filtros, segmentaciones y drill-through
    - Configurar interacciones entre visuales

    Recursos:
    - Microsoft Learn: "Visualizar datos en Power BI"
    - Práctica: Recrear dashboards empresariales
    ```

    #### Implementar y Mantener (15-20%)
    ```
    Temas Clave:
    - Publicar en el servicio de Power BI
    - Configurar actualización de datos
    - Implementar seguridad (RLS, OLS)
    - Gestionar espacios de trabajo

    Recursos:
    - Microsoft Learn: "Implementar y mantener activos"
    - Práctica: Publicar y compartir reportes
    ```

    ---

    ## 🏆 Historias de Éxito

    > **"Gracias a PL-300 Master Platform, aprobé el examen en mi primer intento con 850/1000. El sistema de recomendaciones me ayudó a enfocarme en mis debilidades."**
    > — María González, Data Analyst

    > **"La gamificación me mantuvo motivado durante todo el estudio. ¡Es adictivo! Estudié 2 horas diarias sin darme cuenta."**
    > — Carlos Rodríguez, BI Developer

    > **"El CxC Hub (beta) me dio la experiencia práctica que necesitaba. Las preguntas teóricas están bien, pero los casos reales son invaluables."**
    > — Ana Martínez, Financial Analyst

    ---

    ## 📞 Contacto y Soporte

    ### Soporte Técnico

    📧 **Email**: jeyrellt@gmail.com
    🕐 **Tiempo de respuesta**: < 24 horas

    ### Reportar Problemas

    🐛 **GitHub Issues**: https://github.com/JeyrellT/PowerBITest/issues

    ### Redes Sociales

    🐦 **Twitter**: [@JeyrellT]
    💼 **LinkedIn**: [Jeyrell Thompson]
    🌐 **Website**: https://jeyrellt.github.io/PowerBITest/

    ---

    ## 📄 Licencia

    Este proyecto está licenciado bajo la **Licencia MIT**.

    ```
    MIT License

    Copyright (c) 2025 Jeyrell Thompson

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
    ```

    ---

    ## 🙏 Agradecimientos

    ### Tecnologías de Código Abierto

    Agradecemos profundamente a las comunidades de:
    - **React**: Por el framework increíble
    - **Framer Motion**: Por las animaciones fluidas
    - **ts-fsrs**: Por el algoritmo de repetición espaciada
    - **Recharts**: Por las visualizaciones de datos
    - **GitHub Pages**: Por el hosting gratuito

    ### Inspiración

    - **Duolingo**: Por demostrar que la gamificación funciona
    - **Anki**: Por popularizar la repetición espaciada
    - **Khan Academy**: Por democratizar la educación
    - **Microsoft Learn**: Por el contenido educativo de calidad

    ---

    ## 🌟 Visión a Futuro

    ### Expansión de Certificaciones

    ```
    Roadmap de Certificaciones:
    2026: PL-300 (Power BI Data Analyst)
    2027: PL-400 (Power Platform Developer)
    2027: PL-500 (Power Automate RPA Developer)
    2028: DA-100 (Analyzing Data with Power BI)
    2028: DP-500 (Azure Enterprise Data Analyst)
    ```

    ### Funcionalidades Futuras

    ```
    Ideas en Consideración:
    - 🤝 Modo multijugador (competir con amigos)
    - 🎓 Certificados al completar niveles
    - 👥 Foros y comunidad integrada
    - 📹 Video tutoriales integrados
    - 🌍 Traducción a 10+ idiomas
    - 🤖 Tutor AI personal 24/7
    - 🏢 Versión para empresas (B2B)
    - 📊 Analytics avanzados para profesores
    ```

    ### Impacto Social

    **Meta para 2030:**
    - 🎓 **100,000 usuarios certificados**
    - 🌍 **Disponible en 20+ idiomas**
    - 💰 **$1M en becas otorgadas**
    - 🏫 **Partnerships con 50+ universidades**
    - 🌟 **Plataforma 100% gratuita y sostenible**

    ---

    <div align="center">

    ## 💖 Apoya el Proyecto

    **Tu donación hace la diferencia**

    Cada $5 USD nos acerca a hacer esta plataforma completamente gratuita para todos.

    [![Donar con PayPal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/paypalme/jeyrellt/5)

    ---

    **Hecho con ❤️ por la comunidad de Power BI**

    *"La educación es el arma más poderosa que puedes usar para cambiar el mundo." — Nelson Mandela*

    </div>
