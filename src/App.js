import React, { useState } from 'react';
import PanelManager from './components/PanelManager'
import { minimizePanel, maximizePanel } from './components/PanelGraph'
import Select from './Select'
import './App.css';

const DUMMY_PANEL_DATA_0 = {
  data : {
    A: { w: 0.25, h: 0.5, x: 0, y: 0 },
    B: { w: 0.5, h: 1.0, x: 0.25, y: 0},
    C: { w: 0.25, h: 0.5, x: 0.75, y: 0.0 },
    D: { w: 0.25, h: 0.5, x: 0, y: 0.5 },
    E: { w: 0.25, h: 0.5, x: 0.75, y: 0.5 },
  },
  adjList: [
    { A: { re: ['B', 'D'], le: [], tv: [], bv: ['D'] } },
    { B: { re: ['C', 'E'], le: ['A', 'D'], tv: [], bv: [] } },
    { C: { re: [], le: ['B', 'E'], tv: [], bv: ['E'] } },
    { D: { re: ['B', 'A'], le: [], tv: ['A'], bv: [] } },
    { E: { re: [], le: ['B', 'C'], tv: ['C'], bv: [] } },
  ]
}
const DUMMY_PANEL_DATA_1 = {
  data : {
    A: { w: 0.5, h: 0.5, x: 0, y: 0 },
    B: { w: 0.5, h: 0.5, x: 0.5, y: 0},
    C: { w: 0.5, h: 0.5, x: 0, y: 0.5 },
    D: { w: 0.5, h: 0.5, x: 0.5, y: 0.5 }
  },
  adjList: [
    { A: { re: ['B','C', 'D' ], le: [], tv: [], bv: ['C' ] } },
    { B: { le: ['A', 'C', 'D' ], re: [], tv: [], bv: ['D'] } },
    { C: { re: ['D','B', 'A' ], le: [], tv: ['A'], bv: [] } },
    { D: { le: ['B','C', 'A' ], re: [], tv: ['B'], bv: [] } },
  ]
}

// TODO: test with much, much more complex panel arrangements

const PanelA = () => (<div style={{background: '#C23B23', display: 'flex', flexGrow: 1}}>Panel A</div>)
const PanelB = () => (<div style={{background: '#03C03C', display: 'flex', flexGrow: 1}}>Panel B</div>)
const PanelC = () => (<div style={{background: '#579ABE', display: 'flex', flexGrow: 1}}>Panel C</div>)
const PanelD = () => (<div style={{background: '#976ED7', display: 'flex', flexGrow: 1}}>Panel D</div>)
const PanelE = () => (<div style={{background: '#F39A27', display: 'flex', flexGrow: 1}}>Panel E</div>)

function App() {
  const [panelData0, setPanelData0 ] = useState(DUMMY_PANEL_DATA_0)
  const [panelData1, ] = useState(DUMMY_PANEL_DATA_1)
  const [panelIds, setPanelIds] = useState([])

  const onMaximize= () => {
    const nextGraph = maximizePanel(panelData0, panelIds)
    setPanelData0(nextGraph)
  }
  const onMinimize = () => {
    const nextGraph = minimizePanel(panelData0, panelIds)
    setPanelData0(nextGraph)
  }
  const onRestore = () => {
  }

  return (
    <div className='App'>
      <span
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          paddingTop: '1em',
          paddingBottom: '1em',
        }}
      >
        Example #1
      </span>
      <div style={{ zIndex: 2}}>
        <Select
          label="React Multiple Select"
          placeholder="Pick some"
          onValuesChange={ values => setPanelIds(values)}
          options={[
            { value: 'A' },
            { value: 'B' },
            { value: 'C' },
            { value: 'D' },
            { value: 'E' }
          ]}
          multiple
        />
        <div style={{paddingTop: '0.5em'}}>
          <button disabled={panelIds.length !== 1} onClick={onMaximize} style={{marginLeft: '1em', marginRight: '1em'}}>Maximize</button>
          <button onClick={onMinimize} style={{marginLeft: '1em', marginRight: '1em'}}>Minimize</button>
          <button onClick={onRestore} style={{marginLeft: '1em', marginRight: '1em'}}>Restore</button>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          height: '90vh',
          padding: '1em',
          flexGrow: 1,
          flexBasis: 1
        }}
      >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          flexBasis: 1,
          height: '100%',
          border: '1px solid darkblue'
        }}
      >
        <PanelManager
          minimizedPanels={[]}
          maximizedPanel={''}
          // onPanelDataChange={ nextPanelData => console.log('panel data change', { nextPanelData })}
          panelComponents={[
            {id: 'A', PanelComponent: PanelA},
            {id: 'B', PanelComponent: PanelB},
            {id: 'C', PanelComponent: PanelC},
            {id: 'D', PanelComponent: PanelD},
            {id: 'E', PanelComponent: PanelE},
          ]}
          panelData={panelData0}
        />
        </div>
      </div>
      <span
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          paddingTop: '1em',
          paddingBottom: '1em',
        }}
      >
        Example #2
      </span>
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
        style={{
          display: 'flex',
          border: '1px solid darkblue',
          height: '100%',
          width: '100%'
        }}
      >
        <PanelManager
          // onPanelDataChange={ nextPanelData => console.log('panel data change', { nextPanelData })}
          panelComponents={[
            {id: 'A', PanelComponent: PanelA},
            {id: 'B', PanelComponent: PanelB},
            {id: 'C', PanelComponent: PanelC},
            {id: 'D', PanelComponent: PanelD},
          ]}
          panelData={panelData1}
        />
      </div>
      </div>
    </div>
  );
}

export default App;
