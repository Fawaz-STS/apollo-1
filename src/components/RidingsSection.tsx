"use client";
import React, { useState, useEffect } from "react";
import Papa from "papaparse";

interface TableData {
  headers: string[];
  rows: string[][];
}

export const RidingsSection = () => {
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [excludedColumns, setExcludedColumns] = useState<number[]>([]);

  // Function to get visible columns (excluding specified indices)
  const getVisibleColumns = (headers: string[], rows: string[][]) => {
    return {
      visibleHeaders: headers.filter(
        (_, index) => !excludedColumns.includes(index)
      ),
      visibleRows: rows.map((row) =>
        row.filter((_, index) => !excludedColumns.includes(index))
      ),
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
                gridTemplateColumns: `repeat(${
                  getVisibleColumns(tableData.headers, tableData.rows)
                    .visibleHeaders.length
                }, minmax(0, 1fr))`,
              }}
            >
              {getVisibleColumns(
                tableData.headers,
                tableData.rows
              ).visibleHeaders.map((header, index) => (
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
                gridTemplateColumns: `repeat(${
                  getVisibleColumns(tableData.headers, tableData.rows)
                    .visibleHeaders.length
                }, minmax(0, 1fr))`,
              }}
            >
              {tableData.rows.map((fullRow, rowIndex) => {
                const visibleRow = fullRow.filter(
                  (_, i) => !excludedColumns.includes(i)
                );
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
                          {isFirstVisibleCell && url ? (
                            <a
                              href={url}
                              target="_blank"
                              className="text-blue-600 underline"
                            >
                              {name}
                            </a>
                          ) : (
                            cell
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
