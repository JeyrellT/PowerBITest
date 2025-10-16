/**
 * ValidationActivity.js - Componente de validación de datos
 * Basado en FASE_3 - Tipo de actividad: validation
 */

import React, { useState } from 'react';
import './ValidationActivity.css';

const ValidationActivity = ({ 
  validationChecks = [], 
  dataset = {},
  instructions = '',
  onComplete,
  onProgress
}) => {
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [notes, setNotes] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleIssueToggle = (issueId) => {
    setSelectedIssues(prev => {
      const newSelected = prev.includes(issueId)
        ? prev.filter(id => id !== issueId)
        : [...prev, issueId];
      
      // Update progress
      if (onProgress) {
        const progress = (newSelected.length / validationChecks.length) * 100;
        onProgress(progress);
      }
      
      return newSelected;
    });
  };

  const handleNoteChange = (issueId, note) => {
    setNotes(prev => ({
      ...prev,
      [issueId]: note
    }));
  };

  const handleSubmit = () => {
    setShowResults(true);
    
    if (onComplete) {
      onComplete({
        selectedIssues,
        notes,
        totalChecks: validationChecks.length
      });
    }
  };

  const isCorrectlySelected = (check) => {
    const isSelected = selectedIssues.includes(check.id);
    return isSelected === check.hasIssue;
  };

  const correctCount = validationChecks.filter(check => 
    isCorrectlySelected(check)
  ).length;

  const score = (correctCount / validationChecks.length) * 100;

  return (
    <div className="validation-activity">
      {instructions && (
        <div className="validation-instructions">
          <div className="validation-instructions-icon">🔍</div>
          <div className="validation-instructions-text">{instructions}</div>
        </div>
      )}

      {/* Mostrar preview del dataset si existe */}
      {dataset?.invoices && dataset.invoices.length > 0 && (
        <div className="validation-dataset-preview">
          <h4>Dataset a validar ({dataset.invoices.length} registros)</h4>
          <div className="validation-dataset-sample">
            {dataset.invoices.slice(0, 3).map((invoice, idx) => (
              <div key={idx} className="validation-sample-row">
                <span className="validation-sample-field">
                  <strong>ID:</strong> {invoice.invoice_number || invoice.id}
                </span>
                <span className="validation-sample-field">
                  <strong>Cliente:</strong> {invoice.customer_name}
                </span>
                <span className="validation-sample-field">
                  <strong>Monto:</strong> {invoice.amount}
                </span>
                <span className="validation-sample-field">
                  <strong>Fecha:</strong> {invoice.due_date || invoice.issue_date}
                </span>
              </div>
            ))}
            {dataset.invoices.length > 3 && (
              <div className="validation-sample-more">
                ... y {dataset.invoices.length - 3} registros más
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mostrar factura individual si existe */}
      {dataset?.invoice && (
        <div className="validation-dataset-preview">
          <h4>Factura a revisar</h4>
          <div className="validation-invoice-details">
            <div className="validation-invoice-row">
              <span className="validation-field-label">Número de Factura:</span>
              <span className="validation-field-value">{dataset.invoice.invoice_number || 'N/A'}</span>
            </div>
            <div className="validation-invoice-row">
              <span className="validation-field-label">Cliente:</span>
              <span className="validation-field-value">{dataset.invoice.customer_name || 'N/A'}</span>
            </div>
            <div className="validation-invoice-row">
              <span className="validation-field-label">ID del Cliente:</span>
              <span className="validation-field-value">{dataset.invoice.customer_id || '⚠️ Faltante'}</span>
            </div>
            <div className="validation-invoice-row">
              <span className="validation-field-label">Fecha de Emisión:</span>
              <span className="validation-field-value">{dataset.invoice.issue_date || 'N/A'}</span>
            </div>
            <div className="validation-invoice-row">
              <span className="validation-field-label">Fecha de Vencimiento:</span>
              <span className="validation-field-value">{dataset.invoice.due_date || '⚠️ Faltante'}</span>
            </div>
            <div className="validation-invoice-row">
              <span className="validation-field-label">Monto:</span>
              <span className="validation-field-value">${dataset.invoice.amount || 0}</span>
            </div>
            <div className="validation-invoice-row">
              <span className="validation-field-label">Impuesto:</span>
              <span className="validation-field-value">{dataset.invoice.tax || '⚠️ Faltante'}</span>
            </div>
            <div className="validation-invoice-row">
              <span className="validation-field-label">Términos de Pago:</span>
              <span className="validation-field-value">{dataset.invoice.payment_terms || '⚠️ Faltante'}</span>
            </div>
          </div>
        </div>
      )}

      <div className="validation-progress-info">
        <span>Validaciones marcadas: {selectedIssues.length} / {validationChecks.length}</span>
      </div>

      <div className="validation-checks-container">
        {validationChecks.map((check) => {
          const isSelected = selectedIssues.includes(check.id);
          const isCorrect = showResults && isCorrectlySelected(check);
          const isIncorrect = showResults && !isCorrectlySelected(check);

          let checkClass = 'validation-check-card';
          if (isSelected && !showResults) checkClass += ' validation-check-selected';
          if (isCorrect) checkClass += ' validation-check-correct';
          if (isIncorrect) checkClass += ' validation-check-incorrect';

          return (
            <div key={check.id} className={checkClass}>
              <div className="validation-check-header">
                <label className="validation-check-label">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleIssueToggle(check.id)}
                    disabled={showResults}
                    className="validation-check-checkbox"
                  />
                  <span className="validation-check-title">{check.title}</span>
                </label>
                
                {showResults && (
                  <span className="validation-check-result-icon">
                    {isCorrect ? '✓' : '✗'}
                  </span>
                )}
              </div>

              <div className="validation-check-description">
                {check.description}
              </div>

              {check.example && (
                <div className="validation-check-example">
                  <strong>Ejemplo:</strong> {check.example}
                </div>
              )}

              {isSelected && !showResults && (
                <div className="validation-check-note">
                  <label className="validation-note-label">
                    Notas adicionales (opcional):
                  </label>
                  <textarea
                    className="validation-note-input"
                    value={notes[check.id] || ''}
                    onChange={(e) => handleNoteChange(check.id, e.target.value)}
                    placeholder="Agrega detalles sobre el problema encontrado..."
                    rows={2}
                  />
                </div>
              )}

              {showResults && (
                <div className={`validation-check-feedback ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`}>
                  {check.hasIssue ? (
                    <>
                      <strong>✓ Problema real:</strong> {check.explanation}
                    </>
                  ) : (
                    <>
                      <strong>Este dato está correcto.</strong> {check.explanation}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!showResults ? (
        <div className="validation-actions">
          <button
            className="validation-submit-button"
            onClick={handleSubmit}
            disabled={selectedIssues.length === 0}
          >
            Enviar validación
          </button>
        </div>
      ) : (
        <div className="validation-results">
          <div className="validation-results-card">
            <div className="validation-results-title">
              Resultados de la validación
            </div>
            <div className="validation-results-stats">
              <div className="validation-stat">
                <div className="validation-stat-value">{correctCount}</div>
                <div className="validation-stat-label">Correctas</div>
              </div>
              <div className="validation-stat">
                <div className="validation-stat-value">{validationChecks.length - correctCount}</div>
                <div className="validation-stat-label">Incorrectas</div>
              </div>
              <div className="validation-stat validation-stat-score">
                <div className="validation-stat-value">{Math.round(score)}%</div>
                <div className="validation-stat-label">Puntuación</div>
              </div>
            </div>
            <div className="validation-results-message">
              {score >= 80 ? (
                <span className="validation-message-success">
                  ¡Excelente trabajo! Has identificado correctamente la mayoría de los problemas.
                </span>
              ) : score >= 60 ? (
                <span className="validation-message-warning">
                  Buen intento. Revisa los errores para mejorar tu precisión.
                </span>
              ) : (
                <span className="validation-message-error">
                  Necesitas más práctica. Revisa las explicaciones cuidadosamente.
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationActivity;
