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
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import InteractiveMap from "@/components/InteractiveMap";

export default function Home() {
  const handleRegionClick = (region: string) => {
    console.log("Selected region:", region);
  };

  return (
    <div className="bg-white min-h-screen mb-8 flex flex-col px-4">
      <h1 className="m-auto text-3xl w-fit text-center py-2 shadow-b-lg">
        Canada Election Map - Prediction 2025
      </h1>
      <div className="h-[70vh] flex flex-row justify-center mb-4 relative">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <SidebarTrigger className="absolute top-4 left-4 z-50" />
            <div className="flex justify-center min-h-0 flex-col pl-4 relative h-[70vh]">
              <InteractiveMap onRegionClick={handleRegionClick} />
            </div>
            {/* <div className="grow w-2/11">
              <ApolloInsightsSection />
            </div> */}
          </SidebarInset>
        </SidebarProvider>
      </div>
      <div className="my-2">
        <RidingsSection />
      </div>
      <div>
        <div className="grid grid-cols-2 gap-4">
          <LineChartComponent />
          <BarChartComponent />
        </div>
      </div>
      <div className="flex justify-center">
        <p>Footer</p>
      </div>
    </div>
  );
}
