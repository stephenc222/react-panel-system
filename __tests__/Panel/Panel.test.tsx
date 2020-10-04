import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Panel from '../../src/Panel'
import { PanelSystemContext } from '../../src/context'

const customRender = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <PanelSystemContext.Provider value={providerProps}>{ui}</PanelSystemContext.Provider>,
    renderOptions
  )
}

describe('Panel', () => {
  it('renders', () => {
    const testPanelDataContext = [{
      data: {
        A: { x: 0, y: 0, w: 1, h: 1 }
      },
      adjList: [{
        A: { re: [], le: [], tv: [], bv: [] }
      }]
    }]
    const testDraggingNode = {}
    const panelManagerContext = [{
      panelDataContext: testPanelDataContext,
      draggingNode: testDraggingNode
    }, {
      updatePanelDataContext: () => {},
      setDraggingNode: () => {},
      setStartPos: () => {}
    }]
    customRender(
      <Panel
        nodeId={ 'A'}
        w={ 1}
        h={ 1}
        x={ 0}
        y={ 0}
        onMouseMove={ (event: React.MouseEvent<HTMLDivElement,MouseEvent>) => {}}
        onMouseUp={ (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {}}
      />,
      { providerProps: panelManagerContext }
    )
  })
})