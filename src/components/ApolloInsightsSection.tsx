import React from "react";

export const ApolloInsightsSection = () => {
  return (
    <div className="w-full px-4 max-w-3xl mx-auto">
      <h1 className="text-lg font-bold text-center mb-4">Apollo Insights</h1>
      <div className="flex flex-col items-start">
        <ul className="list-disc list-outside space-y-2 text-gray-800 text-sm">
          <li>Ridings with more car owners tend to vote Conservative</li>
          <li>
            Population density changes have almost no impact on swing ridings
          </li>
          <li>Shifts in GDP downwards tend to increase NDP voters</li>
          <li>
            New major infrastructure projects within a 5 year period cause
            measurable voting fluctuations
          </li>
        </ul>
      </div>
    </div>
  );
};
