import React, { useState, useEffect } from 'react';
import { UserRole, RecommendationResult, BatchRecord } from './types';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { RoleSelectorModal } from './components/landing/RoleSelectorModal';
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { ProducerDashboard } from './components/producer/ProducerDashboard';
import { ManufacturerDashboard } from './components/manufacturer/ManufacturerDashboard';
import { ResearcherDashboard } from './components/researcher/ResearcherDashboard';
import { RegulatorDashboard } from './components/admin/RegulatorDashboard';
import { LaminateBuilder } from './components/tools/LaminateBuilder';
import { QRTraceability } from './components/tools/QRTraceability';
import { SourcingAssistant } from './components/tools/SourcingAssistant';
import { PackagingLibrary } from './components/library/PackagingLibrary';
import { PDFReportGenerator } from './components/tools/PDFReportGenerator';
import { RecommendationWizard } from './components/wizard/RecommendationWizard';
import { calculateLocalRecommendation } from './services/recommendationEngine';


export const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem('packsmart_role') as UserRole) || 'producer';
  });

  const [activeView, setActiveView] = useState<string>('landing');
  const [roleModalOpen, setRoleModalOpen] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('packsmart_theme') === 'dark';
  });

  // State for passing data into tools
  const [selectedBatch, setSelectedBatch] = useState<Partial<BatchRecord> | null>(null);
  const [sourcingQuery, setSourcingQuery] = useState<string>('LDPE food packaging film supplier near Delhi');
  const [activeReportData, setActiveReportData] = useState<RecommendationResult>(() => {
    return calculateLocalRecommendation({
      commodity: 'Tomato',
      category: 'Fresh Produce',
      moisture_pct: 94.5,
      fat_pct: 0.2,
      protein_pct: 0.9,
      ph: 4.3,
      respiration_rate: 18.5,
      shelf_life_days: 14,
      storage_temp_c: 12,
      relative_humidity_pct: 88,
      storage_type: 'Chilled',
      transportation: 'Refrigerated',
      optimization_goal: 'Balanced',
    });
  });

  // Smooth scroll to top when active view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  // Apply dark mode class to html document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('packsmart_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('packsmart_theme', 'light');
    }
  }, [darkMode]);

  const handleRoleSelect = (role: UserRole) => {
    setCurrentRole(role);
    localStorage.setItem('packsmart_role', role);
    setActiveView('dashboard');
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Handlers from sub-components
  const handleGenerateQR = (batchData: Partial<BatchRecord>) => {
    setSelectedBatch(batchData);
    setActiveView('qr');
  };

  const handleDownloadReport = (data: RecommendationResult) => {
    setActiveReportData(data);
    setActiveView('reports');
  };

  const handleFindSourcing = (query: string) => {
    setSourcingQuery(query);
    setActiveView('sourcing');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navigation */}
      <Navbar
        currentRole={currentRole}
        onSelectRole={handleRoleSelect}
        openRoleModal={() => setRoleModalOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        activeView={activeView}
        onSelectView={setActiveView}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeView === 'landing' && (
          <LandingPage
            onSelectRole={handleRoleSelect}
            onStartWizard={() => setActiveView('wizard')}
            openRoleModal={() => setRoleModalOpen(true)}
          />
        )}

        {activeView === 'wizard' && (
          <RecommendationWizard
            initialRole={currentRole}
            onGenerateQR={handleGenerateQR}
            onDownloadReport={handleDownloadReport}
            onFindSourcing={handleFindSourcing}
            onOpenLaminate={() => setActiveView('laminate')}
            onOpenResearcherMap={() => setActiveView('map')}
          />
        )}

        {activeView === 'dashboard' && (
          <>
            {currentRole === 'farmer' && (
              <FarmerDashboard
                onGenerateQR={handleGenerateQR}
                onDownloadReport={handleDownloadReport}
                onFindSourcing={handleFindSourcing}
                onLaunchWizard={() => setActiveView('wizard')}
              />
            )}
            {currentRole === 'producer' && (
              <ProducerDashboard
                onOpenLaminate={() => setActiveView('laminate')}
                onOpenSourcing={handleFindSourcing}
                onOpenReport={handleDownloadReport}
              />
            )}
            {currentRole === 'manufacturer' && (
              <ManufacturerDashboard />
            )}
            {currentRole === 'researcher' && (
              <ResearcherDashboard />
            )}
            {currentRole === 'regulator' && (
              <RegulatorDashboard />
            )}
          </>
        )}


        {/* Specialized Tools Views */}
        {activeView === 'laminate' && <LaminateBuilder />}
        {activeView === 'qr' && <QRTraceability initialBatch={selectedBatch} />}
        {activeView === 'sourcing' && <SourcingAssistant initialQuery={sourcingQuery} />}
        {activeView === 'library' && <PackagingLibrary />}
        {activeView === 'reports' && (
          <PDFReportGenerator
            reportData={activeReportData}
            role={currentRole}
            onBack={() => setActiveView('dashboard')}
          />
        )}
        {activeView === 'dataquality' && <RegulatorDashboard />}
        {activeView === 'map' && <ResearcherDashboard />}
        {activeView === 'kinetics' && <ResearcherDashboard />}
      </main>

      {/* Role Selector Modal */}
      <RoleSelectorModal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        currentRole={currentRole}
        onSelectRole={handleRoleSelect}
      />

      {/* Footer */}
      <Footer onSelectRole={handleRoleSelect} onSelectView={setActiveView} />
    </div>
  );
};
export default App;
