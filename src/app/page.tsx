"use client";
import Image from "next/image";
import Header from "@/components/Header";
import { VoteOverview } from "@/components/VoteOverview";
import { SeatsTotals } from "@/components/SeatsTotals";
import { ApolloInsightsSection } from "@/components/ApolloInsightsSection";
import { RidingsSection } from "@/components/RidingsSection";
import ImportantInfoSection from "@/components/ImportantInfoSection";
import { LineChartComponent } from "@/components/LineChart";
import { Bar } from "recharts";
import { BarChartComponent } from "@/components/BarChart";
import InteractiveMap from "@/components/InteractiveMap";

export default function Home() {
  return (
    <div>
      <p>Home</p>
    </div>
  );
}
