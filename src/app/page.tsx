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

export default function Home() {
  return (
    <div className="bg-white min-h-screen mb-8 flex flex-col px-4">
      <h1 className="m-auto text-3xl w-fit text-center py-2 shadow-b-lg">
        Canada Election Map - Prediction 2025
      </h1>
      <div className="h-fit flex flex-row justify-center mb-4">
        <div className="h-full w-3/11 text-black">
          <VoteOverview />
          <SeatsTotals />
          <ImportantInfoSection />
        </div>
        <div className="flex justify-center h-[1] w-8/11">
          <p className=""> Map </p>
        </div>
        {/* <div className="grow w-2/11">
            <ApolloInsightsSection />
          </div> */}
      </div>
      <div>
        <div className="grid grid-cols-2 gap-4">
          <LineChartComponent />
          <BarChartComponent />
        </div>
      </div>
      <div className="my-2">
        <RidingsSection />
      </div>
      <div className="flex justify-center">
        <p>Footer</p>
      </div>
    </div>
  );
}
