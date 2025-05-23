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

interface CandidateData {
  data: RidingPartyData[];
  winningParty: string;
}

interface RidingInfo {
  Conservative: RidingPartyData;
  Liberal: RidingPartyData;
  Bloc: RidingPartyData;
  NDP: RidingPartyData;
  Green: RidingPartyData;
  winningParty: string;
  winningCandidate: string;
}

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
      </p>
      <p className="text-sm text-gray-500">
        {formatVoteInfo(data.candidateVoteNum, data.candidateVotePrcnt)}
      </p>
    </div>
  );
};

export const RidingsSection = () => {
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [candidateData, setCandidateData] = useState<Map<
    string,
    RidingInfo
  > | null>(null);
  const [excludedColumns, setExcludedColumns] = useState<number[]>([]);

  const visibleHeaders = useMemo(() => {
    if (!tableData) return [];
    return tableData.headers.filter(
      (_, index) => !excludedColumns.includes(index)
    );
  }, [tableData, excludedColumns]);

  const visibleRows = useMemo(() => {
    if (!tableData) return [];
    return tableData.rows.map((row) =>
      row.filter((_, index) => !excludedColumns.includes(index))
    );
  }, [tableData, excludedColumns]);

  // Function to get visible columns (excluding specified indices)
  const getVisibleColumns = (headers: string[], rows: string[][]) => {
    return {
      visibleHeaders,
      visibleRows,
    };
  };

  useEffect(() => {
    const fetchAndParseCSV = async () => {
      try {
        const response = await fetch("/RidingData2025.csv");
        const csvText = await response.text();

        Papa.parse(csvText, {
          complete: (results) => {
            const data = results.data as string[][];
            if (data.length > 0) {
              setTableData({
                headers: data[0],
                rows: data.slice(1),
              });
            }
          },
          header: false,
        });
      } catch (error) {
        console.error("Error loading CSV file:", error);
      }
    };

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
                  // Ensure we have all required columns
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
    fetchAndParseCandidateCSV();
    fetchAndParseCSV();
  }, []);

  // Example: Exclude columns 1 and 3 (0-based index)
  useEffect(() => {
    setExcludedColumns([0, 8, 9, 10]); // Modify this array to exclude different columns
  }, []);

  return (
    <div className="my-8">
      {tableData && (
        <div className="grid grid-cols-1">
          <div className="overflow-x-auto">
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${visibleHeaders.length}, minmax(0, 1fr))`,
              }}
            >
              {visibleHeaders.map((header, index) => (
                <div
                  key={index}
                  className="px-6 py-3 border-b border-gray-200 bg-[#808080] text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  {header}
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-y-auto h-[500px]">
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${visibleHeaders.length}, minmax(0, 1fr))`,
              }}
            >
              {visibleRows.map((visibleRow, rowIndex) => {
                const fullRow = tableData.rows[rowIndex];
                const riding = fullRow[0]; // Riding number
                const name = fullRow[1]; // first column (name)
                const url = fullRow[10]; // hidden column (link)

                return (
                  <React.Fragment key={rowIndex}>
                    {visibleRow.map((cell, cellIndex) => {
                      const isFirstVisibleCell = cellIndex === 0;

                      return (
                        <div
                          key={cellIndex}
                          className={`px-6 py-4 text-sm text-gray-500 border-b border-gray-200 ${
                            rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }`}
                        >
                          {cellIndex === 0 && url ? (
                            <a
                              href={url}
                              target="_blank"
                              className="text-blue-600 underline"
                            >
                              {name}
                            </a>
                          ) : candidateData &&
                            candidateData.get(riding) &&
                            cellIndex < 6 ? (
                            <CandidateDisplay
                              candidateName={cell}
                              ridingData={candidateData.get(riding)!}
                            />
                          ) : (
                            <div>
                              <p>{cell}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
