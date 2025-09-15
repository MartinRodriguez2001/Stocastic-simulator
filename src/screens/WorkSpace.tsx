// components/WorkSpace.tsx
import ReactFlow, { MiniMap, Controls, Background} from "reactflow";
import "reactflow/dist/style.css";

import { useWorkSpace } from "@/hooks/useWorkSpace";
import { WorkSpaceMenu } from "../components/WorkSpaceMenu";
import { useElements } from "@/hooks/useElements";
import { NodeConfigSidebar } from "@/components/RightSideBar";
import { GeneratorNode } from "@/components/Nodes/GeneratorNode";
import { QueueNode } from "@/components/Nodes/QueueNode";
import { SelectorNode } from "@/components/Nodes/SelectorNode";
import { TransporterNode } from "@/components/Nodes/TransporterNode";
import { TransformerNode } from "@/components/Nodes/TransformerNode";
import { OutputNode } from "@/components/Nodes/OutPutNode";

 const nodeTypes = {
    generator: GeneratorNode,
    queue: QueueNode,
    selector: SelectorNode,
    transporter: TransporterNode,
    transformer: TransformerNode,
    output: OutputNode
  }



export default function WorkSpace() {
  const {
    nodes,
    edges,
    selectedNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    addNode,
    updateNode,
    setSelectedNode,
  } = useWorkSpace();

  const elementsManager = useElements();

  return (
    <div style={{ flex: 1, height: "100%", position: "relative" }}>
      <WorkSpaceMenu addNode={addNode} elementsManager={elementsManager} />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        style={{ width: "100%", height: "100%" }}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>

      {/* Sidebar de configuración */}
      <NodeConfigSidebar
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        elementsManager={elementsManager}

      />
    </div>
  );
}
