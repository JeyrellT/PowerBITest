import React, { useState } from 'react';
import WelcomeStep from './WelcomeStep';
import ExperienceStep from './ExperienceStep';
import TechnicalCheckStep from './TechnicalCheckStep';
import ProfileSummary from './ProfileSummary';
import { detectUserProfile } from '../../utils/profileDetection';
import '../../styles/Onboarding.css';

const OnboardingFlow = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({});

  const steps = [
    { component: WelcomeStep, id: 'welcome' },
    { component: ExperienceStep, id: 'experience' },
    { component: TechnicalCheckStep, id: 'technical' },
    { component: ProfileSummary, id: 'summary' }
  ];

  const handleStepComplete = (stepData) => {
    const newUserData = { ...userData, ...stepData };
    setUserData(newUserData);

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      const profile = detectUserProfile(newUserData);
      localStorage.setItem('userProfile', JSON.stringify(profile));
      onComplete(profile);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const CurrentStep = steps[step].component;

  return (
    <div className="onboarding-container">
      <div className="onboarding-progress">
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
        <p className="progress-text">Paso {step + 1} de {steps.length}</p>
      </div>

      <div className="onboarding-content">
        <CurrentStep 
          onComplete={handleStepComplete}
          onBack={step > 0 ? handleBack : null}
          userData={userData}
        />
      </div>
    </div>
  );
};

export default OnboardingFlow;
