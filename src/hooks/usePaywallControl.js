import { useState, useEffect } from 'react';

const QUESTION_LIMIT = 30;
const STORAGE_KEY_COUNT = 'answered_questions_count';
const STORAGE_KEY_UNLOCKED = 'app_unlocked';

/**
 * Hook para gestionar el paywall de donación
 * Rastrea las preguntas respondidas y controla el acceso
 */
export const usePaywallControl = () => {
  const [answeredCount, setAnsweredCount] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [shouldShowPaywall, setShouldShowPaywall] = useState(false);

  // Inicializar estado desde localStorage
  useEffect(() => {
    const savedCount = parseInt(localStorage.getItem(STORAGE_KEY_COUNT) || '0', 10);
    const unlocked = localStorage.getItem(STORAGE_KEY_UNLOCKED) === 'true';
    
    setAnsweredCount(savedCount);
    setIsUnlocked(unlocked);
    
    // Si ya alcanzó el límite y no está desbloqueado, mostrar paywall
    if (savedCount >= QUESTION_LIMIT && !unlocked) {
      setShouldShowPaywall(true);
    }
  }, []);

  // Incrementar contador de preguntas respondidas
  const incrementAnsweredCount = () => {
    if (isUnlocked) {
      return; // Si está desbloqueado, no incrementar ni mostrar paywall
    }

    const newCount = answeredCount + 1;
    setAnsweredCount(newCount);
    localStorage.setItem(STORAGE_KEY_COUNT, newCount.toString());

    // Mostrar paywall al alcanzar el límite
    if (newCount >= QUESTION_LIMIT) {
      setShouldShowPaywall(true);
    }
  };

  // Desbloquear aplicación con código
  const unlockApp = () => {
    setIsUnlocked(true);
    setShouldShowPaywall(false);
    localStorage.setItem(STORAGE_KEY_UNLOCKED, 'true');
  };

  // Verificar si puede responder más preguntas
  const canAnswerQuestions = () => {
    return isUnlocked || answeredCount < QUESTION_LIMIT;
  };

  // Obtener preguntas restantes
  const getRemainingQuestions = () => {
    if (isUnlocked) {
      return Infinity;
    }
    return Math.max(0, QUESTION_LIMIT - answeredCount);
  };

  // Reiniciar contador (solo para desarrollo/testing)
  const resetCounter = () => {
    setAnsweredCount(0);
    setShouldShowPaywall(false);
    localStorage.setItem(STORAGE_KEY_COUNT, '0');
  };

  return {
    answeredCount,
    isUnlocked,
    shouldShowPaywall,
    incrementAnsweredCount,
    unlockApp,
    canAnswerQuestions,
    getRemainingQuestions,
    resetCounter,
    questionLimit: QUESTION_LIMIT
  };
};

export default usePaywallControl;
