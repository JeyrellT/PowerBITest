import React, { createContext, useContext, useState, useEffect } from 'react';

const QUESTION_LIMIT = 30;
const STORAGE_KEY_COUNT = 'answered_questions_count';
const STORAGE_KEY_UNLOCKED = 'app_unlocked';

const PaywallContext = createContext();

export const PaywallProvider = ({ children }) => {
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

    console.log(`📊 Preguntas respondidas: ${newCount}/${QUESTION_LIMIT}`);

    // Mostrar paywall al alcanzar el límite
    if (newCount >= QUESTION_LIMIT) {
      console.log('🔒 Límite alcanzado - Mostrando paywall');
      setShouldShowPaywall(true);
    }
  };

  // Desbloquear aplicación con código
  const unlockApp = () => {
    console.log('🔓 Aplicación desbloqueada');
    setIsUnlocked(true);
    setShouldShowPaywall(false);
    localStorage.setItem(STORAGE_KEY_UNLOCKED, 'true');
    localStorage.setItem('unlock_date', new Date().toISOString());
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
    console.log('🔄 Contador reiniciado');
    setAnsweredCount(0);
    setShouldShowPaywall(false);
    localStorage.setItem(STORAGE_KEY_COUNT, '0');
    // NO reiniciar el unlock status
  };

  const value = {
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

  return (
    <PaywallContext.Provider value={value}>
      {children}
    </PaywallContext.Provider>
  );
};

export const usePaywall = () => {
  const context = useContext(PaywallContext);
  if (!context) {
    throw new Error('usePaywall debe ser usado dentro de PaywallProvider');
  }
  return context;
};

export default PaywallContext;
