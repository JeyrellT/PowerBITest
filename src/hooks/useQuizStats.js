import { useState, useEffect, useRef, useContext } from 'react';
import { CxCProgressContext } from '../contexts/CxCProgressContext';

/**
 * Hook personalizado para obtener estadísticas de quizzes sin duplicación
 * Implementa deduplicación basada en historial y throttling de actualizaciones
 */
export const useQuizStats = () => {
  const { progress, getStats } = useContext(CxCProgressContext);
  const [stats, setStats] = useState(null);
  const lastUpdateTime = useRef(0);
  const updateTimeoutRef = useRef(null);

  useEffect(() => {
    // ✅ Evitar actualizaciones muy frecuentes (throttling)
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateTime.current;
    
    if (timeSinceLastUpdate < 500) {
      // ✅ Programar actualización diferida
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      
      updateTimeoutRef.current = setTimeout(() => {
        lastUpdateTime.current = Date.now();
        updateStats();
      }, 500 - timeSinceLastUpdate);
      
      return;
    }

    lastUpdateTime.current = now;
    updateStats();

    // Cleanup
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress?.quizzesTaken, progress?.totalPoints, progress?.history?.length]);

  const updateStats = () => {
    if (!progress) {
      setStats(null);
      return;
    }

    // ✅ Obtener estadísticas con deduplicación
    const currentStats = getStats();
    
    // ✅ Verificar integridad de datos y eliminar duplicados del historial
    const history = progress?.history || [];
    const uniqueQuizzes = new Map();
    
    history.forEach(item => {
      if (item.type === 'quiz') {
        // ✅ Crear clave única basada en timestamp redondeado a segundos
        // Esto agrupa quizzes que ocurrieron en el mismo segundo
        const timestamp = new Date(item.completedAt).getTime();
        const roundedTimestamp = Math.floor(timestamp / 1000) * 1000;
        const key = `${item.questions}_${item.correctAnswers}_${roundedTimestamp}`;
        
        // ✅ Guardar solo el primero de cada grupo (el más reciente si hay duplicados)
        if (!uniqueQuizzes.has(key)) {
          uniqueQuizzes.set(key, item);
        }
      }
    });

    // ✅ Calcular estadísticas reales basadas en quizzes únicos
    const uniqueQuizzesArray = Array.from(uniqueQuizzes.values());
    const totalUniqueQuizzes = uniqueQuizzesArray.length;
    
    // ✅ Calcular puntos y XP reales sumando solo quizzes únicos
    const realTotalPoints = uniqueQuizzesArray.reduce((sum, quiz) => sum + (quiz.points || 0), 0);
    const realTotalXP = uniqueQuizzesArray.reduce((sum, quiz) => sum + (quiz.xp || 0), 0);

    setStats({
      ...currentStats,
      quizzesTaken: totalUniqueQuizzes,
      realHistory: uniqueQuizzesArray,
      realTotalPoints,
      realTotalXP,
      // ✅ Indicador de si hay duplicados
      hasDuplicates: totalUniqueQuizzes < history.filter(h => h.type === 'quiz').length,
      duplicatesCount: history.filter(h => h.type === 'quiz').length - totalUniqueQuizzes
    });
  };

  return stats;
};

/**
 * Hook para detectar y reportar duplicados en el historial
 */
export const useQuizDuplicateDetection = () => {
  const { progress } = useContext(CxCProgressContext);
  const [duplicateReport, setDuplicateReport] = useState(null);

  useEffect(() => {
    if (!progress?.history) {
      setDuplicateReport(null);
      return;
    }

    const history = progress.history.filter(h => h.type === 'quiz');
    const seen = new Map();
    const duplicates = [];

    history.forEach((item, index) => {
      const timestamp = new Date(item.completedAt).getTime();
      const roundedTimestamp = Math.floor(timestamp / 1000) * 1000;
      const key = `${item.questions}_${item.correctAnswers}_${roundedTimestamp}`;

      if (seen.has(key)) {
        duplicates.push({
          original: seen.get(key),
          duplicate: { ...item, index }
        });
      } else {
        seen.set(key, { ...item, index });
      }
    });

    if (duplicates.length > 0) {
      console.warn('🔍 Duplicados detectados en historial:', duplicates);
      setDuplicateReport({
        count: duplicates.length,
        duplicates,
        timestamp: Date.now()
      });
    } else {
      setDuplicateReport(null);
    }
  }, [progress?.history]);

  return duplicateReport;
};
