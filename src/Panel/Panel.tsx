import React from "react"
import { PanelDraggingNode } from "../types"
import "./Panel.css"

const showEdge = (isTrue: boolean, classname: string) =>
  isTrue ? classname : ""

// slight adjustment to clamp down on potential for an unsafe floating point number
const adjPercent = (num: number) =>
  Math.trunc(num * 10 ** 5) / 10 ** 5 + 2 / 10 ** 5

interface PanelProps {
  panelId: string
  w: number
  h: number
  x: number
  y: number
  leftEdgeClassName?: string
  rightEdgeClassName?: string
  topEdgeClassName?: string
  bottomEdgeClassName?: string
  onMouseMove: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onMouseDown: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    panelId: string,
    edge: string
  ) => void
  onMouseUp: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  draggingNode?: PanelDraggingNode
  children?: React.ReactNode
}

// NOTE: the Drag API cannot be used if I want to set a cursor while "dragging"
// must use mouse move, down and up to simulate drag
const Panel: React.FunctionComponent<PanelProps> = (props) => {
  const {
    w,
    h,
    x,
    y,
    children,
    leftEdgeClassName,
    rightEdgeClassName,
    topEdgeClassName,
    bottomEdgeClassName,
    onMouseMove,
    onMouseDown,
    onMouseUp,
    panelId,
    draggingNode,
  } = props

  return (
    <div
      data-testid={`panel__${panelId}`}
      style={{
        display: "flex",
        position: "absolute",
        width: `${adjPercent(w) * 100}%`,
        height: `${adjPercent(h) * 100}%`,
        top: `${adjPercent(y) * 100}%`,
        left: `${adjPercent(x) * 100}%`,
      }}
    >
      <div
        data-testid={`panel__${panelId}__le`}
        onMouseDown={(event) => onMouseDown(event, panelId, "LE")}
        className={`${showEdge(
          x > 0.01,
          leftEdgeClassName
        )} panel-horizontal-edge`}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        {/*
            "mask" used to prevent mouse events from being blocked by drag events from children,
            while allowing those same mouse events to be utilized in "onMouseMove" and "onMouseUp"
          */}
        <div
          data-testid={`panel__${panelId}__mask`}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          style={{
            position: "fixed",
            display:
              draggingNode && draggingNode.nodeId === panelId ? "" : "none",
            zIndex: 9999,
            opacity: 0,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
        <div
          data-testid={`panel__${panelId}__tv`}
          onMouseDown={(event) => onMouseDown(event, panelId, "TV")}
          className={`${showEdge(
            y > 0.01,
            topEdgeClassName
          )} panel-vertical-edge`}
        />
        {children}
        <div
          data-testid={`panel__${panelId}__bv`}
          onMouseDown={(event) => onMouseDown(event, panelId, "BV")}
          className={`${showEdge(
            y + h <= 0.99,
            bottomEdgeClassName
          )} panel-vertical-edge`}
        />
      </div>
      <div
        data-testid={`panel__${panelId}__re`}
        onMouseDown={(event) => onMouseDown(event, panelId, "RE")}
        className={`${showEdge(
          x + w <= 0.99,
          rightEdgeClassName
        )} panel-horizontal-edge`}
      />
    </div>
  )
}

export default Panel
