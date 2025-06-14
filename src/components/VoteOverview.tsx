"use client";
import React, { useState, useEffect } from "react";
import { Checkbox } from "./ui/checkbox";
import Papa from "papaparse";

interface PartyData {
  party: string;
  color: string;
  votes: string;
  votePcnt: string;
  seats: string;
  seatPcnt: string;
}

export const VoteOverview = () => {
  const [view, setView] = useState<"votes" | "seats">("votes");
  const [partyData, setPartyData] = useState<PartyData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/Info For Drawer(Sheet1).csv");
        const csvText = await response.text();

        Papa.parse(csvText, {
          complete: (results) => {
            const data = results.data as string[][];
            if (data.length > 0) {
              // Skip header row and process each row
              const newData = data.slice(1, 7).map((row) => ({
                party: row[0],
                color: getPartyColor(row[0]),
                votes: row[1],
                votePcnt: row[2],
                seats: row[3],
                seatPcnt: row[4],
              }));
              setPartyData(newData);
            }
          },
          header: false,
        });
      } catch (error) {
        console.error("Error loading CSV file:", error);
      }
    };

    fetchData();
  }, []);

  const getPartyColor = (party: string): string => {
    switch (party) {
      case "Conservative":
        return "var(--conservative-color)";
      case "Liberal":
        return "var(--liberal-color)";
      case "NDP":
        return "var(--ndp-color)";
      case "Bloc":
        return "var(--bloc-color)";
      case "Green":
        return "var(--green-color)";
      default:
        return "#808080";
    }
  };

  return (
    <div className="flex flex-col px-2">
      <div className="flex flex-row pb-2 justify-between items-end">
        <h1 className="text-xl text-left">
          Totals - {view === "votes" ? "Vote Count" : "Seats"}
        </h1>
        <div className="flex flex-row space-x-2 text-sm font-medium">
          <button
            onClick={() => setView("votes")}
            className={`px-3 py-1 rounded ${
              view === "votes"
                ? "bg-[#808080] text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Votes
          </button>
          <button
            onClick={() => setView("seats")}
            className={`px-3 py-1 rounded ${
              view === "seats"
                ? "bg-[#808080] text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Seats
          </button>
        </div>
      </div>

      <div className="w-full max-w-4xl">
        {partyData.map((data, index) => (
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
            <div className="text-left">–</div>
          </div>
        ))}
      </div>
    </div>
  );
};
