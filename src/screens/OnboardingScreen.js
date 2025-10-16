import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DialogueBox from '../components/cxc/DialogueBox';
import { CHARACTERS, DIALOGUES } from '../data/cxc/characters';
import '../styles/OnboardingScreen.css';

/**
 * OnboardingScreen - Primera experiencia del usuario
 * Basado en FASE_1 tutorial y FASE_2 onboarding flow
 */
const OnboardingScreen = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [showDialogue, setShowDialogue] = useState(false);

  const steps = [
    {
      id: 'welcome',
      title: '¡Bienvenido a SuperMercado Global!',
      subtitle: 'Tu viaje en el mundo de Cuentas por Cobrar comienza aquí',
      icon: '🎓',
      content: (
        <div className="onboarding-content">
          <p className="onboarding-text">
            Estás a punto de unirte al departamento de <strong>Cuentas por Cobrar (CxC)</strong> de 
            SuperMercado Global, una empresa líder en retail.
          </p>
          <p className="onboarding-text">
            Durante las próximas <strong>9 horas</strong>, aprenderás todo sobre el proceso 
            Order-to-Cash (O2C), desde la emisión de facturas hasta el análisis de KPIs globales.
          </p>
          <div className="onboarding-features">
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span className="feature-text">11 misiones interactivas</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎮</span>
              <span className="feature-text">Sistema de puntos y rankings</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🏆</span>
              <span className="feature-text">Insignias y logros</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🆘</span>
              <span className="feature-text">Sistema de ayudas inteligente</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'name',
      title: '¿Cómo te llamas?',
      subtitle: 'Personalicemos tu experiencia',
      icon: '👤',
      content: (
        <div className="onboarding-content">
          <p className="onboarding-text">
            Ingresa tu nombre para que podamos personalizar tu experiencia de aprendizaje.
          </p>
          <input
            type="text"
            className="name-input"
            placeholder="Tu nombre..."
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={30}
            autoFocus
          />
          {playerName && (
            <p className="name-preview">
              ¡Hola, <strong>{playerName}</strong>! 👋
            </p>
          )}
        </div>
      )
    },
    {
      id: 'o2c',
      title: 'El Proceso O2C (Order to Cash)',
      subtitle: 'Fundamento del departamento CxC',
      icon: '🔄',
      content: (
        <div className="onboarding-content">
          <p className="onboarding-text">
            El proceso <strong>Order to Cash (O2C)</strong> es el ciclo completo desde que un cliente 
            hace un pedido hasta que pagamos y registramos el pago.
          </p>
          <div className="o2c-flow">
            <div className="o2c-step">
              <span className="o2c-number">1</span>
              <div className="o2c-info">
                <h4>📦 Pedido</h4>
                <p>Cliente solicita productos</p>
              </div>
            </div>
            <div className="o2c-arrow">→</div>
            <div className="o2c-step">
              <span className="o2c-number">2</span>
              <div className="o2c-info">
                <h4>📄 Factura</h4>
                <p>Emitimos factura formal</p>
              </div>
            </div>
            <div className="o2c-arrow">→</div>
            <div className="o2c-step">
              <span className="o2c-number">3</span>
              <div className="o2c-info">
                <h4>💰 Pago</h4>
                <p>Cliente envía pago</p>
              </div>
            </div>
            <div className="o2c-arrow">→</div>
            <div className="o2c-step">
              <span className="o2c-number">4</span>
              <div className="o2c-info">
                <h4>✅ Registro</h4>
                <p>Aplicamos y conciliamos</p>
              </div>
            </div>
          </div>
          <div className="info-box">
            <span className="info-icon">💡</span>
            <p>
              <strong>Tu rol:</strong> Serás responsable de asegurar que este proceso fluya 
              correctamente, minimizando errores y optimizando el tiempo de cobro (DSO).
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'team',
      title: 'Conoce a tu Equipo',
      subtitle: 'Las personas que te acompañarán',
      icon: '👥',
      content: (
        <div className="onboarding-content">
          <p className="onboarding-text">
            Trabajarás con un equipo experimentado que te guiará en cada paso:
          </p>
          <div className="team-grid">
            <div className="team-member">
              <span className="team-avatar" style={{ background: 'var(--gradient-tess)' }}>
                {CHARACTERS.tess.icon}
              </span>
              <h4>{CHARACTERS.tess.name}</h4>
              <p className="team-role">{CHARACTERS.tess.role}</p>
              <p className="team-description">{CHARACTERS.tess.description}</p>
            </div>
            <div className="team-member">
              <span className="team-avatar" style={{ background: 'var(--gradient-gustavo)' }}>
                {CHARACTERS.gustavo.icon}
              </span>
              <h4>{CHARACTERS.gustavo.name}</h4>
              <p className="team-role">{CHARACTERS.gustavo.role}</p>
              <p className="team-description">{CHARACTERS.gustavo.description}</p>
            </div>
            <div className="team-member">
              <span className="team-avatar" style={{ background: 'var(--gradient-priya)' }}>
                {CHARACTERS.priya.icon}
              </span>
              <h4>{CHARACTERS.priya.name}</h4>
              <p className="team-role">{CHARACTERS.priya.role}</p>
              <p className="team-description">{CHARACTERS.priya.description}</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const canProceed = currentStep !== 1 || playerName.trim().length > 0;

  const handleNext = () => {
    if (isLastStep) {
      // Guardar nombre y mostrar diálogo inicial
      localStorage.setItem('cxc_player_name', playerName);
      setShowDialogue(true);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDialogueComplete = () => {
    // Redirigir al menú principal
    navigate('/cxc/menu');
  };

  useEffect(() => {
    // Cargar nombre guardado si existe
    const savedName = localStorage.getItem('cxc_player_name');
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);

  if (showDialogue) {
    return (
      <div className="onboarding-dialogue-screen">
        <DialogueBox
          character={CHARACTERS.tess}
          dialogues={DIALOGUES.tutorial_welcome}
          onComplete={handleDialogueComplete}
          autoAdvance={false}
        />
      </div>
    );
  }

  return (
    <div className="onboarding-screen">
      <div className="onboarding-container">
        {/* Progress indicator */}
        <div className="onboarding-progress">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`progress-dot ${index === currentStep ? 'progress-dot--active' : ''} ${index < currentStep ? 'progress-dot--completed' : ''}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="onboarding-card">
          <div className="onboarding-header">
            <span className="onboarding-icon">{currentStepData.icon}</span>
            <h2 className="onboarding-title">{currentStepData.title}</h2>
            <p className="onboarding-subtitle">{currentStepData.subtitle}</p>
          </div>

          <div className="onboarding-body">
            {currentStepData.content}
          </div>

          <div className="onboarding-footer">
            {currentStep > 0 && (
              <button className="btn-secondary" onClick={handleBack}>
                ← Atrás
              </button>
            )}
            <div className="flex-spacer"></div>
            <button
              className="btn-primary"
              onClick={handleNext}
              disabled={!canProceed}
            >
              {isLastStep ? '¡Comenzar! 🚀' : 'Siguiente →'}
            </button>
          </div>
        </div>

        {/* Skip option */}
        {currentStep === 0 && (
          <button className="skip-button" onClick={() => navigate('/cxc/menu')}>
            Saltar introducción
          </button>
        )}
      </div>
    </div>
  );
};

export default OnboardingScreen;
