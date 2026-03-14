"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"

export function UserGrowthChart() {
  const data = [
    { month: "Jan", users: 1200 },
    { month: "Feb", users: 1900 },
    { month: "Mar", users: 2100 },
    { month: "Apr", users: 2400 },
    { month: "May", users: 2800 },
    { month: "Jun", users: 3200 },
    { month: "Jul", users: 3800 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Growth</CardTitle>
        <CardDescription>Monthly user growth over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="users"
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
                stroke="hsl(var(--primary))"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

