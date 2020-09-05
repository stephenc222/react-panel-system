import React, { useState, useRef } from 'react';
import { cloneDeep } from 'lodash';
import PanelManager from './components/PanelManager'
import {updateGraph} from './components/PanelManager/PanelGraph'
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
const DUMMY_PANEL_DATA = {
  data : {
    A: { w: 0.5, h: 0.5 },
    B: { w: 0.5, h: 0.5 },
    C: { w: 0.5, h: 0.5 },
    D: { w: 0.5, h: 0.5 }
  },
  // embedding order into list (first node is top left panel)
  // FIXME: these relationships may be missing something... maybe...
  adjList: [
    { A: { horiz: ['B', ], adjHoriz: [], vert: ['D', 'C'], adjVert: ['B'] } },
    { B: { horiz: ['A', ], adjHoriz: [], vert: ['C', 'D'], adjVert: ['A'] } },
    { D: { horiz: ['C', ], adjHoriz: [], vert: ['A', 'B'], adjVert: ['C'] } },
    { C: { horiz: ['D', ], adjHoriz: [], vert: ['B', 'A'], adjVert: ['D'] } },
  ]
}

const PanelA = () => (<div style={{background: '#C23B23', display: 'flex', width: '100%', height: '100%'}}>Panel A</div>)
const PanelB = () => (<div style={{background: '#03C03C', display: 'flex', width: '100%', height: '100%'}}>Panel B</div>)
const PanelC = () => (<div style={{background: '#579ABE', display: 'flex', width: '100%', height: '100%'}}>Panel C</div>)
const PanelD = () => (<div style={{background: '#976ED7', display: 'flex', width: '100%', height: '100%'}}>Panel D</div>)

function App() {
  const containerRef = useRef(null)
  const [panelData, setPanelData] = useState(DUMMY_PANEL_DATA)

  const onRangeChange = (name, event) => {
    const targetName = event.target.name
    const currentPercent = panelData.data[name][targetName]
    const nextPercent = parseInt(event.target.value) / 100
    const percentChange = Math.floor((nextPercent - currentPercent) * 100) / 100
    const changeEvent = {
      nodeId: name,
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
        <div>height (0 - 1) {Math.round(panelData.data['A'].h * 100)}%</div>
        <input type='range' min={0} max={100} name='h' value={panelData.data['A'].h * 100} onChange={event => onRangeChange('A', event)} />
        width (0 - 1) {Math.round(panelData.data['A'].w * 100)}%
        <input type='range' min={0} max={100} name='w' value={panelData.data['A'].w * 100} onChange={event => onRangeChange('A', event)} />
        <br/>
        <b>Panel B</b>
        <div>height (0 - 1) {Math.round(panelData.data['B'].h * 100)}%</div>
        <input type='range' min={0} max={100} name='h' value={panelData.data['B'].h * 100} onChange={event => onRangeChange('B', event)} />
        <div>width (0 - 1) {Math.round(panelData.data['B'].w * 100)}%</div>
        <input type='range' min={0} max={100} name='w' value={panelData.data['B'].w * 100} onChange={event => onRangeChange('B', event)} />
        <br/>
        <b>Panel C</b>
        <div>height (0 - 1) {Math.round(panelData.data['C'].h * 100)}%</div>
        <input type='range' min={0} max={100} name='h' value={panelData.data['C'].h * 100} onChange={event => onRangeChange('C', event)} />
        <div>width (0 - 1) {Math.round(panelData.data['C'].w * 100)}%</div>
        <input type='range' min={0} max={100} name='w' value={panelData.data['C'].w * 100} onChange={event => onRangeChange('C', event)} />
        <br/>
        <b>Panel D</b>
        <div>height (0 - 1) {Math.round(panelData.data['D'].h * 100)}%</div>
        <input type='range' min={0} max={100} name='h' value={panelData.data['D'].h * 100} onChange={event => onRangeChange('D', event)} />
        <div>width (0 - 1) {Math.round(panelData.data['D'].w * 100)}%</div>
        <input type='range' min={0} max={100} name='w' value={panelData.data['D'].w * 100} onChange={event => onRangeChange('D', event)} />
      </div>
      <div ref={containerRef} style={{border: '1px solid darkblue', maxWidth: 900, minWidth: 900, minHeight: 900, maxHeight: 900}}>
        {/* <pre>
          {JSON.stringify(panelData, null, 2)}
        </pre> */}
        <PanelManager
          containerRef={containerRef}
          panelComponents={[
            {id: 'A', PanelComponent: PanelA},
            {id: 'B', PanelComponent: PanelB},
            {id: 'C', PanelComponent: PanelC},
            {id: 'D', PanelComponent: PanelD},
          ]}
          panelData={panelData}
        />
      </div>
    </div>
  );
}

export default App;
