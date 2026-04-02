import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

const data = [
  { month: "Jan", donations: 4000, trend: 2400 },
  { month: "Feb", donations: 3000, trend: 2210 },
  { month: "Mar", donations: 5000, trend: 2900 },
  { month: "Apr", donations: 7000, trend: 3500 },
  { month: "May", donations: 6000, trend: 3100 },
  { month: "Jun", donations: 8000, trend: 4200 },
];

const DonationTrendChart = ({ data }: any) => {
  const dataWithTrend = data
    ? data?.map(
        (
          entry: { donations: number },
          index: number,
          arr: { donations: any }[]
        ) => {
          if (index === 0) return { ...entry, trend: 0 };

          const prevDonations = arr[index - 1].donations;
          const trend = entry.donations - prevDonations;

          return { ...entry, trend };
        }
      )
    : [];
  return (
    <Card className="p-4">
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">Donation Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={dataWithTrend}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="donations"
              barSize={40}
              fill="hsl(var(--primary))"
              name="Total Donations"
            />
            <Line
              type="monotone"
              dataKey="trend"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              name="Trend Line"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DonationTrendChart;
