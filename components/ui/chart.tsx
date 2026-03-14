import type React from "react"

export const Area = () => <div role="Area">Area Chart</div>
export const Bar = () => <div role="Bar">Bar Chart</div>
export const CartesianGrid = () => <div role="CartesianGrid">Cartesian Grid</div>
export const ComposedChart = () => <div role="ComposedChart">Composed Chart</div>
export const Legend = () => <div role="Legend">Legend</div>
export const Line = () => <div role="Line">Line Chart</div>
export const ResponsiveContainer = ({ children }: { children: React.ReactNode }) => (
  <div role="ResponsiveContainer">{children}</div>
)
export const Tooltip = () => <div role="Tooltip">Tooltip</div>
export const XAxis = () => <div role="XAxis">X Axis</div>
export const YAxis = () => <div role="YAxis">Y Axis</div>
export const Cell = () => <div role="Cell">Cell</div>
export const Pie = () => <div role="Pie">Pie</div>
export const PieChart = () => <div role="PieChart">Pie Chart</div>
export const AreaChart = () => <div role="AreaChart">Area Chart</div>

