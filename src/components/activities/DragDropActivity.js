/**
 * DragDropActivity.js - Componente de arrastrar y soltar (Cash Application)
 * Basado en FASE_3 - Tipo de actividad: drag_drop
 */

import React, { useState } from 'react';
import './DragDropActivity.css';

const DragDropActivity = ({ 
  items = [], 
  targets = [], 
  correctMatches = {},
  instructions = '',
  onComplete,
  onProgress
}) => {
  const [matches, setMatches] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, target) => {
    e.preventDefault();
    
    if (!draggedItem) return;

    // Remove previous match if exists
    const newMatches = { ...matches };
    Object.keys(newMatches).forEach(key => {
      if (newMatches[key] === draggedItem.id) {
        delete newMatches[key];
      }
    });

    // Add new match
    newMatches[target.id] = draggedItem.id;
    setMatches(newMatches);
    setDraggedItem(null);

    // Update progress
    if (onProgress) {
      const progress = (Object.keys(newMatches).length / targets.length) * 100;
      onProgress(progress);
    }
  };

  const handleRemoveMatch = (targetId) => {
    const newMatches = { ...matches };
    delete newMatches[targetId];
    setMatches(newMatches);

    if (onProgress) {
      const progress = (Object.keys(newMatches).length / targets.length) * 100;
      onProgress(progress);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);

    if (onComplete) {
      onComplete({
        matches,
        totalMatches: targets.length
      });
    }
  };

  const isCorrectMatch = (targetId) => {
    return matches[targetId] === correctMatches[targetId];
  };

  const getMatchedItem = (targetId) => {
    const itemId = matches[targetId];
    return items.find(item => item.id === itemId);
  };

  const isItemMatched = (itemId) => {
    return Object.values(matches).includes(itemId);
  };

  const correctCount = Object.keys(matches).filter(targetId => 
    isCorrectMatch(targetId)
  ).length;

  const score = targets.length > 0 
    ? (correctCount / targets.length) * 100 
    : 0;

  return (
    <div className="dragdrop-activity">
      {instructions && (
        <div className="dragdrop-instructions">
          <div className="dragdrop-instructions-icon">🔄</div>
          <div className="dragdrop-instructions-text">{instructions}</div>
        </div>
      )}

      <div className="dragdrop-progress-info">
        <span>Emparejamientos realizados: {Object.keys(matches).length} / {targets.length}</span>
      </div>

      <div className="dragdrop-container">
        {/* Items to drag */}
        <div className="dragdrop-items-section">
          <h3 className="dragdrop-section-title">
            Pagos disponibles ({items.length})
          </h3>
          <div className="dragdrop-items-list">
            {items.map((item) => {
              const isMatched = isItemMatched(item.id);
              
              return (
                <div
                  key={item.id}
                  className={`dragdrop-item ${isMatched ? 'dragdrop-item-matched' : ''} ${draggedItem?.id === item.id ? 'dragdrop-item-dragging' : ''}`}
                  draggable={!showResults && !isMatched}
                  onDragStart={(e) => handleDragStart(e, item)}
                >
                  <div className="dragdrop-item-header">
                    <span className="dragdrop-item-id">{item.payment_number || item.id}</span>
                    <span className="dragdrop-item-amount">${item.amount.toLocaleString()}</span>
                  </div>
                  <div className="dragdrop-item-details">
                    <span className="dragdrop-item-customer">{item.customer_name}</span>
                    {item.reference && (
                      <span className="dragdrop-item-ref">Ref: {item.reference}</span>
                    )}
                  </div>
                  <div className="dragdrop-item-meta">
                    <span>{item.method}</span>
                    <span>{item.payment_date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Targets to drop */}
        <div className="dragdrop-targets-section">
          <h3 className="dragdrop-section-title">
            Facturas pendientes ({targets.length})
          </h3>
          <div className="dragdrop-targets-list">
            {targets.map((target) => {
              const matchedItem = getMatchedItem(target.id);
              const isCorrect = showResults && isCorrectMatch(target.id);
              const isIncorrect = showResults && matches[target.id] && !isCorrectMatch(target.id);

              let targetClass = 'dragdrop-target';
              if (matchedItem) targetClass += ' dragdrop-target-filled';
              if (isCorrect) targetClass += ' dragdrop-target-correct';
              if (isIncorrect) targetClass += ' dragdrop-target-incorrect';

              return (
                <div
                  key={target.id}
                  className={targetClass}
                  onDragOver={!showResults ? handleDragOver : undefined}
                  onDrop={!showResults ? (e) => handleDrop(e, target) : undefined}
                >
                  <div className="dragdrop-target-header">
                    <span className="dragdrop-target-id">{target.invoice_number || target.id}</span>
                    <span className="dragdrop-target-amount">${target.amount.toLocaleString()}</span>
                  </div>
                  <div className="dragdrop-target-details">
                    <span className="dragdrop-target-customer">{target.customer_name}</span>
                    <span className="dragdrop-target-date">Vence: {target.due_date}</span>
                  </div>

                  {matchedItem ? (
                    <div className="dragdrop-matched-item">
                      <div className="dragdrop-matched-header">
                        <span className="dragdrop-matched-icon">📄</span>
                        <span className="dragdrop-matched-id">
                          {matchedItem.payment_number || matchedItem.id}
                        </span>
                        {!showResults && (
                          <button
                            className="dragdrop-remove-button"
                            onClick={() => handleRemoveMatch(target.id)}
                          >
                            ✕
                          </button>
                        )}
                        {showResults && (
                          <span className="dragdrop-result-icon">
                            {isCorrect ? '✓' : '✗'}
                          </span>
                        )}
                      </div>
                      <div className="dragdrop-matched-amount">
                        ${matchedItem.amount.toLocaleString()}
                      </div>
                    </div>
                  ) : (
                    <div className="dragdrop-drop-zone">
                      {!showResults && (
                        <>
                          <span className="dragdrop-drop-icon">⬇</span>
                          <span className="dragdrop-drop-text">Arrastra un pago aquí</span>
                        </>
                      )}
                    </div>
                  )}

                  {showResults && !matches[target.id] && (
                    <div className="dragdrop-missing-match">
                      <span>Sin emparejar ✗</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {!showResults ? (
        <div className="dragdrop-actions">
          <button
            className="dragdrop-submit-button"
            onClick={handleSubmit}
            disabled={Object.keys(matches).length === 0}
          >
            Enviar emparejamientos
          </button>
        </div>
      ) : (
        <div className="dragdrop-results">
          <div className="dragdrop-results-card">
            <div className="dragdrop-results-title">
              Resultados del emparejamiento
            </div>
            <div className="dragdrop-results-stats">
              <div className="dragdrop-stat">
                <div className="dragdrop-stat-value">{correctCount}</div>
                <div className="dragdrop-stat-label">Correctos</div>
              </div>
              <div className="dragdrop-stat">
                <div className="dragdrop-stat-value">{Object.keys(matches).length - correctCount}</div>
                <div className="dragdrop-stat-label">Incorrectos</div>
              </div>
              <div className="dragdrop-stat dragdrop-stat-score">
                <div className="dragdrop-stat-value">{Math.round(score)}%</div>
                <div className="dragdrop-stat-label">Puntuación</div>
              </div>
            </div>
            <div className="dragdrop-results-message">
              {score >= 80 ? (
                <span className="dragdrop-message-success">
                  ¡Excelente! Has emparejado correctamente la mayoría de los pagos.
                </span>
              ) : score >= 60 ? (
                <span className="dragdrop-message-warning">
                  Bien hecho. Revisa los emparejamientos incorrectos.
                </span>
              ) : (
                <span className="dragdrop-message-error">
                  Necesitas más práctica. Presta atención a los montos y referencias.
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DragDropActivity;
