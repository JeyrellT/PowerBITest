import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { useCxCProgress, ACHIEVEMENT_TYPES, QUESTION_STATUS, CONFIDENCE_LEVELS } from '../contexts/CxCProgressContext';
import { preguntasEjemplo } from '../data/preguntas';
import '../styles/ProfileScreenDuolingo.css';

// Spring animation configs
const springConfig = {
  type: "spring",
  stiffness: 260,
  damping: 20,
  mass: 1
};

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const DOMAIN_LABELS = {
  'preparar-datos': 'Preparar Datos',
  'modelar-datos': 'Modelar Datos',
  'visualizar-analizar': 'Visualizar y Analizar',
  'administrar-asegurar': 'Administrar y Asegurar'
};

const derivedDomainTotals = Object.entries(preguntasEjemplo || {}).reduce((acc, [domain, levels]) => {
  const total = Object.values(levels || {}).reduce((sum, bucket) => sum + (Array.isArray(bucket) ? bucket.length : 0), 0);
  acc[domain] = total;
  return acc;
}, {});

const DOMAIN_TOTAL_QUESTIONS = Object.freeze({
  'preparar-datos': derivedDomainTotals['preparar-datos'] || 25,
  'modelar-datos': derivedDomainTotals['modelar-datos'] || 25,
  'visualizar-analizar': derivedDomainTotals['visualizar-analizar'] || 25,
  'administrar-asegurar': derivedDomainTotals['administrar-asegurar'] || 25
});

const TOTAL_QUESTION_POOL = Object.values(DOMAIN_TOTAL_QUESTIONS).reduce((sum, count) => sum + count, 0);

const CONFIDENCE_LABELS = {
  [CONFIDENCE_LEVELS.NONE]: 'Sin datos',
  [CONFIDENCE_LEVELS.VERY_LOW]: 'Muy baja',
  [CONFIDENCE_LEVELS.LOW]: 'Baja',
  [CONFIDENCE_LEVELS.MEDIUM]: 'Media',
  [CONFIDENCE_LEVELS.HIGH]: 'Alta',
  [CONFIDENCE_LEVELS.VERY_HIGH]: 'Muy alta'
};

const formatConfidence = (confidence) => {
  if (confidence == null || Number.isNaN(confidence)) {
    return 'Sin datos';
  }

  const rounded = Math.round(confidence);
  return CONFIDENCE_LABELS[rounded] || 'En desarrollo';
};

const formatRelativeDate = (isoDate) => {
  if (!isoDate) return 'Sin registrar';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return 'Sin registrar';

  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 'Hoy';
  if (diffDays === 1) return 'Hace 1 día';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
  const diffMonths = Math.floor(diffDays / 30);
  return diffMonths === 1 ? 'Hace 1 mes' : `Hace ${diffMonths} meses`;
};

const formatTimeMs = (ms) => {
  if (!Number.isFinite(ms) || ms <= 0) return 'Sin datos';
  if (ms < 60000) {
    return `${Math.max(1, Math.round(ms / 1000))} s`;
  }
  return `${(ms / 60000).toFixed(1)} min`;
};

// Haptic feedback helper
const haptic = (pattern) => {
  if ('vibrate' in navigator && !prefersReducedMotion) {
    navigator.vibrate(pattern);
  }
};

// Animated counter component
const AnimatedCounter = ({ value, duration = 1000 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const prevValue = useRef(value);
  
  useEffect(() => {
    const controls = animate(prevValue.current, value, {
      duration: duration / 1000,
      onUpdate(latest) {
        setDisplayValue(Math.round(latest));
      }
    });
    
    prevValue.current = value;
    return controls.stop;
  }, [value, duration]);
  
  return <span>{displayValue}</span>;
};

// Particle system component
const ParticleEffect = ({ active, count = 30 }) => {
  if (!active) return null;
  
  return (
    <div className="particle-container">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="particle"
          initial={{ 
            x: 0, 
            y: 0, 
            scale: 0,
            opacity: 1 
          }}
          animate={{ 
            x: (Math.random() - 0.5) * 200,
            y: -Math.random() * 300 - 50,
            scale: [0, 1, 0],
            opacity: [1, 1, 0]
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.02,
            ease: "easeOut"
          }}
          style={{
            position: 'absolute',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: `hsl(${Math.random() * 360}, 100%, 50%)`
          }}
        />
      ))}
    </div>
  );
};

const ProfileScreenDuolingo = ({ onNavigate }) => {
  const { progress, loading } = useCxCProgress();
  const [activeTab, setActiveTab] = useState('overview');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [animateCharts, setAnimateCharts] = useState(false);
  const [expandedAchievement, setExpandedAchievement] = useState(null);
  const [leveledUp, setLeveledUp] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef(null);
  const scrollY = useMotionValue(0);
  const headerBlur = useTransform(scrollY, [0, 100], [0, 10]);
  const headerOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  const levelInfo = useMemo(() => {
    if (!progress) {
      return { level: 1, levelName: 'Novato', xpForNext: 500, percentage: 0 };
    }

    const totalXP = progress.totalXP ?? 0;
    const levels = [
      { level: 1, name: 'Novato', xpRequired: 0, icon: '🌱' },
      { level: 2, name: 'Aprendiz', xpRequired: 500, icon: '📚' },
      { level: 3, name: 'Estudiante', xpRequired: 1200, icon: '🎓' },
      { level: 4, name: 'Experto', xpRequired: 2500, icon: '⭐' },
      { level: 5, name: 'Maestro', xpRequired: 5000, icon: '👑' },
      { level: 6, name: 'Leyenda', xpRequired: 10000, icon: '🏆' }
    ];

    let currentLevel = levels[0];
    let nextLevel = levels[1];

    for (let i = 0; i < levels.length - 1; i++) {
      if (totalXP >= levels[i].xpRequired && totalXP < levels[i + 1].xpRequired) {
        currentLevel = levels[i];
        nextLevel = levels[i + 1];
        break;
      }
      if (totalXP >= levels[levels.length - 1].xpRequired) {
        currentLevel = levels[levels.length - 1];
        nextLevel = levels[levels.length - 1];
      }
    }

    const xpInLevel = totalXP - currentLevel.xpRequired;
    const xpForNext = nextLevel.xpRequired - currentLevel.xpRequired;
    const percentage = (xpInLevel / xpForNext) * 100;

    return {
      level: currentLevel.level,
      levelName: currentLevel.name,
      icon: currentLevel.icon,
      xpInLevel,
      xpForNext,
      percentage: Math.min(percentage, 100)
    };
  }, [progress]);

  useEffect(() => {
    setShowSparkles(true);
    setTimeout(() => setShowSparkles(false), 2000);
    setTimeout(() => setAnimateCharts(true), 300);
    
    // Scroll listener for parallax
    const handleScroll = () => {
      if (containerRef.current) {
        scrollY.set(window.scrollY);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollY]);

  // Mouse position for depth shadows
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Check for level up
  useEffect(() => {
    if (!progress?.totalXP) {
      return undefined;
    }

    const prevLevel = localStorage.getItem('userLevel');
    const currentLevel = levelInfo.level.toString();
    let levelResetTimeout;
    let confettiTimeout;

    if (prevLevel && prevLevel !== currentLevel && parseInt(currentLevel, 10) > parseInt(prevLevel, 10)) {
      setLeveledUp(true);
      setShowConfetti(true);
      haptic([100, 50, 100, 50, 200]);
      levelResetTimeout = setTimeout(() => setLeveledUp(false), 4000);
      confettiTimeout = setTimeout(() => setShowConfetti(false), 4500);
    }

    localStorage.setItem('userLevel', currentLevel);

    return () => {
      if (levelResetTimeout) {
        clearTimeout(levelResetTimeout);
      }
      if (confettiTimeout) {
        clearTimeout(confettiTimeout);
      }
    };
  }, [progress?.totalXP, levelInfo.level]);

  const stats = useMemo(() => {
    if (!progress) return null;

    const questionTracking = progress.questionTracking || {};
    const trackingEntries = Object.entries(questionTracking);

    let uniqueQuestionsAnswered = 0;
    const domainAggregation = {};
    let totalAttemptsFromTracking = 0;
    let correctAttemptsFromTracking = 0;
    let incorrectAttemptsFromTracking = 0;

    trackingEntries.forEach(([, tracking]) => {
      if (!tracking) return;

      const totalAttempts = Number(tracking.totalAttempts || 0);
      if (!Number.isFinite(totalAttempts) || totalAttempts <= 0) {
        return;
      }

      uniqueQuestionsAnswered += 1;

      const correctAttempts = Number(tracking.correctAttempts || 0);
      const incorrectAttemptsRaw = tracking.incorrectAttempts != null
        ? Number(tracking.incorrectAttempts)
        : totalAttempts - correctAttempts;
      const incorrectAttempts = Number.isFinite(incorrectAttemptsRaw)
        ? incorrectAttemptsRaw
        : totalAttempts - correctAttempts;

      totalAttemptsFromTracking += totalAttempts;
      correctAttemptsFromTracking += Math.max(correctAttempts, 0);
      incorrectAttemptsFromTracking += Math.max(incorrectAttempts, 0);

      const domainKey = tracking.domain;
      if (domainKey) {
        if (!domainAggregation[domainKey]) {
          domainAggregation[domainKey] = {
            uniqueAttempted: 0,
            uniqueCorrect: 0,
            uniqueIncorrect: 0,
            totalAttempts: 0,
            correctAttempts: 0,
            incorrectAttempts: 0,
            mastery: 0,
            avgConfidenceSum: 0,
            avgConfidenceCount: 0,
            timeSpent: 0,
            lastAttempt: null
          };
        }

        const domainEntry = domainAggregation[domainKey];

        domainEntry.uniqueAttempted += 1;
        if (correctAttempts > 0) {
          domainEntry.uniqueCorrect += 1;
        } else {
          domainEntry.uniqueIncorrect += 1;
        }

        domainEntry.totalAttempts += totalAttempts;
        domainEntry.correctAttempts += Math.max(correctAttempts, 0);
        domainEntry.incorrectAttempts += Math.max(incorrectAttempts, 0);

        if (tracking.status === QUESTION_STATUS.MASTERED || tracking.status === QUESTION_STATUS.RETIRED) {
          domainEntry.mastery += 1;
        }

        if (typeof tracking.confidenceLevel === 'number') {
          domainEntry.avgConfidenceSum += tracking.confidenceLevel;
          domainEntry.avgConfidenceCount += 1;
        }

        if (Array.isArray(tracking.timestamps) && tracking.timestamps.length > 0) {
          const lastTimestamp = tracking.timestamps[tracking.timestamps.length - 1]?.date;
          if (lastTimestamp) {
            const lastDate = new Date(lastTimestamp);
            if (!Number.isNaN(lastDate.getTime())) {
              if (!domainEntry.lastAttempt || lastDate > domainEntry.lastAttempt) {
                domainEntry.lastAttempt = lastDate;
              }
            }
          }
        } else if (tracking.lastAttemptDate) {
          const lastDate = new Date(tracking.lastAttemptDate);
          if (!Number.isNaN(lastDate.getTime())) {
            if (!domainEntry.lastAttempt || lastDate > domainEntry.lastAttempt) {
              domainEntry.lastAttempt = lastDate;
            }
          }
        }

        if (typeof tracking.averageTimeSpent === 'number' && tracking.averageTimeSpent > 0) {
          domainEntry.timeSpent += tracking.averageTimeSpent * totalAttempts;
        }
      }
    });

    if (uniqueQuestionsAnswered === 0) {
      const answeredQuestions = Array.isArray(progress.answeredQuestions) ? progress.answeredQuestions : [];
      uniqueQuestionsAnswered = answeredQuestions.length;
    }

    let totalAttempts = totalAttemptsFromTracking;
    let correctAttempts = correctAttemptsFromTracking;
    let incorrectAttempts = incorrectAttemptsFromTracking;

    if (totalAttempts === 0) {
      const rawDomainStats = progress.domainStats || {};
      totalAttempts = Object.values(rawDomainStats).reduce(
        (sum, domain) => sum + Number(domain?.attempted ?? domain?.total ?? 0),
        0
      );
      correctAttempts = Object.values(rawDomainStats).reduce(
        (sum, domain) => sum + Number(domain?.correct ?? 0),
        0
      );
      incorrectAttempts = Math.max(totalAttempts - correctAttempts, 0);
    }

    if (totalAttempts === 0) {
      const quizHistory = (progress.history || []).filter((item) => item?.type === 'quiz');
      totalAttempts = quizHistory.reduce(
        (sum, quiz) => sum + Number(quiz?.questions ?? quiz?.totalQuestions ?? 0),
        0
      );
      correctAttempts = quizHistory.reduce(
        (sum, quiz) => sum + Number(quiz?.correctAnswers ?? quiz?.score ?? 0),
        0
      );
      incorrectAttempts = Math.max(totalAttempts - correctAttempts, 0);
    }

    const accuracyOverall = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;

    const rawDomainStats = progress.domainStats || {};
    const domainStats = {};
    const domainKeys = new Set([
      ...Object.keys(DOMAIN_LABELS),
      ...Object.keys(rawDomainStats),
      ...Object.keys(domainAggregation)
    ]);

    domainKeys.forEach((domainKey) => {
      if (!domainKey) return;

      const persisted = rawDomainStats[domainKey] || {};
      const computed = domainAggregation[domainKey] || {
        uniqueAttempted: 0,
        uniqueCorrect: 0,
        uniqueIncorrect: 0,
        totalAttempts: 0,
        correctAttempts: 0,
        incorrectAttempts: 0,
        mastery: 0,
        avgConfidenceSum: 0,
        avgConfidenceCount: 0,
        timeSpent: 0,
        lastAttempt: null
      };

      const uniqueAttempted = computed.uniqueAttempted || 0;
      const uniqueCorrect = computed.uniqueCorrect || 0;
      const uniqueIncorrect = computed.uniqueIncorrect || 0;

      const attemptedFromPersisted = Number(persisted.attempted ?? persisted.total ?? 0) || 0;
      const correctFromPersisted = Number(persisted.correct ?? 0) || 0;
      const incorrectPersisted =
        persisted.incorrect != null ? Number(persisted.incorrect) : null;

      const attempted = uniqueAttempted || attemptedFromPersisted;
      const correct = uniqueCorrect || correctFromPersisted;
      const incorrect =
        uniqueIncorrect ||
        (Number.isFinite(incorrectPersisted) ? incorrectPersisted : Math.max(attempted - correct, 0));

      const totalAttemptsDomain =
        computed.totalAttempts || Number(persisted.totalAttempts ?? attemptedFromPersisted) || 0;
      const correctAttemptsDomain = computed.correctAttempts || correctFromPersisted || 0;
      const incorrectAttemptsDomain =
        computed.incorrectAttempts || Math.max(totalAttemptsDomain - correctAttemptsDomain, 0);

      const accuracy =
        totalAttemptsDomain > 0
          ? (correctAttemptsDomain / totalAttemptsDomain) * 100
          : attempted > 0
            ? (correct / attempted) * 100
            : 0;

      const totalQuestionsPool = DOMAIN_TOTAL_QUESTIONS[domainKey] || attempted;
      const completion = totalQuestionsPool > 0 ? (correct / totalQuestionsPool) * 100 : 0;

      const avgConfidence =
        computed.avgConfidenceCount > 0
          ? computed.avgConfidenceSum / computed.avgConfidenceCount
          : null;

      const avgTime =
        computed.totalAttempts > 0 && computed.timeSpent > 0
          ? computed.timeSpent / computed.totalAttempts
          : Number(persisted.avgTime ?? 0) || 0;

      domainStats[domainKey] = {
        attempted,
        correct,
        incorrect,
        totalAttempts: totalAttemptsDomain,
        correctAttempts: correctAttemptsDomain,
        incorrectAttempts: incorrectAttemptsDomain,
        accuracy,
        completion,
        totalQuestions: totalQuestionsPool,
        mastered: computed.mastery || Number(persisted.mastered ?? 0) || 0,
        avgConfidence,
        avgTime,
        timeSpent: (computed.timeSpent || 0) + Number(persisted.timeSpent ?? 0),
        lastAttempt: computed.lastAttempt ? computed.lastAttempt.toISOString() : persisted.lastAttempt || null
      };
    });

    Object.keys(DOMAIN_LABELS).forEach((domainKey) => {
      if (!domainStats[domainKey]) {
        const pool = DOMAIN_TOTAL_QUESTIONS[domainKey] || 0;
        domainStats[domainKey] = {
          attempted: 0,
          correct: 0,
          incorrect: 0,
          totalAttempts: 0,
          correctAttempts: 0,
          incorrectAttempts: 0,
          accuracy: 0,
          completion: 0,
          totalQuestions: pool,
          mastered: 0,
          avgConfidence: null,
          avgTime: 0,
          timeSpent: 0,
          lastAttempt: null
        };
      }
    });

    const unlockedAchievementIds = new Set(progress.achievements || []);
    const totalAchievements = Object.keys(ACHIEVEMENT_TYPES).length;

    return {
      questionsAnswered: uniqueQuestionsAnswered,
      totalPoints: progress.totalPoints ?? 0,
      totalXP: progress.totalXP ?? 0,
      currentStreak: progress.currentStreak ?? 0,
      longestStreak: progress.longestStreak ?? 0,
      accuracyOverall,
      quizzesTaken: (progress.history || []).filter((item) => item?.type === 'quiz').length,
      totalAttempts,
      correctAttempts,
      incorrectAttempts,
      domainStats,
      unlockedAchievements: unlockedAchievementIds.size,
      totalAchievements,
      unlockedAchievementIds
    };
  }, [progress]);

  const handleTabChange = useCallback((newTab) => {
    haptic(30);
    setActiveTab(newTab);
  }, []);

  if (loading || !stats) {
    return (
      <motion.div 
        className="profile-loading-duo"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <SkeletonLoader />
      </motion.div>
    );
  }

  return (
    <motion.div 
      ref={containerRef}
      className="profile-duo-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence>
        {showSparkles && <SparklesOverlay key="sparkles" />}
        {showConfetti && <ParticleEffect key="confetti" active count={100} />}
        {leveledUp && <LevelUpCeremony key="levelup" levelInfo={levelInfo} onClose={() => setLeveledUp(false)} />}
      </AnimatePresence>

      {/* HEADER with parallax and glassmorphism */}
      <motion.div 
        className="duo-header-mega glass-morphism"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={springConfig}
        style={{
          filter: `blur(${headerBlur}px)`,
          opacity: headerOpacity,
          transform: `translateY(${scrollY.get() * 0.5}px)`
        }}
      >
        <motion.button 
          className="back-btn-duo magnetic-button"
          onClick={() => {
            haptic(50);
            onNavigate?.('menu');
          }}
          whileHover={{ scale: 1.05, x: -4 }}
          whileTap={{ scale: 0.95 }}
          transition={springConfig}
        >
          ← Inicio
        </motion.button>
        
        <div className="header-content-duo">
          <motion.div 
            className="avatar-section-duo"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, ...springConfig }}
          >
            <div className="avatar-mega">
              <motion.div 
                className="avatar-ring morphing-shape"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="avatar-glow"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.span 
                className="avatar-icon"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ transform: `translateY(${scrollY.get() * 0.3}px)` }}
              >
                {levelInfo.icon}
              </motion.span>
            </div>
            <div className="avatar-info">
              <motion.h1 
                className="profile-title-duo text-scramble"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Mi Perfil
              </motion.h1>
              <motion.div 
                className="level-badge-mega"
                whileHover={{ scale: 1.05 }}
                transition={springConfig}
              >
                <span className="level-number">NIVEL {levelInfo.level}</span>
                <span className="level-name">{levelInfo.levelName}</span>
              </motion.div>
            </div>
          </motion.div>

          {/* XP Progress with spring animation */}
          <motion.div 
            className="xp-mega-container"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, ...springConfig }}
          >
            <div className="xp-info-row">
              <span className="xp-label">Experiencia Total</span>
              <motion.span 
                className="xp-count"
                key={progress.totalXP}
                initial={{ scale: 0.8 }}
                animate={{ scale: [1.2, 1] }}
                transition={springConfig}
              >
                <AnimatedCounter value={progress.totalXP} /> XP
              </motion.span>
            </div>
            <div className="xp-bar-mega">
              <motion.div 
                className="xp-fill-mega"
                initial={{ width: 0 }}
                animate={{ width: `${levelInfo.percentage}%` }}
                transition={{ delay: 0.5, duration: 1.5, type: "spring", stiffness: 100 }}
              >
                <div className="xp-shine"></div>
                <span className="xp-percentage">{levelInfo.percentage.toFixed(0)}%</span>
              </motion.div>
            </div>
            <div className="xp-milestone">
              <span>{levelInfo.xpInLevel} / {levelInfo.xpForNext} XP</span>
              <span className="xp-remaining">{levelInfo.xpForNext - levelInfo.xpInLevel} para siguiente nivel</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* STAT CARDS with multi-layer hover and magnetic effect */}
      <motion.div 
        className="stat-cards-mega-duo"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <StatCardDuo
          icon="🎯"
          value={stats.questionsAnswered}
          label="Preguntas"
          subtitle="respondidas"
          color="#FF9800"
          delay={0.1}
          mousePosition={mousePosition}
        />
        <StatCardDuo
          icon="🎪"
          value={`${stats.accuracyOverall.toFixed(1)}%`}
          label="Precisión"
          subtitle={`${stats.correctAttempts}/${stats.totalAttempts}`}
          color="#4CAF50"
          delay={0.2}
          mousePosition={mousePosition}
        />
        <StatCardDuo
          icon="🔥"
          value={stats.currentStreak}
          label="Racha Actual"
          subtitle={`Máxima: ${stats.longestStreak}`}
          color="#FF5722"
          delay={0.3}
          mousePosition={mousePosition}
          isStreak={true}
        />
        <StatCardDuo
          icon="🏆"
          value={`${stats.unlockedAchievements}/${stats.totalAchievements}`}
          label="Logros"
          subtitle="desbloqueados"
          color="#FFD700"
          delay={0.4}
          mousePosition={mousePosition}
        />
      </motion.div>

      {/* TABS with spring animations */}
      <motion.div 
        className="tabs-duo-mega glass-morphism"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, ...springConfig }}
      >
        <AnimatePresence>
          {['overview', 'analysis', 'achievements', 'domains'].map((tab, idx) => (
            <TabButton
              key={tab}
              active={activeTab === tab}
              onClick={() => handleTabChange(tab)}
              icon={tab === 'overview' ? '📊' : tab === 'analysis' ? '📈' : tab === 'achievements' ? '🏆' : '📚'}
              label={tab.charAt(0).toUpperCase() + tab.slice(1)}
              delay={idx * 0.1}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* TAB CONTENT with slide transitions */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab}
          className="tab-content-duo"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={springConfig}
        >
          {activeTab === 'overview' && (
            <OverviewTabDuo stats={stats} progress={progress} levelInfo={levelInfo} />
          )}
          {activeTab === 'analysis' && (
            <AnalysisTabDuo 
              stats={stats} 
              progress={progress}
              selectedDomain={selectedDomain}
              setSelectedDomain={setSelectedDomain}
              showRecommendations={showRecommendations}
              setShowRecommendations={setShowRecommendations}
              animateCharts={animateCharts}
            />
          )}
          {activeTab === 'achievements' && (
            <AchievementsTabDuo 
              progress={progress}
              stats={stats}
              expandedAchievement={expandedAchievement}
              setExpandedAchievement={setExpandedAchievement}
            />
          )}
          {activeTab === 'domains' && (
            <DomainsTabDuo stats={stats} animateCharts={animateCharts} />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

// Enhanced Stat Card with magnetic effect and multi-layer hover
const StatCardDuo = React.memo(({ icon, value, label, subtitle, color, delay, mousePosition, isStreak }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  useEffect(() => {
    if (isHovered && cardRef.current && mousePosition) {
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (mousePosition.x - centerX) * 0.1;
      const deltaY = (mousePosition.y - centerY) * 0.1;
      
      x.set(deltaX);
      y.set(deltaY);
    } else {
      x.set(0);
      y.set(0);
    }
  }, [mousePosition, isHovered, x, y]);
  
  return (
    <motion.div
      ref={cardRef}
      className="stat-card-duo glass-morphism"
      style={{ '--card-color': color, x, y }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, ...springConfig }}
      whileHover={{ scale: 1.05, rotateY: 5 }}
      onHoverStart={() => {
        setIsHovered(true);
        haptic(20);
      }}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => haptic(50)}
    >
      <AnimatePresence>
        {isHovered && (
          <>
            <motion.div 
              className="stat-card-glow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              style={{ backgroundColor: color }}
            />
            <motion.div 
              className="card-pulse"
              initial={{ scale: 0.8, opacity: 1 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </>
        )}
      </AnimatePresence>
      
      <motion.div 
        className="stat-icon-duo"
        animate={isHovered ? { y: [-2, 2, -2], rotate: [0, 5, -5, 0] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {isStreak && parseInt(value) > 0 && <StreakFlame streak={parseInt(value)} />}
        {icon}
      </motion.div>
      
      <motion.div 
        className="stat-value-duo"
        key={value}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={springConfig}
      >
        {typeof value === 'number' ? <AnimatedCounter value={value} /> : value}
      </motion.div>
      
      <div className="stat-label-duo">{label}</div>
      <div className="stat-subtitle-duo">{subtitle}</div>
    </motion.div>
  );
});

// Enhanced Tab Button with spring animations
const TabButton = React.memo(({ active, onClick, icon, label, delay }) => {
  return (
    <motion.button 
      className={`tab-btn-duo ${active ? 'tab-active' : ''}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, ...springConfig }}
      whileHover={!active ? { y: -2, scale: 1.02 } : {}}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span 
        className="tab-icon"
        animate={active ? { y: [0, -3, 0] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {icon}
      </motion.span>
      <span className="tab-label">{label}</span>
      <AnimatePresence>
        {active && (
          <motion.div 
            className="tab-indicator"
            layoutId="tab-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={springConfig}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
});

// Skeleton loader for better UX
const SkeletonLoader = () => (
  <div className="skeleton-container">
    <div className="skeleton-header">
      <div className="skeleton-avatar shimmer" />
      <div className="skeleton-info">
        <div className="skeleton-title shimmer" />
        <div className="skeleton-subtitle shimmer" />
      </div>
      <div className="skeleton-xp-bar shimmer" />
    </div>
    <div className="skeleton-cards">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="skeleton-card shimmer" style={{ animationDelay: `${i * 0.1}s` }} />
      ))}
    </div>
  </div>
);

// Sparkles overlay component
const SparklesOverlay = () => (
  <motion.div
    className="sparkles-overlay"
    initial={{ opacity: 0 }}
    animate={{ opacity: [0, 0.3, 0] }}
    transition={{ duration: 2 }}
  >
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="sparkle"
        initial={{ 
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          scale: 0
        }}
        animate={{ 
          scale: [0, 1, 0],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 2,
          delay: i * 0.1,
          repeat: Infinity,
          repeatDelay: Math.random() * 5
        }}
        style={{
          position: 'fixed',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)'
        }}
      />
    ))}
  </motion.div>
);

// Streak flame visualization
const StreakFlame = ({ streak }) => {
  const flameSize = Math.min(streak / 7, 1);
  const flameColor = streak > 30 ? 'rainbow' : streak > 7 ? 'blue' : 'orange';
  
  return (
    <motion.div
      className={`streak-flame flame-${flameColor}`}
      animate={{ 
        scale: [1, 1.1, 1],
        opacity: [0.8, 1, 0.8]
      }}
      transition={{ duration: 1, repeat: Infinity }}
      style={{ fontSize: `${1 + flameSize}rem` }}
    >
      🔥
    </motion.div>
  );
};

// Level up ceremony component
const LevelUpCeremony = ({ levelInfo, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      className="level-up-ceremony"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onClose}
      style={{ cursor: 'pointer' }}
    >
      <motion.div
        className="ceremony-content"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={springConfig}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          className="level-icon"
          animate={{ rotate: 360 }}
          transition={{ duration: 1 }}
        >
          {levelInfo.icon}
        </motion.div>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          ¡LEVEL UP!
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Ahora eres {levelInfo.levelName} - Nivel {levelInfo.level}
        </motion.p>
        <ParticleEffect active count={50} />
      </motion.div>
    </motion.div>
  );
};

// ===== OVERVIEW TAB DUOLINGO =====
const OverviewTabDuo = ({ stats, progress, levelInfo }) => {
  // ✅ Validación de datos al inicio del componente
  if (!stats || !progress) {
    return (
      <div className="overview-duo">
        <div className="loading-message">
          Cargando información del perfil...
        </div>
      </div>
    );
  }

  return (
    <div className="overview-duo">
      {/* Quick Stats Grid */}
      <div className="quick-stats-grid">
        <div className="quick-stat-card">
          <div className="quick-stat-icon">📝</div>
          <div className="quick-stat-value">{stats.quizzesTaken}</div>
          <div className="quick-stat-label">Quizzes Completados</div>
        </div>
        <div className="quick-stat-card">
          <div className="quick-stat-icon">💯</div>
          <div className="quick-stat-value">{stats.totalPoints}</div>
          <div className="quick-stat-label">Puntos Totales</div>
        </div>
        <div className="quick-stat-card">
          <div className="quick-stat-icon">⚡</div>
          <div className="quick-stat-value">{stats.totalXP}</div>
          <div className="quick-stat-label">XP Ganado</div>
        </div>
        <div className="quick-stat-card">
          <div className="quick-stat-icon">🌟</div>
          <div className="quick-stat-value">{Object.keys(stats.domainStats).length}</div>
          <div className="quick-stat-label">Dominios Explorados</div>
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="section-duo">
        <h2 className="section-title-duo">
          <span className="title-icon">📅</span>
          Actividad Reciente
        </h2>
        <div className="activity-timeline">
          {/* ✅ FIX 5: Filtrar solo quizzes del historial */}
          {progress.history && progress.history
            .filter(item => item.type === 'quiz')
            .slice(0, 5)
            .map((quiz, idx) => {
            const accuracy = quiz?.accuracy ?? 0;
            const score = quiz?.score ?? 0; // ✅ Número de correctas
            const totalQuestions = quiz?.questions ?? 0;
            const date = new Date(quiz.completedAt);
            return (
              <div key={idx} className="activity-item" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="activity-icon" style={{
                  backgroundColor: accuracy >= 70 ? '#4CAF50' : accuracy >= 50 ? '#FFC107' : '#F44336'
                }}>
                  {accuracy >= 70 ? '✓' : accuracy >= 50 ? '○' : '✗'}
                </div>
                <div className="activity-content">
                  <div className="activity-title">Quiz Completado</div>
                  <div className="activity-details">
                    {score}/{totalQuestions} correctas • {accuracy.toFixed(0)}% precisión
                  </div>
                  <div className="activity-date">{date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
                <div className="activity-reward">
                  <span className="reward-xp">+{quiz.xp} XP</span>
                  <span className="reward-points">+{quiz.points} pts</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Insights - MEJORADO CON INFORMACIÓN ÚNICA */}
      <div className="section-duo">
        <h2 className="section-title-duo">
          <span className="title-icon">💡</span>
          Insights de Progreso
        </h2>
        <div className="insights-grid-duo">
          {/* Insight 1: Dominio más dominado */}
          <div className="insight-card">
            <div className="insight-header">
              <span className="insight-emoji">⭐</span>
              <span className="insight-title">Mejor Dominio</span>
            </div>
            <div className="insight-value">
              {(() => {
                // ✅ Validación robusta de datos
                if (!stats?.domainStats || typeof stats.domainStats !== 'object') {
                  return 'Sin datos';
                }
                
                const sortedDomains = Object.entries(stats.domainStats)
                  .filter(([, data]) => data && typeof data === 'object' && Number(data.attempted || 0) > 0)
                  .sort((a, b) => Number(b[1].accuracy || 0) - Number(a[1].accuracy || 0));
                
                if (sortedDomains.length === 0) return 'Sin datos';
                
                const [bestDomain] = sortedDomains[0];
                const domainName = DOMAIN_LABELS[bestDomain] || bestDomain;
                return domainName;
              })()}
            </div>
            <div className="insight-description">
              {(() => {
                if (!stats?.domainStats || typeof stats.domainStats !== 'object') {
                  return 'Comienza a practicar';
                }
                
                const sortedDomains = Object.entries(stats.domainStats)
                  .filter(([, data]) => data && typeof data === 'object' && Number(data.attempted || 0) > 0)
                  .sort((a, b) => Number(b[1].accuracy || 0) - Number(a[1].accuracy || 0));
                
                if (sortedDomains.length === 0) return 'Comienza a practicar';
                
                const [, data] = sortedDomains[0];
                const accuracy = Number(data.accuracy || 0);
                const mastered = Number(data.mastered || 0);
                return `${accuracy.toFixed(0)}% de precisión • ${mastered} dominadas`;
              })()}
            </div>
          </div>

          {/* Insight 2: Velocidad de aprendizaje */}
          <div className="insight-card">
            <div className="insight-header">
              <span className="insight-emoji">⚡</span>
              <span className="insight-title">Velocidad</span>
            </div>
            <div className="insight-value">
              {(() => {
                // ✅ Validación de quizzes tomados
                const quizzesTaken = Number(stats?.quizzesTaken || 0);
                if (quizzesTaken === 0) return 'Principiante';
                if (quizzesTaken < 5) return '🐢 Despacio';
                if (quizzesTaken < 10) return '🚶 Moderado';
                if (quizzesTaken < 20) return '🏃 Rápido';
                return '🚀 Muy Rápido';
              })()}
            </div>
            <div className="insight-description">
              {(() => {
                const totalAttempts = Number(stats?.totalAttempts || 0);
                const quizzesTaken = Number(stats?.quizzesTaken || 0);
                
                if (totalAttempts === 0 || quizzesTaken === 0) {
                  return '0 preguntas promedio por quiz';
                }
                
                const avgQuestionsPerQuiz = (totalAttempts / quizzesTaken).toFixed(1);
                return `${avgQuestionsPerQuiz} preguntas promedio por quiz`;
              })()}
            </div>
          </div>

          {/* Insight 3: Eficiencia (Ratio correctas/intentos) */}
          <div className="insight-card">
            <div className="insight-header">
              <span className="insight-emoji">🎯</span>
              <span className="insight-title">Eficiencia</span>
            </div>
            <div className="insight-value">
              {(() => {
                // ✅ Validación de intentos totales
                const totalAttempts = Number(stats?.totalAttempts || 0);
                const correctAttempts = Number(stats?.correctAttempts || 0);
                
                if (totalAttempts === 0) return 'Sin datos';
                
                const efficiency = (correctAttempts / totalAttempts) * 100;
                if (efficiency >= 80) return '🌟 Excelente';
                if (efficiency >= 65) return '👍 Buena';
                if (efficiency >= 50) return '📚 Aceptable';
                return '💪 Mejorando';
              })()}
            </div>
            <div className="insight-description">
              {(() => {
                const totalAttempts = Number(stats?.totalAttempts || 0);
                const correctAttempts = Number(stats?.correctAttempts || 0);
                
                if (totalAttempts === 0) {
                  return 'Comienza a responder preguntas';
                }
                
                return `${correctAttempts}/${totalAttempts} respuestas correctas al primer intento`;
              })()}
            </div>
          </div>

          {/* Insight 4: Área de oportunidad */}
          <div className="insight-card">
            <div className="insight-header">
              <span className="insight-emoji">🎓</span>
              <span className="insight-title">Siguiente Reto</span>
            </div>
            <div className="insight-value">
              {(() => {
                // ✅ Validación robusta de dominios
                if (!stats?.domainStats || typeof stats.domainStats !== 'object') {
                  return 'Explora dominios';
                }
                
                const sortedDomains = Object.entries(stats.domainStats)
                  .filter(([, data]) => data && typeof data === 'object' && Number(data.attempted || 0) > 0)
                  .sort((a, b) => Number(a[1].accuracy || 0) - Number(b[1].accuracy || 0));
                
                if (sortedDomains.length === 0) return 'Explora dominios';
                
                const [weakDomain] = sortedDomains[0];
                const domainName = DOMAIN_LABELS[weakDomain] || weakDomain;
                return domainName;
              })()}
            </div>
            <div className="insight-description">
              {(() => {
                if (!stats?.domainStats || typeof stats.domainStats !== 'object') {
                  return 'Comienza tu aprendizaje';
                }
                
                const sortedDomains = Object.entries(stats.domainStats)
                  .filter(([, data]) => data && typeof data === 'object' && Number(data.attempted || 0) > 0)
                  .sort((a, b) => Number(a[1].accuracy || 0) - Number(b[1].accuracy || 0));
                
                if (sortedDomains.length === 0) return 'Comienza tu aprendizaje';
                
                const [, data] = sortedDomains[0];
                const accuracy = Number(data.accuracy || 0);
                const improvement = Math.max(0, 70 - accuracy);
                return `${improvement.toFixed(0)}% de mejora potencial`;
              })()}
            </div>
          </div>

          {/* Insight 5: Preguntas dominadas */}
          <div className="insight-card">
            <div className="insight-header">
              <span className="insight-emoji">�</span>
              <span className="insight-title">Maestría</span>
            </div>
            <div className="insight-value">
              {(() => {
                const totalMastered = Object.values(stats.domainStats)
                  .reduce((sum, domain) => sum + (domain.mastered || 0), 0);
                
                if (totalMastered === 0) return 'Ninguna aún';
                if (totalMastered < 5) return `${totalMastered} preguntas`;
                if (totalMastered < 15) return `${totalMastered} preguntas ⭐`;
                return `${totalMastered} preguntas 🌟`;
              })()}
            </div>
            <div className="insight-description">
              {(() => {
                const totalMastered = Object.values(stats.domainStats)
                  .reduce((sum, domain) => sum + (domain.mastered || 0), 0);
                const totalAttempted = stats.questionsAnswered || 0;
                
                if (totalAttempted === 0) return 'Comienza a practicar';
                
                const masteryRate = ((totalMastered / totalAttempted) * 100).toFixed(0);
                return `${masteryRate}% de tus preguntas dominadas`;
              })()}
            </div>
          </div>

          {/* Insight 6: Tiempo de estudio estimado */}
          <div className="insight-card">
            <div className="insight-header">
              <span className="insight-emoji">⏰</span>
              <span className="insight-title">Dedicación</span>
            </div>
            <div className="insight-value">
              {(() => {
                // ✅ Validación de tiempo de estudio
                if (!stats?.domainStats || typeof stats.domainStats !== 'object') {
                  return 'Sin registro';
                }
                
                const totalTimeMinutes = Object.values(stats.domainStats)
                  .reduce((sum, domain) => {
                    const timeSpent = Number((domain && domain.timeSpent) || 0);
                    return sum + timeSpent;
                  }, 0) / 60000;
                
                if (totalTimeMinutes === 0 || !Number.isFinite(totalTimeMinutes)) return 'Sin registro';
                if (totalTimeMinutes < 10) return `${totalTimeMinutes.toFixed(0)} min`;
                if (totalTimeMinutes < 60) return `${totalTimeMinutes.toFixed(0)} min 📚`;
                const hours = (totalTimeMinutes / 60).toFixed(1);
                return `${hours} horas 🔥`;
              })()}
            </div>
            <div className="insight-description">
              {(() => {
                if (!stats?.domainStats || typeof stats.domainStats !== 'object') {
                  return 'Comienza a estudiar';
                }
                
                const totalTimeMinutes = Object.values(stats.domainStats)
                  .reduce((sum, domain) => {
                    const timeSpent = Number((domain && domain.timeSpent) || 0);
                    return sum + timeSpent;
                  }, 0) / 60000;
                
                const quizzesTaken = Number(stats?.quizzesTaken || 0);
                
                if (totalTimeMinutes === 0 || quizzesTaken === 0 || !Number.isFinite(totalTimeMinutes)) {
                  return 'Comienza a estudiar';
                }
                
                const avgTimePerQuiz = (totalTimeMinutes / quizzesTaken).toFixed(1);
                return `${avgTimePerQuiz} min promedio por quiz`;
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== RECOMMENDATION CARD COMPONENT (SIMPLIFIED & CLEAN) =====
const RecommendationCard = React.memo(({ recommendation, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const priorityColors = {
    high: '#F44336',
    medium: '#FF9800',
    low: '#4CAF50',
    varies: '#9C27B0'
  };
  
  return (
    <motion.div
      className={`rec-card-compact priority-${recommendation.priority}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, ...springConfig }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => {
        setIsHovered(true);
        haptic(20);
      }}
      onHoverEnd={() => setIsHovered(false)}
      style={{ '--priority-color': priorityColors[recommendation.priority] }}
    >
      {/* Compact Header */}
      <div className="rec-compact-header">
        <motion.div 
          className="rec-icon-compact"
          animate={isHovered ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5 }}
        >
          {recommendation.icon}
        </motion.div>
        
        <div className="rec-compact-content">
          <h4 className="rec-compact-title">{recommendation.title}</h4>
          <p className="rec-compact-description">{recommendation.description}</p>
        </div>

        <div className={`rec-priority-dot ${recommendation.priority}`}></div>
      </div>

      {/* Compact Stats Row */}
      {(recommendation.progress !== undefined || recommendation.streak || recommendation.stats) && (
        <div className="rec-compact-stats">
          {recommendation.progress !== undefined && (
            <div className="compact-stat">
              <span className="stat-icon">📊</span>
              <span className="stat-text">{recommendation.progress.toFixed(0)}% completado</span>
            </div>
          )}
          
          {recommendation.streak && (
            <div className="compact-stat">
              <span className="stat-icon">🔥</span>
              <span className="stat-text">{recommendation.streak.current}/{recommendation.streak.target} días</span>
            </div>
          )}
          
          {recommendation.stats?.accuracy !== undefined && (
            <div className="compact-stat">
              <span className="stat-icon">🎯</span>
              <span className="stat-text">{recommendation.stats.accuracy.toFixed(0)}% precisión</span>
            </div>
          )}
          
          {recommendation.estimatedTime && (
            <div className="compact-stat">
              <span className="stat-icon">⏱️</span>
              <span className="stat-text">{recommendation.estimatedTime}</span>
            </div>
          )}
          
          {recommendation.xpReward && (
            <div className="compact-stat xp-highlight">
              <span className="stat-icon">⚡</span>
              <span className="stat-text">+{recommendation.xpReward} XP</span>
            </div>
          )}
        </div>
      )}

      {/* Hover Effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="rec-compact-glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            style={{ backgroundColor: priorityColors[recommendation.priority] }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
});

// ===== ANALYSIS TAB DUOLINGO =====
const AnalysisTabDuo = ({ stats, progress, selectedDomain, setSelectedDomain, showRecommendations, setShowRecommendations, animateCharts }) => {
  const domainNames = useMemo(() => ({ ...DOMAIN_LABELS }), []);

  const analysis = useMemo(() => {
    const domainStats = stats.domainStats || {};
    const tracking = progress.questionTracking || {};
    const history = progress.history || [];

    const MIN_CONFIDENT_DATA = 3;

    const domainAnalysis = Object.entries(domainStats).map(([domain, data]) => {
      const attempted = Number(data?.attempted ?? 0);
      const correct = Number(data?.correct ?? 0);
      const incorrect = Number(data?.incorrect ?? Math.max(attempted - correct, 0));
      const accuracy = Number(data?.accuracy ?? 0);
      const completion = Number(data?.completion ?? 0);
      const mastery = Number(data?.mastered ?? 0);
      const avgConfidence = data?.avgConfidence == null ? null : Number(data.avgConfidence);
      const lastAttempt = data?.lastAttempt || null;

      let performance = 'needs-data';
      const hasEnoughData = attempted >= MIN_CONFIDENT_DATA;
      if (hasEnoughData) {
        if (accuracy >= 75) performance = 'strong';
        else if (accuracy < 50) performance = 'weak';
        else performance = 'medium';
      }

      return {
        domain,
        attempted,
        correct,
        incorrect,
        accuracy,
        completion,
        mastery,
        avgConfidence,
        lastAttempt,
        performance,
        hasEnoughData
      };
    }).sort((a, b) => b.accuracy - a.accuracy);

    let strengths = domainAnalysis.filter(d => d.performance === 'strong');
    let weaknesses = domainAnalysis.filter(d => d.performance === 'weak');

    if (strengths.length === 0 && domainAnalysis.length > 0) {
      strengths = domainAnalysis.slice(0, 1);
    }

    if (weaknesses.length === 0 && domainAnalysis.length > 1) {
      const reversed = [...domainAnalysis].reverse();
      weaknesses = reversed.slice(0, 1);
      if (strengths[0] && weaknesses[0]?.domain === strengths[0].domain && reversed.length > 1) {
        weaknesses = reversed.slice(1, 2);
      }
    }

    const recentQuizzes = history.filter(h => h.type === 'quiz').slice(0, 5);
    const avgRecentAccuracy = recentQuizzes.length > 0
      ? recentQuizzes.reduce((sum, q) => {
          const quizAccuracy = q?.accuracy != null
            ? Number(q.accuracy)
            : (Number(q?.correctAnswers ?? q?.score ?? 0) / Math.max(1, Number(q?.questions ?? q?.totalQuestions ?? 0))) * 100;
          return sum + (Number.isFinite(quizAccuracy) ? quizAccuracy : 0);
        }, 0) / recentQuizzes.length
      : 0;

    const trackingValues = Object.values(tracking);
    const masteredQuestions = trackingValues.filter(q =>
      q.totalAttempts > 0 &&
      (q.status === QUESTION_STATUS.MASTERED || q.status === QUESTION_STATUS.RETIRED)
    ).length;

    const strugglingQuestions = trackingValues.filter(q => {
      if (!q || q.totalAttempts < 2) return false;
      const ratio = q.correctAttempts > 0 ? q.correctAttempts / q.totalAttempts : 0;
      return ratio < 0.5;
    }).length;

    const learningRate = stats.totalAttempts > 0
      ? (stats.correctAttempts / stats.totalAttempts) * 100
      : 0;

    // ===== SISTEMA AVANZADO DE RECOMENDACIONES =====
    const recommendations = [];
    
    // 1. Recomendaciones por debilidades (ALTA PRIORIDAD)
    if (weaknesses.length > 0) {
      weaknesses.forEach((weakness) => {
        const domainName = domainNames[weakness.domain] || weakness.domain;
        const questionsWrong = weakness.incorrect;
        
        recommendations.push({
          id: `weakness-${weakness.domain}`,
          icon: '⚠️',
          title: 'Reforzar área débil',
          domain: weakness.domain,
          description: `Tu precisión en ${domainName} es del ${weakness.accuracy.toFixed(0)}%. Has respondido ${questionsWrong} preguntas incorrectamente.`,
          priority: 'high',
          type: 'weakness',
          action: 'Practicar ahora',
          actionTarget: 'quiz',
          actionData: { domain: weakness.domain, level: 'basic' },
          impact: 'Mejorar este dominio puede incrementar tu precisión general en un 15%',
          estimatedTime: '10-15 min',
          xpReward: 150,
          difficulty: 'medium',
          tips: [
            `Revisa la teoría de ${domainName} antes de practicar`,
            'Enfócate en entender los errores, no solo en acertar',
            'Practica en sesiones cortas pero frecuentes'
          ],
          progress: weakness.completion,
          stats: {
            attempted: weakness.attempted,
            correct: weakness.correct,
            accuracy: weakness.accuracy
          }
        });
      });
    }

    // 2. Recomendaciones por racha (MEDIA/ALTA PRIORIDAD)
    if (stats.currentStreak === 0) {
      recommendations.push({
        id: 'streak-start',
        icon: '🔥',
        title: 'Construye tu racha de estudio',
        description: 'Estudia durante 7 días consecutivos para mantener el impulso y ganar bonificaciones.',
        priority: 'high',
        type: 'streak',
        action: 'Empezar racha',
        actionTarget: 'quiz',
        actionData: { mode: 'daily-challenge' },
        impact: 'Las rachas de 7+ días aumentan la retención en un 40%',
        estimatedTime: '5 min/día',
        xpReward: 50,
        difficulty: 'easy',
        tips: [
          'Establece un horario fijo para estudiar',
          'Comienza con solo 5 minutos diarios',
          'Activa recordatorios en tu calendario'
        ],
        progress: 0,
        streak: {
          current: stats.currentStreak,
          target: 7,
          longest: stats.longestStreak
        }
      });
    } else if (stats.currentStreak > 0 && stats.currentStreak < 7) {
      recommendations.push({
        id: 'streak-maintain',
        icon: '🔥',
        title: `¡Mantén tu racha de ${stats.currentStreak} días!`,
        description: `Te faltan ${7 - stats.currentStreak} días para alcanzar una racha de 7 días y desbloquear recompensas.`,
        priority: 'medium',
        type: 'streak',
        action: 'Continuar racha',
        actionTarget: 'quiz',
        actionData: { mode: 'daily-challenge' },
        impact: 'Completar rachas desbloquea multiplicadores de XP',
        estimatedTime: '5 min',
        xpReward: 75,
        difficulty: 'easy',
        tips: [
          '¡No rompas tu racha! Estudia hoy',
          'Tu mejor racha fue de ' + stats.longestStreak + ' días',
          'Las rachas mejoran tu disciplina y retención'
        ],
        progress: (stats.currentStreak / 7) * 100,
        streak: {
          current: stats.currentStreak,
          target: 7,
          longest: stats.longestStreak
        }
      });
    } else if (stats.currentStreak >= 7) {
      recommendations.push({
        id: 'streak-extend',
        icon: '🔥',
        title: `¡Racha épica de ${stats.currentStreak} días!`,
        description: '¡Increíble! Mantén esta racha para maximizar tu aprendizaje y ganar XP extra.',
        priority: 'low',
        type: 'streak',
        action: 'Extender racha',
        actionTarget: 'quiz',
        actionData: { mode: 'daily-challenge', bonus: 'streak-multiplier' },
        impact: 'Rachas de 7+ días otorgan bonificación de XP del 50%',
        estimatedTime: '5 min',
        xpReward: 100,
        difficulty: 'easy',
        tips: [
          '¡Felicidades! Tu disciplina es ejemplar',
          'Multiplica tu XP por mantener la racha',
          'Desafíate con preguntas más difíciles'
        ],
        progress: 100,
        streak: {
          current: stats.currentStreak,
          target: stats.currentStreak + 7,
          longest: stats.longestStreak
        }
      });
    }

    // 3. Recomendaciones por preguntas difíciles (ALTA PRIORIDAD)
    if (strugglingQuestions > 0) {
      recommendations.push({
        id: 'struggling-questions',
        icon: '🎯',
        title: 'Repasa preguntas difíciles',
        description: `Tienes ${strugglingQuestions} preguntas con precisión menor al 50%. Repasarlas mejorará tu confianza.`,
        priority: 'high',
        type: 'review',
        action: 'Revisar ahora',
        actionTarget: 'review',
        actionData: { type: 'struggling', count: strugglingQuestions },
        impact: 'Dominar estas preguntas puede mejorar tu precisión en un 20%',
        estimatedTime: `${Math.ceil(strugglingQuestions * 1.5)} min`,
        xpReward: strugglingQuestions * 10,
        difficulty: 'hard',
        tips: [
          'Lee las explicaciones completas de cada pregunta',
          'Identifica patrones en tus errores',
          'Practica preguntas similares después de entender'
        ],
        progress: 0,
        stats: {
          totalQuestions: strugglingQuestions,
          avgAccuracy: 30
        }
      });
    }

    // 4. Recomendaciones por precisión general (ALTA PRIORIDAD)
    if (stats.accuracyOverall < 70) {
      recommendations.push({
        id: 'accuracy-low',
        icon: '📚',
        title: 'Refuerza tus fundamentos',
        description: `Tu precisión general es del ${stats.accuracyOverall.toFixed(0)}%. Revisar la guía de estudio te ayudará a mejorar.`,
        priority: 'high',
        type: 'study',
        action: 'Ver guía',
        actionTarget: 'guide',
        actionData: { section: 'fundamentals' },
        impact: 'Estudiar la teoría puede aumentar tu precisión en un 25%',
        estimatedTime: '20-30 min',
        xpReward: 200,
        difficulty: 'medium',
        tips: [
          'Lee la guía completa antes de practicar',
          'Toma notas de conceptos clave',
          'Haz resúmenes después de cada sección'
        ],
        progress: 0,
        stats: {
          currentAccuracy: stats.accuracyOverall,
          targetAccuracy: 70
        }
      });
    }

    // 5. Recomendaciones por dominio sin práctica reciente
    domainAnalysis.forEach((domain) => {
      if (domain.lastAttempt) {
        const daysSinceLastAttempt = Math.floor(
          (Date.now() - new Date(domain.lastAttempt).getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (daysSinceLastAttempt >= 7 && domain.attempted > 0) {
          recommendations.push({
            id: `stale-${domain.domain}`,
            icon: '⏰',
            title: 'Refresca tu memoria',
            domain: domain.domain,
            description: `No has practicado ${domainNames[domain.domain] || domain.domain} en ${daysSinceLastAttempt} días. La memoria se debilita con el tiempo.`,
            priority: 'medium',
            type: 'refresh',
            action: 'Refrescar',
            actionTarget: 'quiz',
            actionData: { domain: domain.domain, level: 'review' },
            impact: 'Repasar cada 7 días mejora la retención a largo plazo',
            estimatedTime: '10 min',
            xpReward: 100,
            difficulty: 'easy',
            tips: [
              'La curva del olvido comienza después de 7 días',
              'Un repaso rápido puede restaurar tu conocimiento',
              'Practica regularmente para mantener fresco'
            ],
            progress: Math.max(0, 100 - (daysSinceLastAttempt * 5)),
            stats: {
              daysSinceLastAttempt,
              previousAccuracy: domain.accuracy
            }
          });
        }
      }
    });

    // 6. Recomendaciones por cobertura incompleta
    domainAnalysis.forEach((domain) => {
      if (domain.completion < 50 && domain.completion > 0) {
        recommendations.push({
          id: `incomplete-${domain.domain}`,
          icon: '📊',
          title: 'Completa tu cobertura',
          domain: domain.domain,
          description: `Has cubierto solo el ${domain.completion.toFixed(0)}% de ${domainNames[domain.domain] || domain.domain}. Completa más preguntas para dominar.`,
          priority: 'medium',
          type: 'coverage',
          action: 'Explorar más',
          actionTarget: 'quiz',
          actionData: { domain: domain.domain, level: 'unexplored' },
          impact: 'Cubrir el 100% de un dominio te acerca al dominio completo',
          estimatedTime: '15-20 min',
          xpReward: 175,
          difficulty: 'medium',
          tips: [
            'Explora nuevas preguntas para ampliar tu conocimiento',
            'La variedad mejora la comprensión general',
            'No te limites a las preguntas que ya conoces'
          ],
          progress: domain.completion,
          stats: {
            questionsAnswered: domain.attempted,
            totalQuestions: domain.totalQuestions || DOMAIN_TOTAL_QUESTIONS[domain.domain] || 25,
            completion: domain.completion
          }
        });
      }
    });

    // 7. Recomendaciones por nivel de confianza bajo
    domainAnalysis.forEach((domain) => {
      if (domain.avgConfidence !== null && domain.avgConfidence < CONFIDENCE_LEVELS.MEDIUM) {
        recommendations.push({
          id: `confidence-${domain.domain}`,
          icon: '💪',
          title: 'Aumenta tu confianza',
          domain: domain.domain,
          description: `Tu confianza en ${domainNames[domain.domain] || domain.domain} es ${formatConfidence(domain.avgConfidence)}. Practica más para sentirte seguro.`,
          priority: 'medium',
          type: 'confidence',
          action: 'Practicar',
          actionTarget: 'quiz',
          actionData: { domain: domain.domain, level: 'confidence-builder' },
          impact: 'Mayor confianza reduce la ansiedad en el examen real',
          estimatedTime: '15 min',
          xpReward: 125,
          difficulty: 'medium',
          tips: [
            'La práctica repetida construye confianza',
            'Celebra cada pequeño progreso',
            'Visualiza el éxito antes de responder'
          ],
          progress: (domain.avgConfidence / CONFIDENCE_LEVELS.VERY_HIGH) * 100,
          stats: {
            currentConfidence: formatConfidence(domain.avgConfidence),
            targetConfidence: formatConfidence(CONFIDENCE_LEVELS.HIGH)
          }
        });
      }
    });

    // 8. Recomendaciones por fortalezas (BAJA PRIORIDAD - Motivacional)
    if (strengths.length > 0 && weaknesses.length === 0) {
      const topStrength = strengths[0];
      recommendations.push({
        id: 'excellence',
        icon: '🌟',
        title: '¡Rendimiento excelente!',
        description: `Destacas en ${domainNames[topStrength.domain] || topStrength.domain} con ${topStrength.accuracy.toFixed(0)}% de precisión. ¡Mantén el impulso!`,
        priority: 'low',
        type: 'motivation',
        action: 'Desafío avanzado',
        actionTarget: 'quiz',
        actionData: { domain: topStrength.domain, level: 'advanced', difficulty: 'hard' },
        impact: 'Desafíate con preguntas avanzadas para alcanzar la maestría',
        estimatedTime: '10 min',
        xpReward: 250,
        difficulty: 'hard',
        tips: [
          '¡Excelente trabajo! Sigue así',
          'Prueba preguntas más difíciles',
          'Enseña a otros para reforzar tu conocimiento'
        ],
        progress: 100,
        stats: {
          accuracy: topStrength.accuracy,
          mastery: topStrength.mastery
        }
      });
    }

    // 9. Recomendaciones por logros desbloqueables
    const totalAchievements = Object.keys(ACHIEVEMENT_TYPES).length;
    const lockedAchievements = totalAchievements - stats.unlockedAchievements;
    if (lockedAchievements > 0 && lockedAchievements <= 5) {
      recommendations.push({
        id: 'achievements',
        icon: '🏆',
        title: 'Desbloquea más logros',
        description: `Te faltan ${lockedAchievements} logros por desbloquear. ¡Estás cerca de completarlos todos!`,
        priority: 'low',
        type: 'achievements',
        action: 'Ver logros',
        actionTarget: 'achievements',
        actionData: {},
        impact: 'Completar logros te motiva y marca tu progreso',
        estimatedTime: 'Variable',
        xpReward: 300,
        difficulty: 'varies',
        tips: [
          'Revisa qué logros te faltan',
          'Algunos logros se desbloquean con el tiempo',
          'Los logros dan grandes recompensas de XP'
        ],
        progress: (stats.unlockedAchievements / totalAchievements) * 100,
        stats: {
          unlocked: stats.unlockedAchievements,
          total: totalAchievements,
          remaining: lockedAchievements
        }
      });
    }

    // 10. Recomendaciones por tiempo de estudio
    const totalTimeMs = Object.values(domainStats).reduce((sum, d) => sum + (d?.timeSpent ?? 0), 0);
    const totalTimeMinutes = Math.floor(totalTimeMs / 60000);
    if (totalTimeMinutes < 30 && stats.quizzesTaken > 0) {
      recommendations.push({
        id: 'study-time',
        icon: '⏱️',
        title: 'Aumenta tu tiempo de estudio',
        description: `Has estudiado ${totalTimeMinutes} minutos en total. Dedica más tiempo para mejorar tu preparación.`,
        priority: 'medium',
        type: 'study-time',
        action: 'Estudiar más',
        actionTarget: 'quiz',
        actionData: { mode: 'extended-session' },
        impact: 'Estudiar 30+ minutos por sesión mejora la retención',
        estimatedTime: '30 min',
        xpReward: 200,
        difficulty: 'medium',
        tips: [
          'Las sesiones largas mejoran el aprendizaje profundo',
          'Toma descansos cada 25 minutos (Pomodoro)',
          'Establece metas de tiempo de estudio semanal'
        ],
        progress: (totalTimeMinutes / 60) * 100,
        stats: {
          totalMinutes: totalTimeMinutes,
          targetMinutes: 60
        }
      });
    }

    // Ordenar recomendaciones por prioridad
    const priorityOrder = { high: 0, medium: 1, low: 2, varies: 3 };
    recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    // Limitar a las 8 recomendaciones más relevantes
    const topRecommendations = recommendations.slice(0, 8);

    return {
      strengths,
      weaknesses,
      avgRecentAccuracy,
      masteredQuestions,
      strugglingQuestions,
      learningRate,
      recommendations: topRecommendations,
      domainAnalysis
    };
  }, [stats, progress, domainNames]);

  return (
    <div className="analysis-duo">
      {/* Performance Summary Cards */}
      <div className="performance-mega-grid">
        <div className="perf-mega-card" style={{ '--delay': '0s' }}>
          <div className="perf-icon-mega">📈</div>
          <div className="perf-value-mega">{analysis.learningRate.toFixed(1)}%</div>
          <div className="perf-label-mega">Tasa de Aprendizaje</div>
          <div className="perf-bar">
            <div className="perf-bar-fill" style={{ width: animateCharts ? `${analysis.learningRate}%` : '0%' }}></div>
          </div>
        </div>
        <div className="perf-mega-card" style={{ '--delay': '0.1s' }}>
          <div className="perf-icon-mega">⭐</div>
          <div className="perf-value-mega">{analysis.masteredQuestions}</div>
          <div className="perf-label-mega">Preguntas Dominadas</div>
          <div className="perf-progress">{((analysis.masteredQuestions / stats.questionsAnswered) * 100).toFixed(0)}% del total</div>
        </div>
        <div className="perf-mega-card" style={{ '--delay': '0.2s' }}>
          <div className="perf-icon-mega">⚡</div>
          <div className="perf-value-mega">{analysis.avgRecentAccuracy.toFixed(1)}%</div>
          <div className="perf-label-mega">Precisión Reciente</div>
          <div className="perf-bar">
            <div className="perf-bar-fill" style={{ width: animateCharts ? `${analysis.avgRecentAccuracy}%` : '0%' }}></div>
          </div>
        </div>
        <div className="perf-mega-card" style={{ '--delay': '0.3s' }}>
          <div className="perf-icon-mega">🎯</div>
          <div className="perf-value-mega">{analysis.strugglingQuestions}</div>
          <div className="perf-label-mega">Preguntas Difíciles</div>
          <div className="perf-progress">Necesitan repaso</div>
        </div>
      </div>

      {/* Strengths & Weaknesses - Visual */}
      <div className="strength-weakness-duo">
        <div className="sw-column strength-column">
          <div className="sw-header">
            <span className="sw-icon">💪</span>
            <h3 className="sw-title">Fortalezas</h3>
            <span className="sw-count">{analysis.strengths.length}</span>
          </div>
          {analysis.strengths.length > 0 ? (
            <div className="sw-list">
              {analysis.strengths.map((domain, idx) => (
                <div key={domain.domain} className="sw-item strength-item" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="sw-item-content">
                    <div className="sw-item-name">{domainNames[domain.domain] || domain.domain}</div>
                    <div className="sw-item-stats">
                      {domain.correct}/{domain.attempted} correctas · {domain.accuracy.toFixed(0)}% precisión
                    </div>
                    {!domain.hasEnoughData && (
                      <div className="sw-item-tag">Datos limitados · practica un poco más</div>
                    )}
                    <div className="sw-item-meta">
                      Cobertura {domain.completion.toFixed(0)}% · Confianza {formatConfidence(domain.avgConfidence)} · Última práctica {formatRelativeDate(domain.lastAttempt)}
                    </div>
                  </div>
                  <div className="sw-item-score">
                    <div className="circular-progress" style={{ '--progress': domain.accuracy }}>
                      <span className="progress-value">{domain.accuracy.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="sw-empty">Sigue practicando para desarrollar fortalezas 💪</div>
          )}
        </div>

        <div className="sw-column weakness-column">
          <div className="sw-header">
            <span className="sw-icon">⚠️</span>
            <h3 className="sw-title">Áreas de Mejora</h3>
            <span className="sw-count">{analysis.weaknesses.length}</span>
          </div>
          {analysis.weaknesses.length > 0 ? (
            <div className="sw-list">
              {analysis.weaknesses.map((domain, idx) => (
                <div key={domain.domain} className="sw-item weakness-item" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="sw-item-content">
                    <div className="sw-item-name">{domainNames[domain.domain] || domain.domain}</div>
                    <div className="sw-item-stats">
                      {domain.correct}/{domain.attempted} correctas · {domain.accuracy.toFixed(0)}% precisión
                    </div>
                    {!domain.hasEnoughData && (
                      <div className="sw-item-tag">Datos limitados · practica un poco más</div>
                    )}
                    <div className="sw-item-meta">
                      Cobertura {domain.completion.toFixed(0)}% · Confianza {formatConfidence(domain.avgConfidence)} · Última práctica {formatRelativeDate(domain.lastAttempt)}
                    </div>
                  </div>
                  <div className="sw-item-score">
                    <div className="circular-progress weak" style={{ '--progress': domain.accuracy }}>
                      <span className="progress-value">{domain.accuracy.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="sw-empty">¡Excelente! No tienes áreas débiles 🎉</div>
          )}
        </div>
      </div>

      {/* Recommendations - Simplified & Clean */}
      <div className="section-duo">
        <div className="section-header-interactive">
          <h2 className="section-title-duo">
            <span className="title-icon">💡</span>
            Recomendaciones Personalizadas
            <span className="rec-count-badge">{analysis.recommendations.length}</span>
          </h2>
          <button 
            className="toggle-btn-duo"
            onClick={() => {
              setShowRecommendations(!showRecommendations);
              haptic(30);
            }}
          >
            {showRecommendations ? '▼ Ocultar' : '▶ Mostrar'}
          </button>
        </div>
        <AnimatePresence>
          {showRecommendations && (
            <motion.div 
              className="recommendations-compact-grid"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {analysis.recommendations.map((rec, idx) => (
                <RecommendationCard 
                  key={rec.id} 
                  recommendation={rec} 
                  index={idx}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Domain Comparison - Interactive Chart */}
      <div className="section-duo">
        <h2 className="section-title-duo">
          <span className="title-icon">📊</span>
          Comparación de Dominios
        </h2>
        <div className="domain-chart-mega">
          {Object.entries(stats.domainStats || {}).map(([domain, data], idx) => {
            const accuracy = data?.accuracy ?? 0;
            const attempted = data?.attempted ?? 0;
            const correct = data?.correct ?? 0;
            const completion = data?.completion ?? 0;
            const avgConfidence = data?.avgConfidence ?? null;
            const lastAttempt = data?.lastAttempt ?? null;
            const isSelected = selectedDomain === domain;
            return (
              <div 
                key={domain} 
                className={`chart-domain-row ${isSelected ? 'domain-selected' : ''}`}
                onClick={() => setSelectedDomain(isSelected ? null : domain)}
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                <div className="chart-domain-label">{domainNames[domain] || domain}</div>
                <div className="chart-domain-visual">
                  <div className="chart-bar-track">
                    <div 
                      className={`chart-bar-mega ${accuracy >= 75 ? 'bar-excellent' : accuracy >= 50 ? 'bar-good' : 'bar-needs-work'}`}
                      style={{ width: animateCharts ? `${accuracy}%` : '0%' }}
                    >
                      <span className="bar-label">{accuracy.toFixed(0)}% precisión</span>
                    </div>
                  </div>
                </div>
                <div className="chart-domain-stats">
                  <span className="stat-primary">{correct}/{attempted}</span>
                  <span className="stat-secondary">Cobertura {completion.toFixed(0)}%</span>
                  {isSelected && (
                    <>
                      <span className="stat-detail">{data?.incorrect ?? 0} incorrectas</span>
                      <span className="stat-detail">Confianza {formatConfidence(avgConfidence)}</span>
                      <span className="stat-detail">Última práctica {formatRelativeDate(lastAttempt)}</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Accuracy Evolution Timeline */}
      {/* ✅ FIX 8: Filtrar solo quizzes para evolución */}
      {progress.history && progress.history.filter(h => h.type === 'quiz').length > 0 && (
        <div className="section-duo">
          <h2 className="section-title-duo">
            <span className="title-icon">📈</span>
            Evolución de Tu Precisión
          </h2>
          <div className="evolution-mega-timeline">
            {progress.history
              .filter(h => h.type === 'quiz')
              .slice(0, 10)
              .reverse()
              .map((quiz, idx) => {
              const accuracy = quiz?.accuracy ?? 0;
              const score = quiz?.score ?? 0;
              const totalQuestions = quiz?.questions ?? 0;
              return (
                <div 
                  key={idx} 
                  className="evolution-point"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                  title={`Quiz ${idx + 1}: ${score}/${totalQuestions} - ${accuracy.toFixed(0)}%`}
                >
                  <div 
                    className="evolution-marker"
                    style={{
                      backgroundColor: accuracy >= 70 ? '#4CAF50' : accuracy >= 50 ? '#FFC107' : '#F44336'
                    }}
                  >
                    <span className="marker-index">{idx + 1}</span>
                    <div className="marker-ripple"></div>
                  </div>
                  <div className="evolution-info">
                    <div className="evolution-accuracy">{accuracy.toFixed(0)}%</div>
                    <div className="evolution-score">{score}/{totalQuestions}</div>
                    <div className="evolution-date">
                      {new Date(quiz.completedAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ===== ACHIEVEMENTS TAB DUOLINGO =====
const AchievementsTabDuo = ({ progress, stats, expandedAchievement, setExpandedAchievement }) => {
  const unlockedIds = useMemo(() => new Set(progress.achievements || []), [progress.achievements]);
  const history = useMemo(() => progress.history || [], [progress.history]);
  const quizHistory = useMemo(
    () => history.filter((entry) => entry?.type === 'quiz'),
    [history]
  );
  const trackingValues = useMemo(
    () => Object.values(progress.questionTracking || {}),
    [progress.questionTracking]
  );

  const computeQuizAccuracy = useCallback((quiz) => {
    if (!quiz) return 0;
    if (quiz.accuracy != null) {
      const value = Number(quiz.accuracy);
      return Number.isFinite(value) ? value : 0;
    }
    const correct = Number(quiz?.correctAnswers ?? quiz?.score ?? 0);
    const total = Number(quiz?.questions ?? quiz?.totalQuestions ?? 0);
    return total > 0 ? (correct / total) * 100 : 0;
  }, []);

  const isWithinLastDays = useCallback((date, days) => {
    if (!date) return false;
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return false;
    const diff = Date.now() - parsed.getTime();
    return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000;
  }, []);

  const computeMaxQuizzesPerDay = useCallback((quizzes) => {
    if (!quizzes.length) return 0;
    const counts = new Map();
    quizzes.forEach((quiz) => {
      const dateValue = quiz?.completedAt || quiz?.date;
      if (!dateValue) return;
      const parsed = new Date(dateValue);
      if (Number.isNaN(parsed.getTime())) return;
      const key = parsed.toISOString().slice(0, 10);
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    return counts.size ? Math.max(...counts.values()) : 0;
  }, []);

  const detectQuizByHour = useCallback((quizzes, startHourInclusive, endHourExclusive) => {
    return quizzes.some((quiz) => {
      const dateValue = quiz?.completedAt || quiz?.date;
      if (!dateValue) return false;
      const parsed = new Date(dateValue);
      if (Number.isNaN(parsed.getTime())) return false;
      const hour = parsed.getHours();
      if (startHourInclusive <= endHourExclusive) {
        return hour >= startHourInclusive && hour < endHourExclusive;
      }
      return hour >= startHourInclusive || hour < endHourExclusive;
    });
  }, []);

  const achievementProgress = useMemo(() => {
    const quizzesTaken = stats?.quizzesTaken ?? quizHistory.length;
    const uniqueQuestions = stats?.questionsAnswered
      ?? trackingValues.filter((q) => (q?.totalAttempts || 0) > 0).length;

    const bestQuizAccuracy = quizHistory.reduce(
      (max, quiz) => Math.max(max, computeQuizAccuracy(quiz)),
      0
    );

    const fastestQuizMs = quizHistory.reduce((min, quiz) => {
      const value = Number(quiz?.timeSpent ?? quiz?.totalTime ?? Infinity);
      if (!Number.isFinite(value) || value <= 0) return min;
      return Math.min(min, value);
    }, Infinity);

    const quizzesThisWeek = quizHistory.filter((quiz) =>
      isWithinLastDays(quiz?.completedAt || quiz?.date, 7)
    ).length;

    const maxQuizzesInDay = computeMaxQuizzesPerDay(quizHistory);
    const nightQuizExists = detectQuizByHour(quizHistory, 22, 6);
    const earlyBirdExists = detectQuizByHour(quizHistory, 5, 7);

    const questionsAcc90 = trackingValues.filter((q) => {
      if (!q || q.totalAttempts === 0) return false;
      const ratio = (q.correctAttempts || 0) / q.totalAttempts;
      return ratio >= 0.9;
    }).length;

    const questionsAcc80 = trackingValues.filter((q) => {
      if (!q || q.totalAttempts === 0) return false;
      const ratio = (q.correctAttempts || 0) / q.totalAttempts;
      return ratio >= 0.8;
    }).length;

    const masteredQuestions = trackingValues.filter((q) =>
      q && q.totalAttempts > 0 &&
      (q.status === QUESTION_STATUS.MASTERED || q.status === QUESTION_STATUS.RETIRED)
    ).length;

    const domainEntries = Object.entries(stats?.domainStats || {});
    const domainCount = domainEntries.length || Object.keys(DOMAIN_LABELS).length;
    const topDomain = domainEntries.reduce((best, [domainKey, data]) => {
      const accuracy = Number(data?.accuracy ?? 0);
      if (!best || accuracy > best.accuracy) {
        return { key: domainKey, accuracy };
      }
      return best;
    }, null);

    const domainsAbove80 = domainEntries.filter(([, data]) => Number(data?.accuracy ?? 0) >= 80).length;
    const domainsAbove75 = domainEntries.filter(([, data]) => Number(data?.accuracy ?? 0) >= 75).length;

    const createProgress = (currentValue, goalValue, options = {}) => {
      if (currentValue == null || goalValue == null) return null;
      const current = Number(currentValue);
      const goal = Number(goalValue);
      if (!Number.isFinite(current) || !Number.isFinite(goal) || goal <= 0) return null;

      let percent;
      if (options.lowerIsBetter) {
        if (current <= 0) return null;
        percent = Math.min(100, (goal / current) * 100);
      } else {
        percent = Math.min(100, (current / goal) * 100);
      }

      if (!Number.isFinite(percent)) {
        percent = 0;
      }

      const decimals = options.decimals ?? 0;
      const defaultFormatter = (value) => {
        if (options.isPercentage) return `${value.toFixed(decimals)}%`;
        return value.toFixed(decimals);
      };

      const formatter = options.displayFormatter || defaultFormatter;

      return {
        current,
        goal,
        percent,
        lowerIsBetter: Boolean(options.lowerIsBetter),
        unit: options.unit || null,
        isPercentage: Boolean(options.isPercentage),
        context: options.context || null,
        displayCurrent: formatter(current),
        displayGoal: formatter(goal)
      };
    };

    return {
      first_quiz: createProgress(quizzesTaken, 1, { unit: 'quiz' }),
      explorer: createProgress(uniqueQuestions, 25, { unit: 'preguntas' }),
      dedicated: createProgress(uniqueQuestions, 50, { unit: 'preguntas' }),
      encyclopedia: createProgress(uniqueQuestions, 75, { unit: 'preguntas' }),
      '100_questions': createProgress(uniqueQuestions, TOTAL_QUESTION_POOL || 100, { unit: 'preguntas' }),
      perfect_quiz: createProgress(bestQuizAccuracy, 100, { unit: '%', isPercentage: true }),
      sharpshooter: createProgress(stats?.accuracyOverall ?? 0, 95, { unit: '%', isPercentage: true, decimals: 1 }),
      accuracy_master: createProgress(questionsAcc90, 20, { unit: 'preguntas' }),
      consistent: createProgress(questionsAcc80, 30, { unit: 'preguntas' }),
      speed_demon: createProgress(fastestQuizMs, 5 * 60000, { lowerIsBetter: true, displayFormatter: formatTimeMs }),
      lightning: createProgress(fastestQuizMs, 3 * 60000, { lowerIsBetter: true, displayFormatter: formatTimeMs }),
      flash: createProgress(fastestQuizMs, 2 * 60000, { lowerIsBetter: true, displayFormatter: formatTimeMs }),
      streak_3: createProgress(progress.longestStreak ?? 0, 3, { unit: 'días' }),
      streak_5: createProgress(progress.longestStreak ?? 0, 7, { unit: 'días' }),
      streak_10: createProgress(progress.longestStreak ?? 0, 14, { unit: 'días' }),
      streak_30: createProgress(progress.longestStreak ?? 0, 30, { unit: 'días' }),
      master_domain: topDomain ? createProgress(topDomain.accuracy, 90, { unit: '%', isPercentage: true, context: topDomain.key }) : null,
      domain_expert: createProgress(domainsAbove80, Math.min(3, domainCount), { unit: 'dominios' }),
      polymath: createProgress(domainsAbove75, domainCount, { unit: 'dominios' }),
      week_warrior: createProgress(quizzesThisWeek, 10, { unit: 'quizzes' }),
      night_owl: nightQuizExists ? createProgress(1, 1, { unit: 'quizzes' }) : null,
      early_bird: earlyBirdExists ? createProgress(1, 1, { unit: 'quizzes' }) : null,
      marathon: createProgress(maxQuizzesInDay, 5, { unit: 'quizzes' }),
      master_20: createProgress(masteredQuestions, 20, { unit: 'preguntas' })
    };
  }, [stats, quizHistory, trackingValues, computeQuizAccuracy, isWithinLastDays, computeMaxQuizzesPerDay, detectQuizByHour, progress.longestStreak]);

  const findUnlockDate = useCallback((achievementId) => {
    for (let i = history.length - 1; i >= 0; i -= 1) {
      const entry = history[i];
      if (entry?.type !== 'quiz') continue;
      if (Array.isArray(entry.newAchievements) && entry.newAchievements.includes(achievementId)) {
        return entry.completedAt || entry.date || null;
      }
    }
    return null;
  }, [history]);

  const achievements = useMemo(() => {
    return Object.entries(ACHIEVEMENT_TYPES).map(([key, achievement]) => {
      const progressInfo = achievementProgress[achievement.id] || null;
      const unlocked = unlockedIds.has(achievement.id);
      const unlockedAt = unlocked ? findUnlockDate(achievement.id) : null;

      return {
        key,
        ...achievement,
        unlocked,
        unlockedAt,
        progressInfo
      };
    });
  }, [achievementProgress, unlockedIds, findUnlockDate]);

  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const lockedAchievements = achievements.filter((a) => !a.unlocked);

  const totalAchievements = achievements.length || 1;
  const summaryPercent = (unlockedAchievements.length / totalAchievements) * 100;

  const renderProgressDetails = (achievement) => {
    if (!achievement.progressInfo) return null;
    const { progressInfo } = achievement;

    return (
      <div className="achievement-progress">
        <div className="achievement-progress-track">
          <div
            className="achievement-progress-fill"
            style={{ width: `${Math.min(100, Math.max(0, progressInfo.percent))}%` }}
          />
        </div>
        <div className="achievement-progress-text">
          {progressInfo.lowerIsBetter
            ? `Mejor tiempo: ${progressInfo.displayCurrent} · Objetivo ${progressInfo.displayGoal}`
            : `${progressInfo.displayCurrent}${progressInfo.unit ? ` ${progressInfo.unit}` : ''} / ${progressInfo.displayGoal}${progressInfo.unit ? ` ${progressInfo.unit}` : ''}`}
          {progressInfo.context && (
            <span className="achievement-progress-context">
              • Destacado: {DOMAIN_LABELS[progressInfo.context] || progressInfo.context}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="achievements-duo">
      <div className="achievements-summary">
        <div className="summary-hero">
          <div className="summary-icon">🏆</div>
          <div className="summary-content">
            <h2 className="summary-title">Tus Logros</h2>
            <p className="summary-stats">
              {unlockedAchievements.length} de {totalAchievements} desbloqueados
            </p>
            <div className="summary-bar">
              <div
                className="summary-bar-fill"
                style={{ width: `${summaryPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {unlockedAchievements.length > 0 && (
        <div className="achievement-section">
          <h3 className="achievement-section-title">
            ✨ Logros Desbloqueados ({unlockedAchievements.length})
          </h3>
          <div className="achievements-grid-duo">
            {unlockedAchievements.map((achievement, idx) => (
              <div
                key={achievement.key}
                className={`achievement-card-duo unlocked ${expandedAchievement === achievement.key ? 'expanded' : ''}`}
                onClick={() => setExpandedAchievement(expandedAchievement === achievement.key ? null : achievement.key)}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="achievement-glow" />
                <div className="achievement-icon-large">{achievement.icon}</div>
                <div className="achievement-content">
                  <h4 className="achievement-title">{achievement.name}</h4>
                  <p className="achievement-description">{achievement.description}</p>
                  {achievement.unlockedAt && (
                    <div className="achievement-date">
                      🎉 Desbloqueado: {new Date(achievement.unlockedAt).toLocaleDateString('es-ES')}
                    </div>
                  )}
                  <div className="achievement-xp">+{achievement.points ?? 0} pts</div>
                  {renderProgressDetails(achievement)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {lockedAchievements.length > 0 && (
        <div className="achievement-section">
          <h3 className="achievement-section-title">
            🔒 Logros por Desbloquear ({lockedAchievements.length})
          </h3>
          <div className="achievements-grid-duo">
            {lockedAchievements.map((achievement, idx) => (
              <div
                key={achievement.key}
                className="achievement-card-duo locked"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="achievement-icon-large grayscale">{achievement.icon}</div>
                <div className="achievement-content">
                  <h4 className="achievement-title">{achievement.name}</h4>
                  <p className="achievement-description">{achievement.description}</p>
                  <div className="achievement-xp">+{achievement.points ?? 0} pts</div>
                  {renderProgressDetails(achievement)}
                </div>
                <div className="locked-overlay">🔒</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ===== DOMAINS TAB DUOLINGO =====
const DomainsTabDuo = ({ stats, animateCharts }) => {
  const domainNames = {
    'preparar-datos': { name: 'Preparar Datos', icon: '📊', color: '#FF9800' },
    'modelar-datos': { name: 'Modelar Datos', icon: '🧮', color: '#9C27B0' },
    'visualizar-analizar': { name: 'Visualizar y Analizar', icon: '📈', color: '#2196F3' },
    'administrar-asegurar': { name: 'Administrar y Asegurar', icon: '🔐', color: '#4CAF50' }
  };

  const domainData = Object.entries(stats.domainStats || {}).map(([key, data]) => ({
    key,
    ...domainNames[key],
    ...data
  }));

  return (
    <div className="domains-duo">
      <div className="domains-intro">
        <h2 className="domains-title">Explora los 4 Dominios de Power BI</h2>
        <p className="domains-subtitle">Domina cada área para convertirte en un experto</p>
      </div>

      <div className="domains-mega-grid">
        {domainData.map((domain, idx) => {
          const accuracy = domain.accuracy ?? 0;
          const attempted = domain.attempted ?? 0;
          const correct = domain.correct ?? 0;
          const incorrect = domain.incorrect ?? 0;
          const mastered = domain.mastered ?? 0;
          const totalAttempts = domain.totalAttempts ?? 0;
          const totalQuestions = domain.totalQuestions ?? DOMAIN_TOTAL_QUESTIONS[domain.key] ?? 0;
          const completion = domain.completion ?? (totalQuestions > 0 ? (attempted / totalQuestions) * 100 : 0);
          const avgConfidenceText = formatConfidence(domain.avgConfidence);
          const lastPracticeText = formatRelativeDate(domain.lastAttempt);
          const avgTimeSeconds = domain.avgTime ? (domain.avgTime / 1000) : null;
          const avgTimeText = avgTimeSeconds && Number.isFinite(avgTimeSeconds)
            ? `${avgTimeSeconds.toFixed(1)}s`
            : 'Sin datos';
          
          return (
            <div 
              key={domain.key}
              className="domain-mega-card"
              style={{ 
                '--domain-color': domain.color,
                animationDelay: `${idx * 0.15}s`
              }}
            >
              <div className="domain-card-header">
                <div className="domain-icon-mega">{domain.icon}</div>
                <h3 className="domain-name">{domain.name}</h3>
              </div>

              <div className="domain-accuracy-circle">
                <svg className="circle-svg" viewBox="0 0 120 120">
                  <circle
                    className="circle-bg"
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="8"
                  />
                  <circle
                    className="circle-progress"
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke={domain.color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="339.292"
                    strokeDashoffset={animateCharts ? 339.292 - (339.292 * accuracy / 100) : 339.292}
                  />
                </svg>
                <div className="circle-content">
                  <div className="circle-accuracy">{accuracy.toFixed(0)}%</div>
                  <div className="circle-label">Precisión</div>
                </div>
              </div>

              <div className="domain-stats-grid">
                <div className="domain-stat">
                  <div className="stat-icon">✅</div>
                  <div className="stat-value">{correct}</div>
                  <div className="stat-label">Correctas</div>
                </div>
                <div className="domain-stat">
                  <div className="stat-icon">❌</div>
                  <div className="stat-value">{incorrect}</div>
                  <div className="stat-label">Incorrectas</div>
                </div>
                <div className="domain-stat">
                  <div className="stat-icon">🎓</div>
                  <div className="stat-value">{mastered}</div>
                  <div className="stat-label">Dominadas</div>
                </div>
                <div className="domain-stat">
                  <div className="stat-icon">�</div>
                  <div className="stat-value">{totalAttempts}</div>
                  <div className="stat-label">Intentos</div>
                </div>
              </div>

              <div className="domain-progress-bar">
                <div 
                  className="domain-progress-fill"
                  style={{ 
                    width: animateCharts ? `${Math.min(100, completion)}%` : '0%',
                    backgroundColor: domain.color
                  }}
                ></div>
              </div>
              <div className="domain-progress-label">
                {correct}/{totalQuestions || '∞'} preguntas dominadas
              </div>

              <div className="domain-insights">
                <div className="domain-insight">
                  <span className="insight-label">Cobertura</span>
                  <span className="insight-value">{completion.toFixed(0)}%</span>
                </div>
                <div className="domain-insight">
                  <span className="insight-label">Confianza</span>
                  <span className="insight-value">{avgConfidenceText}</span>
                </div>
                <div className="domain-insight">
                  <span className="insight-label">Tiempo promedio</span>
                  <span className="insight-value">{avgTimeText}</span>
                </div>
                <div className="domain-insight">
                  <span className="insight-label">Última práctica</span>
                  <span className="insight-value">{lastPracticeText}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {domainData.length === 0 && (
        <div className="domains-empty">
          <div className="empty-icon-large">📚</div>
          <h3>Comienza Tu Aventura</h3>
          <p>Completa quizzes para explorar los diferentes dominios</p>
        </div>
      )}
    </div>
  );
};

export default ProfileScreenDuolingo;

