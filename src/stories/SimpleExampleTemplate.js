import React, { useState } from 'react';
import PanelManager , { minimizePanel, maximizePanel} from '../index.js'
import FloatingTestInputBox from './FloatingTestInputBox'
import './App.css';

// initial dummy panel data
const DUMMY_PANEL_DATA = {
  data : {
    A: { w: 0.5, h: 1.0, x: 0, y: 0 },
    B: { w: 0.5, h: 1.0, x: 0.5, y: 0},
  },
  adjList: [
    { A: { re: ['B'], le: [], tv: [], bv: [] } },
    { B: { le: ['A',], re: [], tv: [], bv: [] } },
  ]
}

const PanelA = () => (<div style={{background: '#C23B23', display: 'flex', flexGrow: 1}}>Panel A</div>)
const PanelB = () => (<div style={{background: '#03C03C', display: 'flex', flexGrow: 1}}>Panel B</div>)

function App() {
  const [panelData, setPanelData] = useState(DUMMY_PANEL_DATA)
  // used for "restore"
  const [panelDataContextCache, ] = useState(DUMMY_PANEL_DATA)
  const [panelIds, setPanelIds] = useState([])

  const onMaximize= () => {
    const nextGraph = maximizePanel(panelData, panelIds)
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
    <div className='App'>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          height: '90vh',
          flexGrow: 1,
          padding: '1em',
          flexBasis: 1
        }}
      > 
      <div
        // only used for the FloatingTestInputBox. Not for the PanelManager
        onDragOver={ event => event.preventDefault()}
        style={{
          display: 'flex',
          border: '1px solid darkblue',
          height: '100%',
          width: '100%'
        }}
      >
        <PanelManager
          onPanelDataChange={ nextPanelData => setPanelData(nextPanelData)}
          panelComponents={[
            {id: 'A', PanelComponent: PanelA},
            {id: 'B', PanelComponent: PanelB},
          ]}
          panelData={panelData}
        />
      </div>
      </div>
      <FloatingTestInputBox
        panelIdOptions={
          [{ value: 'A'}, {value: 'B'} ]
        }
        setPanelIds={setPanelIds}
        onMaximize={onMaximize}
        onMinimize={onMinimize}
        onRestore={onRestore}
        panelIds={panelIds}
      />
    </div>
  );
}

export default App;
