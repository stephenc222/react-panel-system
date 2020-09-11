import React from 'react'

// https://stackoverflow.com/questions/30725607/is-there-any-way-to-bind-a-click-event-to-a-divs-left-border-in-jquery
const Panel = ({ managerX, managerY, w, h, x, y, children}) => {
  console.log({w, h})
  return (
    <div
      style={{
        display: 'flex',
        position: 'absolute',
        border: '1px solid red',
        minWidth: `${w * 100}%`,
        maxWidth: `${w * 100}%`,
        minHeight: `${h * 100}%`,
        maxHeight: `${h * 100}%`,
        margin: -1,
        top: `${y * 100}%`,
        left: `${x * 100}%`,
      }}>
      {children}
    </div>
  )
}

export default Panel
