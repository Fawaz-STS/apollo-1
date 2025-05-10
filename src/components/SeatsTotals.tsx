"use client";
import React, { useState } from "react";
import { Checkbox } from "./ui/checkbox";

export const SeatsTotals = () => {
  const VoteCountData = [
    {
      party: "Conserv.",
      color: "blue",
      seats: "160",
      votePcnt: "47.34%",
      change: "7.9",
    },
    {
      party: "Liberal",
      color: "#d41f27",
      seats: "119",
      votePcnt: "35.21%",
      change: "6.3",
    },
    {
      party: "NDP",
      color: "#f58220",
      seats: "25",
      votePcnt: "7.40%",
      change: "2.1",
    },
    {
      party: "Bloc",
      color: "#51a5e1",
      seats: "32",
      votePcnt: "9.47%",
      change: "1.8",
    },
    {
      party: "Green",
      color: "#20a242",
      seats: "2",
      votePcnt: "0.59%",
      change: "0.0",
    },
    { party: "Other", votes: "100,000", color: "#808080" },
  ];
  const TotalSeatsData = [{ party: "Conservative", seats: 121 }];
  const [view, setView] = useState<"current" | "history">("current");

  return (
    <div className="flex flex-col px-2">
      <div className="flex flex-row pb-2 justify-between items-end">
        <h1 className="text-xl text-left ">Totals - Vote Count</h1>
        <div className="flex flex-row space-x-2 text-sm font-medium ">
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
        {VoteCountData.map((data, index) => (
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
            <div className="text-left pl-4">{data.seats}</div>
            <div className="text-left pl-2">{data.votePcnt || "–"}</div>
            <div className="text-left">{data.change || "–"}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
