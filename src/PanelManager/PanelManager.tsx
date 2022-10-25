import React, { createRef } from "react"
import { updateGraph } from "./PanelGraph/index"
import { PanelGraph, PanelChangeEvent, PanelDraggingNode } from "../types"

const getPercentChange = (previous: number, current: number) =>
  (((current - previous) / previous) * 100) / 100

export interface PanelManagerProps {
  onPanelDataChange: (panelDataContext: PanelGraph[]) => void
  children: React.ReactNode
  panelData: PanelGraph[]
  leftEdgeClassName?: string
  rightEdgeClassName?: string
  topEdgeClassName?: string
  bottomEdgeClassName?: string
}

interface PanelManagerState {
  startPos: { startX: number; startY: number }
  draggingNode: PanelDraggingNode
}

class PanelManager extends React.Component<
  PanelManagerProps,
  PanelManagerState
> {
  constructor(props: PanelManagerProps) {
    super(props)
    this.updatePanelData = this.updatePanelData.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.state = {
      startPos: { startX: null, startY: null },
      draggingNode: null,
    }
  }
  private panelManagerRef = createRef<HTMLDivElement>()

  onMouseDown(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    panelId: string,
    edge: string
  ) {
    const { pageX = event.clientX, pageY = event.clientY } = event
    this.setState({
      startPos: { startX: pageX, startY: pageY },
      draggingNode: { nodeId: panelId, edge },
    })
  }
  updatePanelData(changeEvent: PanelChangeEvent) {
    const nextPanelData = this.props.panelData.map((panelDataItem) =>
      updateGraph(panelDataItem, changeEvent)
    )
    this.props.onPanelDataChange && this.props.onPanelDataChange(nextPanelData)
  }
  onMouseUp(event: MouseEvent) {
    event.stopPropagation()
    this.setState({
      startPos: { startX: null, startY: null },
      draggingNode: null,
    })
  }

  onMouseMove(event: MouseEvent) {
    // NOTE: prefer pageX and pageY values, will "work fine" if panel layout
    // is just full screen if need to fallback to clientX and clientY
    const { pageX = event.clientX, pageY = event.clientY } = event
    event.preventDefault()
    event.stopPropagation()
    if (!this.state.draggingNode) {
      return
    }
    const { panelData } = this.props
    const { nodeId, edge: edgeType } = this.state.draggingNode
    const panelDataLayer = panelData.find((panelDataItem) =>
      Object.keys(panelDataItem.data).includes(nodeId)
    )
    const currentWidthPercent = panelDataLayer.data[nodeId].w
    const currentXPercent = panelDataLayer.data[nodeId].x
    // if these are not found on the panel manager ref, assume non-user environment,
    // like JSDOM, and assume PanelManager will take the full screen
    const rect = this.panelManagerRef.current.getBoundingClientRect()
    // a non-mounted ref has defaults of "0" which prevents destructuring with defaults
    // in a test environment like JSDOM, default to the window dimensions
    const width = rect.width || window.innerWidth
    const height = rect.height || window.innerWidth
    const x = rect.x || 0
    const y = rect.y || 0
    const nextPanelWidthPercent =
      Math.trunc(((pageX - x) / width) * 10 ** 5) / 10 ** 5
    const nextPanelHeightPercent =
      Math.trunc(((pageY - y) / height) * 10 ** 5) / 10 ** 5
    const { startX, startY } = this.state.startPos
    if (edgeType === "LE" || edgeType === "RE") {
      const changeX =
        edgeType === "RE"
          ? getPercentChange(startX, pageX)
          : getPercentChange(pageX, startX)
      if (isNaN(changeX) || changeX === 0) {
        return
      }
      if (nextPanelWidthPercent === 0 || isNaN(nextPanelWidthPercent)) {
        return
      }
      const xDiff =
        edgeType === "RE"
          ? nextPanelWidthPercent - currentWidthPercent - currentXPercent
          : currentXPercent - nextPanelWidthPercent
      const changeEvent: PanelChangeEvent = {
        nodeId,
        edgeType,
        data: {
          w: xDiff,
          h: 0,
        },
      }
      this.updatePanelData(changeEvent)
      this.setState({ startPos: { startX: pageX, startY: pageY } })
      return
    }
    if (edgeType === "TV" || edgeType === "BV") {
      const changeY =
        edgeType === "BV"
          ? getPercentChange(startY, pageY)
          : getPercentChange(pageY, startY)
      if (isNaN(changeY) || changeY === 0) {
        return
      }
      if (nextPanelHeightPercent === 0 || isNaN(nextPanelHeightPercent)) {
        return
      }
      const yDiff = nextPanelHeightPercent
      const changeEvent: PanelChangeEvent = {
        nodeId,
        edgeType,
        data: {
          w: 0,
          h: yDiff,
        },
      }
      this.updatePanelData(changeEvent)
      this.setState({ startPos: { startX: pageX, startY: pageY } })
      return
    }
  }

  render() {
    const {
      children,
      panelData = [],
      leftEdgeClassName = "panel-horizontal-edge--left",
      rightEdgeClassName = "panel-horizontal-edge--right",
      topEdgeClassName = "panel-vertical-edge--top",
      bottomEdgeClassName = "panel-vertical-edge--bottom",
    } = this.props
    const { draggingNode } = this.state
    return (
      <div
        ref={this.panelManagerRef}
        style={{
          display: "flex",
          position: "relative",
          height: "100%",
          width: "100%",
          cursor:
            draggingNode &&
            draggingNode.edge &&
            (draggingNode.edge === "LE" || draggingNode.edge === "RE")
              ? "col-resize"
              : draggingNode &&
                draggingNode.edge &&
                (draggingNode.edge === "TV" || draggingNode.edge === "BV")
              ? "row-resize"
              : "",
        }}
      >
        {panelData.map((panelDataItem) => {
          return React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              const { panelId } = child.props || {}
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
                ...panelChildData,
              })
            }
          })
        })}
      </div>
    )
  }
}

export default PanelManager
