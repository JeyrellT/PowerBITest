import React, { useState } from 'react';
import './styles/App.css';
import OnboardingFlow from './components/onboarding/OnboardingFlow';
import HomeScreen from './components/HomeScreen';
import ProfileScreenDuolingo from './components/ProfileScreenDuolingo';
import InstructionsScreen from './components/InstructionsScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import AnalysisScreen from './components/AnalysisScreen';
import ExamGuideScreen from './components/ExamGuideScreen';
import UnderConstructionScreen from './components/UnderConstructionScreen';
import DonationPaywall from './components/DonationPaywall';
import { ThemeProvider } from './contexts/ThemeContext';
import { CxCProgressProvider } from './contexts/CxCProgressContext';
import { PaywallProvider, usePaywall } from './contexts/PaywallContext';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [quizConfig, setQuizConfig] = useState({
    domain: 'all',
    level: 'all',
    numberOfQuestions: 20
  });
  const [quizResults, setQuizResults] = useState(null);
  
  // Hook del paywall desde el contexto
  const { shouldShowPaywall, unlockApp } = usePaywall();

  const handleOnboardingComplete = (profile) => {
    // El perfil ahora se maneja globalmente por el contexto
    // Solo navegar a home
    setCurrentScreen('home');
  };

  const navigateToScreen = (screen, data, updateType) => {
    if (data) {
      if (data.config) setQuizConfig(data.config);
      if (data.results) setQuizResults(data.results);
    }
    if (!data && updateType === 'quiz-complete') {
      setQuizResults((prev) => (prev ? { ...prev } : prev));
    }
    setCurrentScreen(screen);
  };

  const restartQuiz = () => {
    setQuizResults(null);
    setCurrentScreen('home');
  };

  const handleResetProfile = () => {
    // El reset se maneja globalmente
    setCurrentScreen('onboarding');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return <OnboardingFlow onComplete={handleOnboardingComplete} />;
      case 'home':
        return (
          <HomeScreen 
            onNavigate={navigateToScreen}
            onResetProfile={handleResetProfile}
          />
        );
      case 'instructions':
        return (
          <InstructionsScreen 
            onNavigate={navigateToScreen} 
            quizConfig={quizConfig}
          />
        );
      case 'quiz':
        return (
          <QuizScreen 
            onNavigate={navigateToScreen} 
            quizConfig={quizConfig}
          />
        );
      case 'results':
        return (
          <ResultsScreen 
            onNavigate={navigateToScreen} 
            results={quizResults}
          />
        );
      case 'analysis':
        return (
          <AnalysisScreen 
            onNavigate={navigateToScreen} 
            results={quizResults} 
            onRestart={restartQuiz}
          />
        );
      case 'exam-guide':
        return (
          <ExamGuideScreen 
            onNavigate={navigateToScreen}
          />
        );
      case 'profile':
        return (
          <ProfileScreenDuolingo 
            onNavigate={navigateToScreen}
          />
        );
      case 'cxc':
        return (
          <UnderConstructionScreen
            onNavigate={navigateToScreen}
            mode="cxc"
          />
        );
      case 'diagnostico':
        return (
          <UnderConstructionScreen
            onNavigate={navigateToScreen}
            mode="diagnostico"
          />
        );
      default:
        return (
          <HomeScreen 
            onNavigate={navigateToScreen}
            onResetProfile={handleResetProfile}
          />
        );
    }
  };

  return (
    <div className="App">
      {renderScreen()}
      
      {/* Paywall Modal - Se muestra cuando se alcanza el límite */}
      {shouldShowPaywall && (
        <DonationPaywall onUnlock={unlockApp} />
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <CxCProgressProvider>
        <PaywallProvider>
          <AppContent />
        </PaywallProvider>
      </CxCProgressProvider>
    </ThemeProvider>
  );
}

export default App;
