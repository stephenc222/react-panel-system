import { PanelGraph } from "../../types"

export const maximizePanel = (panelNodeId: string): PanelGraph[] => {
  // assumes that only one panel could be "maximized", and that "maximized" means bring to the
  // forefront of a user's attention, with full width and height
  if (!panelNodeId) {
    throw new Error("panelNodeId is required")
  }
  const newGraphArr: PanelGraph[] = [
    {
      adjList: [
        {
          [panelNodeId]: { re: [], le: [], tv: [], bv: [] },
        },
      ],
      data: {
        [panelNodeId]: {
          x: 0,
          y: 0,
          w: 1,
          h: 1,
        },
      },
    },
  ]
  // remove all edge relationships
  // set x and y to (0,0) w and h to 1 each
  return newGraphArr
}
