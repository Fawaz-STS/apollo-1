"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import Papa from "papaparse";
import { FaArrowUp } from "react-icons/fa";

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
  Liberal: "liberal-color",
  Conservative: "conservative-color",
  NDP: "ndp-color",
  Green: "green-color",
  Bloc: "bloc-color",
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
  return `${voteNum.toLocaleString()} (${votePrcnt.toFixed(1)}%)`;
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
  const [searchTerm, setSearchTerm] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleScrollToTop = () => {
    if (listRef.current) {
      listRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateData) return;
    const foundKey = Array.from(candidateData.keys()).find((ridingId) => {
      const ridingInfo = candidateData.get(ridingId);
      return ridingInfo?.ridingName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
    if (foundKey && rowRefs.current[foundKey]) {
      rowRefs.current[foundKey]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      // Fetch both CSVs in parallel
      const [candidateRes, ridingRes] = await Promise.all([
        fetch("/data/CANADA_ELECTION_2025_VOTE_RESULTS_BY_CANDIDATE.csv"),
        fetch("/data/RidingData2025.csv"),
      ]);
      const [candidateCSV, ridingCSV] = await Promise.all([
        candidateRes.text(),
        ridingRes.text(),
      ]);

      // Parse candidate CSV
      let candidateData = new Map();
      Papa.parse(candidateCSV, {
        complete: (results) => {
          const data = results.data as string[][];
          if (data.length > 0) {
            data.slice(1).forEach((row) => {
              if (row.length >= 19) {
                const ridingId = row[0];
                const ridingName = row[1];
                const ridingInfo: RidingInfo = {
                  Conservative: {
                    partyName: "Conservative",
                    candidateName: "",
                    candidateVoteNum: parseInt(row[6]) || 0,
                    candidateVotePrcnt: parseFloat(row[7]) || 0,
                  },
                  Liberal: {
                    partyName: "Liberal",
                    candidateName: "",
                    candidateVoteNum: parseInt(row[3]) || 0,
                    candidateVotePrcnt: parseFloat(row[4]) || 0,
                  },
                  NDP: {
                    partyName: "NDP",
                    candidateName: "",
                    candidateVoteNum: parseInt(row[9]) || 0,
                    candidateVotePrcnt: parseFloat(row[10]) || 0,
                  },
                  Green: {
                    partyName: "Green",
                    candidateName: "",
                    candidateVoteNum: parseInt(row[12]) || 0,
                    candidateVotePrcnt: parseFloat(row[13]) || 0,
                  },
                  Bloc: {
                    partyName: "Bloc",
                    candidateName: "",
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
                candidateData.set(ridingId, ridingInfo);
              }
            });
          }
        },
        header: false,
      });

      // Parse riding CSV and merge
      Papa.parse(ridingCSV, {
        complete: (results) => {
          const data = results.data as string[][];
          if (data.length > 0) {
            data.slice(1).forEach((row) => {
              const ridingId = row[0];
              const ridingInfo = candidateData.get(ridingId);
              if (ridingInfo) {
                candidateData.set(ridingId, {
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
          }
          setCandidateData(new Map(candidateData));
        },
        header: false,
      });
    };
    fetchAll();
  }, []);

  return (
    <div className="my-8 relative rounded-lg">
      <button
        className="absolute right-4 top-2 z-10 bg-white text-white p-2 rounded-full shadow transition"
        onClick={handleScrollToTop}
        aria-label="Scroll to Top"
      >
        <FaArrowUp size={10} color="#555" />
      </button>
      {candidateData && (
        <div className="grid grid-cols-1">
          <div className="overflow-x-auto">
            <div className=" rounded-lg grid grid-cols-6 gap-4 px-6 py-3 border-b border-gray-200 bg-[#808080] text-left text-xs font-medium text-white uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <span>Riding</span>
                <form
                  onSubmit={handleSearch}
                  className="flex items-center gap-1"
                >
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border rounded px-1 py-0.5 text-xs text-black"
                    style={{ width: 120 }}
                  />
                </form>
              </div>
              <div>Liberal</div>
              <div>Conservative</div>
              <div>NDP</div>
              <div>Green</div>
              <div>Bloc</div>
            </div>
          </div>
          <div
            ref={listRef}
            className="overflow-y-auto h-[500px] relative scrollbar-hide rounded-lg border-b-2 border-gray-200"
          >
            {Array.from(candidateData.entries()).map(
              ([ridingId, ridingInfo], index) => (
                <div
                  key={ridingId}
                  ref={(el) => {
                    rowRefs.current[ridingId] = el;
                  }}
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
