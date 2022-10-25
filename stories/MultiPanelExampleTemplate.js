import React, { useState } from "react"
import PanelManager, {
  minimizePanel,
  maximizePanel,
  Panel,
} from "../src/index.ts"
import FloatingTestInputBox from "./components/FloatingTestInputBox"
import "./App.css"

const DUMMY_PANEL_DATA_0 = [
  {
    data: {
      A: { w: 0.25, h: 0.5, x: 0, y: 0 },
      B: { w: 0.5, h: 1.0, x: 0.25, y: 0 },
      C: { w: 0.25, h: 0.5, x: 0.75, y: 0.0 },
      D: { w: 0.25, h: 0.5, x: 0, y: 0.5 },
      E: { w: 0.25, h: 0.5, x: 0.75, y: 0.5 },
    },
    adjList: [
      { A: { re: ["B", "D"], le: [], tv: [], bv: ["D"] } },
      { B: { re: ["C", "E"], le: ["A", "D"], tv: [], bv: [] } },
      { C: { re: [], le: ["B", "E"], tv: [], bv: ["E"] } },
      { D: { re: ["B", "A"], le: [], tv: ["A"], bv: [] } },
      { E: { re: [], le: ["B", "C"], tv: ["C"], bv: [] } },
    ],
  },
]

const PanelA = () => (
  <div style={{ background: "#C23B23", display: "flex", flexGrow: 1 }}>
    Panel A
  </div>
)
const PanelB = () => (
  <div style={{ background: "#03C03C", display: "flex", flexGrow: 1 }}>
    Panel B
  </div>
)
const PanelC = () => (
  <div style={{ background: "#579ABE", display: "flex", flexGrow: 1 }}>
    Panel C
  </div>
)
const PanelD = () => (
  <div style={{ background: "#976ED7", display: "flex", flexGrow: 1 }}>
    Panel D
  </div>
)
const PanelE = () => (
  <div style={{ background: "#F39A27", display: "flex", flexGrow: 1 }}>
    Panel E
  </div>
)

function App() {
  const [panelData0, setPanelData0] = useState(DUMMY_PANEL_DATA_0)
  // used for "restore"
  const [panelDataContextCache0] = useState(DUMMY_PANEL_DATA_0)
  const [panelIds, setPanelIds] = useState([])

  const onMaximize = () => {
    const nextGraph = maximizePanel(panelIds)
    setPanelData0(nextGraph)
  }
  const onMinimize = () => {
    const nextGraph = minimizePanel(panelData0, panelIds)
    setPanelData0(nextGraph)
  }
  const onRestore = () => {
    setPanelData0(panelDataContextCache0)
  }

  return (
    <>
      <div
        className="App"
        // NOTE: Only used for the FloatingTestInputBox. Not for the PanelManager
        onDragOver={(event) => event.preventDefault()}
      >
        <PanelManager
          minimizedPanels={[]}
          maximizedPanel={""}
          onPanelDataChange={(nextPanelData) => setPanelData0(nextPanelData)}
          panelData={panelData0}
        >
          <Panel panelId="A">
            <PanelA />
          </Panel>
          <Panel panelId="B">
            <PanelB />
          </Panel>
          <Panel panelId="C">
            <PanelC />
          </Panel>
          <Panel panelId="D">
            <PanelD />
          </Panel>
          <Panel panelId="E">
            <PanelE />
          </Panel>
        </PanelManager>
      </div>
      <FloatingTestInputBox
        setPanelIds={setPanelIds}
        onMaximize={onMaximize}
        onMinimize={onMinimize}
        onRestore={onRestore}
        panelIds={panelIds}
        panelIdOptions={[
          { value: "A" },
          { value: "B" },
          { value: "C" },
          { value: "D" },
          { value: "E" },
        ]}
      />
    </>
  )
}

export default App
