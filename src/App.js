import React, { useState, useRef } from 'react';
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
    w: 0.5,
    h: 0.5,
    xOffset: 0,
    yOffset: 0
  },
  PanelB: {
    w: 0.5,
    h: 0.5,
    xOffset: 0.5,
    yOffset: 0
  }
}

const PanelA = () => (<div style={{background: 'blue', display: 'flex', width: '100%', height: '100%'}}>Panel A</div>)
const PanelB = () => (<div style={{background: 'lightgreen', display: 'flex', width: '100%', height: '100%'}}>Panel B</div>)

function App() {
  const containerRef = useRef(null)
  const [panelData, setPanelData] = useState(DUMMY_PANEL_DATA)

  const onRangeChange = (name, event) => {
    const targetName = event.target.name
    const nextPercent = parseInt(event.target.value) / 100
    const nextPanelData = Object.assign({}, panelData)
    nextPanelData[name][targetName] = nextPercent
    setPanelData(nextPanelData)
  }
  return (
    <div className="App">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid lightgrey',
          maxWidth: 500,
          alignContent: 'left',
          padding: '1em',
          textAlign: 'left'
        }}
      >
        <b>Panel A</b>
        <label>
          height (0 - 1) {Math.round(panelData['PanelA'].h * 100)}%
          <input type='range' min={0} max={100} name='h' value={panelData['PanelA'].h * 100} onChange={event => onRangeChange('PanelA', event)} />
          <br/>
          width (0 - 1) {Math.round(panelData['PanelA'].w * 100)}%
          <input type='range' min={0} max={100} name='w' value={panelData['PanelA'].w * 100} onChange={event => onRangeChange('PanelA', event)} />
        </label>
        <b>Panel B</b>
        <label>
          height (0 - 1) {Math.round(panelData['PanelB'].h * 100)}%
          <input type='range' min={0} max={100} name='h' value={panelData['PanelB'].h * 100} onChange={event => onRangeChange('PanelB', event)} />
          <br/>
          width (0 - 1) {Math.round(panelData['PanelB'].w * 100)}%
          <input type='range' min={0} max={100} name='w' value={panelData['PanelB'].w * 100} onChange={event => onRangeChange('PanelB', event)} />
        </label>
      </div>
      <div ref={containerRef} style={{border: '1px solid darkblue', maxWidth: 900, minWidth: 900, minHeight: 900, maxHeight: 900}}>
        <PanelManager
          containerRef={containerRef}
          panelComponents={[PanelA, PanelB]}
          panelData={panelData}

        />
      </div>
    </div>
  );
}

export default App;
