"use client";
import React, { useState, useEffect, useMemo } from "react";
import Papa from "papaparse";

interface TableData {
  headers: string[];
  rows: string[][];
}

interface RidingPartyData {
  partyName: string;
  candidateName: string;
  candidateVoteNum: number;
  candidateVotePrcnt: number;
}

interface RidingInfo {
  ridingId: string;
  ridingLink: string;
  incumbent: string;
  ridingName: string;
  Conservative: RidingPartyData;
  Liberal: RidingPartyData;
  Bloc: RidingPartyData;
  NDP: RidingPartyData;
  Green: RidingPartyData;
  winningParty: string;
  winningCandidate: string;
}

type Party = "Liberal" | "Conservative" | "NDP" | "Green" | "Bloc";

const partyColors = {
  Liberal: "text-party-liberal",
  Conservative: "text-party-conservative",
  NDP: "text-party-ndp",
  Green: "text-party-green",
  Bloc: "text-party-bloc",
} as const;

const getCandidateInfo = (ridingData: RidingInfo, candidateName: string) => {
  const parties = ["Liberal", "Conservative", "NDP", "Green", "Bloc"] as const;
  for (const party of parties) {
    if (ridingData[party].candidateName === candidateName) {
      return {
        party,
        data: ridingData[party],
        isWinner: candidateName === ridingData.winningCandidate,
      };
    }
  }
  return null;
};

const formatVoteInfo = (voteNum: number, votePrcnt: number) => {
  return `${voteNum.toLocaleString()} votes (${votePrcnt.toFixed(1)}%)`;
};

const CandidateDisplay = ({
  candidateName,
  ridingData,
}: {
  candidateName: string;
  ridingData: RidingInfo;
}) => {
  const candidateInfo = getCandidateInfo(ridingData, candidateName);

  if (!candidateInfo) return <p>{candidateName}</p>;

  const { party, data, isWinner } = candidateInfo;
  const colorClass = partyColors[party];

  return (
    <div>
      <p className={isWinner ? `font-bold ${colorClass}` : ""}>
        {candidateName}
        {isWinner && <span className="ml-1">✓</span>}
      </p>
      <p className="text-sm text-gray-500">
        {formatVoteInfo(data.candidateVoteNum, data.candidateVotePrcnt)}
      </p>
    </div>
  );
};

export const RidingsSection = () => {
  const [candidateData, setCandidateData] = useState<Map<
    string,
    RidingInfo
  > | null>(null);

  useEffect(() => {
    const fetchAndParseCandidateCSV = async () => {
      try {
        const response = await fetch(
          "/CANADA_ELECTION_2025_VOTE_RESULTS_BY_CANDIDATE.csv"
        );
        const csvText = await response.text();

        Papa.parse(csvText, {
          complete: (results) => {
            const data = results.data as string[][];
            if (data.length > 0) {
              const newCandidateData = new Map<string, RidingInfo>();

              // Skip header row and process each row
              data.slice(1).forEach((row) => {
                if (row.length >= 19) {
                  const ridingId = row[0];
                  const ridingName = row[1];

                  const ridingInfo: RidingInfo = {
                    Conservative: {
                      partyName: "Conservative",
                      candidateName: row[5] || "",
                      candidateVoteNum: parseInt(row[6]) || 0,
                      candidateVotePrcnt: parseFloat(row[7]) || 0,
                    },
                    Liberal: {
                      partyName: "Liberal",
                      candidateName: row[2] || "",
                      candidateVoteNum: parseInt(row[3]) || 0,
                      candidateVotePrcnt: parseFloat(row[4]) || 0,
                    },
                    NDP: {
                      partyName: "NDP",
                      candidateName: row[8] || "",
                      candidateVoteNum: parseInt(row[9]) || 0,
                      candidateVotePrcnt: parseFloat(row[10]) || 0,
                    },
                    Green: {
                      partyName: "Green",
                      candidateName: row[11] || "",
                      candidateVoteNum: parseInt(row[12]) || 0,
                      candidateVotePrcnt: parseFloat(row[13]) || 0,
                    },
                    Bloc: {
                      partyName: "Bloc",
                      candidateName: row[14] || "",
                      candidateVoteNum: parseInt(row[15]) || 0,
                      candidateVotePrcnt: parseFloat(row[16]) || 0,
                    },
                    winningCandidate: row[17] || "",
                    winningParty: row[18] || "",
                    ridingId: ridingId,
                    ridingLink: "",
                    incumbent: "",
                    ridingName: ridingName,
                  };

                  newCandidateData.set(ridingId, ridingInfo);
                }
              });

              setCandidateData(newCandidateData);
            }
          },
          header: false,
        });
      } catch (error) {
        console.error("Error loading CSV file:", error);
      }
    };

    const fetchAndParseCSV = async () => {
      try {
        const response = await fetch("/RidingData2025.csv");
        const csvText = await response.text();

        Papa.parse(csvText, {
          complete: (results) => {
            const data = results.data as string[][];
            if (data.length > 0) {
              // Update candidate data with riding link and incumbent info
              setCandidateData((prevData) => {
                if (!prevData) return null;
                const newData = new Map(prevData);

                data.slice(1).forEach((row) => {
                  const ridingId = row[0];
                  const ridingInfo = newData.get(ridingId);
                  if (ridingInfo) {
                    newData.set(ridingId, {
                      ...ridingInfo,
                      ridingLink: row[10] || "",
                      incumbent: row[7] || "",
                      ridingName: row[1] || "",
                      Liberal: {
                        ...ridingInfo.Liberal,
                        candidateName: row[2] || "",
                      },
                      Conservative: {
                        ...ridingInfo.Conservative,
                        candidateName: row[3] || "",
                      },
                      NDP: {
                        ...ridingInfo.NDP,
                        candidateName: row[4] || "",
                      },
                      Green: {
                        ...ridingInfo.Green,
                        candidateName: row[5] || "",
                      },
                      Bloc: {
                        ...ridingInfo.Bloc,
                        candidateName: row[6] || "",
                      },
                    });
                  }
                });

                return newData;
              });
            }
          },
          header: false,
        });
      } catch (error) {
        console.error("Error loading CSV file:", error);
      }
    };

    fetchAndParseCandidateCSV();
    fetchAndParseCSV();
  }, []);

  return (
    <div className="my-8">
      {candidateData && (
        <div className="grid grid-cols-1">
          <div className="overflow-x-auto">
            <div className="grid grid-cols-6 gap-4 px-6 py-3 border-b border-gray-200 bg-[#808080] text-left text-xs font-medium text-white uppercase tracking-wider">
              <div>Riding</div>
              <div>Liberal</div>
              <div>Conservative</div>
              <div>NDP</div>
              <div>Green</div>
              <div>Bloc</div>
            </div>
          </div>
          <div className="overflow-y-auto h-[500px]">
            {Array.from(candidateData.entries()).map(
              ([ridingId, ridingInfo], index) => (
                <div
                  key={ridingId}
                  className={`grid grid-cols-6 gap-4 px-6 py-4 text-sm text-gray-500 border-b border-gray-200 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <div>
                    {ridingInfo.ridingLink ? (
                      <a
                        href={ridingInfo.ridingLink}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        {ridingInfo.ridingName}
                      </a>
                    ) : (
                      ridingInfo.ridingName
                    )}
                    {ridingInfo.incumbent && (
                      <div className="text-xs text-gray-400">
                        Incumbent: {ridingInfo.incumbent}
                      </div>
                    )}
                  </div>
                  {(
                    [
                      "Liberal",
                      "Conservative",
                      "NDP",
                      "Green",
                      "Bloc",
                    ] as Party[]
                  ).map((party) => (
                    <CandidateDisplay
                      key={party}
                      candidateName={ridingInfo[party].candidateName}
                      ridingData={ridingInfo}
                    />
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};
