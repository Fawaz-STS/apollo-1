import React from "react";
import { Lightbulb } from "lucide-react"; // optional icon library

function ImoportantInfoSection() {
  return (
    <div className="w-full max-w-sm mx-auto p-6 rounded-xl shadow-sm border border-gray-200 bg-white text-center relative">
      {/* Title */}
      <div className="flex items-center justify-center space-x-2 mb-2 text-gray-800">
        <Lightbulb className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold">Important Info</h2>
      </div>

      {/* Body Text */}
      <p className="text-sm text-gray-600">
        You can customize the map to show your own desired parameters by
        clicking the{" "}
        <span className="font-semibold text-gray-800">"Custom Map"</span>{" "}
        option.
      </p>

      {/* Carousel Dots */}
      <div className="flex justify-center space-x-1 mt-4">
        <span className="w-2 h-2 rounded-full bg-gray-700" />
        <span className="w-2 h-2 rounded-full bg-gray-300" />
        <span className="w-2 h-2 rounded-full bg-gray-300" />
      </div>

      {/* Navigation Arrows (mocked) */}
      <div className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-400 cursor-pointer">
        <span>&lsaquo;</span>
      </div>
      <div className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 cursor-pointer">
        <span>&rsaquo;</span>
      </div>
    </div>
  );
}

export default ImoportantInfoSection;
