import React, { createRef } from 'react'
import { updateGraph } from './PanelGraph/index'
import { PanelSystemContext } from '../context'
import { PanelGraph, PanelChangeEvent } from '../types'

const getPercentChange = (previous: number, current: number) => ((current - previous) / previous * 100) / 100


export interface PanelManagerProps {
  onPanelDataChange: (panelDataContext: PanelGraph[]) => void
  panelData: PanelGraph[]
  leftEdgeClassName?: string
  rightEdgeClassName?: string
  topEdgeClassName?: string
  bottomEdgeClassName?: string
}

interface PanelManagerState {
  startPos: { startX: number, startY: number }
  draggingNode: { edge: string, nodeId: string } | null
}

class PanelManager extends React.Component<PanelManagerProps, PanelManagerState> {
  constructor(props: PanelManagerProps) {
    super(props)
    this.updatePanelDataContext = this.updatePanelDataContext.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.setDraggingNode = this.setDraggingNode.bind(this)
    this.setStartPos= this.setStartPos.bind(this)
    this.state = {
      startPos: { startX: null, startY: null },
      draggingNode: null
    }
  }
  private panelManagerRef = createRef<HTMLDivElement>()

  updatePanelDataContext (changeEvent: PanelChangeEvent) {
    const nextPanelDataContext = this.props.panelData.map( panelDataItem => updateGraph(panelDataItem, changeEvent))
    this.props.onPanelDataChange && this.props.onPanelDataChange(nextPanelDataContext)
  }
  setDraggingNode(draggingNode: PanelManagerState['draggingNode']) {
    this.setState({ draggingNode })
  }
  setStartPos(startPos: PanelManagerState['startPos']) {
    this.setState({ startPos })
  }
  onMouseUp(event: MouseEvent)  {
    event.stopPropagation()
    this.setDraggingNode(null)
    this.setStartPos({ startX: null, startY: null })
  }

  onMouseMove (event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    if (!this.state.draggingNode) {
      return
    }
    const { panelData } = this.props
    const { nodeId, edge: edgeType } = this.state.draggingNode
    const panelDataLayer = panelData.find( panelDataItem => Object.keys(panelDataItem.data).includes(nodeId))
    const currentWidthPercent = panelDataLayer.data[nodeId].w 
    const currentXPercent = panelDataLayer.data[nodeId].x
    const currentHeightPercent = panelDataLayer.data[nodeId].h
    const { width, height, x, y } = this.panelManagerRef.current.getBoundingClientRect()
    const nextPanelWidthPercent = Math.trunc(((event.pageX - x) / width) * 10**5) / 10**5
    const nextPanelHeightPercent = Math.trunc(((event.pageY - y) / height) * 10**5) / 10**5
    if (nodeId === undefined) {
      return
    }
    const { startX, startY } = this.state.startPos
    if (edgeType === 'LE' || edgeType === 'RE') {
      const changeX = edgeType === 'RE' ? getPercentChange(startX, event.pageX) : getPercentChange(event.pageX, startX)
      if (isNaN(changeX) || changeX === 0) {
        return
      }
      if (nextPanelWidthPercent === 0 || isNaN(nextPanelWidthPercent)) {
        return
      }
      const xDiff = edgeType === 'RE'
        ? nextPanelWidthPercent - currentWidthPercent - currentXPercent
        : currentXPercent - nextPanelWidthPercent
      const changeEvent: PanelChangeEvent = {
        nodeId,
        edgeType,
        data: {
          w: xDiff,
          h: 0
        }
      }
      this.updatePanelDataContext(changeEvent)
      this.setStartPos({ startX: event.pageX, startY: event.pageY})
      return
    }
    if (edgeType === 'TV' || edgeType === 'BV') {
      const changeY = edgeType === 'BV' ? getPercentChange(startY, event.pageY) : getPercentChange(event.pageY, startY)  
      if (isNaN(changeY) || changeY === 0) {
        return
      }
      if (nextPanelHeightPercent === 0 || isNaN(nextPanelHeightPercent)) {
        return
      }
      const diffChange = nextPanelHeightPercent - currentHeightPercent
      const yDiff = edgeType === 'BV'
        ? diffChange
        : nextPanelHeightPercent
      const changeEvent: PanelChangeEvent = {
        nodeId,
        edgeType,
        data: {
          w: 0,
          h: edgeType === 'BV' ? yDiff : yDiff,
        }
      }
      this.updatePanelDataContext(changeEvent)
      this.setStartPos({ startX: event.pageX, startY: event.pageY})
      return
    }
  }

  render() {
    const {
      children,
      panelData = [],
      leftEdgeClassName = 'panel-horizontal-edge--left',
      rightEdgeClassName = 'panel-horizontal-edge--right',
      topEdgeClassName = 'panel-vertical-edge--top',
      bottomEdgeClassName  = 'panel-vertical-edge--bottom'
    } = this.props
    const {
      draggingNode
    } = this.state

    const panelManagerContext = [{panelDataContext: panelData, draggingNode}, { updatePanelDataContext: this.updatePanelDataContext, setDraggingNode: this.setDraggingNode, setStartPos: this.setStartPos }]
    return (
      <PanelSystemContext.Provider value={panelManagerContext}>
        <div
          ref={this.panelManagerRef}
          style={{
            display: 'flex',
            position: 'relative',
            height: '100%',
            width: '100%',
            cursor: draggingNode
              && draggingNode.edge 
              && (draggingNode.edge === 'LE' || draggingNode.edge === 'RE')
                ? 'col-resize' 
                : draggingNode
                  && draggingNode.edge
                  && (draggingNode.edge === 'TV' || draggingNode.edge === 'BV')
                    ? 'row-resize'
                    : ''
          }}
        >
          {
            panelData.map( panelDataItem => {
              return React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                  const { panelId } = (child.props || {})
                  const panelChildData = panelDataItem.data[panelId]
                  // panel either doesn't exist or has been "minimized"
                  if (!panelChildData) {
                    return null
                  }
                  return React.cloneElement(child, {
                    bottomEdgeClassName,
                    topEdgeClassName,
                    leftEdgeClassName,
                    rightEdgeClassName,
                    nodeId: panelId,
                    onMouseMove: this.onMouseMove,
                    onMouseUp: this.onMouseUp,
                    ...child.props,
                    ...panelChildData
                  })
                }
              })
            })
          }
        </div>
      </PanelSystemContext.Provider>
    ) 
  }
}

PanelManager.contextType = PanelSystemContext

export default PanelManager