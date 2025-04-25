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
    <div className="p-4 h-full overflow-y-auto">
      {tableData && (
        <div className="overflow-x-auto overflow-y-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                {getVisibleColumns(
                  tableData.headers,
                  tableData.rows
                ).visibleHeaders.map((header, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {getVisibleColumns(
                tableData.headers,
                tableData.rows
              ).visibleRows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-6 py-4 text-sm text-gray-500 border-b border-gray-200"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
