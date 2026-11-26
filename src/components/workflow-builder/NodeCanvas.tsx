import React, { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  BackgroundVariant,
  addEdge,
  Connection,
  Edge,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  NodeTypes
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { TriggerNode } from './nodes/TriggerNode';
import { AINode } from './nodes/AINode';
import { LogicNode } from './nodes/LogicNode';
import { IntegrationNode } from './nodes/IntegrationNode';
import { TransformNode } from './nodes/TransformNode';
import { OutputNode } from './nodes/OutputNode';
import { useWorkflow } from '../../context/WorkflowContext';
import { FlowAINode, FlowAIEdge } from '../../types/workflow';

export const NodeCanvas: React.FC = () => {
  const { 
    currentWorkflow, 
    setCurrentWorkflow, 
    setSelectedNodeId, 
    onNodesChangeInternal, 
    onEdgesChangeInternal 
  } = useWorkflow();

  const nodeTypes = useMemo<NodeTypes>(
    () => ({
      triggerNode: TriggerNode as any,
      aiNode: AINode as any,
      logicNode: LogicNode as any,
      integrationNode: IntegrationNode as any,
      transformNode: TransformNode as any,
      outputNode: OutputNode as any
    }),
    []
  );

  const onNodesChange = useCallback(
    (changes: NodeChange<FlowAINode>[]) => {
      setCurrentWorkflow((prev) => ({
        ...prev,
        nodes: applyNodeChanges(changes, prev.nodes)
      }));
    },
    [setCurrentWorkflow]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange<FlowAIEdge>[]) => {
      setCurrentWorkflow((prev) => ({
        ...prev,
        edges: applyEdgeChanges(changes, prev.edges)
      }));
    },
    [setCurrentWorkflow]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: FlowAIEdge = {
        ...params,
        id: `e-${params.source}-${params.target}-${Date.now()}`,
        animated: true,
        style: { stroke: '#6366f1', strokeWidth: 2 }
      };

      setCurrentWorkflow((prev) => ({
        ...prev,
        edges: addEdge(newEdge, prev.edges)
      }));
    },
    [setCurrentWorkflow]
  );

  return (
    <div className="w-full h-full relative bg-[#090D17]">
      <ReactFlow
        nodes={currentWorkflow.nodes}
        edges={currentWorkflow.edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => setSelectedNodeId(node.id)}
        onPaneClick={() => setSelectedNodeId(null)}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={1.5}
        className="flowai-canvas"
        proOptions={{ hideAttribution: true }}
      >
        <Background 
          color="#313A52" 
          gap={24} 
          size={1.5} 
          variant={BackgroundVariant.Dots} 
          className="opacity-40" 
        />
        
        <Controls 
          className="!bg-[#111728]/90 !border !border-white/10 !rounded-xl !shadow-xl !overflow-hidden [&>button]:!bg-transparent [&>button]:!border-white/5 [&>button]:!text-slate-300 hover:[&>button]:!text-white hover:[&>button]:!bg-white/10"
        />

        <MiniMap
          nodeColor={(node) => {
            switch (node.data?.category) {
              case 'trigger': return '#6366f1';
              case 'ai': return '#f59e0b';
              case 'logic': return '#10b981';
              case 'integration': return '#ec4899';
              case 'transform': return '#06b6d4';
              case 'output': return '#10b981';
              default: return '#64748b';
            }
          }}
          className="!bg-[#0D1220]/90 !border !border-white/10 !rounded-xl !overflow-hidden !shadow-xl hidden md:block"
          maskColor="rgba(0, 0, 0, 0.65)"
        />
      </ReactFlow>
    </div>
  );
};
