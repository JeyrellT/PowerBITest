import React, { useState, useEffect } from 'react';
import './DialogueBox.css';

/**
 * Componente DialogueBox
 * Muestra diálogos secuenciales con personajes
 */
const DialogueBox = ({ 
  character, 
  dialogues = [], 
  onComplete, 
  autoAdvance = false,
  autoAdvanceDelay = 3000,
  showAvatar = true 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setCurrentIndex(0);
  }, [dialogues]);

  const handleNext = () => {
    if (currentIndex < dialogues.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 500);
    } else {
      if (onComplete) onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  useEffect(() => {
    if (!autoAdvance || currentIndex >= dialogues.length - 1) return;

    const timer = setTimeout(() => {
      handleNext();
    }, autoAdvanceDelay);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, autoAdvance, autoAdvanceDelay, dialogues.length]);

  if (!dialogues || dialogues.length === 0) {
    return null;
  }

  const currentDialogue = dialogues[currentIndex];
  const isLastDialogue = currentIndex === dialogues.length - 1;

  return (
    <div className="dialogue-box">
      {showAvatar && (
        <div className="dialogue-avatar">
          <div className={`avatar-circle ${character?.id || 'default'}`}>
            {character?.icon || character?.name?.[0] || '👤'}
          </div>
          <div className="character-name">{character?.name || 'Narrador'}</div>
          <div className="character-role">{character?.role || ''}</div>
        </div>
      )}
      
      <div className="dialogue-content">
        <div className="dialogue-header">
          <span className="dialogue-progress">
            {currentIndex + 1} / {dialogues.length}
          </span>
        </div>

        <div className={`dialogue-text ${isTyping ? 'typing' : ''}`}>
          {currentDialogue}
        </div>

        <div className="dialogue-controls">
          <button
            className="dialogue-btn dialogue-btn-prev"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            ← Anterior
          </button>

          <div className="dialogue-dots">
            {dialogues.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''} ${index < currentIndex ? 'completed' : ''}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>

          <button
            className={`dialogue-btn dialogue-btn-next ${isLastDialogue ? 'primary' : ''}`}
            onClick={handleNext}
          >
            {isLastDialogue ? 'Continuar ✓' : 'Siguiente →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DialogueBox;
