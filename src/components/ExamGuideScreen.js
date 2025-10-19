import React, { useState } from 'react';
import '../styles/ExamGuideScreen.css';
import { examGuideContent } from '../data/examGuideContent';

// Helper para renderizar texto con formato Markdown básico (negritas **)
const renderTextWithBold = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return <strong key={index}>{boldText}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
};

const ExamGuideScreen = ({ onNavigate }) => {
  const [openSectionId, setOpenSectionId] = useState(
    examGuideContent.sections[0]?.id || null
  );

  const toggleSection = (sectionId) => {
    setOpenSectionId((current) => (current === sectionId ? null : sectionId));
  };

  return (
    <div className="exam-guide-screen">
      <div className="exam-guide-container">
        <header className="exam-guide-header">
          <button className="guide-back-button" onClick={() => onNavigate('home')}>
            ← Volver a inicio
          </button>
          <div className="guide-heading">
            <h1>{examGuideContent.title}</h1>
            <p className="guide-description">{examGuideContent.description}</p>
            <div className="guide-meta">
              <span>Ultima actualizacion: {examGuideContent.lastUpdated}</span>
            </div>
          </div>
          <div className="guide-actions">
            <button
              className="guide-action-button primary"
              onClick={() => onNavigate('instructions')}
            >
              Comenzar diagnostico →
            </button>
          </div>
        </header>

        <section className="guide-key-stats">
          {examGuideContent.keyStats.map((stat) => (
            <div key={stat.label} className="key-stat-card">
              <span className="key-stat-label">{stat.label}</span>
              <span className="key-stat-value">{stat.value}</span>
            </div>
          ))}
        </section>

        <section className="guide-timeline">
          <h2>Ruta de preparacion sugerida</h2>
          <div className="timeline-cards">
            {examGuideContent.preparationTimeline.map((item) => (
              <div key={item.title} className="timeline-card">
                <h3>{item.title}</h3>
                <p>{item.details}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="guide-sections">
          {examGuideContent.sections.map((section) => {
            const isOpen = section.id === openSectionId;
            return (
              <article key={section.id} className={`guide-section ${isOpen ? 'open' : ''}`}>
                <header
                  className="section-header"
                  onClick={() => toggleSection(section.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      toggleSection(section.id);
                    }
                  }}
                >
                  <div>
                    <h2>{section.title}</h2>
                    <p>{section.intro}</p>
                  </div>
                  <span className="section-toggle">{isOpen ? '−' : '+'}</span>
                </header>
                {isOpen && (
                  <div className="section-body">
                    {section.highlights && section.highlights.length > 0 && (
                      <ul className="section-highlights">
                        {section.highlights.map((highlight, index) => (
                          <li key={index}>{highlight}</li>
                        ))}
                      </ul>
                    )}
                    {section.subSections && section.subSections.length > 0 && (
                      <div className="section-subsections">
                        {section.subSections.map((sub) => (
                          <div key={sub.title} className="subsection-card">
                            <h3>{sub.title}</h3>
                            <ul>
                              {sub.items.map((item, index) => (
                                <li key={index}>{renderTextWithBold(item)}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </section>

        <section className="guide-closing">
          <div className="closing-card">
            <h2>Conclusiones clave</h2>
            <ul>
              {examGuideContent.closing.keyInsights.map((insight, index) => (
                <li key={index}>{insight}</li>
              ))}
            </ul>
          </div>
          <div className="closing-card">
            <h2>Proximos pasos recomendados</h2>
            <ul>
              {examGuideContent.closing.nextSteps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        </section>

        <footer className="guide-footer">
          <button className="guide-action-button" onClick={() => onNavigate('home')}>
            ← Volver al inicio
          </button>
          <button
            className="guide-action-button primary"
            onClick={() => onNavigate('instructions')}
          >
            Lanzar diagnostico ahora →
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ExamGuideScreen;
