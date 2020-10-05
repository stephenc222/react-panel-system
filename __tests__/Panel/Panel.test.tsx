import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Panel from '../../src/Panel'

describe('Panel', () => {
  it('renders', () => {
    render(
      <Panel
        draggingNode={{}}
        panelId={ 'A'}
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
})