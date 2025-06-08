"use client";
import * as React from "react";
import { GalleryVerticalEnd } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { VoteOverview } from "./VoteOverview";
import { SeatsTotals } from "./SeatsTotals";
import ImportantInfoSection from "./ImportantInfoSection";
import Link from "next/link";
import { Button } from "./ui/button";
import { useState } from "react";
import { ApolloInsightsSection } from "./ApolloInsightsSection";
// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [showD1, setShowD1] = useState(true);
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu className="flex flex-row justify-between">
          <Button onClick={() => setShowD1(true)}>D1</Button>
          <Button onClick={() => setShowD1(false)}> D2</Button>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {showD1 && (
          <div>
            <VoteOverview />
            <SeatsTotals />
          </div>
        )}
        {!showD1 && (
          <div>
            <ApolloInsightsSection />
            <ImportantInfoSection />
          </div>
        )}
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
