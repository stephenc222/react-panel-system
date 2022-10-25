import React, { useState } from "react"
import PanelManager, {
  minimizePanel,
  maximizePanel,
  Panel,
} from "../src/index.ts"
import FloatingTestInputBox from "./components/FloatingTestInputBox"
import "./App.css"

// initial dummy panel data
const DUMMY_PANEL_DATA = [
  {
    data: {
      A: { w: 0.33333, h: 1.0, x: 0, y: 0 },
      B: { w: 0.33333, h: 1.0, x: 0.33333, y: 0 },
      C: { w: 0.33333, h: 1.0, x: 0.66666, y: 0 },
    },
    adjList: [
      { A: { re: ["B"], le: [], tv: [], bv: [] } },
      { B: { le: ["A"], re: ["C"], tv: [], bv: [] } },
      { C: { le: ["B"], re: [], tv: [], bv: [] } },
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

function App() {
  const [panelData, setPanelData] = useState(DUMMY_PANEL_DATA)
  // used for "restore"
  const [panelDataContextCache] = useState(DUMMY_PANEL_DATA)
  const [panelIds, setPanelIds] = useState([])

  const onMaximize = () => {
    const nextGraph = maximizePanel(panelIds)
    setPanelData(nextGraph)
  }
  const onMinimize = () => {
    const nextGraph = minimizePanel(panelData, panelIds)
    setPanelData(nextGraph)
  }
  const onRestore = () => {
    setPanelData(panelDataContextCache)
  }

  return (
    <>
      <div
        className="App"
        // NOTE: Only used for the FloatingTestInputBox. Not for the PanelManager
        onDragOver={(event) => event.preventDefault()}
      >
        <PanelManager
          onPanelDataChange={(nextPanelData) => setPanelData(nextPanelData)}
          panelData={panelData}
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
        </PanelManager>
      </div>
      <FloatingTestInputBox
        setPanelIds={setPanelIds}
        onMaximize={onMaximize}
        onMinimize={onMinimize}
        onRestore={onRestore}
        panelIds={panelIds}
        panelIdOptions={[{ value: "A" }, { value: "B" }, { value: "C" }]}
      />
    </>
  )
}

export default App
