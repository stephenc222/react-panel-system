/**
 * @jest-environment jsdom
 */
import React, { useState } from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import PanelManager from '../../src/PanelManager'
import Panel from '../../src/Panel'

describe('PanelManager', () => {
  it('renders null if no children passed', () => {
    const testPanelData = [{
      data: {
        A: { x: 0, y: 0, w: 1, h: 1 }
      },
      adjList: [{
        A: { re: [], le: [], tv: [], bv: [] }
      }]
    }]
    const { container } = render(<PanelManager onPanelDataChange={() => null} panelData={testPanelData} />)
    expect(container.firstChild).toBeEmptyDOMElement()
  })
  it('renders a panel layout of one panel', () => {
    const testPanelData = [{
      data: {
        A: { x: 0, y: 0, w: 1, h: 1 }
      },
      adjList: [{
        A: { re: [], le: [], tv: [], bv: [] }
      }]
    }]
    const internallyCreatedAndPassedPanelProps = {
      w: 1,
      h: 1,
      x: 0,
      y: 0,
      onMouseMove: () => {},
      onMouseUp: () => {},
      onMouseDown: () => {},
      draggingNode: null
    }
    render(
      <PanelManager onPanelDataChange={() => null} panelData={testPanelData}>
        <Panel panelId='A' {...internallyCreatedAndPassedPanelProps} />
      </PanelManager>
    )
  })
  it('should have no change if dragging node is falsy', () => {
    const testPanelData = [{
      data: {
        A: { x: 0, y: 0, w: 1, h: 0.5 },
        B: { x: 0, y: 0.5, w: 1, h: 0.5 }
      },
      adjList: [{
        A: { re: [], le: [], tv: [], bv: ['B'] },
        B: { re: [], le: [], tv: ['A'], bv: [] }
      }]
    }]
    const PanelA = () => (<div style={{background: '#C23B23', display: 'flex', flexGrow: 1}}>Panel A</div>)
    const PanelB = () => (<div style={{background: '#03C03C', display: 'flex', flexGrow: 1}}>Panel B</div>)
    const TestApp = () => {
      const [panelData, setPanelData] = useState(testPanelData)
    
      return (
        <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          height: '90vh',
          padding: '1em'
        }}
      > 
        <PanelManager
          // @ts-expect-error
          onPanelDataChange={ nextPanelData => setPanelData(nextPanelData)}
          panelData={panelData}
        >
          {/** @ts-expect-error */} 
          <Panel panelId='A'>
            <PanelA/>
          </Panel>
          {/** @ts-expect-error */} 
          <Panel panelId='B'>
            <PanelB/>
          </Panel>
        </PanelManager>
      </div>
      )
    }
    const { getByTestId } = render(<TestApp/>)
    const testPanelAContainer = getByTestId('panel__A')
    // default JSDOM window width is 1024, and height is 768
    const startHeightInPixels = parseFloat(testPanelAContainer.style.height.replace('%','')) / 100 * 768
    const testPanelAMask = getByTestId('panel__A__mask')
    // mouse move without a prior mouse down
    fireEvent.mouseMove(testPanelAMask, { clientX: 1024 / 2 , clientY:  startHeightInPixels * 0.4 })
    fireEvent.mouseUp(testPanelAMask)
    // then inspect panel for expected position change
    expect(testPanelAContainer.style.height).toEqual('50.002%')
  })
  it('should have no width change if the change is NaN or 0', () => {
    const testPanelData = [{
      data: {
        A: { x: 0, y: 0, w: 0.5, h: 1 },
        B: { x: 0.5, y: 0, w: 0.5, h: 1 }
      },
      adjList: [{
        A: { re: ['B'], le: [], tv: [], bv: [] },
        B: { re: [], le: ['A'], tv: [], bv: [] }
      }]
    }]
    const PanelA = () => (<div style={{background: '#C23B23', display: 'flex', flexGrow: 1}}>Panel A</div>)
    const PanelB = () => (<div style={{background: '#03C03C', display: 'flex', flexGrow: 1}}>Panel B</div>)
    const TestApp = () => {
      const [panelData, setPanelData] = useState(testPanelData)
    
      return (
        <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          height: '90vh',
          padding: '1em'
        }}
      > 
        <PanelManager
          // @ts-expect-error
          onPanelDataChange={ nextPanelData => setPanelData(nextPanelData)}
          panelData={panelData}
        >
          {/** @ts-expect-error */} 
          <Panel panelId='A'>
            <PanelA/>
          </Panel>
          {/** @ts-expect-error */} 
          <Panel panelId='B'>
            <PanelB/>
          </Panel>
        </PanelManager>
      </div>
      )
    }
    const { getByTestId } = render(<TestApp/>)
    const testPanelAContainer = getByTestId('panel__A')
    // default JSDOM window width is 1024, and height is 768
    const testPanelAHorizontalRightEdge = getByTestId('panel__A__re')
    const testPanelAMask = getByTestId('panel__A__mask')
    // mouse down
    fireEvent.mouseDown(testPanelAHorizontalRightEdge)
    // then mouse move
    fireEvent.mouseMove(testPanelAMask, { clientX: NaN, clientY: 768 / 2 })
    fireEvent.mouseUp(testPanelAMask)
    // then inspect panel for expected position change
    expect(testPanelAContainer.style.width).toEqual('50.002%')
  })
  it('should have no height change if the change is NaN or 0', () => {
    const testPanelData = [{
      data: {
        A: { x: 0, y: 0, w: 1, h: 0.5 },
        B: { x: 0, y: 0.5, w: 1, h: 0.5 }
      },
      adjList: [{
        A: { re: [], le: [], tv: [], bv: ['B'] },
        B: { re: [], le: [], tv: ['A'], bv: [] }
      }]
    }]
    const PanelA = () => (<div style={{background: '#C23B23', display: 'flex', flexGrow: 1}}>Panel A</div>)
    const PanelB = () => (<div style={{background: '#03C03C', display: 'flex', flexGrow: 1}}>Panel B</div>)
    const TestApp = () => {
      const [panelData, setPanelData] = useState(testPanelData)
    
      return (
        <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          height: '90vh',
          padding: '1em'
        }}
      > 
        <PanelManager
          // @ts-expect-error
          onPanelDataChange={ nextPanelData => setPanelData(nextPanelData)}
          panelData={panelData}
        >
          {/** @ts-expect-error */} 
          <Panel panelId='A'>
            <PanelA/>
          </Panel>
          {/** @ts-expect-error */} 
          <Panel panelId='B'>
            <PanelB/>
          </Panel>
        </PanelManager>
      </div>
      )
    }
    const { getByTestId } = render(<TestApp/>)
    const testPanelAContainer = getByTestId('panel__A')
    // default JSDOM window width is 1024, and height is 768
    const testPanelAHorizontalBottomEdge = getByTestId('panel__A__bv')
    const testPanelAMask = getByTestId('panel__A__mask')
    // mouse down
    fireEvent.mouseDown(testPanelAHorizontalBottomEdge)
    // then mouse move
    fireEvent.mouseMove(testPanelAMask, { clientX: 1024 / 2, clientY:  NaN })
    fireEvent.mouseUp(testPanelAMask)
    // then inspect panel for expected position change
    expect(testPanelAContainer.style.height).toEqual('50.002%')
  })
  it('changes PanelA\'s height from mousedown on panel edge and mousemove on panel mask', () => {
    const testPanelData = [{
      data: {
        A: { x: 0, y: 0, w: 1, h: 0.5 },
        B: { x: 0, y: 0.5, w: 1, h: 0.5 }
      },
      adjList: [{
        A: { re: [], le: [], tv: [], bv: ['B'] },
        B: { re: [], le: [], tv: ['A'], bv: [] }
      }]
    }]
    const PanelA = () => (<div style={{background: '#C23B23', display: 'flex', flexGrow: 1}}>Panel A</div>)
    const PanelB = () => (<div style={{background: '#03C03C', display: 'flex', flexGrow: 1}}>Panel B</div>)
    const TestApp = () => {
      const [panelData, setPanelData] = useState(testPanelData)
    
      return (
        <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          height: '90vh',
          padding: '1em'
        }}
      > 
        <PanelManager
          // @ts-expect-error
          onPanelDataChange={ nextPanelData => setPanelData(nextPanelData)}
          panelData={panelData}
        >
          {/** @ts-expect-error */} 
          <Panel panelId='A'>
            <PanelA/>
          </Panel>
          {/** @ts-expect-error */} 
          <Panel panelId='B'>
            <PanelB/>
          </Panel>
        </PanelManager>
      </div>
      )
    }
    const { getByTestId } = render(<TestApp/>)
    const testPanelAContainer = getByTestId('panel__A')
    // default JSDOM window width is 1024, and height is 768
    const startHeightInPixels = parseFloat(testPanelAContainer.style.height.replace('%','')) / 100 * 768
    const testPanelAHorizontalBottomEdge = getByTestId('panel__A__bv')
    const testPanelAMask = getByTestId('panel__A__mask')
    // mouse down
    fireEvent.mouseDown(testPanelAHorizontalBottomEdge)
    // then mouse move
    fireEvent.mouseMove(testPanelAMask, { clientX: 1024 / 2 , clientY:  startHeightInPixels * 0.4 })
    fireEvent.mouseUp(testPanelAMask)
    // then inspect panel for expected position change
    expect(testPanelAContainer.style.height).toEqual('14.942%')
  })
  it('changes PanelA\'s width from mousedown on panel edge and mousemove on panel mask', () => {
    const testPanelData = [{
      data: {
        A: { x: 0, y: 0, w: 0.5, h: 1 },
        B: { x: 0.5, y: 0, w: 0.5, h: 1 }
      },
      adjList: [{
        A: { re: ['B'], le: [], tv: [], bv: [] },
        B: { re: [], le: ['A'], tv: [], bv: [] }
      }]
    }]
    const PanelA = () => (<div style={{background: '#C23B23', display: 'flex', flexGrow: 1}}>Panel A</div>)
    const PanelB = () => (<div style={{background: '#03C03C', display: 'flex', flexGrow: 1}}>Panel B</div>)
    const TestApp = () => {
      const [panelData, setPanelData] = useState(testPanelData)
    
      return (
        <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          height: '90vh',
          padding: '1em'
        }}
      > 
        <PanelManager
          // @ts-expect-error
          onPanelDataChange={ nextPanelData => setPanelData(nextPanelData)}
          panelData={panelData}
        >
          {/** @ts-expect-error */} 
          <Panel panelId='A'>
            <PanelA/>
          </Panel>
          {/** @ts-expect-error */} 
          <Panel panelId='B'>
            <PanelB/>
          </Panel>
        </PanelManager>
      </div>
      )
    }
    const { getByTestId } = render(<TestApp/>)
    const testPanelAContainer = getByTestId('panel__A')
    // default JSDOM window width is 1024, and height is 768
    const startWidthInPixels = parseFloat(testPanelAContainer.style.width.replace('%','')) / 100 * 1024
    const testPanelAHorizontalRightEdge = getByTestId('panel__A__re')
    const testPanelAMask = getByTestId('panel__A__mask')
    // mouse down
    fireEvent.mouseDown(testPanelAHorizontalRightEdge)
    // then mouse move
    fireEvent.mouseMove(testPanelAMask, { clientX: startWidthInPixels * 0.8, clientY: 768 / 2 })
    fireEvent.mouseUp(testPanelAMask)
    // then inspect panel for expected position change
    expect(testPanelAContainer.style.width).toEqual('39.943%')
  })
})