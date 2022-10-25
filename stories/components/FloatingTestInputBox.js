import React, { useState, useRef } from "react"
import Select from "./Select"
import "./FloatingTestInputBox.css"

const FloatingTestInputBox = ({
  panelIds,
  setPanelIds,
  onMaximize,
  onMinimize,
  onRestore,
  panelIdOptions = [],
}) => {
  const [posVal, setPos] = useState({ top: 200, left: 900 })
  const [initialOffset, setInitialOffset] = useState({})
  const [isDragging, setIsDragging] = useState(false)
  const [hide, setHide] = useState(false)
  const floatingBoxRef = useRef(null)
  if (hide) {
    return null
  }
  return (
    <div
      style={{
        cursor: isDragging ? "grabbing" : "move",
        top: posVal.top,
        left: posVal.left,
      }}
      ref={floatingBoxRef}
      draggable="true"
      onDragStart={(event) => {
        const { left, top } = floatingBoxRef.current.getBoundingClientRect()
        const offset = {
          top: (event.pageY || event.screenY) - top,
          left: (event.pageX || event.screenX) - left,
        }
        setInitialOffset({ ...offset })
        setIsDragging(true)
      }}
      onDragOver={(event) => event.preventDefault()}
      onDrag={(event) => {
        setPos({
          top:
            posVal.top -
            (event.pageY || event.screenY) +
            (event.pageY || event.screenY),
          left:
            posVal.left -
            (event.pageX || event.screenX) +
            (event.pageX || event.screenX),
        })
      }}
      onDragEnd={(event) => {
        setIsDragging(false)
        setPos({
          top: (event.pageY || event.screenY) - initialOffset.top,
          left: (event.pageX || event.screenX) - initialOffset.left,
        })
      }}
      className="floating-test-input-box-container"
    >
      <div className="close-button-container">
        <div onClick={() => setHide(true)} className="close-button">
          X
        </div>
      </div>
      <Select
        label="Panel Select"
        placeholder="Pick some panels!"
        onValuesChange={(values) => setPanelIds(values)}
        options={panelIdOptions}
        multiple
      />
      <div className="action-button-container">
        <button
          disabled={panelIds.length !== 1}
          onClick={onMaximize}
          className="action-button"
        >
          Maximize
        </button>
        <button onClick={onMinimize} className="action-button">
          Minimize
        </button>
        <button onClick={onRestore} className="action-button">
          Restore
        </button>
      </div>
    </div>
  )
}

export default FloatingTestInputBox
