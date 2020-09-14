import React, { useState, useRef } from 'react';
import { cloneDeep } from 'lodash';
import PanelManager from './components/PanelManager'
import {updateGraph} from './components/PanelManager/PanelGraph'
import './App.css';

const Switch = ({ isOn, handleToggle, id }) => {
  return (
    <>
      <input
        checked={isOn}
        onChange={() => handleToggle(!isOn)}
        className="react-switch-checkbox"
        id={`react-switch-new-${id}`}
        type="checkbox"
      />
      <label
        className="react-switch-label"
        htmlFor={`react-switch-new-${id}`}
      >
        <span className={`react-switch-button`} />
      </label>
    </>
  );
};



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
// const DUMMY_PANEL_DATA = {
//   PanelA: {
//     w: 0.5,
//     h: 0.5,
//     xOffset: 0,
//     yOffset: 0
//   },
//   PanelB: {
//     w: 0.5,
//     h: 0.5,
//     xOffset: 0.5,
//     yOffset: 0
//   }
// }
const DUMMY_PANEL_DATA_0 = {
  data : {
    A: { w: 0.25, h: 0.5, x: 0, y: 0 },
    B: { w: 0.5, h: 1.0, x: 0.25, y: 0},
    C: { w: 0.25, h: 0.5, x: 0.75, y: 0.0 },
    D: { w: 0.25, h: 0.5, x: 0, y: 0.5 },
    E: { w: 0.25, h: 0.5, x: 0.75, y: 0.5 },
  },
  // embedding order into list (first node is top left panel)
  // FIXME: these relationships may be missing something... maybe...
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
  // embedding order into list (first node is top left panel)
  // FIXME: these relationships may be missing something... maybe...
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

const SinglePanelManagerTestInput = ({ panelId, panelData, onRangeChange, index, id}) => {
    const [isTop, setIsTop] = useState(false)
    const [isLeft, setIsLeft] = useState(false)
    return (
      <>
        <b>Panel {panelId}</b>
        <div>x: {Math.floor(panelData.data[panelId].x * 100)}% y: {Math.floor(panelData.data[panelId].y * 100)}%</div>
      <div style={{ display: 'flex', flexDirection: 'row'}} key={`panel_input_${panelId}`}>
        <div style={{flexDirection: 'column', display: 'flex', padding: '0.5em'}}>
          <div>From Edge:</div>
          <div style={{display: 'flex', padding: '0.5em'}}>
          TV <Switch id={`top-${index}-${id}`} isOn={isTop} handleToggle={setIsTop}/>&nbsp;BV
          </div>
          <div>height (0 - 1) {Math.round(panelData.data[panelId].h * 100)}%</div>
          <input type='range' min={0} max={100} name='h' value={panelData.data[panelId].h * 100} onChange={event => onRangeChange(panelId, event, isTop ? 'BV' : 'TV')} />
        </div>
        <div style={{flexDirection: 'column', display: 'flex', padding: '0.5em'}}>
          <div>From Edge:</div>
          <div style={{display: 'flex', padding: '0.5em'}}>
          LE <Switch isOn={isLeft} id={`left-${index}-${id}`} handleToggle={setIsLeft}/>&nbsp;RE
          </div>
          width (0 - 1) {Math.round(panelData.data[panelId].w * 100)}%
          <input type='range' min={0} max={100} name='w' value={panelData.data[panelId].w * 100} onChange={event => onRangeChange(panelId, event, isLeft ? 'RE' : 'LE')} />
          <br/>
        </div>
      </div>
      </>
    )
}

const PanelManagerTestInputs = ({panelData, onRangeChange, id = ''}) => {
  const panelIds = Object.keys(panelData.data)

  return panelIds.map( (panelId, index)  => {
    return (
      <SinglePanelManagerTestInput
        key={`${panelId}_${index}`}
        index={index}
        id={id}
        panelData={panelData}
        onRangeChange={onRangeChange}
        panelId={panelId}
      />
    )
  })
}

function App() {
  const containerRef0 = useRef(null)
  const containerRef1 = useRef(null)
  const [panelData0, setPanelData0] = useState(DUMMY_PANEL_DATA_0)
  const [panelData1, setPanelData1] = useState(DUMMY_PANEL_DATA_1)

  const onRangeChange = (name, event, panelData, setPanelData, edgeType) => {
    const targetName = event.target.name
    const currentPercent = panelData.data[name][targetName]
    const nextPercent = parseInt(event.target.value) / 100
    const percentChange = Math.floor((nextPercent - currentPercent) * 100) / 100
    // this will be dispatched from a panel drag event, in one single object
    const changeEvent = {
      nodeId: name,
      edgeType,
      data: {
        w: targetName === 'w' ? percentChange : 0,
        h: targetName === 'h' ? percentChange : 0
      }
    }
    const nextPanelData = updateGraph(cloneDeep(panelData), changeEvent)
    setPanelData(nextPanelData)
  }
  return (
    <div className="App">
      <div style={{display: 'flex', flexDirection: 'row', padding: '1em'}}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid lightgrey',
          width: 310,
          alignContent: 'left',
          padding: '0.5em',
          textAlign: 'left'
        }}
      >
        <span style={{fontSize: 18, fontWeight: 'bold'}}>Example #1</span>
        <br/>
        <PanelManagerTestInputs onRangeChange={(name, event, edgeType) => onRangeChange(name, event, panelData0, setPanelData0, edgeType )} panelData={panelData0} />
      </div>
      <div ref={containerRef0} style={{border: '1px solid darkblue', maxWidth: 900, minWidth: 900, minHeight: 900, maxHeight: 900}}>
        <PanelManager
          containerRef={containerRef0}
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
      <div style={{display: 'flex', flexDirection: 'row', padding: '1em'}}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid lightgrey',
          width: 310,
          alignContent: 'left',
          padding: '0.5em',
          textAlign: 'left'
        }}
      >
        <span style={{fontSize: 18, fontWeight: 'bold'}}>Example #2</span>
        <br/>
        <PanelManagerTestInputs id='test-one' onRangeChange={(name, event, edgeType) => onRangeChange(name, event, panelData1, setPanelData1, edgeType )} panelData={panelData1} />
      </div>
      <div ref={containerRef1} style={{border: '1px solid darkblue', maxWidth: 900, minWidth: 900, minHeight: 900, maxHeight: 900}}>
        <PanelManager
          containerRef={containerRef1}
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
