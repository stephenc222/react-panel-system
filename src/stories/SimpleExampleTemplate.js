import React, { useState } from 'react';
import PanelManager , { minimizePanel, maximizePanel} from '../components/PanelManager'
import Select from '../../src/Select'
import '../../src/App.css';

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

// TODO: test with much, much more complex panel arrangements

const PanelA = () => (<div style={{background: '#C23B23', display: 'flex', flexGrow: 1}}>Panel A</div>)
const PanelB = () => (<div style={{background: '#03C03C', display: 'flex', flexGrow: 1}}>Panel B</div>)

function App() {
  const [panelData, setPanelData] = useState(DUMMY_PANEL_DATA)
  // used for "restore"
  // TODO: integrate through an interface a component consuming the PanelManager can trigger
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
      <div style={{ zIndex: 2}}>
        <Select
          label="Panel Select"
          placeholder="Pick some"
          onValuesChange={ values => setPanelIds(values)}
          options={[
            { value: 'A' },
            { value: 'B' },
          ]}
          multiple
        />
        <div style={{paddingTop: '0.5em'}}>
          <button disabled={panelIds.length !== 1} onClick={onMaximize} style={{marginLeft: '1em', marginRight: '1em'}}>Maximize</button>
          <button onClick={onMinimize} style={{marginLeft: '1em', marginRight: '1em'}}>Minimize</button>
          <button onClick={onRestore} style={{marginLeft: '1em', marginRight: '1em'}}>Restore</button>
        </div>
      </div>
      <span
        style={{
          paddingTop: '1em',
          paddingBottom: '1em',
        }}
      >
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
          onPanelDataChange={ nextPanelData => setPanelData(nextPanelData)}
          panelComponents={[
            {id: 'A', PanelComponent: PanelA},
            {id: 'B', PanelComponent: PanelB},
          ]}
          panelData={panelData}
        />
      </div>
      </div>
    </div>
  );
}

export default App;
