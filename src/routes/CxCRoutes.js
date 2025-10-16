import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Lazy load components
const CxCMenu = lazy(() => import('../screens/CxCMenuScreen'));
const MissionScreen = lazy(() => import('../screens/MissionScreen'));
const CxCProfile = lazy(() => import('../screens/CxCProfileScreen'));
const OnboardingScreen = lazy(() => import('../screens/OnboardingScreen'));

// Loading component
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    flexDirection: 'column',
    gap: '1rem'
  }}>
    <div style={{
      width: '48px',
      height: '48px',
      border: '4px solid rgba(59, 130, 246, 0.2)',
      borderTopColor: '#3b82f6',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }}></div>
    <p style={{ color: 'var(--text-secondary)' }}>Cargando...</p>
  </div>
);

/**
 * CxCRoutes - Configuración de rutas para el módulo CxC
 * Basado en FASE_2 arquitectura de navegación
 */
const CxCRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Ruta principal: Menú de misiones */}
        <Route path="/" element={<Navigate to="/cxc/menu" replace />} />
        <Route path="/menu" element={<CxCMenu />} />
        
        {/* Onboarding - Primera vez */}
        <Route path="/onboarding" element={<OnboardingScreen />} />
        
        {/* Misiones individuales */}
        <Route path="/mission/:missionId" element={<MissionScreen />} />
        
        {/* Perfil del usuario */}
        <Route path="/profile" element={<CxCProfile />} />
        
        {/* Ruta 404 */}
        <Route path="*" element={<Navigate to="/cxc/menu" replace />} />
      </Routes>
    </Suspense>
  );
};

export default CxCRoutes;
