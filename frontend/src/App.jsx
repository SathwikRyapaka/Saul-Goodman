import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

// Layouts
import { AppLayout } from './layouts/AppLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SearchCase from './pages/SearchCase';
import MyCases from './pages/MyCases';
import CaseDetails from './pages/CaseDetails';
import DocumentCenter from './pages/DocumentCenter';
import AIExplanation from './pages/AIExplanation';
import VoiceAssistant from './pages/VoiceAssistant';
import Hearings from './pages/Hearings';
import LegalServices from './pages/LegalServices';
import LegalServiceDetail from './pages/LegalServiceDetail';
import LegalAuthorityFinder from './pages/LegalAuthorityFinder';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

const App = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            
            <Route element={<AppLayout />}>
              {/* Public/Semi-public App Routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/search" element={<SearchCase />} />
              <Route path="/cases/:id" element={<CaseDetails />} />
              <Route path="/ai-explain" element={<AIExplanation />} />
              <Route path="/voice" element={<VoiceAssistant />} />
              <Route path="/legal-services" element={<LegalServices />} />
              <Route path="/legal-services/authority" element={<LegalAuthorityFinder />} />
              <Route path="/legal-services/:serviceType" element={<LegalServiceDetail />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/cases" element={<MyCases />} />
                <Route path="/documents" element={<DocumentCenter />} />
                <Route path="/hearings" element={<Hearings />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
