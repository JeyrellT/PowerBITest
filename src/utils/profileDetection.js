/**
 * Detecta y determina el perfil del usuario basado en sus respuestas del onboarding
 */

export const detectUserProfile = (userData) => {
  const { experienceLevel, technicalAnswers, technicalScore, technicalAccuracy } = userData;

  // Calcular nivel ajustado basado en respuestas técnicas
  let adjustedLevel = experienceLevel;
  
  if (experienceLevel === 'basico' && technicalAccuracy >= 80) {
    adjustedLevel = 'intermedio';
    console.log('📈 Usuario ajustado a intermedio por alto desempeño técnico');
  } else if (experienceLevel === 'avanzado' && technicalAccuracy < 50) {
    adjustedLevel = 'intermedio';
    console.log('📉 Usuario ajustado a intermedio por bajo desempeño técnico');
  }

  // Configuración personalizada según nivel
  const profileConfigs = {
    basico: {
      startingDifficulty: 'principiante',
      recommendedDomain: 'preparar-datos',
      questionCount: 15,
      timeLimit: null,
      showHints: true,
      showExplanations: 'immediate',
      includeExcelComparisons: true,
      adaptiveThreshold: 0.7
    },
    intermedio: {
      startingDifficulty: 'intermedio',
      recommendedDomain: 'todos',
      questionCount: 25,
      timeLimit: 45 * 60,
      showHints: true,
      showExplanations: 'immediate',
      includeExcelComparisons: false,
      adaptiveThreshold: 0.75
    },
    avanzado: {
      startingDifficulty: 'avanzado',
      recommendedDomain: 'todos',
      questionCount: 40,
      timeLimit: 90 * 60,
      showHints: false,
      showExplanations: 'end',
      includeExcelComparisons: false,
      adaptiveThreshold: 0.8
    }
  };

  const config = profileConfigs[adjustedLevel];
  const messages = generatePersonalizedMessages(adjustedLevel, technicalAccuracy);
  const focusAreas = identifyFocusAreas(technicalAnswers, adjustedLevel);

  return {
    originalLevel: experienceLevel,
    detectedLevel: adjustedLevel,
    technicalScore: technicalScore,
    technicalAccuracy: technicalAccuracy,
    config: config,
    messages: messages,
    focusAreas: focusAreas,
    timestamp: new Date().toISOString()
  };
};

const generatePersonalizedMessages = (level, accuracy) => {
  const baseMessages = {
    basico: {
      welcome: '¡Bienvenido al mundo de Power BI!',
      motivation: 'Tu experiencia con Excel es una excelente base. Vamos a construir desde ahí.',
      tip: 'Consejo: No te apresures. Lee cada explicación cuidadosamente.'
    },
    intermedio: {
      welcome: '¡Excelente! Ya tienes las bases.',
      motivation: 'Ahora profundizaremos en DAX y modelado avanzado.',
      tip: 'Consejo: Presta atención a las mejores prácticas y patrones comunes.'
    },
    avanzado: {
      welcome: '¡Estás listo para el desafío!',
      motivation: 'Simularemos el examen real PL-300.',
      tip: 'Consejo: Administra tu tiempo y lee las preguntas con cuidado.'
    }
  };

  const messages = { ...baseMessages[level] };

  if (accuracy >= 80) {
    messages.performance = '¡Impresionante! Tu desempeño técnico es excelente.';
  } else if (accuracy >= 60) {
    messages.performance = 'Buen trabajo. Con práctica llegarás lejos.';
  } else {
    messages.performance = 'No te preocupes, todos empezamos así. ¡Vamos a aprender juntos!';
  }

  return messages;
};

const identifyFocusAreas = (technicalAnswers, level) => {
  if (!technicalAnswers || technicalAnswers.length === 0) {
    return [];
  }

  const incorrectAnswers = technicalAnswers.filter(ans => !ans.correct);
  
  const areaMapping = {
    'q1_basic': 'Conceptos básicos de BI',
    'q2_basic': 'Visualizaciones',
    'q1_inter': 'DAX - Columnas vs Medidas',
    'q2_inter': 'Modelado de datos',
    'q1_adv': 'DAX Avanzado - Context Transition',
    'q2_adv': 'Optimización y Performance'
  };

  const focusAreas = incorrectAnswers
    .map(ans => areaMapping[ans.questionId])
    .filter(area => area !== undefined);

  return [...new Set(focusAreas)];
};

export const getSavedProfile = () => {
  try {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : null;
  } catch (error) {
    console.error('Error al recuperar perfil:', error);
    return null;
  }
};

export const updateProfileBasedOnPerformance = (currentProfile, quizResults) => {
  const accuracy = quizResults.correctAnswers / quizResults.totalQuestions;
  let newLevel = currentProfile.detectedLevel;

  if (currentProfile.detectedLevel === 'basico' && accuracy >= 0.85) {
    newLevel = 'intermedio';
  } else if (currentProfile.detectedLevel === 'intermedio' && accuracy >= 0.85) {
    newLevel = 'avanzado';
  } else if (currentProfile.detectedLevel === 'avanzado' && accuracy < 0.5) {
    newLevel = 'intermedio';
  } else if (currentProfile.detectedLevel === 'intermedio' && accuracy < 0.4) {
    newLevel = 'basico';
  }

  const updatedProfile = {
    ...currentProfile,
    detectedLevel: newLevel,
    lastQuizResults: quizResults,
    lastUpdated: new Date().toISOString()
  };

  localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
  return updatedProfile;
};
