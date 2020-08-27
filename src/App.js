import React, { useState } from 'react';
import PanelManager from './components/PanelManager'
import './App.css';

/**
 * data object passed to PanelManager has following structure (per panel)
 * id: {
 *   xOffset: number,
 *   yOffset: number,
 *   w: number,
 *   h: number
 * }
 */ 

// All Panels "start" at top left, and all panels are offset from the relative "{0,0}" of the PanelManager itself
// Panels will be sorted according of xOffset and yOffset (since all panel offsets are based from the same relative point)
const DUMMY_PANEL_DATA = {
  PanelA: {
    w: 100,
    h: 100,
    xOffset: 0,
    yOffset: 0
  },
  PanelB: {
    w: 100,
    h: 100,
    xOffset: 100,
    yOffset: 0
  }
}

const PanelA = () => (<div style={{background: 'blue', display: 'flex', width: '100%', height: '100%'}}>Panel A</div>)
const PanelB = () => (<div style={{background: 'lightgreen', display: 'flex', width: '100%', height: '100%'}}>Panel B</div>)

function App() {
  const [panelId, setPanelId] = useState('')
  const [panelData, setPanelData] = useState(DUMMY_PANEL_DATA)
  window.test = PanelA
  return (
    <div className="App">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid lightgrey',
          maxWidth: 500,
          alignContent: 'left',
          padding: '1em'
        }}
      >
        <label>
          Panel Id:<br/>
          <input value={panelId} onChange={event => setPanelId(event.target.value)} />
        </label>
        <div style={{ maxWidth: 500}}>
          <button>Maximize</button>
          <button>Minimize</button>
        </div>
      </div>
      <div style={{border: '1px solid darkblue', maxWidth: 900, minWidth: 900, minHeight: 900, maxHeight: 900}}>
        <PanelManager
          panelComponents={[PanelA, PanelB]}
          panelData={panelData}

        />
      </div>
    </div>
  );
}

export default App;
