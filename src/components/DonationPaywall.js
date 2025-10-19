import React, { useState } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import '../styles/DonationPaywall.css';

const UNLOCK_CODE = 'WFGWX-YVC9B-4J6C9-T83GX';

const DonationPaywall = ({ onUnlock }) => {
  const { theme } = React.useContext(ThemeContext);
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');
  const [showInstructions, setShowInstructions] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const cleanedInput = inputCode.trim().toUpperCase();
    const cleanedCode = UNLOCK_CODE.toUpperCase();
    
    if (cleanedInput === cleanedCode) {
      // Código correcto - guardar en localStorage y desbloquear
      localStorage.setItem('app_unlocked', 'true');
      localStorage.setItem('unlock_date', new Date().toISOString());
      onUnlock();
    } else {
      setError('❌ Código de acceso incorrecto. Por favor verifica e intenta nuevamente.');
      setInputCode('');
    }
  };

  const formatCodeInput = (value) => {
    // Permitir solo letras, números y guiones
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    setInputCode(cleaned);
  };

  return (
    <div className={`donation-paywall ${theme}`}>
      <div className="paywall-overlay"></div>
      
      <div className="paywall-modal">
        <div className="paywall-header">
          <div className="paywall-icon">🔒</div>
          <h2>¡Has alcanzado el límite gratuito!</h2>
          <p className="paywall-subtitle">30 preguntas completadas</p>
        </div>

        <div className="paywall-content">
          {showInstructions ? (
            <>
              <div className="paywall-message">
                <p className="message-primary">
                  Para continuar usando la aplicación, necesitas realizar una pequeña donación 
                  de <strong>$5 USD</strong> que nos ayudará a mantener y mejorar la plataforma.
                </p>
              </div>

              <div className="donation-benefits">
                <h3>✨ Tu donación incluye:</h3>
                <ul>
                  <li>
                    <span className="benefit-icon">♾️</span>
                    <span>Acceso ilimitado a todas las preguntas</span>
                  </li>
                  <li>
                    <span className="benefit-icon">🎯</span>
                    <span>Análisis detallado de tu progreso</span>
                  </li>
                  <li>
                    <span className="benefit-icon">📊</span>
                    <span>Estadísticas avanzadas permanentes</span>
                  </li>
                  <li>
                    <span className="benefit-icon">💎</span>
                    <span>Soporte al desarrollo continuo</span>
                  </li>
                  <li>
                    <span className="benefit-icon">🎟️</span>
                    <span>Lista prioritaria para nuevas características</span>
                  </li>
                </ul>
              </div>

              <div className="donation-steps">
                <h3>📋 Pasos para desbloquear:</h3>
                <ol>
                  <li>
                    <strong>Realiza tu donación de $5 USD</strong> a través de PayPal:
                    <a 
                      href="https://www.paypal.com/paypalme/jeyrellt/5" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="paypal-link"
                    >
                      💳 Donar $5 con PayPal
                    </a>
                  </li>
                  <li>
                    <strong>Guarda el comprobante</strong> de la transacción (screenshot o PDF)
                  </li>
                  <li>
                    <strong>Envía el comprobante por email</strong> a:
                    <a href="mailto:Tjeyrell@gmail.com" className="email-link">
                      Tjeyrell@gmail.com
                    </a>
                  </li>
                  <li>
                    <strong>Recibirás tu código de acceso</strong> por email (generalmente en 24-48 horas)
                  </li>
                  <li>
                    <strong>Ingresa el código</strong> en el campo de abajo para desbloquear
                  </li>
                </ol>
              </div>

              <button 
                className="btn-show-code-input"
                onClick={() => setShowInstructions(false)}
              >
                Ya tengo mi código de acceso
              </button>
            </>
          ) : (
            <>
              <div className="code-input-section">
                <h3>🔑 Ingresa tu código de acceso</h3>
                <p className="code-instructions">
                  Introduce el código que recibiste por email después de realizar tu donación
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="code-input-wrapper">
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => formatCodeInput(e.target.value)}
                      placeholder="XXXXX-XXXXX-XXXXX-XXXXX"
                      className="code-input"
                      maxLength={25}
                      autoFocus
                    />
                  </div>

                  {error && (
                    <div className="error-message">
                      {error}
                    </div>
                  )}

                  <button type="submit" className="btn-submit-code">
                    🔓 Desbloquear Aplicación
                  </button>
                </form>

                <button 
                  className="btn-back-instructions"
                  onClick={() => {
                    setShowInstructions(true);
                    setError('');
                    setInputCode('');
                  }}
                >
                  ← Volver a las instrucciones
                </button>
              </div>

              <div className="help-section">
                <p>
                  <strong>¿No recibiste tu código?</strong><br/>
                  Verifica tu bandeja de spam o contacta a <a href="mailto:Tjeyrell@gmail.com">Tjeyrell@gmail.com</a>
                </p>
              </div>
            </>
          )}
        </div>

        <div className="paywall-footer">
          <p className="footer-note">
            💡 <strong>Nota:</strong> El acceso es permanente. Solo pagas una vez.
          </p>
          <p className="footer-thanks">
            ¡Gracias por apoyar el desarrollo de esta plataforma educativa! 🙏
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonationPaywall;
