import React from 'react'

// https://stackoverflow.com/questions/30725607/is-there-any-way-to-bind-a-click-event-to-a-divs-left-border-in-jquery
const Panel = ({ managerX, managerY, w, h, xOffset, yOffset, children}) => {
  console.log({w, h})
  return (
    <div
      style={{
        border: '1px solid red',
        minWidth: `${w * 100}%`,
        maxWidth: `${w * 100}%`,
        minHeight: `${h * 100}%`,
        maxHeight: `${h * 100}%`,
        margin: -1
        // top: yOffset,
        // left: xOffset
      }}>
      {children}
    </div>
  )
}

export default Panel
