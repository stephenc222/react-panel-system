# React Panel System

## Overview

A system of UI Panels to enable Panels to be easily resizable, persistent and configurable.

## Architechture

Primarily consists of 2 main entities:

- Panel
- PanelManager

### Panel

Each Container of individual, variable content, to enable standard component wrapping without influence on children implementation to simplify persistence, drag and drop, and resizing, as well as configuration from JSON. Assumes children of Panel are encapsulated, so do not rely on Panel or PanelManager to handle any data fetching concerns

### PanelManager

Manages Panels. This means handling order, serialization of Panel position, and as a context base for drag and drop libraries like React-Dnd for easy user update. Assumes will expand to the entirety given to it by parent. Accepts a callback that will be called with an object of panels whose positions have changed. Id of each panel must be mapped to a corresponding child component, or the PanelManager will throw
