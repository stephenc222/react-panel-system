/**
 * @jest-environment jsdom
 */
import React from 'react'
import sinon from 'sinon'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Panel from '../../src/Panel'

describe('Panel', () => {
  it('renders', () => {
    render(
      <Panel
        draggingNode={null}
        panelId={'A'}
        w={ 1}
        h={ 1}
        x={ 0}
        y={ 0}
        onMouseMove={ (event: React.MouseEvent<HTMLDivElement,MouseEvent>) => {}}
        onMouseUp={ (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {}}
        onMouseDown={ (event: React.MouseEvent<HTMLDivElement, MouseEvent>, panelId: string, edge: string) => {}}
      />
    )
  })
  it('calls the onMouseDown prop on mouse down event on Panel "left edge"', () => {
    const mouseDownFake = sinon.fake()
    const { getByTestId } = render(
      <Panel
        draggingNode={null}
        panelId={'A'}
        w={ 0.5}
        h={ 1}
        x={ 0.5}
        y={ 0}
        onMouseMove={ (event: React.MouseEvent<HTMLDivElement,MouseEvent>) => {}}
        onMouseUp={ (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {}}
        onMouseDown={mouseDownFake}
      />
    )
    const testPanelALeftEdge = getByTestId('panel__A__le')
    fireEvent.mouseDown(testPanelALeftEdge)
    expect(mouseDownFake.callCount).toEqual(1)
  })
  it('calls the onMouseDown prop on mouse down event on Panel "top edge"', () => {
    const mouseDownFake = sinon.fake()
    const { getByTestId } = render(
      <Panel
        draggingNode={null}
        panelId={'A'}
        w={1}
        h={0.5}
        x={0}
        y={0.5}
        onMouseMove={ (event: React.MouseEvent<HTMLDivElement,MouseEvent>) => {}}
        onMouseUp={ (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {}}
        onMouseDown={mouseDownFake}
      />
    )
    const testPanelATopEdge = getByTestId('panel__A__tv')
    fireEvent.mouseDown(testPanelATopEdge)
    expect(mouseDownFake.callCount).toEqual(1)
  })
  it('calls the onMouseDown prop on mouse down event on Panel "bottom edge"', () => {
    const mouseDownFake = sinon.fake()
    const { getByTestId } = render(
      <Panel
        draggingNode={null}
        panelId={'A'}
        w={1}
        h={0.5}
        x={0}
        y={0}
        onMouseMove={ (event: React.MouseEvent<HTMLDivElement,MouseEvent>) => {}}
        onMouseUp={ (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {}}
        onMouseDown={mouseDownFake}
      />
    )
    const testPanelABottomEdge = getByTestId('panel__A__bv')
    fireEvent.mouseDown(testPanelABottomEdge)
    expect(mouseDownFake.callCount).toEqual(1)
  })
})