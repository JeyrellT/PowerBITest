import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useCxCProgress } from './CxCProgressContext';

export const GameStateContext = createContext();

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState debe usarse dentro de GameStateProvider');
  }
  return context;
};

// Configuración de rangos
const RANKS = {
  BRONCE: { name: 'Bronce', min: 0, max: 60, color: '#CD7F32' },
  PLATA: { name: 'Plata', min: 61, max: 80, color: '#C0C0C0' },
  ORO: { name: 'Oro', min: 81, max: 90, color: '#FFD700' },
  PLATINO: { name: 'Platino', min: 91, max: 100, color: '#E5E4E2' }
};

// Configuración de insignias
const BADGES = {
  factura_impecable: {
    id: 'factura_impecable',
    name: 'Factura Impecable',
    description: 'Completar misión 1.1 con Platino sin ayuda',
    icon: '✓'
  },
  conciliador_ninja: {
    id: 'conciliador_ninja',
    name: 'Conciliador Ninja',
    description: 'Match difuso ≥80% en misión 2.2',
    icon: '⚡'
  },
  maestro_datasets: {
    id: 'maestro_datasets',
    name: 'Maestro de Datasets',
    description: 'Limpiar dataset (2.1) con ≥90% reducción de errores',
    icon: '🗂️'
  },
  embajador_global: {
    id: 'embajador_global',
    name: 'Embajador Global',
    description: 'Presentación final (3.3) Platino',
    icon: '🌍'
  },
  cfo_ready: {
    id: 'cfo_ready',
    name: 'CFO Ready',
    description: 'Responder Q&A 3.3 ≥90%',
    icon: '👔'
  },
  sin_ayuda_acto1: {
    id: 'sin_ayuda_acto1',
    name: 'Auto-gestor',
    description: 'Completar Acto 1 sin ayudas',
    icon: '💪'
  },
  ayuda_colaborativa: {
    id: 'ayuda_colaborativa',
    name: 'Trabajo en Equipo',
    description: 'Usar colaboración en 3 actos diferentes',
    icon: '🤝'
  },
  speed_runner: {
    id: 'speed_runner',
    name: 'Ágil',
    description: 'Completar misión bajo tiempo objetivo sin errores',
    icon: '⚡'
  }
};

export const GameStateProvider = ({ children }) => {
  const { progress, unlockBadge, unlockAchievement } = useCxCProgress();
  const [helpStock, setHelpStock] = useState(3);
  const [helpCooldown, setHelpCooldown] = useState(0);
  const [collabCredits, setCollabCredits] = useState({ acto1: 1, acto2: 1, acto3: 1 });

  // Calcular rango actual basado en puntos
  const getCurrentRank = useCallback((points) => {
    const avgScore = points || 0;
    
    for (const [key, rank] of Object.entries(RANKS)) {
      if (avgScore >= rank.min && avgScore <= rank.max) {
        return { key, ...rank };
      }
    }
    return { key: 'BRONCE', ...RANKS.BRONCE };
  }, []);

  // Cooldown timer
  useEffect(() => {
    if (helpCooldown <= 0) return;

    const timer = setInterval(() => {
      setHelpCooldown(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [helpCooldown]);

  const checkAndUnlockBadges = useCallback(() => {
    if (!progress?.missions) return;

    // Factura Impecable
    const m11 = progress.missions['acto1_m1_factura'];
    if (m11?.grade === 'Platino' && (!m11.helpUsed || m11.helpUsed.length === 0)) {
      unlockBadge('factura_impecable');
    }

    // Auto-gestor (Acto 1 sin ayudas)
    const acto1Missions = ['acto1_m1_factura', 'acto1_m2_cash', 'acto1_m3_aging'];
    const acto1Complete = acto1Missions.every(mId => {
      const mission = progress.missions[mId];
      return mission?.status === 'completed' && (!mission.helpUsed || mission.helpUsed.length === 0);
    });
    if (acto1Complete) {
      unlockBadge('sin_ayuda_acto1');
      unlockAchievement('sin_ayuda_acto1');
    }

    // Trabajo en equipo (colaboración en 3 actos)
    const actosWithCollab = new Set();
    Object.keys(progress.missions).forEach(mId => {
      const mission = progress.missions[mId];
      if (mission.collab && mission.collab.length > 0) {
        const actoNum = parseInt(mId.match(/acto(\d)/)?.[1]);
        if (actoNum) actosWithCollab.add(actoNum);
      }
    });
    if (actosWithCollab.size >= 3) {
      unlockBadge('ayuda_colaborativa');
    }
  }, [progress, unlockBadge, unlockAchievement]);

  // Verificar logros al cambiar progreso
  useEffect(() => {
    if (!progress) return;

    checkAndUnlockBadges();
  }, [progress, checkAndUnlockBadges]);

  const requestHelp = useCallback((type, cost, cooldownSeconds = 300) => {
    if (helpStock <= 0) {
      return { success: false, message: 'No tienes ayudas disponibles' };
    }

    if (helpCooldown > 0) {
      return { 
        success: false, 
        message: `Debes esperar ${Math.ceil(helpCooldown / 60)} minutos` 
      };
    }

    if (progress?.points?.available < cost) {
      return { success: false, message: 'No tienes suficientes puntos' };
    }

    setHelpStock(prev => prev - 1);
    setHelpCooldown(cooldownSeconds);

    return { success: true, remainingStock: helpStock - 1 };
  }, [helpStock, helpCooldown, progress?.points?.available]);

  const rechargeHelp = useCallback(() => {
    setHelpStock(prev => prev + 1);
  }, []);

  const requestCollab = useCallback((acto) => {
    const actoKey = `acto${acto}`;
    if (!collabCredits[actoKey] || collabCredits[actoKey] <= 0) {
      return { success: false, message: 'No tienes créditos de colaboración para este acto' };
    }

    setCollabCredits(prev => ({
      ...prev,
      [actoKey]: prev[actoKey] - 1
    }));

    return { success: true, remainingCredits: collabCredits[actoKey] - 1 };
  }, [collabCredits]);

  const rechargeCollabCredit = useCallback((acto) => {
    const actoKey = `acto${acto}`;
    setCollabCredits(prev => ({
      ...prev,
      [actoKey]: (prev[actoKey] || 0) + 1
    }));
  }, []);

  const calculateScore = useCallback((baseScore, helpUsed = [], timeBonus = false) => {
    let score = baseScore;

    // Penalizaciones por ayudas
    helpUsed.forEach(help => {
      score -= help.cost || 0;
    });

    // Resolución parcial: factor 0.85
    const hasPartialResolution = helpUsed.some(h => h.type === 'resolution');
    if (hasPartialResolution) {
      score *= 0.85;
    }

    // Bonus por tiempo
    if (timeBonus) {
      score *= 1.05;
    }

    // Bonus sin ayudas
    if (helpUsed.length === 0) {
      score *= 1.10;
    }

    return Math.round(score);
  }, []);

  const getGradeFromScore = useCallback((score) => {
    if (score >= 91) return 'Platino';
    if (score >= 81) return 'Oro';
    if (score >= 61) return 'Plata';
    return 'Bronce';
  }, []);

  const value = {
    // Estado
    helpStock,
    helpCooldown,
    collabCredits,
    currentRank: getCurrentRank(progress?.points?.total || 0),
    badges: BADGES,
    ranks: RANKS,
    
    // Métodos
    requestHelp,
    rechargeHelp,
    requestCollab,
    rechargeCollabCredit,
    calculateScore,
    getGradeFromScore,
    getCurrentRank,
    checkAndUnlockBadges
  };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
};
