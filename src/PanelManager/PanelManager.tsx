import React, { createRef } from 'react'
import { updateGraph } from './PanelGraph/index'
import { PanelGraph, PanelChangeEvent, PanelDraggingNode } from '../types'

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
  draggingNode: PanelDraggingNode
}

class PanelManager extends React.Component<PanelManagerProps, PanelManagerState> {
  constructor(props: PanelManagerProps) {
    super(props)
    this.updatePanelData = this.updatePanelData.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.setDraggingNode = this.setDraggingNode.bind(this)
    this.setStartPos= this.setStartPos.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.state = {
      startPos: { startX: null, startY: null },
      draggingNode: null
    }
  }
  private panelManagerRef = createRef<HTMLDivElement>()

  onMouseDown (event: React.MouseEvent<HTMLDivElement, MouseEvent>, panelId: string, edge: string) {
    this.setDraggingNode({ nodeId: panelId, edge })
    this.setStartPos({ startX: event.pageX, startY: event.pageY })
  }
  updatePanelData (changeEvent: PanelChangeEvent) {
    const nextPanelData = this.props.panelData.map( panelDataItem => updateGraph(panelDataItem, changeEvent))
    this.props.onPanelDataChange && this.props.onPanelDataChange(nextPanelData)
  }
  setDraggingNode(draggingNode: PanelDraggingNode) {
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
      this.updatePanelData(changeEvent)
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
          h: yDiff,
        }
      }
      this.updatePanelData(changeEvent)
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
    return (
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
                  onMouseMove: this.onMouseMove,
                  onMouseUp: this.onMouseUp,
                  onMouseDown: this.onMouseDown,
                  draggingNode,
                  ...child.props,
                  ...panelChildData
                })
              }
            })
          })
        }
      </div>
    ) 
  }
}

export default PanelManager