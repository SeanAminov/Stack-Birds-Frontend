import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ViewerProvider } from './context/ViewerContext';
import { AppShell } from './components/Layout/AppShell';
import { Header } from './components/Layout/Header';
import { ScreenViewer } from './components/ScreenViewer/ScreenViewer';
import { ControlPanel } from './components/ControlPanel/ControlPanel';
import { AgentPanel } from './components/AgentPanel/AgentPanel';
import { CustomizationPanel } from './components/Customization/CustomizationPanel';

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isAgentDragging, setIsAgentDragging] = useState(false);

  return (
    <ThemeProvider>
      <ViewerProvider>
        <AppShell>
          <Header onSettingsClick={() => setSettingsOpen(!settingsOpen)} />
          <ScreenViewer />
          <AgentPanel
            isDragging={isAgentDragging}
            onDragStart={() => setIsAgentDragging(true)}
            onDragEnd={() => setIsAgentDragging(false)}
          />
          <ControlPanel />
          <CustomizationPanel
            isOpen={settingsOpen}
            onClose={() => setSettingsOpen(false)}
          />
        </AppShell>
      </ViewerProvider>
    </ThemeProvider>
  );
}

export default App;
