"use client";
import React, { useState } from "react";
import { Checkbox } from "./ui/checkbox";
import * as Constants from "@/constants";

export const VoteOverview = () => {
  const [view, setView] = useState<"current" | "history">("current");

  const currentVoteData = [
    {
      party: "Conserv.",
      color: "#142f52",
      votes: "5,556,835",
      votePcnt: "32.6%",
      change: "5.3",
    },
    {
      party: "Liberal",
      color: "#d41f27",
      votes: "5,742,635",
      votePcnt: "33.7%",
      change: "4.2",
    },
    {
      party: "NDP",
      color: "#f58220",
      votes: "3,035,715",
      votePcnt: "17.8%",
      change: "1.6",
    },
    {
      party: "Bloc",
      color: "#51a5e1",
      votes: "1,301,496",
      votePcnt: "7.6%",
      change: "0.3",
    },
    {
      party: "Green",
      color: "#20a242",
      votes: "398,746",
      votePcnt: "2.3%",
      change: "0.1",
    },
    { party: "Other", votes: "100,000", color: "#808080" },
  ];

  const historicalVoteData = [
    {
      party: "Conservative",
      color: "blue",
      votes: "6,100,000",
      votePcnt: "34.0%",
      change: "-1.2",
    },
    {
      party: "Liberal",
      color: "green",
      votes: "6,000,000",
      votePcnt: "33.4%",
      change: "-0.3",
    },
    {
      party: "NDP",
      color: "yellow",
      votes: "2,900,000",
      votePcnt: "16.5%",
      change: "-1.3",
    },
    {
      party: "Bloc",
      color: "blue",
      votes: "1,350,000",
      votePcnt: "7.8%",
      change: "+0.2",
    },
    {
      party: "Green",
      color: "green",
      votes: "420,000",
      votePcnt: "2.5%",
      change: "+0.2",
    },
    { party: "Other", votes: "110,000" },
  ];

  const dataToDisplay =
    view === "current" ? currentVoteData : historicalVoteData;

  return (
    <div className="flex flex-col px-2">
      <div className="flex flex-row pb-2 justify-between items-end">
        <h1 className="text-xl text-left">Totals - Vote Count</h1>
        <div className="flex flex-row space-x-2 text-sm font-medium">
          <button
            onClick={() => setView("current")}
            className={`px-3 py-1 rounded ${
              view === "current"
                ? "bg-[#808080] text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Current
          </button>
          {/* <button
            onClick={() => setView("history")}
            className={`px-3 py-1 rounded ${
              view === "history"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            History
          </button> */}
        </div>
      </div>

      <div className="w-full max-w-4xl">
        {dataToDisplay.map((data, index) => (
          <div
            key={index}
            className="grid grid-cols-4 gap-4 py-2 border-b border-gray-100 items-center text-sm"
          >
            <div className="text-left">
              <div className="flex items-center space-x-2">
                <Checkbox color={data.color} checked={true} />
                <span className="whitespace-nowrap">{data.party}</span>
              </div>
            </div>
            <div className="text-left pl-4">{data.votes}</div>
            <div className="text-left pl-2">{data.votePcnt || "–"}</div>
            <div className="text-left">{data.change || "–"}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
