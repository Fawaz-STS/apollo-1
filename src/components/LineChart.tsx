"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const chartConfig = {
  "Conserv.": { label: "Conserv.", color: "var(--conservative-color)" },
  Liberal: { label: "Liberal", color: "var(--liberal-color)" },
  NDP: { label: "NDP", color: "var(--ndp-color)" },
  Bloc: { label: "Bloc", color: "var(--bloc-color)" },
  Green: { label: "Green", color: "var(--green-color)" },
};

const lineData = [
  {
    year: 2015,
    "Conserv.": 8000000,
    Liberal: 9000000,
    NDP: 2000000,
    Bloc: 1000000,
    Green: 500000,
  },
  {
    year: 2019,
    "Conserv.": 8500000,
    Liberal: 9500000,
    NDP: 2500000,
    Bloc: 1200000,
    Green: 600000,
  },
  {
    year: 2021,
    "Conserv.": 9000000,
    Liberal: 10000000,
    NDP: 3000000,
    Bloc: 1300000,
    Green: 700000,
  },
  {
    year: 2025,
    "Conserv.": 8113484,
    Liberal: 8595488,
    NDP: 1234673,
    Bloc: 1236349,
    Green: 238892,
  },
];

export function LineChartComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Votes by Party Over Years</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                return (
                  <div className="bg-white/95 text-black rounded shadow-lg px-4 py-2 text-sm">
                    {payload.map((p) => {
                      const party = p.dataKey as keyof typeof chartConfig;
                      const value = p.value as number | undefined;
                      if (
                        !party ||
                        !(party in chartConfig) ||
                        value === undefined
                      )
                        return null;
                      return (
                        <div
                          key={party}
                          style={{ color: chartConfig[party].color }}
                        >
                          {chartConfig[party].label}: {value.toLocaleString()}
                        </div>
                      );
                    })}
                  </div>
                );
              }}
            />
            <Legend />
            {Object.keys(chartConfig).map((party) => (
              <Line
                key={party}
                type="monotone"
                dataKey={party}
                stroke={chartConfig[party as keyof typeof chartConfig].color}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
