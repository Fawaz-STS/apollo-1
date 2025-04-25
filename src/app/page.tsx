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
    <div className="bg-white min-h-screen mb-4">
      <div>
        <Header />
        <h1 className=" justify-self-center text-3xl w-fit text-center py-2 shadow-lg font-bold">
          Canada Election Map - Prediction 2025
        </h1>
        <div className="h-fit flex flex-row justify-center">
          <div className="h-full w-3/11 p-2 text-black">
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
          <div className="grid grid-cols-2 gap-4 p-8">
            <LineChartComponent />
            <BarChartComponent />
          </div>
        </div>
        <div className="p-8 h-[500px]">
          <RidingsSection />
          <div className="flex flex-col h-1/2" id="about-section">
            <h1 className="text-center"> About Section</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
              consequuntur veniam, et fugiat laboriosam molestias cupiditate
              voluptatem vero sint, totam vel. Error dignissimos, veritatis
              voluptate corrupti et laborum amet enim.
            </p>
          </div>
          <div className="flex flex-col h-1/2" id="contact-section">
            <h1 className="text-center"> Contact Section</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
              consequuntur veniam, et fugiat laboriosam molestias cupiditate
              voluptatem vero sint, totam vel. Error dignissimos, veritatis
              voluptate corrupti et laborum amet enim.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
