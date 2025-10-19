import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import '../styles/UnderConstructionScreen.css';

const UnderConstructionScreen = ({ onNavigate, mode = 'cxc' }) => {
  const { theme } = useContext(ThemeContext);

  const content = {
    cxc: {
      title: 'CxC Hub - En Construcción',
      icon: '🏢',
      subtitle: 'Centro de Conocimiento y Competencias',
      description: 'La parte práctica más innovadora de nuestra plataforma',
      features: [
        {
          icon: '💼',
          title: 'Casos Reales de Cuentas por Cobrar',
          description: 'Aprende con escenarios empresariales reales de gestión de CxC'
        },
        {
          icon: '📊',
          title: 'Análisis de Reportes Interactivos',
          description: 'Interpreta y crea dashboards de análisis financiero profesional'
        },
        {
          icon: '🎯',
          title: 'Misiones Especializadas',
          description: 'Sistema de misiones gamificadas con progreso y recompensas'
        },
        {
          icon: '🤖',
          title: 'IA Avanzada y Backend Robusto',
          description: 'Tecnología de última generación para una experiencia única'
        }
      ]
    },
    diagnostico: {
      title: 'Diagnóstico Avanzado - En Construcción',
      icon: '🔬',
      subtitle: 'Evaluación Integral de Competencias',
      description: 'Análisis profundo y personalizado de tu nivel',
      features: [
        {
          icon: '📈',
          title: 'Evaluación Adaptativa',
          description: 'Sistema inteligente que ajusta la dificultad según tu desempeño'
        },
        {
          icon: '🎯',
          title: 'Análisis por Competencias',
          description: 'Identifica fortalezas y áreas de mejora con precisión'
        },
        {
          icon: '📊',
          title: 'Reportes Detallados',
          description: 'Visualizaciones profesionales de tu progreso y habilidades'
        },
        {
          icon: '💡',
          title: 'Recomendaciones Personalizadas',
          description: 'Plan de estudio adaptado a tus necesidades específicas'
        }
      ]
    }
  };

  const currentContent = content[mode] || content.cxc;

  return (
    <div className={`under-construction-screen ${theme}`}>
      <div className="construction-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="construction-content">
        {/* Header */}
        <div className="construction-header">
          <button className="back-button" onClick={() => onNavigate('home')}>
            <span>←</span> Volver al Inicio
          </button>
        </div>

        {/* Main Content */}
        <div className="construction-main">
          <div className="construction-icon-wrapper">
            <div className="icon-pulse"></div>
            <div className="construction-icon">{currentContent.icon}</div>
          </div>

          <h1 className="construction-title">{currentContent.title}</h1>
          <p className="construction-subtitle">{currentContent.subtitle}</p>
          <p className="construction-description">{currentContent.description}</p>

          {/* Features Grid */}
          <div className="features-preview">
            <h2>¿Qué estamos construyendo?</h2>
            <div className="features-grid">
              {currentContent.features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Funding Section */}
          <div className="funding-section">
            <div className="funding-card">
              <h2>🚀 Ayúdanos a Construir el Futuro</h2>
              <p className="funding-intro">
                Estamos buscando financiamiento para implementar tecnología de IA avanzada 
                y desarrollar un backend robusto que haga realidad esta experiencia única.
              </p>

              <div className="funding-stats">
                <div className="stat-item">
                  <div className="stat-value">$100,000</div>
                  <div className="stat-label">Meta de Financiamiento</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <div className="stat-value">100%</div>
                  <div className="stat-label">Gratis para Todos</div>
                </div>
              </div>

              <div className="funding-promise">
                <div className="promise-icon">🎁</div>
                <p>
                  <strong>Promesa Especial:</strong> Si alcanzamos $100,000 USD en donaciones, 
                  haremos esta aplicación completamente gratuita para todos los usuarios.
                </p>
              </div>

              {/* Benefits */}
              <div className="donation-benefits">
                <h3>✨ Beneficios para Donadores</h3>
                <div className="benefits-list">
                  <div className="benefit-item">
                    <span className="benefit-icon">🎟️</span>
                    <div className="benefit-text">
                      <strong>Lista de Espera Prioritaria</strong>
                      <small>Acceso garantizado cuando lancemos</small>
                    </div>
                  </div>
                  <div className="benefit-item">
                    <span className="benefit-icon">🚀</span>
                    <div className="benefit-text">
                      <strong>Acceso Anticipado</strong>
                      <small>Prueba las nuevas características primero</small>
                    </div>
                  </div>
                  <div className="benefit-item">
                    <span className="benefit-icon">💰</span>
                    <div className="benefit-text">
                      <strong>Descuentos Exclusivos</strong>
                      <small>Precios especiales en la versión premium</small>
                    </div>
                  </div>
                  <div className="benefit-item">
                    <span className="benefit-icon">🏆</span>
                    <div className="benefit-text">
                      <strong>Reconocimiento Especial</strong>
                      <small>Tu nombre en nuestro muro de agradecimientos</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="donation-cta">
                <h3>💖 Realiza tu Donación</h3>
                <div className="paypal-section">
                  <div className="paypal-icon">💳</div>
                  <div className="paypal-info">
                    <strong>PayPal:</strong>
                    <a href="mailto:Tjeyrell@gmail.com" className="email-link">
                      Tjeyrell@gmail.com
                    </a>
                  </div>
                </div>

                <div className="steps-to-donate">
                  <h4>📝 Pasos para Donar:</h4>
                  <ol>
                    <li>Realiza tu donación a través de PayPal</li>
                    <li>Guarda el comprobante de la transacción</li>
                    <li>Envía el comprobante por correo a <strong>Tjeyrell@gmail.com</strong></li>
                    <li>Recibirás confirmación y serás agregado a la lista de espera</li>
                  </ol>
                </div>

                <a 
                  href="https://www.paypal.com/paypalme/jeyrellt" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="donate-button"
                >
                  <span>💳</span>
                  Donar Ahora con PayPal
                  <span>→</span>
                </a>

                <p className="email-note">
                  O envía tu correo con el comprobante a: 
                  <a href="mailto:Tjeyrell@gmail.com">Tjeyrell@gmail.com</a>
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="timeline-section">
            <h2>🗓️ Hoja de Ruta</h2>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-marker current"></div>
                <div className="timeline-content">
                  <h4>Fase 1: Captación de Fondos</h4>
                  <p>Búsqueda activa de donaciones y financiamiento</p>
                  <span className="timeline-date">Actual</span>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>Fase 2: Desarrollo de Backend</h4>
                  <p>Infraestructura robusta y escalable con IA</p>
                  <span className="timeline-date">Q4 2025</span>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>Fase 3: Beta Privada</h4>
                  <p>Acceso exclusivo para donadores</p>
                  <span className="timeline-date">Q1 2026</span>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>Fase 4: Lanzamiento Público</h4>
                  <p>Apertura completa de la plataforma</p>
                  <span className="timeline-date">Q2 2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="construction-footer">
            <p>Mientras tanto, disfruta de nuestro sistema de preguntas y análisis disponible</p>
            <button className="primary-cta" onClick={() => onNavigate('home')}>
              Comenzar a Practicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderConstructionScreen;
