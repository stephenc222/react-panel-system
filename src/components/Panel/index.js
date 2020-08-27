import React from 'react'

// https://stackoverflow.com/questions/30725607/is-there-any-way-to-bind-a-click-event-to-a-divs-left-border-in-jquery
const Panel = ({ managerX, managerY, w, h, xOffset, yOffset, children}) => {
  return (
    <div
      style={{
        position: 'absolute',
        width: w,
        height: h,
        top: yOffset,
        left: xOffset
      }}>
      {children}
    </div>
  )
}

export default Panel
