import React, { useState } from 'react';
import { AIPromptBar } from './AIPromptBar';
import { TestRunBar } from './TestRunBar';
import { NodeCanvas } from './NodeCanvas';
import { NodePalette } from './NodePalette';
import { NodeInspector } from './NodeInspector';
import { ExportN8nModal } from './ExportN8nModal';
import { useWorkflow } from '../../context/WorkflowContext';

export const WorkflowBuilderView: React.FC = () => {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const { selectedNodeId } = useWorkflow();

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full overflow-hidden bg-[#090D17]">
      {/* AI Prompt Synthesizer Header Section */}
      <div className="p-4 border-b border-white/10 bg-[#090D17]">
        <AIPromptBar />
      </div>

      {/* Main Canvas Area with Toolbar and Drawers */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Control Bar */}
        <TestRunBar 
          isPaletteOpen={isPaletteOpen}
          onTogglePalette={() => setIsPaletteOpen((prev) => !prev)}
        />

        {/* Visual Canvas and Drawers */}
        <div className="flex-1 flex relative overflow-hidden">
          {/* Node Palette Floating Panel */}
          {isPaletteOpen && (
            <div className="absolute top-4 left-4 z-20 w-80 animate-fade-in shadow-2xl">
              <NodePalette />
            </div>
          )}

          {/* Canvas */}
          <div className="flex-1 h-full relative">
            <NodeCanvas />
          </div>

          {/* Right Inspector Drawer */}
          {selectedNodeId && (
            <NodeInspector />
          )}
        </div>
      </div>

      {/* Modals */}
      <ExportN8nModal />
    </div>
  );
};
