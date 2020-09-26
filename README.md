# React Panel System

A system of resizable, persistent and configurable panels. Built with React.

Demo [here](https://stephenc222.github.io/react-panel-system/).

## Quick Start

`yarn add react-panel-system`

```jsx
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import PanelManager , { minimizePanel, maximizePanel } from 'react-panel-system'

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

## Props

| Prop                           |      Type      | Description |
| :----------------------------- | :------------: | :----------|
| panelData <br/> _(required)_    |    object    | This is the core data structure of `react-panel-system`. It consists of two properties, an object called `data` and an array called `adjList`. <br/> <br/> The `data` object property describes the x offset and y offset, in percentage, of a certain panel from the top left corner (the (0,0) coordinate of the `PanelManager`). The top-level keys in `data` are the same panel ids that map directly to `panelComponents`. <br/> <br/> The `adjList` array property is similar to an adjacency list, where each object in the array has a top-level key of it's panel Id, and then four arrays describing the kinds of edge-based relationships that a particular panel has. For example, in the "Simple Example", panel with id "A" shares a right edge with "B", and has no other relationships to "B" or any other node, because there are only 2 nodes in that example in the `panelData`. Conversely, in that example, panel with id "B" shares a left edge with "A". <br/> <br/>__NOTE:__ Panel relationships are intentionally "redundant" to ensure reliable transformation on "minimize" and "maximize" See [Data Helper Functions](#Data-Helper-Functions).    |
| panelComponents <br/> _(required)_ | array | A required array of objects, where each object in the array has expected properties of `id` and `PanelComponent`.<br/> <br/> The `id` property maps directly to the `id` of the same panel in `panelData`, so that `react-panel-system` can correctly render the component set to the corresponding value of `PanelComponent`, for this same `id`.<br/> <br/>__NOTE:__ `react-panel-system` expects each `PanelComponent` to be responsible for fetching it's own data, and thus self-contained, whether that is through a state management solution like Redux or React Context, or fetching it's data on component mount.|
onPanelDataChange<br/> _(required)_  | function | This is the callback prop that is passed the next state of `panelData`. This should directly correspond to the state value passed as `panelData` to `PanelManager`. A simple implementation of `onPanelDataChange` prop would look like this: <br/></br>`onPanelDataChange={panelData => this.setState({ panelData })}` <br/></br>or a React Hooks equivalent like: <br/><br/>`onPanelDataChange={panelData => setPanelData(panelData)}`|
leftEdgeClassName | string | The CSS class to apply to the left edge (the draggable edge). If supplied, this will override the default CSS class.
rightEdgeClassName | string | The CSS class to apply to the right edge (the draggable edge). If supplied, this will override the default CSS class.
topEdgeClassName | string | The CSS class to apply to the top edge (the draggable edge). If supplied, this will override the default CSS class.
bottomEdgeClassName | string | The CSS class to apply to the bottom edge (the draggable edge). If supplied, this will override the default CSS class.

## Data Helper Functions

Using these data helper functions, you can easily update `panelData` to respond to typical panel UX concerns, like "maximizing" and "minimizing" panels. These functions are exported from the root of the package, along with `PanelManager`

- **`maximizePanel`**: Takes the current `panelData` data structure, and a panel id of an existing panel in `panelData` and returns the next state of `panelData` with the corresponding panel "maximized". "Maximized" is defined as one panel, that is full width, full height of the container of `PanelManager`, with no draggable edges

- **`minimizePanel`**: Takes the current `panelData` data structure, and a panel id of an existing panel in `panelData` and returns the next state of `panelData` with the corresponding panel "minimized". "Minimized" is defined as the panel removed from `panelData`, which means it's previous edge-based relationships are re-mapped correspondingly to it's former neighbors.
