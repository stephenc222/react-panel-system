# React Panel System

## Overview

A system of UI Panels to enable Panels to be easily resizable, persistent and configurable.
Demo [here](https://stephenc222.github.io/react-panel-system/).

## Quick Start

`yarn add react-panel-system`

```jsx
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import PanelManager , { minimizePanel, maximizePanel} from 'react-panel-system'

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

const PanelA = () => (
  <div
    style={{
      background: '#C23B23',
      display: 'flex',
      flexGrow: 1
    }}>
    Panel A
  </div>
)
const PanelB = () => (
  <div
    style={{
      background: '#03C03C',
      display: 'flex',
      flexGrow: 1
    }}>
    Panel B
  </div>
)

const App = () => {
  const [panelData, setPanelData] = useState(DUMMY_PANEL_DATA)

  return (
    <div>
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
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

```

## Architechture

Primarily consists of 3 main entities:

- Panel
- PanelManager
- PanelGraph

### Panel

Each Container of individual, variable content, to enable standard component wrapping without undue influence on children implementation to simplify persistence, drag-based resizing, as well as configuration from JSON. Assumes children of Panel are encapsulated, so do not rely on Panel or PanelManager to handle any data fetching concerns

### PanelManager

Manages and renders Panels. This means handling order, serialization of Panel position, and calculation of change events to pass to PanelGraph. PanelManager will expand to the entirety given to it by it's parent. Accepts a callback that will be called with an object of panels whose positions have changed.

### PanelGraph

This is the set of functions that form the API that handles graph transformations based on change events received from the PanelManager. Graph updates result in a new, deeply copied graph data structure for the following reasons:

1. Modern component libraries such as React do not handle well performing UI state updates with objects that maintain references to objects used in a previous UI state
2. The size of the panel graph probably would never grow to be very large (even 12 panels would seem an unrealistic number) so handling multiple transformations of small arrays (the graph is stored in an adjacency list, or at least a forumlation of an adjacency list that encodes edge data in property key names themselves) in response to UI events is not seen as a performance killer.

`current graph + change event = new graph`
