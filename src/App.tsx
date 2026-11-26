import React from 'react';
import { WorkflowProvider, useWorkflow } from './context/WorkflowContext';
import { Layout } from './components/layout/Layout';
import { DashboardView } from './components/dashboard/DashboardView';
import { WorkflowBuilderView } from './components/workflow-builder/WorkflowBuilderView';
import { MyWorkflowsView } from './components/my-workflows/MyWorkflowsView';
import { TemplatesView } from './components/templates/TemplatesView';
import { IntegrationsView } from './components/integrations/IntegrationsView';
import { ExecutionHistoryView } from './components/execution-history/ExecutionHistoryView';
import { SettingsView } from './components/settings/SettingsView';

const MainContent: React.FC = () => {
  const { activePage } = useWorkflow();

  switch (activePage) {
    case 'dashboard':
      return <DashboardView />;
    case 'builder':
      return <WorkflowBuilderView />;
    case 'workflows':
      return <MyWorkflowsView />;
    case 'templates':
      return <TemplatesView />;
    case 'integrations':
      return <IntegrationsView />;
    case 'history':
      return <ExecutionHistoryView />;
    case 'settings':
      return <SettingsView />;
    default:
      return <DashboardView />;
  }
};

export function App() {
  return (
    <WorkflowProvider>
      <Layout>
        <MainContent />
      </Layout>
    </WorkflowProvider>
  );
}

export default App;
