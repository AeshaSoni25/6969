import React, { useState } from 'react';
import { AegisProvider, useAegis } from './context/AegisContext';
import { SecureMonSidebar } from './components/layout/SecureMonSidebar';
import { SecureMonHeader } from './components/layout/SecureMonHeader';
import { SecureMonDashboard } from './components/dashboard/SecureMonDashboard';
import { CommandPalette } from './components/layout/CommandPalette';
import { ToastContainer } from './components/common/ToastContainer';
import { CreateAssessmentModal } from './components/wizard/CreateAssessmentModal';
import { ScopeConfigScreen } from './components/scope/ScopeConfigScreen';
import { AssessmentRunningScreen } from './components/running/AssessmentRunningScreen';
import { AssetInventoryScreen } from './components/assets/AssetInventoryScreen';
import { FindingsListScreen } from './components/findings/FindingsListScreen';
import { FindingDetailsModal } from './components/findings/FindingDetailsModal';
import { ValidationModal } from './components/sandbox/ValidationModal';
import { RetestCenterScreen } from './components/retest/RetestCenterScreen';
import { CvssCalculatorScreen } from './components/cvss/CvssCalculatorScreen';
import { RiskHeatmapScreen } from './components/risk/RiskHeatmapScreen';
import { AiAssistantScreen } from './components/ai/AiAssistantScreen';
import { RemediationKanbanScreen } from './components/remediation/RemediationKanbanScreen';
import { ReportGeneratorScreen } from './components/reports/ReportGeneratorScreen';
import { AuditLogsScreen } from './components/audit/AuditLogsScreen';
import { SettingsScreen } from './components/settings/SettingsScreen';

const MainAppContent: React.FC = () => {
  const { activeView, selectedFinding, setSelectedFinding } = useAegis();
  const [createWizardOpen, setCreateWizardOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
      case 'overview':
        return <SecureMonDashboard onOpenCreateWizard={() => setCreateWizardOpen(true)} />;
      case 'scope':
        return <ScopeConfigScreen />;
      case 'running':
        return <AssessmentRunningScreen />;
      case 'assets':
        return <AssetInventoryScreen />;
      case 'findings':
        return <FindingsListScreen />;
      case 'retest':
        return <RetestCenterScreen />;
      case 'cvss':
        return <CvssCalculatorScreen />;
      case 'risk':
        return <RiskHeatmapScreen />;
      case 'ai':
        return <AiAssistantScreen />;
      case 'remediation':
        return <RemediationKanbanScreen />;
      case 'reports':
        return <ReportGeneratorScreen />;
      case 'audit':
        return <AuditLogsScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <SecureMonDashboard onOpenCreateWizard={() => setCreateWizardOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-page text-slate-900 dark:text-slate-100 flex font-sans antialiased overflow-x-hidden">
      {/* 1. Left Vertical Sidebar (SecureMon Brand & Nav Hierarchy) */}
      <SecureMonSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-page">
        {/* Top Header Bar */}
        <SecureMonHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Dashboard and Sub-views Area */}
        <main className="flex-1 overflow-y-auto bg-page">
          {renderActiveView()}
        </main>
      </div>

      {/* 3. Global Modals & Utilities */}
      {selectedFinding && (
        <FindingDetailsModal
          finding={selectedFinding}
          onClose={() => setSelectedFinding(null)}
        />
      )}

      <ValidationModal />
      <CommandPalette />
      <CreateAssessmentModal
        isOpen={createWizardOpen}
        onClose={() => setCreateWizardOpen(false)}
      />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AegisProvider>
      <MainAppContent />
    </AegisProvider>
  );
}

export default App;
