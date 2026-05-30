"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const userGrowthData = [
  { month: "Apr", users: 2100 },
  { month: "May", users: 3200 },
  { month: "Jun", users: 4500 },
  { month: "Jul", users: 5800 },
  { month: "Aug", users: 6900 },
  { month: "Sep", users: 7600 },
  { month: "Oct", users: 8400 },
  { month: "Nov", users: 9100 },
  { month: "Dec", users: 9800 },
  { month: "Jan", users: 10500 },
  { month: "Feb", users: 11600 },
  { month: "Mar", users: 12847 },
];

const postActivityData = [
  { month: "Apr", posts: 120 },
  { month: "May", posts: 185 },
  { month: "Jun", posts: 240 },
  { month: "Jul", posts: 310 },
  { month: "Aug", posts: 275 },
  { month: "Sep", posts: 350 },
  { month: "Oct", posts: 420 },
  { month: "Nov", posts: 380 },
  { month: "Dec", posts: 290 },
  { month: "Jan", posts: 445 },
  { month: "Feb", posts: 510 },
  { month: "Mar", posts: 580 },
];

interface AnalyticsChartProps {
  type?: "user_growth" | "post_activity";
}

export function AnalyticsChart({ type = "user_growth" }: AnalyticsChartProps) {
  if (type === "user_growth") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">User Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                />
                <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#1B2A4A"
                  strokeWidth={2}
                  dot={{ fill: "#1B2A4A", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Post Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={postActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#6B7280" }}
              />
              <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar
                dataKey="posts"
                fill="#E8A0BF"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
