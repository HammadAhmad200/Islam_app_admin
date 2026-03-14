"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "@/components/ui/chart";
import DonationTrendChart from "./donation-trend-chart";

interface DonationData {}
export function DonationTrends({ data }: any) {
  // const data = [
  //   { name: "Jan", donations: 4000, emergency: 2400 },
  //   { name: "Feb", donations: 3000, emergency: 1398 },
  //   { name: "Mar", donations: 2000, emergency: 9800 },
  //   { name: "Apr", donations: 2780, emergency: 3908 },
  //   { name: "May", donations: 1890, emergency: 4800 },
  //   { name: "Jun", donations: 2390, emergency: 3800 },
  //   { name: "Jul", donations: 3490, emergency: 4300 },
  // ];

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Donation Trends</CardTitle>
        <CardDescription>
          Monthly donation trends including regular and emergency donations
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="donations" fill="hsl(var(--primary))" name="Regular Donations" />
              <Line type="monotone" dataKey="emergency" stroke="hsl(var(--destructive))" name="Emergency Donations" />
            </ComposedChart>
          </ResponsiveContainer>
        </div> */}
        <DonationTrendChart data={data} />
      </CardContent>
    </Card>
  );
}
