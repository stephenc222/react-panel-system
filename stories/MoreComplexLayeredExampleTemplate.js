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
      A: { w: 1.0, h: 1.0, x: 0, y: 0 },
    },
    adjList: [{ A: { re: [], le: [], tv: [], bv: [] } }],
  },
  {
    data: {
      B: { w: 0.25, h: 0.5, x: 0, y: 0 },
      C: { w: 0.25, h: 0.5, x: 0.75, y: 0 },
      D: { w: 0.25, h: 0.5, x: 0, y: 0.5 },
      E: { w: 0.25, h: 0.5, x: 0.75, y: 0.5 },
    },
    adjList: [
      { B: { re: ["D"], le: [], tv: [], bv: ["D"] } },
      { C: { le: ["E"], re: [], tv: [], bv: ["E"] } },
      { D: { re: ["B"], le: [], tv: ["B"], bv: [] } },
      { E: { le: ["C"], re: [], tv: ["C"], bv: [] } },
    ],
  },
]

const PanelA = () => (
  <div
    style={{
      background: "#C23B23",
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      textAlign: "center",
      width: "100%",
      justifyContent: "space-between",
      alignItems: "space-between",
    }}
  >
    <span>Panel A</span>
    <div>This panel is rendered first</div>
    <div />
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
          <Panel panelId="D">
            <PanelD />
          </Panel>
          <Panel panelId="E">
            <PanelE />
          </Panel>
        </PanelManager>
      </div>
      {/* <FloatingTestInputBox
        panelIdOptions={
          [{ value: 'A'}, {value: 'B'}, {value: 'C'} ]
        }
        setPanelIds={setPanelIds}
        onMaximize={onMaximize}
        onMinimize={onMinimize}
        onRestore={onRestore}
        panelIds={panelIds}
      /> */}
    </>
  )
}

export default App
