"use client";
import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const chartConfig = {
  "Conserv.": { label: "Conserv.", color: "var(--conservative-color)" },
  Liberal: { label: "Liberal", color: "var(--liberal-color)" },
  NDP: { label: "NDP", color: "var(--ndp-color)" },
  Bloc: { label: "Bloc", color: "var(--bloc-color)" },
  Green: { label: "Green", color: "var(--green-color)" },
};

export function BarChartComponent() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/data/Info For Drawer(Sheet1).csv");
      const csvText = await response.text();
      Papa.parse(csvText, {
        complete: (results) => {
          const rows = results.data as string[][];
          const formattedData = rows.slice(1, 7).map((row) => ({
            party: row[0],
            seats: Number(row[3]),
            label:
              chartConfig[row[0] as keyof typeof chartConfig]?.label || row[0],
            color:
              chartConfig[row[0] as keyof typeof chartConfig]?.color ||
              "#8884d8",
          }));
          setData(formattedData);
        },
        header: false,
      });
    };
    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seats by Party</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <YAxis
              dataKey="party"
              type="category"
              tickLine={false}
              axisLine={false}
              width={100}
            />
            <XAxis dataKey="seats" type="number" hide />
            <Tooltip
              cursor={false}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const p = payload[0];
                const party = p.payload.party as keyof typeof chartConfig;
                const value = p.value as number | undefined;
                if (!party || !(party in chartConfig) || value === undefined)
                  return null;
                return (
                  <div className="bg-white/95 text-black rounded shadow-lg px-4 py-2 text-sm">
                    <div style={{ color: chartConfig[party].color }}>
                      {chartConfig[party].label}: {value.toLocaleString()} seats
                    </div>
                  </div>
                );
              }}
            />
            <Bar dataKey="seats" radius={5} fill="#8884d8">
              {data.map((entry, idx) => (
                <Cell key={entry.party} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
