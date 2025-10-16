/**
 * FormActivity.js - Componente de formulario dinámico
 * Basado en FASE_3 - Tipo de actividad: form
 */

import React, { useState } from 'react';
import './FormActivity.css';

const FormActivity = ({ 
  fields = [], 
  initialData = {},
  instructions = '',
  onComplete,
  onProgress
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));

    // Clear error on change
    if (errors[fieldId]) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: null
      }));
    }

    // Update progress
    if (onProgress) {
      const filledFields = Object.values({ ...formData, [fieldId]: value })
        .filter(v => v !== '' && v !== null && v !== undefined).length;
      const progress = (filledFields / fields.length) * 100;
      onProgress(progress);
    }
  };

  const handleBlur = (fieldId) => {
    setTouched(prev => ({
      ...prev,
      [fieldId]: true
    }));

    validateField(fieldId, formData[fieldId]);
  };

  const validateField = (fieldId, value) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;

    let error = null;

    // Required validation
    if (field.required && (!value || value.toString().trim() === '')) {
      error = 'Este campo es obligatorio';
    }

    // Type-specific validation
    if (value && !error) {
      switch (field.type) {
        case 'email':
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            error = 'Formato de email inválido';
          }
          break;
        
        case 'number':
          if (isNaN(value)) {
            error = 'Debe ser un número';
          } else {
            if (field.min !== undefined && parseFloat(value) < field.min) {
              error = `Valor mínimo: ${field.min}`;
            }
            if (field.max !== undefined && parseFloat(value) > field.max) {
              error = `Valor máximo: ${field.max}`;
            }
          }
          break;
        
        case 'date':
          if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            error = 'Formato de fecha inválido (YYYY-MM-DD)';
          }
          break;
        
        case 'text':
          if (field.pattern && !new RegExp(field.pattern).test(value)) {
            error = field.patternMessage || 'Formato inválido';
          }
          if (field.minLength && value.length < field.minLength) {
            error = `Mínimo ${field.minLength} caracteres`;
          }
          if (field.maxLength && value.length > field.maxLength) {
            error = `Máximo ${field.maxLength} caracteres`;
          }
          break;
        
        default:
          break;
      }
    }

    // Custom validator
    if (field.validator && !error) {
      const customError = field.validator(value, formData);
      if (customError) error = customError;
    }

    setErrors(prev => ({
      ...prev,
      [fieldId]: error
    }));

    return !error;
  };

  const validateAll = () => {
    let allValid = true;
    const newErrors = {};

    fields.forEach(field => {
      const isValid = validateField(field.id, formData[field.id]);
      if (!isValid) {
        allValid = false;
        newErrors[field.id] = errors[field.id];
      }
    });

    setTouched(
      fields.reduce((acc, field) => ({ ...acc, [field.id]: true }), {})
    );

    return allValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateAll()) {
      if (onComplete) {
        onComplete(formData);
      }
    }
  };

  const renderField = (field) => {
    const value = formData[field.id] || '';
    const error = touched[field.id] && errors[field.id];

    let fieldClass = 'form-field-input';
    if (error) fieldClass += ' form-field-error';
    if (touched[field.id] && !error && value) fieldClass += ' form-field-valid';

    switch (field.type) {
      case 'select':
        return (
          <select
            className={fieldClass}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            onBlur={() => handleBlur(field.id)}
            required={field.required}
          >
            <option value="">Seleccionar...</option>
            {field.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'textarea':
        return (
          <textarea
            className={fieldClass}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            onBlur={() => handleBlur(field.id)}
            placeholder={field.placeholder}
            rows={field.rows || 4}
            required={field.required}
          />
        );
      
      case 'checkbox':
        return (
          <label className="form-field-checkbox">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => handleChange(field.id, e.target.checked)}
              onBlur={() => handleBlur(field.id)}
              required={field.required}
            />
            <span>{field.checkboxLabel || field.label}</span>
          </label>
        );
      
      default:
        return (
          <input
            className={fieldClass}
            type={field.type || 'text'}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            onBlur={() => handleBlur(field.id)}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={field.step}
            required={field.required}
          />
        );
    }
  };

  const completedFields = Object.keys(formData).filter(
    key => formData[key] !== '' && formData[key] !== null && formData[key] !== undefined
  ).length;

  return (
    <div className="form-activity">
      {instructions && (
        <div className="form-instructions">
          <div className="form-instructions-icon">📋</div>
          <div className="form-instructions-text">{instructions}</div>
        </div>
      )}

      <div className="form-progress-info">
        <span>Campos completados: {completedFields} / {fields.length}</span>
        <div className="form-progress-mini">
          <div 
            className="form-progress-mini-fill"
            style={{ width: `${(completedFields / fields.length) * 100}%` }}
          />
        </div>
      </div>

      <form className="form-container" onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div key={field.id} className="form-field">
            <label className="form-field-label">
              {field.label}
              {field.required && <span className="form-field-required">*</span>}
            </label>
            
            {field.hint && (
              <div className="form-field-hint">{field.hint}</div>
            )}
            
            {renderField(field)}
            
            {touched[field.id] && errors[field.id] && (
              <div className="form-field-error-message">
                {errors[field.id]}
              </div>
            )}
            
            {touched[field.id] && !errors[field.id] && formData[field.id] && (
              <div className="form-field-success-message">
                ✓
              </div>
            )}
          </div>
        ))}

        <div className="form-actions">
          <button 
            type="submit" 
            className="form-submit-button"
          >
            Enviar formulario
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormActivity;
